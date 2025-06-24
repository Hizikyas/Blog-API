-- CreateEnum
CREATE TYPE "Category" AS ENUM ('TECHNOLOGY', 'FOOD', 'TRAVEL', 'EDUCATION');

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "blog" TEXT NOT NULL,
    "catagory" TEXT NOT NULL,
    "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "image" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);
