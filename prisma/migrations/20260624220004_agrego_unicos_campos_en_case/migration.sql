/*
  Warnings:

  - A unique constraint covering the columns `[title,patientName,teacherId]` on the table `Case` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Case_title_patientName_teacherId_key" ON "Case"("title", "patientName", "teacherId");
