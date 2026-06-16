-- DropIndex
DROP INDEX "PersonaQuestion_personaSubComponentId_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "PersonaQuestion_name_key" ON "PersonaQuestion"("name");
