-- CreateEnum
CREATE TYPE "PersonaFieldType" AS ENUM ('text', 'textarea', 'single_dropdown', 'single_broad_selector', 'single_dropdown_with_icon', 'multi_radio', 'multi_radio_with_brief', 'multi_slider', 'radio', 'file_upload_multiple');

-- AlterTable
ALTER TABLE "PersonaQuestion"
ALTER COLUMN "fieldType" TYPE "PersonaFieldType"
USING ("fieldType"::"PersonaFieldType");
