/*
  Warnings:

  - You are about to drop the column `imgUrl` on the `Manga` table. All the data in the column will be lost.
  - You are about to drop the column `unitPrice` on the `Serie` table. All the data in the column will be lost.
  - Added the required column `imgURL` to the `Manga` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Manga` DROP COLUMN `imgUrl`,
    ADD COLUMN `imgURL` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Serie` DROP COLUMN `unitPrice`;
