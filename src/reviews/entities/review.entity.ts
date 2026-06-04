import { UserRole } from '@prisma/client';

export class ReviewTeacherEntity {
  id!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  role!: UserRole;
}
export class ReviewEntity {
  id!: string;
  feedback!: string;
  teacher!: ReviewTeacherEntity;
}
