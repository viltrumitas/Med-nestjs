import { Prisma } from '@prisma/client';

export const toJson = <T>(data: T): Prisma.InputJsonValue =>
  data as Prisma.InputJsonValue;

export const fromJson = <T>(data: Prisma.JsonValue): T =>
  data as unknown as T;