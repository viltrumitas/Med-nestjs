import { CaseEntity } from '../entities/case.entity';
import { CaseResponseDto } from '../dto/case-response.dto';
import { TeacherResponseDto } from 'src/users/dto/teacher-response.dto';

export class CaseMapper {
  static toResponse(caseEntity: CaseEntity): CaseResponseDto {
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

      cincinnati:
        caseEntity.cincinnati as Record<string, any> | null,

      glasgow: caseEntity.glasgow,

      area: caseEntity.area,

      isPublished: caseEntity.isPublished,

      createdAt: caseEntity.createdAt,
      updatedAt: caseEntity.updatedAt,
    };
  }
}