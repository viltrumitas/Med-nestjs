import { Prisma } from '@prisma/client';

export const caseInclude = {
  author: true,
} satisfies Prisma.CaseInclude;

export type CaseEntity = Prisma.CaseGetPayload<{
  include: typeof caseInclude;
}>;