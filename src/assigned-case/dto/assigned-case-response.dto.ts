import { AssignmentResponseDto } from "src/assignments/dto/assignment-response.dto";
import { CaseResponseDto } from "src/cases/dto/case-response.dto";

export class AssignedCaseResponseDto {
  id!: string;

  assignment!: AssignmentResponseDto;

  case!: CaseResponseDto;

  submissionId!: string | null;

  assignedAt!: Date;
}