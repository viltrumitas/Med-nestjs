import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";

import { PrismaService } from "src/prisma/prisma.service";
import { ClassroomMapper } from "./mappers/classroom-mapper";
import { classroomListInclude, classroomDetailInclude } from "./entities/classroom.entity";
import { CreateClassroomDto } from "./dto/create-classroom.dto";
import { UpdateClassroomDto } from "./dto/update-classroom.dto";
import { generateUniqueCode } from "src/common/utils/generate-code";
import { CreateAssignmentDto } from "src/assignments/dto/create-assignment.dto";
import { AssignmentMapper } from "src/assignments/mapper/assignment.mapper";
import { assignmentDetailInclude } from "src/assignments/entities/assignment.entity";
import { UserRole } from "@prisma/client";

@Injectable()
export class ClassroomsService {
  constructor(private readonly prisma: PrismaService) { }


  // crear classroom 

  async create(dto: CreateClassroomDto, teacherId: string) {

    const existing = await this.prisma.classroom.findFirst({
      where: {
        name: dto.name,
        teacherId
      },
    })

    if (existing) {
      throw new ConflictException('Ya existe un classroom con ese nombre');
    }

    const code = await generateUniqueCode(this.prisma, 6);

    const classroom = await this.prisma.classroom.create({
      data: {
        name: dto.name,
        description: dto.description,
        code,
        isActive: true,

        teacher: {
          connect: { id: teacherId }
        },
      },
      include: classroomDetailInclude,
    });

    return ClassroomMapper.toResponse(classroom);
  }

  async createAssignment(classroomId: string, data: CreateAssignmentDto, teacherId: string) {

    if (!data.caseIds || data.caseIds.length < 1) {
      throw new BadRequestException('Selecciona al menos un caso');
    }

    const classroom = await this.prisma.classroom.findFirst({
      where: {
        id: classroomId,
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
        classroomId,
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
            id: classroomId
          }
        },

        cases: {
          create: data.caseIds.map((caseId) => ({
            caseId,
          })),
        },
      },
      include: assignmentDetailInclude,
    });

    return AssignmentMapper.toResponse(assignment);
  }

  async findMyClassrooms(userId: string, role: UserRole) {

    if (role === UserRole.TEACHER) {
      const classrooms = await this.prisma.classroom.findMany({
        where: {
          teacherId: userId,
        },
        include: classroomListInclude,
        orderBy: {
          createdAt: 'desc',
        },
      });

      return classrooms.map(ClassroomMapper.toResponse);
    }

    if (role === UserRole.STUDENT) {
      const classrooms = await this.prisma.classroom.findMany({
        where: {
          enrollments: {
            some: {
              studentId: userId,
            },
          },
        },
        include: classroomListInclude,
        orderBy: {
          createdAt: 'desc',
        },
      });

      return classrooms.map(ClassroomMapper.toResponse);
    }
    return [];
  }

  async findOne(id: string, userId: string, role: UserRole) {
    const classroom = await this.prisma.classroom.findUnique({
      where: {
        id
      },
      include: classroomDetailInclude,
    });

    if (!classroom) {
      throw new NotFoundException('Classroom no encontrado');
    }

    if (role === UserRole.TEACHER) {
      if (classroom.teacherId !== userId) {
        throw new ForbiddenException(
          'No tienes acceso a este classroom'
        )
      }

      return ClassroomMapper.toTeacherResponse(
        classroom,
      );
    }

    if (role === UserRole.STUDENT) {
      const enrollment =
        await this.prisma.enrollment.findFirst({
          where: {
            classroomId: id,
            studentId: userId,
          },
        });

      if (!enrollment) {
        throw new ForbiddenException(
          'No perteneces a este classroom',
        );
      }

      classroom.assignments =
        classroom.assignments.filter(
          assignment =>
            assignment.isPublished,
        );

      return ClassroomMapper.toStudentResponse(
        classroom,
      );
    }
  }

  async update(id: string, teacherId: string, dto: UpdateClassroomDto) {
    const classroom = await this.prisma.classroom.findUnique({
      where: {
        id
      },
    });

    if (!classroom) {
      throw new NotFoundException('Classroom no encontrado');
    }

    if (classroom.teacherId !== teacherId) {
      throw new ForbiddenException('No puedes editar este classroom');
    }

    const updated = await this.prisma.classroom.update({
      where: {
        id
      },
      data: dto,
      include: classroomListInclude,
    });

    return ClassroomMapper.toResponse(updated);
  }

  async delete(id: string, teacherId: string) {
    const classroom = await this.prisma.classroom.findUnique({
      where: {
        id
      },
    });

    if (!classroom) {
      throw new NotFoundException('Classroom no encontrado');
    }

    if (classroom.teacherId !== teacherId) {
      throw new ForbiddenException('No puedes eliminar este classroom');
    }

    await this.prisma.classroom.delete({
      where: {
        id
      }
    });

    return { id };
  }

  async joinByCode(code: string, studentId: string) {
    const classroom = await this.prisma.classroom.findUnique({
      where: {
        code
      },
    });

    if (!classroom) {
      throw new NotFoundException('Classroom no existe');
    }

    if (!classroom.isActive) {
      throw new ForbiddenException('Classroom inactivo');
    }

    const already = await this.prisma.enrollment.findFirst({
      where: {
        classroomId: classroom.id,
        studentId,
      },
    });

    if (already) {
      throw new ConflictException('Ya estas inscrito en este classroom');
    }

    await this.prisma.enrollment.create({
      data: {
        classroomId: classroom.id,
        studentId,
      },
    });

    return { success: true }
  }

  async getStudents(classroomId: string, teacherId: string) {
    const classroom = await this.prisma.classroom.findUnique({
      where: { id: classroomId },
    });

    if (!classroom) {
      throw new NotFoundException('Classroom no encontrado');
    }

    if (classroom.teacherId !== teacherId) {
      throw new ForbiddenException('No autorizado');
    }

    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        classroomId
      },
      include: {
        student: true,
      },
    });

    return enrollments.map((e) => e.student);
  }
}