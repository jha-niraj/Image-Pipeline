-- CreateTable
CREATE TABLE "image" (
    "id" TEXT NOT NULL,
    "originalImagePath" TEXT NOT NULL,
    "maskImagePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);
