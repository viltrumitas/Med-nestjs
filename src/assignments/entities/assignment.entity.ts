import { Prisma } from "@prisma/client";

export const assignmentListInclude = {
  teacher: true,
} satisfies Prisma.AssignmentInclude;

export const assignmentDetailInclude = {
  teacher: true,
  assignedCases: {
    include: {
      student: true,
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
    },
  },
} satisfies Prisma.AssignmentInclude;

export type AssignmentListEntity =
  Prisma.AssignmentGetPayload<{
    include: typeof assignmentListInclude;
  }>;

export type AssignmentDetailEntity =
  Prisma.AssignmentGetPayload<{
    include: typeof assignmentDetailInclude;
  }>;

export type AssignmentAssignedCaseEntity =
  Prisma.AssignedCaseGetPayload<{
    include: typeof assignmentDetailInclude.assignedCases.include;
  }>;