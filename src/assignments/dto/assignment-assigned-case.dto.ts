import { SubmissionStatus } from '@prisma/client';
import { StudentResponseDto } from 'src/submissions/dto/student-response.dto';
import { CaseResponseDto } from 'src/cases/dto/case-response.dto';

export class AssignmentAssignedCaseSubmissionDto {
  id!: string;
  status!: SubmissionStatus;
}

export class AssignmentAssignedCaseResponseDto {
  id!: string;

  student!: StudentResponseDto;

  case!: CaseResponseDto;

  submission!: AssignmentAssignedCaseSubmissionDto | null;

  assignedAt!: Date;
}