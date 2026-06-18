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

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) { }

  private calculateSectionScore<T extends object>(section: T): number {
    return Object.values(section)
      .filter((value): value is number => typeof value === 'number')
      .reduce(
        (total, value) => total + value,
        0,
      );
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
      dto.otherInterventions
    ];

    return sections.reduce(
      (total, section) => total + this.calculateSectionScore(section),
      0,
    );
  }

  async create(submissionId: string, teacherId: string, dto: CreateReviewDto) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId }
    })

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (submission.status !== SubmissionStatus.SUBMITTED) {
      throw new BadRequestException('Submission must be submitted before review')
    }

    const teacher = await this.prisma.user.findUnique({
      where: { id: teacherId }
    })

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    if (teacher.role !== UserRole.TEACHER) {
      throw new ForbiddenException('Only teachers can review submissions');
    }

    const existingReview = await this.prisma.review.findUnique({
      where: { submissionId }
    })

    if (existingReview) {
      throw new ConflictException('Submission already reviewed');
    }

    const totalScore = this.calculateTotalScore(dto);

    const {
      sampler,
      opqrst
    } = dto;

    const review: ReviewEntity = await this.prisma.$transaction(async (tx) => {
      const createdReview = await tx.review.create({
        data: {
          submissionId,
          teacherId,

          sceneManagement: {
            ...dto.sceneManagement
          },
          primaryAssessment: {
            ...dto.primaryAssessment
          },
          patientPriority: {
            ...dto.patientPriority
          },
          vitalSigns: {
            ...dto.vitalSigns
          },
          focusedAssessment: {
            ...dto.focusedAssessment
          },
          physicalExamination: {
            ...dto.physicalExamination
          },
          otherInterventions: {
            ...dto.otherInterventions
          },

          anamnesis: {
            sampler: { ...sampler },
            opqrst: { ...opqrst },
          } as Prisma.InputJsonValue,
          totalScore,
          feedback: dto.feedback,
        },

        include: reviewInclude,
      });

      await tx.submission.update({
        where: {
          id: submissionId,
        },
        data: {
          status: SubmissionStatus.REVIEWED,
        },
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

    if (review.submission.studentId !== studentId) {
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
      if (review.submission.studentId !== userId) {
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

  async findAll(
    userId: string,
    role: UserRole,
  ) {
    const reviews = await this.prisma.review.findMany({
      where:
        role === UserRole.TEACHER
          ? {
            teacherId: userId,
          }
          : {
            submission: {
              is: {
                studentId: userId,
              },
            },
          },
      include: reviewInclude,
      orderBy: {
        createdAt: 'desc',
      },
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
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.teacherId !== teacherId) {
      throw new ForbiddenException(
        'You do not have access to this review',
      );
    }

    const updatedData: any = {};

    if (dto.sceneManagement) {
      updatedData.sceneManagement = dto.sceneManagement;
    }

    if (dto.primaryAssessment) {
      updatedData.primaryAssessment = dto.primaryAssessment;
    }

    if (dto.patientPriority) {
      updatedData.patientPriority = dto.patientPriority;
    }

    if (dto.vitalSigns) {
      updatedData.vitalSigns = dto.vitalSigns;
    }

    if (dto.focusedAssessment) {
      updatedData.focusedAssessment = dto.focusedAssessment;
    }

    if (dto.physicalExamination) {
      updatedData.physicalExamination = dto.physicalExamination;
    }

    if (dto.otherInterventions) {
      updatedData.otherInterventions = dto.otherInterventions;
    }

    if (dto.sampler || dto.opqrst) {
      updatedData.anamnesis = {
        sampler: dto.sampler ?? (review.anamnesis as any)?.sampler,
        opqrst: dto.opqrst ?? (review.anamnesis as any)?.opqrst,
      } as Prisma.InputJsonValue;
    }

    if (
      dto.sceneManagement ||
      dto.primaryAssessment ||
      dto.patientPriority ||
      dto.vitalSigns ||
      dto.focusedAssessment ||
      dto.physicalExamination ||
      dto.otherInterventions
    ) {
      const merged = {
        sceneManagement:
          dto.sceneManagement ?? (review as any).sceneManagement,
        primaryAssessment:
          dto.primaryAssessment ?? (review as any).primaryAssessment,
        patientPriority:
          dto.patientPriority ?? (review as any).patientPriority,
        vitalSigns:
          dto.vitalSigns ?? (review as any).vitalSigns,
        focusedAssessment:
          dto.focusedAssessment ?? (review as any).focusedAssessment,
        physicalExamination:
          dto.physicalExamination ??
          (review as any).physicalExamination,
        otherInterventions:
          dto.otherInterventions ??
          (review as any).otherInterventions,
        sampler: (review.anamnesis as any)?.sampler,
        opqrst: (review.anamnesis as any)?.opqrst,
      };

      updatedData.totalScore =
        this.calculateTotalScore(merged as any);
    }

    const updated = await this.prisma.review.update({
      where: { id },
      data: updatedData,
      include: reviewInclude,
    });

    return ReviewMapper.toResponse(updated);
  }
}