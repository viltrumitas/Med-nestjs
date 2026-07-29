import { LateSubmissionPolicy } from "@prisma/client";

export class AssignmentSummaryResponse {
  id!: string;
  title!: string;
  description!: string | null;
  isPublished!: boolean;

  dueDate!: Date | null;

  lateSubmissionPolicy!: LateSubmissionPolicy;
}