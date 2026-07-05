import { StudentSummaryResponse } from "src/users/dto/student-summary.dto";
import { CaseSummaryResponseDto } from "src/cases/dto/case-summary.dto";
import { SubmissionStatus } from "@prisma/client";

export class AssignmentAssignedCaseSummaryDto {
  id!: string;

  student!: StudentSummaryResponse;

  case!: CaseSummaryResponseDto;

  submission!: {
    id: string;
    status: SubmissionStatus;
    reviewId: string | null;
  } | null;

  assignedAt!: Date;
}