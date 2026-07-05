import { Prisma } from '@prisma/client';

export const submissionListInclude = {
  assignedCase: {
    include: {
      student: true,
      case: {
        include: {
          author: true,
        },
      },
      assignment: {
        include: {
          classroom: {
            include: {
              teacher: true,
            },
          },
        },
      },
    },
  },
  review: {
    select: {
      id: true,
    },
  },
} satisfies Prisma.SubmissionInclude;


export const submissionDetailInclude = {
  assignedCase: {
    include: {
      student: true,
      case: {
        include: {
          author: true,
        },
      },
      assignment: {
        include: {
          classroom: {
            include: {
              teacher: true,
            },
          },
        },
      },
    },
  },
  review: {
    include: {
      teacher: true,
    },
  },
} satisfies Prisma.SubmissionInclude;


export type SubmissionListEntity =
Prisma.SubmissionGetPayload<{
  include: typeof submissionListInclude;
}>;

export type SubmissionDetailEntity =
  Prisma.SubmissionGetPayload<{
    include: typeof submissionDetailInclude;
  }>;