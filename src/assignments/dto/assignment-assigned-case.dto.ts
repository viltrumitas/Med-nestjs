import { StudentResponseDto } from "src/submissions/dto/student-response.dto";
import { CaseResponseDto } from "src/cases/dto/case-response.dto";

export class AssignmentAssignedCaseResponseDto {
  id!: string;

  student!: StudentResponseDto;

  case!: CaseResponseDto;

  submissionId!: string | null;

  assignedAt!: Date;
}