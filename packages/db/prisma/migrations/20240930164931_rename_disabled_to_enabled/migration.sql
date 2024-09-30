/*
  Warnings:

  - You are about to drop the column `disabled` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `disabled` on the `SubjectCategory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "disabled",
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "SubjectCategory" DROP COLUMN "disabled",
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true;
