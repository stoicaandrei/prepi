-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "disabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SubjectCategory" ADD COLUMN     "disabled" BOOLEAN NOT NULL DEFAULT false;
