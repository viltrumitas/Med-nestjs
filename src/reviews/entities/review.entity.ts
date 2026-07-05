import { Prisma } from '@prisma/client';

export const reviewListInclude = {
  teacher: true,
  submission: {
    select: {
      id: true,
      status: true,
      assignedCase: {
        select: {
          student: true,
          assignment: {
            select: {
              id: true,
              title: true,
              isPublished: true,
            },
          },
          case: {
            select: {
              id: true,
              title: true,
              consult: true,
              isPublished: true,
            },
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
            include: {
              author: true,
            },
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