import { Priority, SubmissionStatus } from '@prisma/client';
import { StudentResponseDto } from 'src/users/dto/student-response.dto';
import { AssignmentResponseDto } from 'src/assignments/dto/assignment-response.dto';
import { CaseResponseDto } from 'src/cases/dto/case-response.dto';

export class SubmissionResponseDto {
  id!: string;

  reviewId!: string | null;

  student!: StudentResponseDto;

  assignment!: AssignmentResponseDto;
  case!: CaseResponseDto;
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
