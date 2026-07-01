import { TeacherResponseDto } from './teacher-response.dto';
import { Gender, MedicalArea } from '@prisma/client';

export class CaseResponseDto {
  id!: string;

  title!: string | null;

  teacher!: TeacherResponseDto | null;

  consult!: string | null;
  scenery!: string | null;

  patientName!: string | null;
  gender!: Gender | null;
  age!: number | null;

  medicalHistory!: string[] | null;
  medications?: string | null;

  generalFindings?: string | null;

  ta?: string | null;
  fc?: number | null;
  fr?: number | null;
  spo2?: number | null;
  glucose?: number | null;
  temperature?: number | null;
  capillaryFiller?: number | null;

  cincinnati?: Record<string, any> | null;
  glasgow?: number | null;

  area!: MedicalArea;

  isPublished!: boolean | null;

  createdAt!: Date;
  updatedAt!: Date;
}
