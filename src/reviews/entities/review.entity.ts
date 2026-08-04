import { Prisma } from '@prisma/client';
import { caseDetailInclude, caseListInclude } from 'src/cases/entities/case.entity';

export const reviewListInclude = {
  teacher: true,
  submission: {
    select: {
      id: true,
      status: true,
      submissionTiming: true,
      submittedAt: true,
      assignedCase: {
        select: {
          student: true,
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
            include: caseListInclude
          },
        },
      },
    },
  },
} satisfies Prisma.ReviewInclude;

export const reviewDetailInclude = {
  teacher: true,

  submission: {
    include: {
      review: {
        include: {
          teacher: true,
        },
      },

      assignedCase: {
        include: {
          student: true,

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
            include: caseDetailInclude,
          },
        },
      },
    },
  },
} satisfies Prisma.ReviewInclude;

export type ReviewListEntity = Prisma.ReviewGetPayload<{
  include: typeof reviewListInclude;
}>;

export type ReviewDetailEntity = Prisma.ReviewGetPayload<{
  include: typeof reviewDetailInclude;
}>;