import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CaseStatus } from '@prisma/client';
import { safeUserSelect } from '../common/utils/safe-user-select';
import { ReviewMapper } from './mappers/review.mapper';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { feedback: string; caseId: string; teacherId: string }) {
    const caseEntity = await this.prisma.case.findUnique({
      where: { id: data.caseId },
    });

    if (!caseEntity) {
      throw new NotFoundException('Case not found');
    }

    if (caseEntity.status !== CaseStatus.SUBMITTED) {
      throw new BadRequestException('Case must be submitted before review');
    }

    if (caseEntity.authorId === data.teacherId) {
      throw new ForbiddenException('You cannot review your own case');
    }

    const existingReview = await this.prisma.review.findUnique({
      where: {
        caseId_teacherId: {
          caseId: data.caseId,
          teacherId: data.teacherId,
        },
      },
    });

    if (existingReview) {
      throw new ForbiddenException('You have already reviewed this case');
    }

    const [review] = await this.prisma.$transaction([
      this.prisma.review.create({
        data: {
          feedback: data.feedback,
          case: {
            connect: {
              id: data.caseId,
            },
          },
          teacher: {
            connect: {
              id: data.teacherId,
            },
          },
        },
        include: {
          teacher: {
            select: safeUserSelect,
          },
        },
      }),
      this.prisma.case.update({
        where: {
          id: data.caseId,
        },
        data: {
          status: CaseStatus.REVIEWED,
        },
      }),
    ]);

    return ReviewMapper.toResponse(review);
  }

  async findByCase(caseId: string, studentId: string) {
    const caseEntity = await this.prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!caseEntity) {
      throw new NotFoundException('Case not found');
    }

    if (caseEntity.authorId !== studentId) {
      throw new ForbiddenException(
        'You can only view reviews for your own cases',
      );
    }

    const reviews = await this.prisma.review.findMany({
      where: { caseId },
      include: {
        teacher: {
          select: safeUserSelect,
        },
      },
    });

    return reviews.map((reviewEntity) => ReviewMapper.toResponse(reviewEntity));
  }
}
