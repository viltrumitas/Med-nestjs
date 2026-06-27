/*
  Warnings:

  - Added the required column `area` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MedicalArea" AS ENUM ('PEDIATRICS', 'TRAUMA', 'GYNECO_OBSTETRICS', 'ADULT_EMERGENCY');

-- AlterTable
ALTER TABLE "Case" ADD COLUMN     "area" "MedicalArea" NOT NULL;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "studentId" TEXT NOT NULL;
