import { UserRole } from "@prisma/client";

export class ImportDuplicateUserDto {
  matricula!: number;
  firstName!: string;
  lastName!: string;
  role!: UserRole;
}