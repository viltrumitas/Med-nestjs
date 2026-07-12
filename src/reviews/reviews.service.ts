import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmissionStatus, UserRole } from '@prisma/client';
import { ReviewMapper } from './mappers/review.mapper';
import { CreateReviewDto } from './dto/create-review.dto';
import { toJson, fromJson } from '../../src/common/utils/to-json';
import {
  ReviewListEntity,
  ReviewDetailEntity,
  reviewListInclude,
  reviewDetailInclude,
} from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) { }

  private calculateSectionScore<T extends object>(section: T): number {
    return Object.values(section)
      .filter((value): value is number => typeof value === 'number')
      .reduce((total, value) => total + value, 0);
  }

  private calculateTotalScore(dto: CreateReviewDto): number {
    const sections = [
      dto.sceneManagement,
      dto.primaryAssessment,
      dto.patientPriority,
      dto.vitalSigns,
      dto.focusedAssessment,
      dto.physicalExamination,
      dto.sampler,
      dto.opqrst,
      dto.otherInterventions,
    ];

    return sections.reduce(
      (total, section) =>
        total + this.calculateSectionScore(section),
      0,
    );
  }

  async create(
    submissionId: string,
    teacherId: string,
    dto: CreateReviewDto,
  ) {
    const submission =
      await this.prisma.submission.findUnique({
        where: { id: submissionId },
        include: {
          assignedCase: {
            include: {
              student: true,
              case: true,
              
              assignment: {
                include: {
                  classroom: true,
                },
              },
            },
          },
        },
      });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (submission.assignedCase.assignment.classroom.teacherId !== teacherId) {
      throw new ForbiddenException('No puedes revisar esta entrega');
    }


    if (submission.status !== SubmissionStatus.SUBMITTED) {
      throw new BadRequestException(
        'Submission must be submitted before review',
      );
    }

    const existingReview =
      await this.prisma.review.findUnique({
        where: { submissionId },
      });

    if (existingReview) {
      throw new ConflictException(
        'Submission already reviewed',
      );
    }

    const totalScore = this.calculateTotalScore(dto);

    const review = await this.prisma.$transaction(async (tx) => {
      const createdReview = await tx.review.create({
        data: {
          submissionId,
          teacherId,

          sceneManagement: toJson(dto.sceneManagement),
          primaryAssessment: toJson(dto.primaryAssessment),
          patientPriority: toJson(dto.patientPriority),
          vitalSigns: toJson(dto.vitalSigns),
          focusedAssessment: toJson(dto.focusedAssessment),
          physicalExamination: toJson(dto.physicalExamination),
          otherInterventions: toJson(dto.otherInterventions),

          anamnesis: toJson({
            sampler: dto.sampler,
            opqrst: dto.opqrst,
          }),

          totalScore,
          feedback: dto.feedback,
        },
        include: reviewDetailInclude,
      });

      await tx.submission.update({
        where: { id: submissionId },
        data: { status: SubmissionStatus.REVIEWED },
      });

      return createdReview;
    });

    return ReviewMapper.toResponse(review);
  }

  async findBySubmissionId(
    submissionId: string,
    studentId: string,
  ) {
    const review = await this.prisma.review.findUnique({
      where: { submissionId },
      include: reviewDetailInclude,
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (
      review.submission.assignedCase.studentId !==
      studentId
    ) {
      throw new ForbiddenException(
        'You do not have access to this review',
      );
    }

    return ReviewMapper.toResponse(review);
  }

  async findById(
    id: string,
    userId: string,
    role: UserRole,
  ) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: reviewDetailInclude,
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (role === UserRole.STUDENT) {
      if (
        review.submission.assignedCase.studentId !==
        userId
      ) {
        throw new ForbiddenException(
          'You do not have access to this review',
        );
      }
    }

    if (role === UserRole.TEACHER) {
      if (review.submission.assignedCase.assignment.classroom.teacherId !== userId) {
        throw new ForbiddenException(
          'You do not have access to this review',
        );
      }
    }

    return ReviewMapper.toResponse(review);
  }

  async findAll(teacherId: string) {
    const reviews = await this.prisma.review.findMany({
      where: {
        submission: {
          assignedCase: {
            assignment: {
              classroom: {
                teacherId,
              },
            },
          },
        },
      },
      include: reviewListInclude,
      orderBy: { createdAt: 'desc' },
    });

    return reviews.map(ReviewMapper.toSummary);
  }

  async update(
    id: string,
    teacherId: string,
    dto: Partial<CreateReviewDto>,
  ) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: reviewDetailInclude,
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (
      review.submission.assignedCase.assignment.classroom.teacherId !==
      teacherId
    ) {
      throw new ForbiddenException(
        'You do not have access to this review',
      );
    }

    const anamnesis = fromJson<{
      sampler: CreateReviewDto['sampler'];
      opqrst: CreateReviewDto['opqrst'];
    }>(review.anamnesis);

    const reviewData: CreateReviewDto = {
      sceneManagement:
        dto.sceneManagement ??
        fromJson<CreateReviewDto['sceneManagement']>(
          review.sceneManagement,
        ),

      primaryAssessment:
        dto.primaryAssessment ??
        fromJson<CreateReviewDto['primaryAssessment']>(
          review.primaryAssessment
        ),

      patientPriority:
        dto.patientPriority ??
        fromJson<CreateReviewDto['patientPriority']>(
          review.patientPriority
        ),

      vitalSigns:
        dto.vitalSigns ??
        fromJson<CreateReviewDto['vitalSigns']>(
          review.vitalSigns
        ),

      focusedAssessment:
        dto.focusedAssessment ??
        fromJson<CreateReviewDto['focusedAssessment']>(
          review.focusedAssessment
        ),

      physicalExamination:
        dto.physicalExamination ??
        fromJson<CreateReviewDto['physicalExamination']>(
          review.physicalExamination
        ),

      sampler:
        dto.sampler ??
        anamnesis.sampler,

      opqrst:
        dto.opqrst ??
        anamnesis.opqrst,

      otherInterventions:
        dto.otherInterventions ??
        fromJson<CreateReviewDto['otherInterventions']>(
          review.otherInterventions
        ),

      feedback:
        dto.feedback ??
        review.feedback ??
        undefined,
    };

    const totalScore =
      this.calculateTotalScore(reviewData);

    const updated = await this.prisma.review.update({
      where: { id },
      data: {
        sceneManagement: toJson(reviewData.sceneManagement),
        primaryAssessment: toJson(reviewData.primaryAssessment),
        patientPriority: toJson(reviewData.patientPriority),
        vitalSigns: toJson(reviewData.vitalSigns),
        focusedAssessment: toJson(reviewData.focusedAssessment),
        physicalExamination: toJson(reviewData.physicalExamination),

        anamnesis: toJson({
          sampler: reviewData.sampler,
          opqrst: reviewData.opqrst,
        }),

        otherInterventions: toJson(
          reviewData.otherInterventions,
        ),

        totalScore,

        feedback: reviewData.feedback,
      },
      include: reviewDetailInclude,
    });

    return ReviewMapper.toResponse(updated);
  }
}