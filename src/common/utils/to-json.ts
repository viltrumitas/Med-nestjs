import { Prisma } from '@prisma/client';

export const toJson = <T>(data: T): Prisma.InputJsonValue =>
  data as Prisma.InputJsonValue;