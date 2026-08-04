import { CaseResponseDto } from '../dto/case-response.dto';
import { TeacherResponseDto } from 'src/users/dto/teacher-response.dto';
import { CaseSummaryResponseDto } from '../dto/case-summary.dto';
import { CaseDetailEntity } from '../entities/case.entity';
import { CaseListEntity } from '../entities/case.entity';
import { Glasgow } from 'src/common/types/glasgow.type';
import { MedicalAreaMapper } from 'src/medical-areas/mapper/medical-area.mapper';

export class CaseMapper {

  private static mapUsage(caseEntity: CaseListEntity | CaseDetailEntity) {
    const uniqueAssignments = [
      ...new Map(
        caseEntity.assignedCases.map((ac) => [
          ac.assignment.id,
          ac.assignment,
        ]),
      ).values(),
    ];

    // total de actividades
    const totalAssignments = uniqueAssignments.length;

    // actividades publicadas
    const activeAssignments = uniqueAssignments.filter(a => a.isPublished).length;

    // ultima vez usado
    const lastUsedAt =
      uniqueAssignments.length === 0
        ? null
        : uniqueAssignments.reduce((latest, current) =>
          current.createdAt > latest.createdAt ? current : latest,
        ).createdAt;

    // nunca usado
    const neverUsed = totalAssignments === 0;

    return {
      totalAssignments,
      activeAssignments,
      lastUsedAt,
      neverUsed,
    }
  }
  static toResponse(caseEntity: CaseDetailEntity): CaseResponseDto {

    const teacher: TeacherResponseDto = {
      id: caseEntity.author.id,
      matricula: caseEntity.author.matricula,
      firstName: caseEntity.author.firstName,
      lastName: caseEntity.author.lastName,
      role: caseEntity.author.role,
    };

    return {
      id: caseEntity.id,
      title: caseEntity.title,

      teacher,

      consult: caseEntity.consult,
      scenery: caseEntity.scenery,

      patientName: caseEntity.patientName,
      gender: caseEntity.gender,
      age: caseEntity.age,

      medicalHistory: caseEntity.medicalHistory,
      medications: caseEntity.medications,

      generalFindings: caseEntity.generalFindings,

      ta: caseEntity.ta,
      fc: caseEntity.fc,
      fr: caseEntity.fr,
      spo2: caseEntity.spo2,
      glucose: caseEntity.glucose,
      temperature: caseEntity.temperature,
      capillaryFiller: caseEntity.capillaryFiller,

      cincinnati: caseEntity.cincinnati as Record<string, any> | null,
      glasgow: caseEntity.glasgow as Glasgow | null,

      medicalArea: caseEntity.medicalArea
        ? {
          id: caseEntity.medicalArea.id,
          name: caseEntity.medicalArea.name,
        }
        : null,

      isPublished: caseEntity.isPublished,

      usage: CaseMapper.mapUsage(caseEntity),

      createdAt: caseEntity.createdAt,
      updatedAt: caseEntity.updatedAt,
    };
  }

  static toSummary(caseEntity: CaseListEntity | CaseDetailEntity): CaseSummaryResponseDto {
    return {
      id: caseEntity.id,
      title: caseEntity.title!,
      consult: caseEntity.consult,
      isPublished: caseEntity.isPublished,
      createdAt: caseEntity.createdAt,
      medicalArea: caseEntity.medicalArea
        ? {
          id: caseEntity.medicalArea.id,
          name: caseEntity.medicalArea.name,
        }
        : null,

      usage: CaseMapper.mapUsage(caseEntity),
    };
  }
}