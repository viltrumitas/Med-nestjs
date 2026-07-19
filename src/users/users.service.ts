import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma,
  UserRole,
} from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  findByMatricula(matricula: number) {
    return this.prisma.user.findUnique({
      where: {
        matricula,
      },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    return user;
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        matricula: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    return user;
  }

  async findTeachers() {
    return this.prisma.user.findMany({
      where: {
        role: UserRole.TEACHER,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        matricula: true,
      },
      orderBy: {
        firstName: 'asc',
      },
    });
  }

  async findStudents() {
    return this.prisma.user.findMany({
      where: {
        role: UserRole.STUDENT,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        matricula: true,
      },
      orderBy: {
        firstName: 'asc',
      },
    });
  }

  findAuthorizedUser(matricula: number) {
    return this.prisma.authorizedUser.findUnique({
      where: {
        matricula,
      },
    });
  }

  create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
    });
  }
}