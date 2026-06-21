import { UserRole } from "@prisma/client";

export class UserResponseDto {
  id!: string;
  matricula!: number;
  firstName!: string;
  lastName!: string;
  role!: UserRole;
  createdAt!: Date;
}