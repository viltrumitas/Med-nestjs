import { UserRole } from '@prisma/client';

export class AuthorizedUserResponseDto {
  id!: string;
  matricula!: number;
  firstName!: string;
  lastName!: string;
  role!: UserRole;

  createdAt!: Date;
  updatedAt!: Date;
}