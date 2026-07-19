import { UserRole } from '@prisma/client';

export class AuthorizedUserSummaryDto {
  id!: string;
  matricula!: number;
  firstName!: string;
  lastName!: string;
  role!: UserRole;
}