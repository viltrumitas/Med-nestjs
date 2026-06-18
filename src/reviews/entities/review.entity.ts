import { Prisma } from '@prisma/client';

export const reviewInclude = {
  teacher: true,
  submission: {
    include: {
      student: true,
      case: true,
    },
  },
} satisfies Prisma.ReviewInclude;

export type ReviewEntity = Prisma.ReviewGetPayload<{
  include: typeof reviewInclude;
}>;