import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CaseMapper } from './mappers/case.mapper';
import { CreateCaseDto } from './dto/create-case.dto';
import { caseInclude } from './entities/case.entity';

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
      include: caseInclude,
    });

    return CaseMapper.toResponse(createdCase);
  }

  async findAll() {
    const cases = await this.prisma.case.findMany({
      where: {
        isPublished: true,
      },
      include: caseInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return cases.map(CaseMapper.toResponse);
  }

  async findMyCases(teacherId: string) {
    const cases = await this.prisma.case.findMany({
      where: {
        teacherId
      },
      include: caseInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return cases.map(CaseMapper.toResponse);
  }

  async findOne(id: string) {
    const caseEntity = await this.prisma.case.findUnique({
      where: { id },
      include: caseInclude,
    });

    if (!caseEntity) {
      throw new NotFoundException('Case not found');
    }

    return CaseMapper.toResponse(caseEntity);
  }

  async publish(id: string, teacherId: string) {
    const caseEntity = await this.prisma.case.findUnique({
      where: { id },
    });

    if (!caseEntity) {
      throw new NotFoundException('Case not found');
    }

    if (caseEntity.teacherId !== teacherId) {
      throw new ForbiddenException('You can only publish your own cases');
    }

    if (caseEntity.isPublished) {
      throw new BadRequestException('Case is already published');
    }

    const updatedCase = await this.prisma.case.update({
      where: { id },
      data: {
        isPublished: true,
      },
      include: caseInclude,
    });

    return CaseMapper.toResponse(updatedCase);
  }

  async unpublish(id: string, teacherId: string) {
    const caseEntity = await this.prisma.case.findUnique({
      where: { id },
    });

    if (!caseEntity) {
      throw new NotFoundException('Case not found');
    }

    if (caseEntity.teacherId !== teacherId) {
      throw new ForbiddenException(`You can't unpublish this case`);
    }

    const updatedCase = await this.prisma.case.update({
      where: { id },
      data: {
        isPublished: false,
      },
      include: caseInclude,
    });

    return CaseMapper.toResponse(updatedCase)
  }

  async deleteCase(id: string, teacherId: string) {
    const caseEntity = await this.prisma.case.findUnique({
      where: { id },
    });

    if (!caseEntity) {
      throw new NotFoundException('Case not found');
    }

    if (caseEntity.teacherId !== teacherId) {
      throw new ForbiddenException('You can only delete your own cases');
    }

    return this.prisma.case.delete({
      where: { id },
    });
  }
}
