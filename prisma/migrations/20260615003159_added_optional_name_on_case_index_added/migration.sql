-- AlterTable
ALTER TABLE "Case" ALTER COLUMN "title" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Submission_studentId_idx" ON "Submission"("studentId");

-- CreateIndex
CREATE INDEX "Submission_caseId_idx" ON "Submission"("caseId");

-- CreateIndex
CREATE INDEX "Submission_status_idx" ON "Submission"("status");
