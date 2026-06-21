import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { SubmissionStatus } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';

import { SubmissionMapper } from './mapper/submission.mapper';
import { submissionInclude } from './entities/submission.entity';

@Injectable()
export class SubmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSubmissionDto, caseId: string, studentId: string,
  ) {
    const caseEntity = await this.prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!caseEntity) {
      throw new NotFoundException('Case not found');
    }

    if (!caseEntity.isPublished) {
      throw new ForbiddenException('Case is not available');
    }

    const existing = await this.prisma.submission.findUnique({
      where: {
        caseId_studentId: {
          caseId,
          studentId,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        'Submission already exists',
      );
    }

    const submission = await this.prisma.submission.create({
        data: {
          caseId,
          studentId,
          ...data,
          status: SubmissionStatus.DRAFT,
        },
        include: submissionInclude,
      });

    return SubmissionMapper.toResponse(
      submission,
    );
  }

  async findOne(submissionId: string, studentId: string) {
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

    if (submission.studentId !== studentId) {
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
      });

    if (!submission) {
      throw new NotFoundException(
        'Submission not found',
      );
    }

    if (submission.studentId !== studentId) {
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
      });

    if (!submission) {
      throw new NotFoundException(
        'Submission not found',
      );
    }

    if (submission.studentId !== studentId) {
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
      submission.transferDecision === null ||
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