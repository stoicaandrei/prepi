/*
  Warnings:

  - You are about to drop the column `stripePromotionalCode` on the `InvitationCode` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InvitationCode" DROP COLUMN "stripePromotionalCode",
ADD COLUMN     "stripeCoupon" TEXT;
