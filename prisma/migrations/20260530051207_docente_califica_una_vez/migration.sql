/*
  Warnings:

  - A unique constraint covering the columns `[caseId,teacherId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Review_caseId_teacherId_key" ON "Review"("caseId", "teacherId");
