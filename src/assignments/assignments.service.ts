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
import { CaseMapper } from 'src/cases/mappers/case.mapper';

@Injectable()
export class AssignmentsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateAssignmentDto, teacherId: string) {

    if (!data.caseIds || data.caseIds.length < 1) {
      throw new BadRequestException('Selecciona al menos un caso');
    }

    const classroom = await this.prisma.classroom.findFirst({
      where: {
        id: data.classroomId,
        teacherId,
        isActive: true,
      },
    });

    if (!classroom) {
      throw new ForbiddenException('No puedes crear actividades en esta clase');
    }
    
    const existing = await this.prisma.assignment.findFirst({
      where: {
        title: data.title,
        classroomId: data.classroomId,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Ya existe una actividad con ese titulo',
      );
    }

    const cases = await this.prisma.case.findMany({
      where: {
        id: {
          in: data.caseIds,
        },
        author: {
          id: teacherId
        },
        isPublished: true,
      },
    });

    if (cases.length !== data.caseIds.length) {
      throw new BadRequestException('Uno o mas casos no existen o no te pertenecen');
    }

    const assignment = await this.prisma.assignment.create({
      data: {
        title: data.title,
        description: data.description,

        classroom: {
          connect: {
            id: data.classroomId
          }
        },

        cases: {
          create: data.caseIds.map((caseId) => ({
            caseId,
          })),
        },
      },
      include: assignmentListInclude,
    });

    return AssignmentMapper.toResponse(assignment);
  }

  async findMyAssignments(teacherId: string) {
    const assignments = await this.prisma.assignment.findMany({
      where: {
        classroom: {
          teacherId,
          isActive: true,
        },
      },
      include: assignmentListInclude,
      orderBy: { createdAt: 'desc' },
    });

    return assignments.map(AssignmentMapper.toResponse);
  }

  async findMyPublishedCases(teacherId: string) {
    const cases = await this.prisma.case.findMany({
      where: {
        author: {
          id: teacherId,
        },
        isPublished: true,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return cases.map((c) => CaseMapper.toResponse(c));
  }

  async findOne(id: string, teacherId: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
      include: assignmentDetailInclude,
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    if (assignment.classroom.teacherId !== teacherId) {
      throw new ForbiddenException('No puedes acceder a esta actividad');
    }

    return AssignmentMapper.toDetailResponse(assignment);
  }

  async publish(id: string, teacherId: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
      include: {
        classroom: {
          include: {
            enrollments: {
              include: {
                student: true,
              },
            },
          },
        },
        cases: {
          include: {
            case: true,
          },
        },
      }
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    if (assignment.classroom.teacherId !== teacherId) {
      throw new ForbiddenException(
        'You can only publish your own assignments',
      );
    }

    if (!assignment.classroom.isActive) {
      throw new BadRequestException('La clase esta inactiva');
    }

    if (assignment.isPublished) {
      throw new BadRequestException('Assignment is already published');
    }

    const students = assignment.classroom.enrollments;

    if (!students.length) {
      throw new BadRequestException('No hay estudiantes inscritos en esta clase');
    }

    if (!assignment.cases.length) {
      throw new BadRequestException('La actividad no tiene casos asociados');
    }

    

    const cases = assignment.cases.map((assignmentCase) => assignmentCase.case);

    const shuffledCases = cases
      .map((c) => ({ c, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .map((x) => x.c);

    const assignedData = students.map((student, index) => {
      const caseItem =
        shuffledCases[index % shuffledCases.length];

      return {
        assignmentId: id,
        studentId: student.studentId,
        caseId: caseItem.id,
      };
    });

    await this.prisma.$transaction(async (tx) => {
      await tx.assignment.update({
        where: { id },
        data: { isPublished: true },
      });

      await tx.assignedCase.deleteMany({
        where: { assignmentId: id },
      });

      await tx.assignedCase.createMany({
        data: assignedData,
      });
    });

    const publishedAssignment = await this.prisma.assignment.findUnique({
      where: { id },
      include: assignmentDetailInclude,
    });

    if (!publishedAssignment) {
      throw new NotFoundException('Assignment not found');
    }

    return AssignmentMapper.toDetailResponse(publishedAssignment);
  }

  async unpublish(id: string, teacherId: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
      include: {
        classroom: true,
      }
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    if (assignment.classroom.teacherId !== teacherId) {
      throw new ForbiddenException(
        'You cannot unpublish this assignment',
      );
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.assignedCase.deleteMany({
        where: {
          assignmentId: id,
        },
      });

      await tx.assignment.update({
        where: { id },
        data: {
          isPublished: false,
        },
      });

      return tx.assignment.findUnique({
        where: { id },
        include: assignmentListInclude,
      });
    });

    if (!updated) {
      throw new NotFoundException('Assignment not found');
    }

    return AssignmentMapper.toResponse(updated);
  }

  async deleteAssignment(id: string, teacherId: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
      include: {
        classroom: true,
      }
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    if (assignment.classroom.teacherId !== teacherId) {
      throw new ForbiddenException(
        'You can only delete your own assignments',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.assignedCase.deleteMany({
        where: {
          assignmentId: id,
        },
      });

      await tx.assignment.delete({
        where: {
          id,
        },
      });
    });

    return { id };
  }
}