import { AssignmentResponseDto } from "./assignment-response.dto";
import { CaseSummaryResponseDto } from "src/cases/dto/case-summary.dto";
import { AssignmentAssignedCaseSummaryDto } from "./assignment-assigned-case-summary.dto";

export class AssignmentDetailResponseDto
  extends AssignmentResponseDto {

  cases!: CaseSummaryResponseDto[];
  assignedCases!: AssignmentAssignedCaseSummaryDto[];
}