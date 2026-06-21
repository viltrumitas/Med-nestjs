import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByMatricula(matricula: number) {
    return this.prisma.user.findUnique({
      where: {
        matricula,
      },
    });
  }

  findAuthorizedTeacher(matricula: number) {
    return this.prisma.authorizedTeacher.findUnique({
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
