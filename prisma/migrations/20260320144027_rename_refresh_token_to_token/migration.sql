/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `RefreshToken` table. All the data in the column will be lost.
  - Added the required column `token` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "refreshToken",
ADD COLUMN     "token" TEXT NOT NULL;
