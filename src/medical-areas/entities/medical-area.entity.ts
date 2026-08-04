import { Prisma } from "@prisma/client";

export const medicalAreaInclude = {
  _count: {
    select: {
      cases: true,
    },
  },
} satisfies Prisma.MedicalAreaInclude;

export type MedicalAreaEntity =
  Prisma.MedicalAreaGetPayload<{
    include: typeof medicalAreaInclude;
  }>;