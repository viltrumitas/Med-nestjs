import { Prisma } from "@prisma/client";

export type SubmissionEntity = Prisma.SubmissionGetPayload<{
  include: {
    student: true;
  };
}>;