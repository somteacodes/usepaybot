/*
  Warnings:

  - You are about to drop the column `currentTaskId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `instruction` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `otherUserId` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_currentTaskId_fkey`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `currentTaskId`,
    DROP COLUMN `instruction`,
    DROP COLUMN `otherUserId`;

-- AlterTable
ALTER TABLE `vouchermatch` ADD COLUMN `voucher` VARCHAR(191) NULL;
