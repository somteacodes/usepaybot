/*
  Warnings:

  - You are about to alter the column `task` on the `task` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `task` MODIFY `task` INTEGER NOT NULL;
