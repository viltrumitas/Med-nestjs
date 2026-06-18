import { Priority, SubmissionStatus } from "@prisma/client";
import { StudentResponseDto } from "./student-response.dto";

export class SubmissionResponseDto {
  id!: string;

  student!: StudentResponseDto;
  sceneManagement?: string | null;
  sss?: string | null;
  primaryTest?: string | null;
  sample?: string | null;
  opqrst?: string | null;
  presumptiveDiagnosis?: string | null;
  priority?: Priority | null;
  transferDecision?: boolean | null;
  treatmentPlan?: string | null;
  reportPatient?: string | null;
  status!: SubmissionStatus | null;

  createdAt!: Date;
  updatedAt!: Date;
}