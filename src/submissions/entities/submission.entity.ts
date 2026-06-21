import { Prisma } from "@prisma/client";

export const submissionInclude = {
  student: true,
  case: true,
  review: {
    include: {
      teacher: true,
    },
  },
} satisfies Prisma.SubmissionInclude;

export type SubmissionEntity = Prisma.SubmissionGetPayload<{
  include: typeof submissionInclude;
}>;