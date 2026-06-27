import { Prisma } from '@prisma/client';

export const assignedCaseListInclude = {
  assignment: {
    include: {
      teacher: true,
    },
  },
  case: {
    include: {
      author: true,
    },
  },
  submission: {
    include: {
      review: true,
    },
  },
} as const satisfies Prisma.AssignedCaseInclude;

export type AssignedCaseListEntity =
  Prisma.AssignedCaseGetPayload<{
    include: typeof assignedCaseListInclude;
  }>;