import { Prisma } from '@prisma/client';

export const classroomListInclude = {
  teacher: true,
  _count: {
    select: {
      enrollments: true,
      assignments: true,
    },
  },
} satisfies Prisma.ClassroomInclude;

export const classroomDetailInclude = {
  teacher: true,

  enrollments: {
    include: {
      student: true,
    },
  },

  assignments: true,

  _count: {
    select: {
      enrollments: true,
      assignments: true,
    },
  },
} satisfies Prisma.ClassroomInclude;

export type ClassroomListEntity =
  Prisma.ClassroomGetPayload<{
    include: typeof classroomListInclude;
  }>;

export type ClassroomDetailEntity =
  Prisma.ClassroomGetPayload<{
    include: typeof classroomDetailInclude;
  }>;