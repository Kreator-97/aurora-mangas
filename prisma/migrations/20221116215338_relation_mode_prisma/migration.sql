-- DropForeignKey
ALTER TABLE `Address` DROP FOREIGN KEY `Address_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `Item_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `Item_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Manga` DROP FOREIGN KEY `Manga_serieId_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Serie` DROP FOREIGN KEY `Serie_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `Subscription` DROP FOREIGN KEY `Subscription_serieId_fkey`;

-- DropForeignKey
ALTER TABLE `Subscription` DROP FOREIGN KEY `Subscription_userId_fkey`;

-- CreateIndex
CREATE INDEX `Address_userId_idx` ON `Address`(`userId`);

-- CreateIndex
CREATE INDEX `Item_orderId_productId_idx` ON `Item`(`orderId`, `productId`);

-- CreateIndex
CREATE INDEX `Subscription_userId_serieId_idx` ON `Subscription`(`userId`, `serieId`);

-- RenameIndex
ALTER TABLE `Manga` RENAME INDEX `Manga_serieId_fkey` TO `Manga_serieId_idx`;

-- RenameIndex
ALTER TABLE `Order` RENAME INDEX `Order_userId_fkey` TO `Order_userId_idx`;

-- RenameIndex
ALTER TABLE `Serie` RENAME INDEX `Serie_authorId_fkey` TO `Serie_authorId_idx`;
