/*
  Warnings:

  - You are about to drop the column `authorId` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `opqrst` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `presumptiveDiagnosis` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `primaryTest` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `reportPatient` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `sample` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `sceneManagement` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `sss` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `transferDecision` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `treatmentPlan` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `caseId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the `CaseInfo` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[submissionId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `age` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consult` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientName` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scenery` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherId` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submissionId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'REVIEWED');

-- DropForeignKey
ALTER TABLE "Case" DROP CONSTRAINT "Case_authorId_fkey";

-- DropForeignKey
ALTER TABLE "CaseInfo" DROP CONSTRAINT "CaseInfo_caseId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_caseId_fkey";

-- DropIndex
DROP INDEX "Review_caseId_teacherId_key";

-- AlterTable
ALTER TABLE "Case" DROP COLUMN "authorId",
DROP COLUMN "opqrst",
DROP COLUMN "presumptiveDiagnosis",
DROP COLUMN "primaryTest",
DROP COLUMN "priority",
DROP COLUMN "reportPatient",
DROP COLUMN "sample",
DROP COLUMN "sceneManagement",
DROP COLUMN "sss",
DROP COLUMN "status",
DROP COLUMN "transferDecision",
DROP COLUMN "treatmentPlan",
ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "capillaryFiller" DOUBLE PRECISION,
ADD COLUMN     "cincinnati" JSONB,
ADD COLUMN     "consult" TEXT NOT NULL,
ADD COLUMN     "fc" INTEGER,
ADD COLUMN     "fr" INTEGER,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "generalFindings" TEXT,
ADD COLUMN     "glasgow" INTEGER,
ADD COLUMN     "glucose" INTEGER,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "medicalHistory" TEXT[],
ADD COLUMN     "medications" TEXT,
ADD COLUMN     "patientName" TEXT NOT NULL,
ADD COLUMN     "scenery" TEXT NOT NULL,
ADD COLUMN     "spo2" INTEGER,
ADD COLUMN     "ta" TEXT,
ADD COLUMN     "teacherId" TEXT NOT NULL,
ADD COLUMN     "temperature" DOUBLE PRECISION,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "caseId",
ADD COLUMN     "submissionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;

-- DropTable
DROP TABLE "CaseInfo";

-- DropEnum
DROP TYPE "CaseStatus";

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "sceneManagement" TEXT NOT NULL,
    "sss" TEXT,
    "primaryTest" TEXT NOT NULL,
    "sample" TEXT,
    "opqrst" TEXT,
    "presumptiveDiagnosis" TEXT NOT NULL,
    "priority" "Priority" NOT NULL,
    "transferDecision" BOOLEAN NOT NULL,
    "treatmentPlan" TEXT NOT NULL,
    "reportPatient" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Submission_caseId_studentId_key" ON "Submission"("caseId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_submissionId_key" ON "Review"("submissionId");

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
