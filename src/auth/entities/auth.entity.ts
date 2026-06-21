import { Prisma } from "@prisma/client";

export const userInclude = {} satisfies Prisma.UserInclude;

export type UserEntity = Prisma.UserGetPayload<{
  include: typeof userInclude
}>;