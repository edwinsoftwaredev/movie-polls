-- CreateTable
CREATE TABLE `Session` (
    `id` INTEGER NOT NULL,
    `session` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
