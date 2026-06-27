import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { AssignmentMapper } from './mapper/assignment.mapper';
import { assignmentDetailInclude, assignmentListInclude } from './entities/assignment.entity';

@Injectable()
export class AssignmentsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateAssignmentDto, teacherId: string) {
    const existing = await this.prisma.assignment.findFirst({
      where: {
        title: data.title,
        teacherId,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Ya existe una actividad con ese titulo',
      );
    }

    const assignment = await this.prisma.assignment.create({
      data: {
        title: data.title,
        description: data.description,
        teacher: {
          connect: { id: teacherId },
        },
      },
      include: assignmentListInclude,
    });

    return AssignmentMapper.toResponse(assignment);
  }

  async findMyAssignments(teacherId: string) {
    const assignments = await this.prisma.assignment.findMany({
      where: { teacherId },
      include: assignmentListInclude,
      orderBy: { createdAt: 'desc' },
    });

    return assignments.map(AssignmentMapper.toResponse);
  }

  async findOne(id: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
      include: assignmentDetailInclude,
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    return AssignmentMapper.toDetailResponse(assignment);
  }

  async publish(id: string, teacherId: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    if (assignment.teacherId !== teacherId) {
      throw new ForbiddenException(
        'You can only publish your own assignments',
      );
    }

    if (assignment.isPublished) {
      throw new BadRequestException(
        'Assignment is already published',
      );
    }

    const students = await this.prisma.user.findMany({
      where: { role: 'STUDENT' },
    });

    const cases = await this.prisma.case.findMany({
      where: { isPublished: true },
    });

    if (!students.length) {
      throw new BadRequestException('No students available');
    }

    if (!cases.length) {
      throw new BadRequestException('No cases available');
    }

    const existingAssignments =
      await this.prisma.assignedCase.findMany({
        where: { assignmentId: id },
      });

    if (existingAssignments.length > 0) {
      throw new BadRequestException(
        'Assignments already generated',
      );
    }

    // BALANCED ALGORITHM
    const shuffledCases = cases
      .map((c) => ({ c, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .map((x) => x.c);

    const assignedData = students.map((student, index) => {
      const caseItem =
        shuffledCases[index % shuffledCases.length];

      return {
        assignmentId: id,
        studentId: student.id,
        caseId: caseItem.id,
      };
    });

    await this.prisma.$transaction(async (tx) => {
      await tx.assignment.update({
        where: { id },
        data: { isPublished: true },
      });

      await tx.assignedCase.createMany({
        data: assignedData,
        skipDuplicates: true,
      });
    });

    return {
      message: 'Assignment published and cases generated',
      totalStudents: students.length,
    };
  }

  async unpublish(id: string, teacherId: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    if (assignment.teacherId !== teacherId) {
      throw new ForbiddenException(
        'You cannot unpublish this assignment',
      );
    }

    const updated = await this.prisma.assignment.update({
      where: { id },
      data: { isPublished: false },
      include: assignmentListInclude,
    });

    return AssignmentMapper.toResponse(updated);
  }

  async deleteAssignment(id: string, teacherId: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    if (assignment.teacherId !== teacherId) {
      throw new ForbiddenException(
        'You can only delete your own assignments',
      );
    }

    const deleted = await this.prisma.assignment.delete({
      where: { id },
    });

    return { id: deleted.id };
  }
}