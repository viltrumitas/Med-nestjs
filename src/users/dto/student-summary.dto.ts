import { UserRole } from "@prisma/client";

export class StudentSummaryResponse {
  id!: string;
  firstName!: string;
  lastName!: string;
  role!: UserRole;
}