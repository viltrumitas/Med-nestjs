-- CreateEnum
CREATE TYPE "LateSubmissionPolicy" AS ENUM ('ACCEPT_LATE', 'REJECT_LATE');

-- CreateEnum
CREATE TYPE "SubmissionTiming" AS ENUM ('ON_TIME', 'LATE');

-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "lateSubmissionPolicy" "LateSubmissionPolicy" NOT NULL DEFAULT 'ACCEPT_LATE';

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "submissionTiming" "SubmissionTiming" NOT NULL DEFAULT 'ON_TIME',
ADD COLUMN     "submittedAt" TIMESTAMP(3);
