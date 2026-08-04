import { Prisma } from '@prisma/client';
import { caseDetailInclude, caseListInclude } from 'src/cases/entities/case.entity';

export const assignedCaseListInclude = {
  assignment: {
    include: {
      classroom: {
        include: {
          teacher: true,
        }
      }
    }
  },

  case: {
    include: caseListInclude
  },

  submission: {
    include: {
      review: {
        select: {
          id: true,
        }
      }
    }
  },

} satisfies Prisma.AssignedCaseInclude;

export const assignedCaseDetailInclude = {
  assignment: {
    include: {
      classroom: {
        include: {
          teacher: true,
        }
      }
    }
  },

  case: {
    include: caseDetailInclude,
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
    include: caseListInclude,
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

export type SubmissionEntity =
  Prisma.SubmissionGetPayload<{
    include: {
      review: {
        select: {
          id: true;
        };
      };
    };
  }>;