/*
  Warnings:

  - You are about to drop the column `foreignId` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `task` table. All the data in the column will be lost.
  - You are about to drop the `instruction` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `task` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_userId_fkey`;

-- AlterTable
ALTER TABLE `task` DROP COLUMN `foreignId`,
    DROP COLUMN `userId`,
    ADD COLUMN `task` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `currentTaskId` VARCHAR(191) NULL,
    ADD COLUMN `instruction` LONGTEXT NULL,
    ADD COLUMN `otherUserId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `instruction`;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_currentTaskId_fkey` FOREIGN KEY (`currentTaskId`) REFERENCES `Task`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
