import { Prisma } from "@prisma/client";

export const assignmentListInclude = {
  classroom: {
    include: {
      teacher: true,
    },
  },
} satisfies Prisma.AssignmentInclude;

export const assignmentDetailInclude = {
  classroom: {
    include: {
      teacher: true,
    },
  },

  cases: {
    include: {
      case: {
        include: {
          author: true,
        },
      },
    },
  },

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
          review: {
            select: {
              id: true,
            },
          },
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