import { AssignmentResponseDto } from "src/assignments/dto/assignment-response.dto";
import { CaseResponseDto } from "src/cases/dto/case-response.dto";
import { SubmissionStatus } from "@prisma/client";

export class AssignedCaseSubmissionDto {
  id!: string;
  status!: SubmissionStatus;
}

export class AssignedCaseResponseDto {
  id!: string;

  assignment!: AssignmentResponseDto;

  case!: CaseResponseDto;

  submission!: AssignedCaseSubmissionDto | null;

  assignedAt!: Date;
}