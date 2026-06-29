import { AssignmentResponseDto } from "./assignment-response.dto";
import { AssignmentAssignedCaseResponseDto } from "./assignment-assigned-case.dto";
import { CaseResponseDto } from "src/cases/dto/case-response.dto";

export class AssignmentDetailResponseDto
  extends AssignmentResponseDto {

  cases!: CaseResponseDto[];
  assignedCases!: AssignmentAssignedCaseResponseDto[];
}