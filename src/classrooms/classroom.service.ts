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

  async findMyClassrooms(teacherId: string) {
    const classrooms = await this.prisma.classroom.findMany({
      where: {
        teacherId,
      },
      include: classroomListInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return classrooms.map(ClassroomMapper.toSummary);
  }

  async findOne(id: string, userId: string) {
    const classroom = await this.prisma.classroom.findUnique({
      where: {
        id
      },
      include: classroomDetailInclude,
    });

    if (!classroom) {
      throw new NotFoundException('Classroom no encontrado');
    }

    const isTeacher = classroom.teacherId === userId;

    const isStudent = await this.prisma.enrollment.findFirst({
      where: {
        classroomId: classroom.id,
        studentId: userId,
      },
    });

    if (!isTeacher && !isStudent) {
      throw new ForbiddenException('No tienes acceso a este classroom');
    }

    return ClassroomMapper.toDetailResponse(classroom);
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