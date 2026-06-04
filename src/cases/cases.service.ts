import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { caseWithAuthor } from '../common/utils/safe-user-select';
import { CaseMapper } from './mappers/case.mapper';
import { CaseStatus } from '@prisma/client';

@Injectable()
export class CasesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { title: string; description: string; authorId: string }) {
    const createdCase = await this.prisma.case.create({
      data: {
        title: data.title,
        description: data.description,
        author: {
          connect: {
            id: data.authorId,
          },
        },
      },
      ...caseWithAuthor,
    });

    return CaseMapper.toResponse(createdCase);
  }

  async submit(id: string, userId: string) {
    const caseEntity = await this.prisma.case.findUnique({
      where: { id },
    });

    if (!caseEntity) {
      throw new NotFoundException('Case not found');
    }

    if (caseEntity.authorId !== userId) {
      throw new ForbiddenException('You can only submit your own cases');
    }

    if (caseEntity.status !== CaseStatus.DRAFT) {
      throw new BadRequestException('Only draft cases can be submitted');
    }

    const updatedCase = await this.prisma.case.update({
      where: { id },
      data: {
        status: CaseStatus.SUBMITTED,
      },
      ...caseWithAuthor,
    });
    return CaseMapper.toResponse(updatedCase);
  }

  async findSubmittedCases() {
    const cases = await this.prisma.case.findMany({
      where: {
        status: CaseStatus.SUBMITTED,
      },
      ...caseWithAuthor,
    });

    return cases.map((caseEntity) => CaseMapper.toResponse(caseEntity));
  }

  async findAll() {
    const cases = await this.prisma.case.findMany(caseWithAuthor);

    return cases.map((caseEntity) => CaseMapper.toResponse(caseEntity));
  }

  async findOne(id: string) {
    const caseEntity = await this.prisma.case.findUnique({
      where: { id },
      ...caseWithAuthor,
    });

    if (!caseEntity) {
      throw new NotFoundException('Case not found');
    }

    return CaseMapper.toResponse(caseEntity);
  }
}
