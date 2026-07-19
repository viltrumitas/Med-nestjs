/*
  Warnings:

  - You are about to drop the `AuthorizedTeacher` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "AuthorizedTeacher";

-- CreateTable
CREATE TABLE "AuthorizedUser" (
    "id" TEXT NOT NULL,
    "matricula" INTEGER NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthorizedUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthorizedUser_matricula_key" ON "AuthorizedUser"("matricula");
