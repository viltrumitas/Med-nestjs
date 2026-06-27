/*
  Warnings:

  - A unique constraint covering the columns `[assignmentId,studentId]` on the table `Submission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assignmentId` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Submission_caseId_studentId_key";

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "assignmentId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "teacherId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignedCase" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssignedCase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AssignedCase_studentId_idx" ON "AssignedCase"("studentId");

-- CreateIndex
CREATE INDEX "AssignedCase_caseId_idx" ON "AssignedCase"("caseId");

-- CreateIndex
CREATE INDEX "AssignedCase_assignmentId_idx" ON "AssignedCase"("assignmentId");

-- CreateIndex
CREATE UNIQUE INDEX "AssignedCase_assignmentId_studentId_key" ON "AssignedCase"("assignmentId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_assignmentId_studentId_key" ON "Submission"("assignmentId", "studentId");

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedCase" ADD CONSTRAINT "AssignedCase_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedCase" ADD CONSTRAINT "AssignedCase_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedCase" ADD CONSTRAINT "AssignedCase_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
