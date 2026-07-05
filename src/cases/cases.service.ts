import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CaseMapper } from './mappers/case.mapper';
import { CreateCaseDto } from './dto/create-case.dto';
import { caseListInclude, caseDetailInclude } from './entities/case.entity';

@Injectable()
export class CasesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateCaseDto, teacherId: string) {
    const existing = await this.prisma.case.findFirst({
      where: {
        title: data.general.title,
        patientName: data.patient.patientName,
        teacherId,
      },
    });

    if (existing) {
      throw new BadRequestException('Ya existe un caso con estos datos');
    }

    const createdCase = await this.prisma.case.create({
      data: {
        title: data.general.title,
        consult: data.general.consult,
        scenery: data.general.scenery,

        patientName: data.patient.patientName,
        gender: data.patient.gender,
        age: data.patient.age,
        medicalHistory: data.patient.medicalHistory,
        medications: data.patient.medications,

        generalFindings: data.findings.generalFindings,

        ta: data.vitalSigns.ta,
        fc: data.vitalSigns.fc,
        fr: data.vitalSigns.fr,
        spo2: data.vitalSigns.spo2,
        glucose: data.vitalSigns.glucose,
        temperature: data.vitalSigns.temperature,
        capillaryFiller: data.vitalSigns.capillaryFiller,

        cincinnati: data.neurological.cincinnati,
        glasgow: data.neurological.glasgow,

        area: data.area,

        author: {
          connect: { id: teacherId },
        },
      },
      include: caseDetailInclude,
    });

    return CaseMapper.toResponse(createdCase);
  }

  async findAll() {
    const cases = await this.prisma.case.findMany({
      where: {
        isPublished: true,
      },
      include: caseListInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return cases.map(CaseMapper.toSummary);
  }

  async findMyCases(teacherId: string) {
    const cases = await this.prisma.case.findMany({
      where: {
        teacherId
      },
      include: caseListInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return cases.map(CaseMapper.toSummary);
  }

  async findPublished(teacherId: string) {
    const cases = await this.prisma.case.findMany({
      where: {
        teacherId,
        isPublished: true,
      },
      include: caseListInclude,
      orderBy: {
        createdAt: 'desc'
      },
    });
    return cases.map(CaseMapper.toSummary);
  }

  async findOne(id: string, teacherId?: string) {
    const caseEntity = await this.prisma.case.findUnique({
      where: { id },
      include: caseDetailInclude,
    });

    if (!caseEntity) {
      throw new NotFoundException('Caso no encontrado');
    }

    if (!caseEntity.isPublished && caseEntity.teacherId !== teacherId) {
      throw new ForbiddenException('No tienes acceso a este caso');
    }

    return CaseMapper.toResponse(caseEntity);
  }

  async publish(id: string, teacherId: string) {
    const caseEntity = await this.prisma.case.findUnique({
      where: { id },
    });

    if (!caseEntity) {
      throw new NotFoundException('Caso no encontrado');
    }

    if (caseEntity.teacherId !== teacherId) {
      throw new ForbiddenException('Solo puedes publicar tus propios casos');
    }

    if (caseEntity.isPublished) {
      throw new BadRequestException('El caso ya ha sido publicado');
    }

    const updatedCase = await this.prisma.case.update({
      where: { id },
      data: {
        isPublished: true,
      },
      include: caseDetailInclude,
    });

    return CaseMapper.toResponse(updatedCase);
  }

  async unpublish(id: string, teacherId: string) {
    const caseEntity = await this.prisma.case.findUnique({
      where: { id },
    });

    if (!caseEntity) {
      throw new NotFoundException('Caso no encontrado');
    }

    if (caseEntity.teacherId !== teacherId) {
      throw new ForbiddenException(`No puedes despublicar este caso`);
    }

    const usedCase = await this.prisma.assignmentCase.findFirst({
      where: {
        caseId: id,
        assignment: {
          isPublished: true,
        },
      },
    })

    if (usedCase) {
      throw new BadRequestException('No puedes despublicar un caso que pertenece a una actividad publicada');
    }

    const updatedCase = await this.prisma.case.update({
      where: { id },
      data: {
        isPublished: false,
      },
      include: caseDetailInclude,
    });

    return CaseMapper.toResponse(updatedCase)
  }

  async deleteCase(id: string, teacherId: string) {
    const caseEntity = await this.prisma.case.findUnique({
      where: { id },
    });

    if (!caseEntity) {
      throw new NotFoundException('Caso no encontrado');
    }

    if (caseEntity.teacherId !== teacherId) {
      throw new ForbiddenException('Solo puedes borrar tus propios casos');
    }

    const usages = await this.prisma.assignmentCase.count({
      where: {
        caseId: id,
      },
    });

    if (usages > 0) {
      throw new BadRequestException('No puedes eliminar un caso que esta siendo utilizado en una actividad');
    }

    return this.prisma.case.delete({
      where: { id },
    });
  }
}
