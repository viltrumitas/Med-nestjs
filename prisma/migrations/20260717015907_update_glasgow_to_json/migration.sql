/*
  Warnings:

  - The `glasgow` column on the `Case` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[teacherId,name]` on the table `Classroom` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Case" DROP COLUMN "glasgow",
ADD COLUMN     "glasgow" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "Classroom_teacherId_name_key" ON "Classroom"("teacherId", "name");
