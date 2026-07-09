import { Prisma } from '@prisma/client';

export const classroomListInclude = {
  teacher: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    }
  },
  _count: {
    select: {
      enrollments: true,
      assignments: true,
    },
  },
} satisfies Prisma.ClassroomInclude;

export const classroomDetailInclude = {
  teacher: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    }
  },

  enrollments: {
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          matricula: true
        },
      },
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