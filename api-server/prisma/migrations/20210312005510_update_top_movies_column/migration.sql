/*
  Warnings:

  - You are about to drop the column `movie` on the `TopMovies` table. All the data in the column will be lost.
  - Added the required column `topMovies` to the `TopMovies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TopMovies` DROP COLUMN `movie`,
    ADD COLUMN     `topMovies` JSON NOT NULL;
