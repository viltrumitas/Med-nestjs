import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, SubmissionStatus } from '@prisma/client';
import { AssignedCaseMapper } from './mapper/assigned-case.mapper';
import { assignedCaseListInclude } from './entities/assigned-case.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { submissionInclude } from 'src/submissions/entities/submission.entity';
import { SubmissionMapper } from 'src/submissions/mapper/submission.mapper';

@Injectable()
export class AssignedCaseService {
  constructor(private readonly prisma: PrismaService) { }

  async startSubmission(assignedCaseId: string, studentId: string) {
    const assignedCase = await this.prisma.assignedCase.findUnique({
      where: { id: assignedCaseId },
      include: assignedCaseListInclude,
    });

    if (!assignedCase) {
      throw new NotFoundException('Assigned case not found');
    }

    if (assignedCase.studentId !== studentId) {
      throw new ForbiddenException('Access denied');
    }

    if (assignedCase.submission) {
      throw new ConflictException('Submission already started');
    }

    const createdSubmission = await this.prisma.submission.create({
      data: {
        assignedCaseId,
        studentId,
        status: SubmissionStatus.DRAFT,
      },
      include: submissionInclude,
    });

    return SubmissionMapper.toResponse(createdSubmission);
  }

  async findMyAssignedCases(studentId: string) {
    const assignedCases = await this.prisma.assignedCase.findMany({
      where: {
        studentId,
      },
      include: assignedCaseListInclude,
      orderBy: {
        assignedAt: 'desc',
      },
    });
    return assignedCases.map(AssignedCaseMapper.toResponse)
  }

  async findOne(
    assignedCaseId: string,
    studentId: string,
  ) {
    const assignedCase =
      await this.prisma.assignedCase.findUnique({
        where: {
          id: assignedCaseId,
        },
        include: assignedCaseListInclude,
      });

    if (!assignedCase) {
      throw new NotFoundException(
        'Assigned case not found',
      );
    }

    if (assignedCase.studentId !== studentId) {
      throw new ForbiddenException(
        'Access denied',
      );
    }

    return AssignedCaseMapper.toResponse(
      assignedCase,
    );
  }
}
