-- CreateTable
CREATE TABLE `TransactionMatch` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matched` BOOLEAN NOT NULL DEFAULT false,
    `senderId` INTEGER NULL,
    `receiverId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VoucherMatch` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matched` BOOLEAN NOT NULL DEFAULT false,
    `senderId` INTEGER NULL,
    `receiverId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TransactionMatch` ADD CONSTRAINT `TransactionMatch_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransactionMatch` ADD CONSTRAINT `TransactionMatch_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VoucherMatch` ADD CONSTRAINT `VoucherMatch_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VoucherMatch` ADD CONSTRAINT `VoucherMatch_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
