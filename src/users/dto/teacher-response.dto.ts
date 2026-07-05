import { UserRole } from '@prisma/client';

export class TeacherResponseDto {
  id!: string;
  matricula!: number;
  firstName!: string;
  lastName!: string;
  role!: UserRole;
}
