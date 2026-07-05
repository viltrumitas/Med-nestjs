import { AssignmentSummaryResponse } from "src/assignments/dto/assignment-summary.dto";
import { CaseSummaryResponseDto } from "src/cases/dto/case-summary.dto";
import { SubmissionStatus } from "@prisma/client";

export class AssignedCaseSummaryResponseDto {
  id!: string;

  assignment!: AssignmentSummaryResponse;

  case!: CaseSummaryResponseDto;

  submission!: {
    id: string;
    status: SubmissionStatus;
    reviewId: string | null;
  } | null;

  assignedAt!: Date;
}