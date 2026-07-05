import { UserRole } from "@prisma/client";

export class StudentResponseDto {
  id!: string;
  matricula!: number;
  firstName!: string;
  lastName!: string;
  role!: UserRole;
}