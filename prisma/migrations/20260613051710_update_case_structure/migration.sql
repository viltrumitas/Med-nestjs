/*
  Warnings:

  - You are about to drop the column `description` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Case` table. All the data in the column will be lost.
  - Added the required column `presumptiveDiagnosis` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryTest` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priority` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reportPatient` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sceneManagement` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transferDecision` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `treatmentPlan` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anamnesis` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `focusedAssessment` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `otherInterventions` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `physicalExamination` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryAssessment` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalScore` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vitalSigns` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('GREEN', 'YELLOW', 'RED', 'BLACK');

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_caseId_fkey";

-- AlterTable
ALTER TABLE "Case" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "opqrst" TEXT,
ADD COLUMN     "presumptiveDiagnosis" TEXT NOT NULL,
ADD COLUMN     "primaryTest" TEXT NOT NULL,
ADD COLUMN     "priority" "Priority" NOT NULL,
ADD COLUMN     "reportPatient" TEXT NOT NULL,
ADD COLUMN     "sample" TEXT,
ADD COLUMN     "sceneManagement" TEXT NOT NULL,
ADD COLUMN     "sss" TEXT,
ADD COLUMN     "transferDecision" BOOLEAN NOT NULL,
ADD COLUMN     "treatmentPlan" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "anamnesis" JSONB NOT NULL,
ADD COLUMN     "focusedAssessment" JSONB NOT NULL,
ADD COLUMN     "otherInterventions" JSONB NOT NULL,
ADD COLUMN     "physicalExamination" JSONB NOT NULL,
ADD COLUMN     "primaryAssessment" JSONB NOT NULL,
ADD COLUMN     "totalScore" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vitalSigns" JSONB NOT NULL,
ALTER COLUMN "feedback" DROP NOT NULL;

-- CreateTable
CREATE TABLE "CaseInfo" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "consult" TEXT NOT NULL,
    "scenery" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "age" INTEGER NOT NULL,
    "medicalHistory" TEXT[],
    "medications" TEXT,
    "generalFindings" TEXT,
    "ta" TEXT,
    "fc" INTEGER,
    "fr" INTEGER,
    "spo2" INTEGER,
    "glucose" INTEGER,
    "temperature" DOUBLE PRECISION,
    "capillaryFiller" DOUBLE PRECISION,
    "cincinnati" JSONB,
    "glasgow" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CaseInfo_caseId_key" ON "CaseInfo"("caseId");

-- AddForeignKey
ALTER TABLE "CaseInfo" ADD CONSTRAINT "CaseInfo_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;
