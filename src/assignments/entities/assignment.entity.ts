import { Prisma } from "@prisma/client";

export const assignmentListInclude = {
  teacher: true,
} satisfies Prisma.AssignmentInclude;

export const assignmentDetailInclude = {
  teacher: true,
  assignedCases: {
    include: {
      student: true,
      case: true,
    },
  },
} satisfies Prisma.AssignmentInclude;

export type AssignmentListEntity = Prisma.AssignmentGetPayload<{
  include: typeof assignmentListInclude;
}>;