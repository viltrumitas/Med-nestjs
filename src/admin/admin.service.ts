import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthorizedUserDto } from './dto/create-user.dto';
import { AdminMapper } from './mapper/admin.mapper';
import { UpdateAuthorizedUserDto } from './dto/update-user.dto';

import { UserRole } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(dto: CreateAuthorizedUserDto) {
    const existing = await this.prisma.authorizedUser.findUnique({
      where: {
        matricula: dto.matricula,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'La matricula ya esta registrada',
      );
    }

    const authorizedUser =
      await this.prisma.authorizedUser.create({
        data: {
          matricula: dto.matricula,
          firstName: dto.firstName,
          lastName: dto.lastName,
          role: dto.role,
        },
      });

    return AdminMapper.toResponse(authorizedUser);
  }

  async findAll() {
    const users = await this.prisma.authorizedUser.findMany({
      orderBy: {
        firstName: 'asc',
      },
    });

    return users.map(AdminMapper.toSummary);
  }

  async findOne(id: string) {
    const user = await this.prisma.authorizedUser.findUnique({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException(
        `Usuario no encontrado`
      )
    }

    return AdminMapper.toResponse(user);
  }

  async update(id: string, dto: UpdateAuthorizedUserDto) {
    const user = await this.prisma.authorizedUser.findUnique({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException(
        `Usuario no encontrado`
      )
    }

    if (dto.matricula && dto.matricula !== user.matricula) {
      const existing = await this.prisma.authorizedUser.findUnique({
        where: {
          matricula: dto.matricula,
        },
      });

      if (existing) {
        throw new BadRequestException(
          `La matricula ya esta registrada`,
        );
      }
    }

    const updated = await this.prisma.authorizedUser.update({
      where: { id },
      data: dto,
    });

    return AdminMapper.toResponse(updated)
  }

  async delete(id: string) {
    const user = await this.prisma.authorizedUser.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const deleted = await this.prisma.authorizedUser.delete({
      where: { id },
    });

    return AdminMapper.toResponse(deleted);
  }

  async statistics() {
    const [
      totalStudents,
      totalTeachers,
      totalAdmins,
      totalAuthorizedUsers,
      totalCases,
      publishedCases,
      draftCases,
      totalAssignments,
      totalClassrooms,
      totalSubmissions,
      reviewedSubmissions,
    ] = await Promise.all([
      this.prisma.user.count({
        where: {
          role: UserRole.STUDENT,
        },
      }),

      this.prisma.user.count({
        where: {
          role: UserRole.TEACHER,
        },
      }),

      this.prisma.user.count({
        where: {
          role: UserRole.ADMIN,
        },
      }),

      this.prisma.authorizedUser.count(),

      this.prisma.case.count(),

      this.prisma.case.count({
        where: {
          isPublished: true,
        },
      }),

      this.prisma.case.count({
        where: {
          isPublished: false,
        },
      }),

      this.prisma.assignment.count(),

      this.prisma.classroom.count(),

      this.prisma.submission.count(),

      this.prisma.review.count(),
    ]);

    return {
      totalStudents,
      totalTeachers,
      totalAdmins,
      totalAuthorizedUsers,
      totalCases,
      publishedCases,
      draftCases,
      totalAssignments,
      totalClassrooms,
      totalSubmissions,
      reviewedSubmissions,
      pendingSubmissions:
        totalSubmissions - reviewedSubmissions,
    };
  }
}
