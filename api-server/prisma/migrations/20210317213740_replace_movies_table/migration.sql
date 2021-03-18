/*
  Warnings:

  - You are about to drop the `TopMovies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `TopMovies`;

-- CreateTable
CREATE TABLE `BestMovies` (
    `id` INTEGER NOT NULL,
    `movies` JSON NOT NULL,
    `updateDate` DATETIME(3) NOT NULL,
    `type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
