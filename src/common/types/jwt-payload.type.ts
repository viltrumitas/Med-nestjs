import { UserRole } from '@prisma/client';

export type JwtPayload = {
  sub: string;
  matricula: number;
  role: UserRole;
};
