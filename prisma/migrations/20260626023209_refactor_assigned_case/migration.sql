/*
  Warnings:

  - You are about to drop the column `assignmentId` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `caseId` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Submission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[assignedCaseId]` on the table `Submission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assignedCaseId` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_caseId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_studentId_fkey";

-- DropIndex
DROP INDEX "Submission_assignmentId_studentId_key";

-- DropIndex
DROP INDEX "Submission_caseId_idx";

-- DropIndex
DROP INDEX "Submission_studentId_idx";

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "assignmentId",
DROP COLUMN "caseId",
DROP COLUMN "studentId",
ADD COLUMN     "assignedCaseId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Submission_assignedCaseId_key" ON "Submission"("assignedCaseId");

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_assignedCaseId_fkey" FOREIGN KEY ("assignedCaseId") REFERENCES "AssignedCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
