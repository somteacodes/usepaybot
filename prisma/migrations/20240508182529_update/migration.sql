/*
  Warnings:

  - You are about to drop the column `letters` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `letters`,
    ADD COLUMN `letter` VARCHAR(255) NULL;
