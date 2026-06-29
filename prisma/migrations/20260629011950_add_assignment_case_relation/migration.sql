-- CreateTable
CREATE TABLE "AssignmentCase" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssignmentCase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AssignmentCase_assignmentId_idx" ON "AssignmentCase"("assignmentId");

-- CreateIndex
CREATE INDEX "AssignmentCase_caseId_idx" ON "AssignmentCase"("caseId");

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentCase_assignmentId_caseId_key" ON "AssignmentCase"("assignmentId", "caseId");

-- AddForeignKey
ALTER TABLE "AssignmentCase" ADD CONSTRAINT "AssignmentCase_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentCase" ADD CONSTRAINT "AssignmentCase_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
