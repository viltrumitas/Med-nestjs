import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";

import { PrismaService } from "src/prisma/prisma.service";

import { CreateMedicalAreaDto } from "./dto/create-medical-area.dto";
import { UpdateMedicalAreaDto } from "./dto/update-medical-area.dto";


import { MedicalAreaMapper } from "./mapper/medical-area.mapper";
import { medicalAreaInclude } from "./entities/medical-area.entity";

@Injectable()
export class MedicalAreasService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateMedicalAreaDto) {
    const exists = await this.prisma.medicalArea.findFirst({
      where: {
        name: {
          equals: dto.name.trim(),
          mode: 'insensitive',
        },
      },
    });

    if (exists) {
      throw new ConflictException(
        'Ya existe un area medica con ese nombre.',
      );
    }

    const area = await this.prisma.medicalArea.create({
      data: {
        name: dto.name.trim(),
        description: dto.description,
      },
      include: medicalAreaInclude,
    });

    return MedicalAreaMapper.toResponse(area);
  }

  async findAll() {
    const areas = await this.prisma.medicalArea.findMany({
      include: {
        _count: {
          select: {
            cases: true,
          },
        },
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });

    return areas.map(
      MedicalAreaMapper.toSummary,
    );
  }

  async findOne(id: string) {
    const area = await this.prisma.medicalArea.findUnique({
      where: {
        id,
      },
      include: medicalAreaInclude,
    });

    if (!area) {
      throw new NotFoundException(
        'Area medica no encontrada.',
      )
    }

    return MedicalAreaMapper.toResponse(area);
  }

  async update(
    id: string,
    dto: UpdateMedicalAreaDto
  ) {
    const exists = await this.prisma.medicalArea.findUnique({
      where: {
        id,
      },
    });

    if (!exists) {
      throw new NotFoundException(
        'Area medica no encontrada.',
      );
    }

    if (dto.name) {
      const duplicated =
        await this.prisma.medicalArea.findFirst({
          where: {
            name: {
              equals: dto.name.trim(),
              mode: 'insensitive'
            },
            NOT: {
              id,
            },
          },
        });
      
      if (duplicated) {
        throw new ConflictException(
          'Ya existe un area medica con ese nombre.',
        )
      }
    }

    const updated =
      await this.prisma.medicalArea.update({
        where: {
          id,
        },
        data: {
          ...dto,
          name: dto.name?.trim(),
        },
        include: medicalAreaInclude,
      });

    return MedicalAreaMapper.toResponse(updated);
  }

  async remove(id: string) {
    const area = await this.prisma.medicalArea.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            cases: true,
          },
        },
      },
    });

    if (!area) {
      throw new NotFoundException(
        'Area medica no encontrada.',
      );
    }

    if (area._count.cases > 0) {
      throw new ConflictException(
        'No es posible eliminar un area medica que tiene casos clinicos asociados.',
      );
    }

    await this.prisma.medicalArea.delete({
      where: {
        id,
      },
    });

    return {
      message:
        'Area medica eliminada correctamente.',
    };
  }
}