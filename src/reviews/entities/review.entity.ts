import { Prisma } from '@prisma/client';

export const reviewInclude = {
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
                }
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

export type ReviewEntity = Prisma.ReviewGetPayload<{
  include: typeof reviewInclude;
}>;