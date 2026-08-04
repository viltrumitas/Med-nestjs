import { Prisma } from '@prisma/client';

export const caseListInclude = {
  author: true,
  medicalArea: true,
  assignedCases: {
    select: {
      assignmentId: true,
      assignedAt: true,
      assignment: {
        select: {
          id: true,
          isPublished: true,
          createdAt: true,
        },
      },
    },
  },
} satisfies Prisma.CaseInclude;

export const caseDetailInclude = {
  author: true,
  medicalArea: true,
  assignedCases: {
    select: {
      assignmentId: true,
      assignedAt: true,
      assignment: {
        select: {
          id: true,
          isPublished: true,
          createdAt: true,
        },
      },
    },
  },
} satisfies Prisma.CaseInclude;

export type CaseListEntity = Prisma.CaseGetPayload<{
  include: typeof caseListInclude;
}>;

export type CaseDetailEntity = Prisma.CaseGetPayload<{
  include: typeof caseDetailInclude;
}>;