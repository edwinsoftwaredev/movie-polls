-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BestMovies" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "movies" TEXT NOT NULL,
    "updateDate" DATETIME NOT NULL,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Poll" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" DATETIME,
    "isOpen" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "MoviePoll" (
    "pollId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    "voteCount" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("pollId", "movieId"),
    FOREIGN KEY ("pollId") REFERENCES "Poll" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Token" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "pollId" INTEGER NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    FOREIGN KEY ("pollId") REFERENCES "Poll" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
