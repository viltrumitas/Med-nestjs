import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CaseStatus } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { feedback: string; caseId: string; authorId: string }) {
    const caseEntity = await this.prisma.case.findUnique({
      where: { id: data.caseId },
    });

    if (!caseEntity) {
      throw new NotFoundException('Case not found');
    }

    if (
      caseEntity.status !== CaseStatus.DRAFT &&
      caseEntity.status !== CaseStatus.REVIEWED
    ) {
      throw new BadRequestException('Case must be submitted');
    }

    if (caseEntity.id === data.caseId) {
      throw new ForbiddenException('Case has already reviewed');
    }

    const caseCreated = await this.prisma.review.create({
      data: {
        feedback: data.feedback,
        caseId: {
          connect: {
            id: data.authorId,
          },
        },
      },
    });
    
  }
}