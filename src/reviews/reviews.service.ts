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
import { Prisma } from '@prisma/client';
import { ReviewEntity, reviewInclude } from './entities/review.entity';
import { toJson } from '../../src/common/utils/to-json';

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
          assignedCase: true,
        },
      });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (submission.status !== SubmissionStatus.SUBMITTED) {
      throw new BadRequestException(
        'Submission must be submitted before review',
      );
    }

    const teacher = await this.prisma.user.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    if (teacher.role !== UserRole.TEACHER) {
      throw new ForbiddenException(
        'Only teachers can review submissions',
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
        include: reviewInclude,
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
      include: reviewInclude,
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
      include: reviewInclude,
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
      if (review.teacherId !== userId) {
        throw new ForbiddenException(
          'You do not have access to this review',
        );
      }
    }

    return ReviewMapper.toResponse(review);
  }

  async findAll(userId: string, role: UserRole) {
    const reviews = await this.prisma.review.findMany({
      where:
        role === UserRole.TEACHER
          ? { teacherId: userId }
          : {
            submission: {
              is: {
                assignedCase: {
                  studentId: userId,
                },
              },
            },
          },
      include: reviewInclude,
      orderBy: { createdAt: 'desc' },
    });

    return reviews.map(ReviewMapper.toResponse);
  }

  async update(
    id: string,
    teacherId: string,
    dto: Partial<CreateReviewDto>,
  ) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: reviewInclude,
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.teacherId !== teacherId) {
      throw new ForbiddenException(
        'You do not have access to this review',
      );
    }

    const updated = await this.prisma.review.update({
      where: { id },
      data: {
        sceneManagement: dto.sceneManagement
          ? toJson(dto.sceneManagement)
          : undefined,

        primaryAssessment: dto.primaryAssessment
          ? toJson(dto.primaryAssessment)
          : undefined,

        patientPriority: dto.patientPriority
          ? toJson(dto.patientPriority)
          : undefined,

        vitalSigns: dto.vitalSigns
          ? toJson(dto.vitalSigns)
          : undefined,

        focusedAssessment: dto.focusedAssessment
          ? toJson(dto.focusedAssessment)
          : undefined,

        physicalExamination: dto.physicalExamination
          ? toJson(dto.physicalExamination)
          : undefined,

        otherInterventions: dto.otherInterventions
          ? toJson(dto.otherInterventions)
          : undefined,

        anamnesis:
          dto.sampler || dto.opqrst
            ? toJson({
              sampler: dto.sampler,
              opqrst: dto.opqrst,
            })
            : undefined,
      },
      include: reviewInclude,
    });

    return ReviewMapper.toResponse(updated);
  }
}