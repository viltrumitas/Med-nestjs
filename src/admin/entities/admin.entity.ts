import { Prisma } from '@prisma/client';

export type AuthorizedUserEntity =
  Prisma.AuthorizedUserGetPayload<{}>;