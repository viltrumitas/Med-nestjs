import { AssignmentResponseDto } from "./assignment-response.dto";
import { AssignmentAssignedCaseResponseDto } from "./assignment-assigned-case.dto";

export class AssignmentDetailResponseDto
  extends AssignmentResponseDto {

  assignedCases!: AssignmentAssignedCaseResponseDto[];
}