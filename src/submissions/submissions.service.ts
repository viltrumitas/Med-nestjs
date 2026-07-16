import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SubmissionStatus } from '@prisma/client';
import { UserRole } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

import { UpdateSubmissionDto } from './dto/update-submission.dto';

import { SubmissionMapper } from './mapper/submission.mapper';
import { submissionDetailInclude } from './entities/submission.entity';
import { submissionListInclude } from './entities/submission.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async findPendingForTeacher(teacherId: string) {
    const submissions = await this.prisma.submission.findMany({
      where: {
        status: SubmissionStatus.SUBMITTED,
        review: null,
        assignedCase: {
          assignment: {
            classroom: {
              teacherId,
              isActive: true,
            },
          },
        },
      },
      include: submissionListInclude,
      orderBy: {
        updatedAt: 'asc',
      },
    });

    return submissions.map(SubmissionMapper.toSummary);
  }

  async findPendingForStudent(studentId: string) {
    const submissions = await this.prisma.submission.findMany({
      where: {
        assignedCase: {
          studentId,
          assignment: {
            isPublished: true,
            classroom: {
              isActive: true,
            },
          },
        },
        review: null,
      },
      include: submissionListInclude,

      orderBy: {
        updatedAt: 'desc',
      },
    });

    return submissions.map(SubmissionMapper.toSummary);
  }

  async findPendingByClassroom(
    classroomId: string,
    teacherId: string,
  ) {
    const submissions = await this.prisma.submission.findMany({
      where: {
        status: SubmissionStatus.SUBMITTED,
        review: null,

        assignedCase: {
          assignment: {
            classroomId,

            classroom: {
              teacherId,
              isActive: true,
            },
          },
        },
      },
      include: submissionListInclude,

      orderBy: {
        updatedAt: 'asc',
      },
    });

    return submissions.map(
      SubmissionMapper.toSummary,
    );
  }

  async findOne(
    submissionId: string,
    userId: string,
    role: UserRole,
  ) {
    const submission =
      await this.prisma.submission.findUnique({
        where: { id: submissionId },
        include: submissionDetailInclude,
      });

    if (!submission) {
      throw new NotFoundException(
        'Submission not found',
      );
    }

    if (role === UserRole.STUDENT) {
      if (
        submission.assignedCase.studentId !==
        userId
      ) {
        throw new ForbiddenException(
          'Access denied',
        );
      }
    }

    if (role === UserRole.TEACHER) {
      if (
        submission.assignedCase.assignment.classroom.teacherId !==
        userId
      ) {
        throw new ForbiddenException(
          'Access denied',
        );
      }
    }

    return SubmissionMapper.toResponse(
      submission,
    );
  }

  async update(
    submissionId: string,
    studentId: string,
    dto: UpdateSubmissionDto,
  ) {
    const submission =
      await this.prisma.submission.findUnique({
        where: { id: submissionId },
        include: submissionDetailInclude,
      });

    if (!submission) {
      throw new NotFoundException(
        'Submission not found',
      );
    }

    if (
      submission.assignedCase.studentId !==
      studentId
    ) {
      throw new ForbiddenException(
        'Access denied',
      );
    }

    if (!submission.assignedCase.assignment.isPublished) {
      throw new BadRequestException('La actividad ya no esta disponible');
    }

    if (!submission.assignedCase.assignment.classroom.isActive) {
      throw new BadRequestException('La clase ya no esta disponible');
    }

    if (
      submission.status !==
      SubmissionStatus.DRAFT
    ) {
      throw new BadRequestException(
        'Submission already submitted',
      );
    }

    const updated =
      await this.prisma.submission.update({
        where: { id: submissionId },
        data: dto,
        include: submissionDetailInclude,
      });

    return SubmissionMapper.toResponse(
      updated,
    );
  }

  async submit(
    submissionId: string,
    studentId: string,
  ) {
    const submission =
      await this.prisma.submission.findUnique({
        where: { id: submissionId },
        include: submissionDetailInclude,
      });

    if (!submission) {
      throw new NotFoundException(
        'Entrega no encontrada',
      );
    }

    if (
      submission.assignedCase.studentId !==
      studentId
    ) {
      throw new ForbiddenException(
        'No tienes acceso a esta entrega',
      );
    }

    if (!submission.assignedCase.assignment.isPublished) {
      throw new BadRequestException('La actividad ya no esta disponible');
    }

    if (!submission.assignedCase.assignment.classroom.isActive) {
      throw new BadRequestException('La clase ya no esta disponible');
    }

    if (
      submission.status !==
      SubmissionStatus.DRAFT
    ) {
      throw new BadRequestException(
        'La entrega ya fue enviada',
      );
    }

    if (
      !submission.sceneManagement ||
      !submission.sss ||
      !submission.primaryTest ||
      !submission.sample ||
      !submission.opqrst ||
      !submission.presumptiveDiagnosis ||
      !submission.priority ||
      submission.transferDecision ===
      null ||
      !submission.treatmentPlan ||
      !submission.reportPatient
    ) {
      throw new BadRequestException(
        'La entrega esta incompleta',
      );
    }

    const updated =
      await this.prisma.submission.update({
        where: { id: submissionId },
        data: {
          status:
            SubmissionStatus.SUBMITTED,
        },
        include: submissionDetailInclude,
      });

    return SubmissionMapper.toResponse(
      updated,
    );
  }
}