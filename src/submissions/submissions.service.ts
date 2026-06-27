import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SubmissionStatus } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

import { UpdateSubmissionDto } from './dto/update-submission.dto';

import { SubmissionMapper } from './mapper/submission.mapper';
import { submissionInclude } from './entities/submission.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findPendingForTeacher(teacherId: string) {
    const submissions = await this.prisma.submission.findMany({
      where: {
        status: SubmissionStatus.SUBMITTED,
        review: null,
        assignedCase: {
          assignment: {
            teacherId,
          },
        },
      },
      include: submissionInclude,
      orderBy: {
        updatedAt: 'asc',
      },
    });

    return submissions.map(SubmissionMapper.toResponse);
  }

  async findOne(
    submissionId: string,
    studentId: string,
  ) {
    const submission =
      await this.prisma.submission.findUnique({
        where: { id: submissionId },
        include: submissionInclude,
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
        include: {
          assignedCase: true,
        },
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
        include: submissionInclude,
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
        include: {
          assignedCase: true,
        },
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

    if (
      submission.status !==
      SubmissionStatus.DRAFT
    ) {
      throw new BadRequestException(
        'Submission already submitted',
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
        'Submission is incomplete',
      );
    }

    const updated =
      await this.prisma.submission.update({
        where: { id: submissionId },
        data: {
          status:
            SubmissionStatus.SUBMITTED,
        },
        include: submissionInclude,
      });

    return SubmissionMapper.toResponse(
      updated,
    );
  }
}