-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Streamer', 'EndUser');

-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('Google');

-- CreateEnum
CREATE TYPE "StreamType" AS ENUM ('Spotify', 'Youtube');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "provider" "Provider" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stream" (
    "id" TEXT NOT NULL,
    "type" "StreamType" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "userID" TEXT NOT NULL,

    CONSTRAINT "Stream_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Upvote" (
    "id" TEXT NOT NULL,
    "streamID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,

    CONSTRAINT "Upvote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Upvote_streamID_userID_key" ON "Upvote"("streamID", "userID");

-- AddForeignKey
ALTER TABLE "Stream" ADD CONSTRAINT "Stream_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_streamID_fkey" FOREIGN KEY ("streamID") REFERENCES "Stream"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
