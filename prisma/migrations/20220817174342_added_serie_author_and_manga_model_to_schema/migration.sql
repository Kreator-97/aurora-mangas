-- CreateTable
CREATE TABLE `Serie` (
    `authorId` VARCHAR(191) NOT NULL,
    `demography` ENUM('SHONEN', 'SEINEN', 'SHOJO', 'JOSEI', 'ISEKAI') NOT NULL,
    `finished` BOOLEAN NOT NULL,
    `genre` ENUM('ACTION', 'ADVENTURE', 'FANTASY', 'GORE', 'HORROR', 'MARTIAL_ARTS', 'MYSTERY', 'ROMANCE', 'SOBRENATURAL', 'THRILLER') NOT NULL,
    `id` VARCHAR(191) NOT NULL,
    `imgURL` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `periodicy` ENUM('MENSUAL', 'BIMESTRAL') NOT NULL DEFAULT 'MENSUAL',
    `sipnosis` VARCHAR(191) NOT NULL,
    `unitPrice` INTEGER NOT NULL,

    UNIQUE INDEX `Serie_authorId_key`(`authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Author` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `birthDate` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Manga` (
    `id` VARCHAR(191) NOT NULL,
    `serieId` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `imgUrl` VARCHAR(191) NOT NULL,
    `published` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,

    UNIQUE INDEX `Manga_serieId_key`(`serieId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Serie` ADD CONSTRAINT `Serie_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `Author`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Manga` ADD CONSTRAINT `Manga_serieId_fkey` FOREIGN KEY (`serieId`) REFERENCES `Serie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
