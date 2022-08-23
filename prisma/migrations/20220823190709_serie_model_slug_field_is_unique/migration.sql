/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Serie` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slug` on table `Serie` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Serie` MODIFY `slug` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Serie_slug_key` ON `Serie`(`slug`);
