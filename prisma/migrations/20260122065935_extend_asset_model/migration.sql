/*
  Warnings:

  - Added the required column `updatedAt` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "emailVerified" DATETIME;
ALTER TABLE "User" ADD COLUMN "image" TEXT;

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ApiUsage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "LearnerSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "learnerId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "knowledgeLevel" REAL NOT NULL DEFAULT 0.5,
    "emotionalState" TEXT NOT NULL DEFAULT 'focused',
    "scaffoldingLevel" REAL NOT NULL DEFAULT 0.5,
    "score" INTEGER NOT NULL DEFAULT 0,
    "currentGoal" TEXT,
    "completedSteps" TEXT NOT NULL DEFAULT '[]',
    "misconceptions" TEXT NOT NULL DEFAULT '[]',
    "conversationHistory" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastActiveAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Asset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "taskId" TEXT,
    "prompt" TEXT,
    "filePath" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "subCategory" TEXT,
    "style" TEXT,
    "material" TEXT,
    "era" TEXT,
    "mood" TEXT,
    "condition" TEXT,
    "quality" TEXT,
    "keywordsKo" TEXT,
    "keywordsEn" TEXT,
    "description" TEXT,
    "meshNames" TEXT,
    "materialNames" TEXT,
    "analyzed" BOOLEAN NOT NULL DEFAULT false,
    "analysisSource" TEXT,
    "confidence" REAL,
    "analyzedAt" DATETIME,
    "fileSize" INTEGER,
    "folder" TEXT,
    "url" TEXT,
    "thumbnail" TEXT,
    "author" TEXT,
    "license" TEXT,
    "metadata" TEXT,
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Asset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Asset" ("createdAt", "filePath", "id", "prompt", "taskId", "type", "userId") SELECT "createdAt", "filePath", "id", "prompt", "taskId", "type", "userId" FROM "Asset";
DROP TABLE "Asset";
ALTER TABLE "new_Asset" RENAME TO "Asset";
CREATE UNIQUE INDEX "Asset_filePath_key" ON "Asset"("filePath");
CREATE INDEX "Asset_category_subCategory_idx" ON "Asset"("category", "subCategory");
CREATE INDEX "Asset_style_material_idx" ON "Asset"("style", "material");
CREATE INDEX "Asset_era_mood_idx" ON "Asset"("era", "mood");
CREATE INDEX "Asset_folder_idx" ON "Asset"("folder");
CREATE INDEX "Asset_type_idx" ON "Asset"("type");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "ApiUsage_date_provider_key" ON "ApiUsage"("date", "provider");

-- CreateIndex
CREATE INDEX "LearnerSession_learnerId_idx" ON "LearnerSession"("learnerId");

-- CreateIndex
CREATE INDEX "LearnerSession_topic_idx" ON "LearnerSession"("topic");
