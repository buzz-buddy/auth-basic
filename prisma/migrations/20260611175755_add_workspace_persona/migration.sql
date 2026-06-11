-- CreateEnum
CREATE TYPE "WorkspaceRole" AS ENUM ('OWNER', 'MEMBER', 'ADMIN');

-- CreateEnum
CREATE TYPE "PersonaStatus" AS ENUM ('DRAFT', 'COMPLETE');

-- CreateEnum
CREATE TYPE "ResponseValueSource" AS ENUM ('EMPTY', 'USER', 'AI', 'AI_ACCEPTED', 'AI_EDITED');

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "websiteUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceMember" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "WorkspaceRole" NOT NULL DEFAULT 'OWNER',

    CONSTRAINT "WorkspaceMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Persona" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "status" "PersonaStatus" NOT NULL DEFAULT 'DRAFT',
    "schemaVersion" INTEGER NOT NULL DEFAULT 1,
    "currentPersonaSubComponentId" INTEGER,

    CONSTRAINT "Persona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonaSchemaVersion" (
    "version" INTEGER NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PersonaSchemaVersion_pkey" PRIMARY KEY ("version")
);

-- CreateTable
CREATE TABLE "PersonaComponent" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "schemaVersion" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "PersonaComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonaSubComponent" (
    "id" SERIAL NOT NULL,
    "personaComponentId" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "sideInfo" TEXT,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "PersonaSubComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonaQuestion" (
    "id" SERIAL NOT NULL,
    "personaSubComponentId" INTEGER NOT NULL,
    "fieldType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "fieldConfig" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PersonaQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceQuestionResponse" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "personaQuestionId" INTEGER NOT NULL,
    "userResponse" JSONB,
    "aiValue" JSONB,
    "valueSource" "ResponseValueSource" NOT NULL DEFAULT 'EMPTY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkspaceQuestionResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkspaceMember_userId_idx" ON "WorkspaceMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceMember_workspaceId_userId_key" ON "WorkspaceMember"("workspaceId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Persona_workspaceId_key" ON "Persona"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonaComponent_slug_key" ON "PersonaComponent"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PersonaSubComponent_personaComponentId_slug_key" ON "PersonaSubComponent"("personaComponentId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "PersonaQuestion_personaSubComponentId_name_key" ON "PersonaQuestion"("personaSubComponentId", "name");

-- CreateIndex
CREATE INDEX "WorkspaceQuestionResponse_workspaceId_idx" ON "WorkspaceQuestionResponse"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceQuestionResponse_workspaceId_personaQuestionId_key" ON "WorkspaceQuestionResponse"("workspaceId", "personaQuestionId");

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Persona" ADD CONSTRAINT "Persona_currentPersonaSubComponentId_fkey" FOREIGN KEY ("currentPersonaSubComponentId") REFERENCES "PersonaSubComponent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Persona" ADD CONSTRAINT "Persona_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonaSubComponent" ADD CONSTRAINT "PersonaSubComponent_personaComponentId_fkey" FOREIGN KEY ("personaComponentId") REFERENCES "PersonaComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonaQuestion" ADD CONSTRAINT "PersonaQuestion_personaSubComponentId_fkey" FOREIGN KEY ("personaSubComponentId") REFERENCES "PersonaSubComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceQuestionResponse" ADD CONSTRAINT "WorkspaceQuestionResponse_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceQuestionResponse" ADD CONSTRAINT "WorkspaceQuestionResponse_personaQuestionId_fkey" FOREIGN KEY ("personaQuestionId") REFERENCES "PersonaQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
