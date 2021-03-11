-- CreateTable
CREATE TABLE `TopMovies` (
    `id` INTEGER NOT NULL,
    `movie` JSON NOT NULL,
    `updateDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
