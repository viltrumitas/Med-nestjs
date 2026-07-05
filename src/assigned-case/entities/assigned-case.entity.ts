import { Prisma } from '@prisma/client';

export const assignedCaseListInclude = {
  assignment: {
    include: {
      classroom: {
        include: {
          teacher: true,
        },
      },
    },
  },

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
} satisfies Prisma.AssignedCaseInclude;

export const assignedCaseDetailInclude = {
  assignment: {
    include: {
      classroom: {
        include: {
          teacher: true,
        },
      },
    },
  },

  case: {
    include: {
      author: true,
    },
  },

  student: true,

  submission: {
    include: {
      review: {
        select: {
          id: true,
        },
      },
    },
  },
} satisfies Prisma.AssignedCaseInclude;

export const assignedCaseAssignmentSummaryInclude = {
  student: true,
  case: {
    include: {
      author: true,
    },
  },
  submission: {
    include: {
      review: {
        select: { id: true },
      },
    },
  },
} satisfies Prisma.AssignedCaseInclude;

export type AssignedCaseListEntity =
  Prisma.AssignedCaseGetPayload<{
    include: typeof assignedCaseListInclude;
  }>;

export type AssignedCaseDetailEntity =
  Prisma.AssignedCaseGetPayload<{
    include: typeof assignedCaseDetailInclude;
  }>;

export type AssignmentAssignedCaseSummaryEntity =
  Prisma.AssignedCaseGetPayload<{
    include: typeof assignedCaseAssignmentSummaryInclude;
  }>;