import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

import { parse } from 'csv-parse/sync';

import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthorizedUserDto } from './dto/create-user.dto';
import { AdminMapper } from './mapper/admin.mapper';
import { UpdateAuthorizedUserDto } from './dto/update-user.dto';

import { UserRole } from '@prisma/client';
import { ImportAuthorizedUserRowDto } from 'src/admin/dto/import-authorized-user-row.dto';
import { ImportAuthorizedUsersResponseDto } from './dto/import-authorized-users-response.dto';
import { ImportAuthorizedUserErrorDto } from './dto/import-authorized-user-error.dto';
import { ImportDuplicateUserDto } from './dto/import-duplicates-user.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  // crud

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
    const authorizedUser = await this.prisma.authorizedUser.findUnique({
      where: { id },
    });

    if (!authorizedUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (
      dto.matricula &&
      dto.matricula !== authorizedUser.matricula
    ) {
      const existing = await this.prisma.authorizedUser.findUnique({
        where: {
          matricula: dto.matricula,
        },
      });

      if (existing) {
        throw new BadRequestException(
          'La matrícula ya está registrada',
        );
      }
    }

    const updatedAuthorizedUser =
      await this.prisma.authorizedUser.update({
        where: { id },
        data: dto,
      });

    await this.prisma.user.updateMany({
      where: {
        matricula: authorizedUser.matricula,
      },
      data: {
        matricula: updatedAuthorizedUser.matricula,
        firstName: updatedAuthorizedUser.firstName,
        lastName: updatedAuthorizedUser.lastName,
        role: updatedAuthorizedUser.role,
      },
    });

    return AdminMapper.toResponse(updatedAuthorizedUser);
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

  async importAuthorizedUsers(
    file: Express.Multer.File,
  ): Promise<ImportAuthorizedUsersResponseDto> {

    // validar archivo antes de hacer el parse

    if (!file) {
      throw new BadRequestException('No se recibio ningun archivo');
    }

    if (!file.originalname.toLowerCase().endsWith('.csv')) {
      throw new BadRequestException(
        'El archivo debe ser un CSV.',
      );
    }

    if (file.size === 0) {
      throw new BadRequestException(
        `El archivo esta vacio.`,
      )
    }

    // Leer CSV
    let rows: ImportAuthorizedUserRowDto[];

    try {
      rows = parse(file.buffer, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
    } catch {
      throw new BadRequestException(
        `El archivo CSV tiene un formato invalido.`,
      );
    }

    // validar que el archivo tenga registros
    if (rows.length === 0) {
      return {
        success: false,
        imported: 0,
        duplicates: {
          count: 0,
          users: [],
        },
        totalRows: rows.length,
        errors: [
          {
            row: 0,
            message: 'El archivo no contiene registros.',
          },
        ],
      }
    }

    // validar encabezados
    const requiredHeaders = [
      'matricula',
      'firstName',
      'lastName',
      'role',
    ];

    const headers = Object.keys(rows[0]);

    const missingHeaders = requiredHeaders.filter(
      h => !headers.includes(h),
    );

    if (missingHeaders.length > 0) {
      return {
        success: false,
        imported: 0,
        duplicates: {
          count: 0,
          users: [],
        },
        totalRows: rows.length,
        errors: [
          {
            row: 1,
            message:
              `Faltan las columnas ${missingHeaders.join(', ')}`,
          },
        ],
      };
    }

    // Validar
    const errors: ImportAuthorizedUserErrorDto[] = [];

    const validRoles = Object.values(UserRole);

    for (let i = 0; i < rows.length; i++) {

      const row = rows[i];
      const rowNumber = i + 2;

      if (!row.matricula || isNaN(Number(row.matricula))) {
        errors.push({
          row: rowNumber,
          message: 'La matrícula es inválida.',
        });
      }

      if (!row.firstName?.trim()) {
        errors.push({
          row: rowNumber,
          message: 'El nombre es obligatorio.',
        });
      }

      if (!row.lastName?.trim()) {
        errors.push({
          row: rowNumber,
          message: 'El apellido es obligatorio.',
        });
      }

      if (!validRoles.includes(row.role = row.role.trim().toUpperCase() as UserRole)) {
        errors.push({
          row: rowNumber,
          message: `Rol inválido: ${row.role}`,
        });
      }
    }

    if (errors.length > 0) {
      return {
        success: false,
        imported: 0,
        duplicates: {
          count: 0,
          users: [],
        },
        totalRows: rows.length,
        errors,
      };
    }

    // Validar matrículas duplicadas en el archivo CSV

    const seenMatriculas = new Set<number>();

    for (let i = 0; i < rows.length; i++) {

      const matricula = Number(rows[i].matricula);

      if (seenMatriculas.has(matricula)) {
        errors.push({
          row: i + 2,
          message: `La matrícula ${matricula} está repetida en el archivo.`,
        });

        continue;
      }

      seenMatriculas.add(matricula);
    }

    if (errors.length > 0) {
      return {
        success: false,
        imported: 0,
        duplicates: {
          count: 0,
          users: [],
        },
        totalRows: rows.length,
        errors,
      };
    }

    // Buscar matrículas existentes

    const matriculas = rows.map(row => Number(row.matricula));

    const existingUsers = await this.prisma.authorizedUser.findMany({
      where: {
        matricula: {
          in: matriculas,
        },
      },
    });

    const existingMatriculas = new Set(
      existingUsers.map(user => user.matricula),
    );

    // Separar nuevos y duplicados

    const newUsers: ImportAuthorizedUserRowDto[] = [];
    const duplicates: ImportDuplicateUserDto[] = [];

    for (const row of rows) {

      const matricula = Number(row.matricula);

      if (existingMatriculas.has(matricula)) {
        duplicates.push({
          matricula,
          firstName: row.firstName,
          lastName: row.lastName,
          role: row.role as UserRole,
        });
        continue;
      }

      newUsers.push(row);
    }

    // Insertar nuevos usuarios

    if (newUsers.length > 0) {
      await this.prisma.authorizedUser.createMany({
        data: newUsers.map(user => ({
          matricula: Number(user.matricula),
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role as UserRole,
        })),
      });
    }

    return {
      success: true,
      imported: newUsers.length,
      duplicates: {
        count: duplicates.length,
        users: duplicates,
      },
      totalRows: rows.length,
      errors: [],
    };
  }
}