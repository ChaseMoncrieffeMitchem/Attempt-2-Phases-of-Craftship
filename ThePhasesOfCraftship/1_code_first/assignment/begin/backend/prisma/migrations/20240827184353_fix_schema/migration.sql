/*
  Warnings:

  - The primary key for the `Member` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_memberId_fkey";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "memberId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "Member" DROP CONSTRAINT "Member_pkey",
ALTER COLUMN "id" SET DATA TYPE BIGINT,
ADD CONSTRAINT "Member_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "memberId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "Vote" ALTER COLUMN "memberId" SET DATA TYPE BIGINT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
