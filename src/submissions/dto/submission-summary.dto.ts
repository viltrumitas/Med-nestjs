import { SubmissionStatus } from "@prisma/client";
import { AssignmentSummaryResponse } from "src/assignments/dto/assignment-summary.dto";
import { CaseSummaryResponseDto } from "src/cases/dto/case-summary.dto";
import { StudentResponseDto } from "src/users/dto/student-response.dto";
import { StudentSummaryResponse } from "src/users/dto/student-summary.dto";

export class SubmissionSummaryResponseDto {
  id!: string;
  reviewId?: string;
  student!: StudentSummaryResponse;
  assignment!: AssignmentSummaryResponse;
  case!: CaseSummaryResponseDto;
  status!: SubmissionStatus;
  createdAt!: Date;
}