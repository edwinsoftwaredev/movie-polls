/*
  Warnings:

  - Added the required column `voteCount` to the `MoviePoll` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MoviePoll` ADD COLUMN     `voteCount` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Token` (
    `uuid` VARCHAR(191) NOT NULL,
    `pollId` INTEGER NOT NULL,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Token` ADD FOREIGN KEY (`pollId`) REFERENCES `Poll`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
