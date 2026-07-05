import { AssignmentSummaryResponse } from "src/assignments/dto/assignment-summary.dto";
import { CaseSummaryResponseDto } from "src/cases/dto/case-summary.dto";
import { StudentSummaryResponse } from "src/users/dto/student-summary.dto";

export class ReviewSummaryResponseDto {
  id!: string;
  totalScore!: number;
  student!: StudentSummaryResponse;
  assignment!: AssignmentSummaryResponse;
  case!: CaseSummaryResponseDto;
  createdAt!: Date;
}