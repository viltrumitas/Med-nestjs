import { UserRole } from "@prisma/client";

export class TeacherSummaryResponse {
  id!: string;
  firstName!: string;
  lastName!: string;
  role!: UserRole;
}