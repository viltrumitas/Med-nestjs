import { Prisma } from '@prisma/client';

export const submissionInclude = {
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
          teacher: true,
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

export type SubmissionEntity =
  Prisma.SubmissionGetPayload<{
    include: typeof submissionInclude;
  }>;