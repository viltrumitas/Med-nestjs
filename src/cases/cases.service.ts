import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { caseWithAuthor } from '../common/utils/safe-user-select';
import { CaseMapper } from './mappers/case.mapper';

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
      return null;
    }

    return CaseMapper.toResponse(caseEntity);
  }
}
