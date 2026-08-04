/*
  Warnings:

  - You are about to drop the column `area` on the `Case` table. All the data in the column will be lost.
  - Added the required column `medicalAreaId` to the `Case` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Case" DROP COLUMN "area",
ADD COLUMN     "medicalAreaId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "MedicalArea";

-- CreateTable
CREATE TABLE "MedicalArea" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalArea_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MedicalArea_name_key" ON "MedicalArea"("name");

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_medicalAreaId_fkey" FOREIGN KEY ("medicalAreaId") REFERENCES "MedicalArea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
