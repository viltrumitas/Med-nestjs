import { Prisma } from '@prisma/client';

export const caseListInclude = {
  author: true,
} satisfies Prisma.CaseInclude;

export const caseDetailInclude = {
  author: true,
} satisfies Prisma.CaseInclude;

export type CaseListEntity = Prisma.CaseGetPayload<{
  include: typeof caseListInclude;
}>;

export type CaseDetailEntity = Prisma.CaseGetPayload<{
  include: typeof caseDetailInclude;
}>;