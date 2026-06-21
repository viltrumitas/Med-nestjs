-- CreateTable
CREATE TABLE "AuthorizedTeacher" (
    "id" TEXT NOT NULL,
    "matricula" INTEGER NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthorizedTeacher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthorizedTeacher_matricula_key" ON "AuthorizedTeacher"("matricula");
