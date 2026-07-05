import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { SubmissionStatus } from '@prisma/client';
import { AssignedCaseMapper } from './mapper/assigned-case.mapper';
import { assignedCaseDetailInclude, assignedCaseListInclude } from './entities/assigned-case.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { submissionDetailInclude } from 'src/submissions/entities/submission.entity';
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
      throw new NotFoundException('Caso asignado no encontrado');
    }

    if (assignedCase.studentId !== studentId) {
      throw new ForbiddenException('No tienes acceso a este caso');
    }

    if (!assignedCase.assignment.isPublished) {
      throw new ConflictException('La actividad ya no esta disponible')
    }

    if (!assignedCase.assignment.classroom.isActive) {
      throw new ForbiddenException('La clase ya no esta disponible');
    }

    if (assignedCase.submission) {
      throw new ConflictException('Ya has empezado a responder');
    }

    const createdSubmission = await this.prisma.submission.create({
      data: {
        assignedCaseId,
        status: SubmissionStatus.DRAFT,
      },
      include: submissionDetailInclude,
    });

    return SubmissionMapper.toResponse(createdSubmission);
  }

  async findMyAssignedCases(studentId: string) {
    const assignedCases = await this.prisma.assignedCase.findMany({
      where: {
        studentId,
        assignment: {
          isPublished: true,
          classroom: {
            isActive: true,
          },
        },
      },
      include: assignedCaseListInclude,
      orderBy: {
        assignedAt: 'desc',
      },
    });
    return assignedCases.map(AssignedCaseMapper.toSummary)
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
        include: assignedCaseDetailInclude,
      });

    if (!assignedCase) {
      throw new NotFoundException(
        'Caso asignado no encontrado',
      );
    }

    if (assignedCase.studentId !== studentId) {
      throw new ForbiddenException(
        'No tienes acceso a este caso',
      );
    }

    if (!assignedCase.assignment.isPublished) {
      throw new ForbiddenException('La actividad no esta disponible');
    }

    if (!assignedCase.assignment.classroom.isActive) {
      throw new ForbiddenException('La clase no esta disponible');
    }

    return AssignedCaseMapper.toResponse(
      assignedCase,
    );
  }
}
