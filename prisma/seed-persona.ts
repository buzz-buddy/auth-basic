import { readFileSync } from 'fs';
import { join } from 'path';
import { Prisma, PrismaClient } from '@prisma/client';

type SeedQuestion = {
  name: string;
  fieldType: string;
  label: string;
  isRequired: boolean;
  fieldConfig?: Prisma.InputJsonValue;
};

type SeedSubComponent = {
  slug: string;
  label: string;
  title?: string;
  description?: string;
  sideInfo?: string;
  sortOrder: number;
  personaQuestions?: SeedQuestion[];
};

type SeedComponent = {
  slug: string;
  label: string;
  sortOrder: number;
  personaSubComponents?: SeedSubComponent[];
};

type PersonaSeedFile = {
  schemaVersion: number;
  description: string;
  personaComponents: SeedComponent[];
};

export async function seedPersonaSchema(prisma: PrismaClient) {
  const filePath = join(__dirname, 'seeds', 'persona', 'schema-v1.json');
  const raw = readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw) as PersonaSeedFile;

  await prisma.personaSchemaVersion.upsert({
    where: { version: data.schemaVersion },
    create: {
      version: data.schemaVersion,
      description: data.description,
      isActive: true,
    },
    update: {
      description: data.description,
      isActive: true,
    },
  });

  for (const component of data.personaComponents) {
    const personaComponent = await prisma.personaComponent.upsert({
      where: { slug: component.slug },
      create: {
        slug: component.slug,
        label: component.label,
        sortOrder: component.sortOrder,
        schemaVersion: data.schemaVersion,
      },
      update: {
        label: component.label,
        sortOrder: component.sortOrder,
        schemaVersion: data.schemaVersion,
      },
    });

    for (const sub of component.personaSubComponents ?? []) {
      const personaSubComponent = await prisma.personaSubComponent.upsert({
        where: {
          personaComponentId_slug: {
            personaComponentId: personaComponent.id,
            slug: sub.slug,
          },
        },
        create: {
          personaComponentId: personaComponent.id,
          slug: sub.slug,
          label: sub.label,
          title: sub.title,
          description: sub.description,
          sideInfo: sub.sideInfo,
          sortOrder: sub.sortOrder,
        },
        update: {
          label: sub.label,
          title: sub.title,
          description: sub.description,
          sideInfo: sub.sideInfo,
          sortOrder: sub.sortOrder,
        },
      });

      for (const question of sub.personaQuestions ?? []) {
        await prisma.personaQuestion.upsert({
          where: {
            personaSubComponentId_name: {
              personaSubComponentId: personaSubComponent.id,
              name: question.name,
            },
          },
          create: {
            personaSubComponentId: personaSubComponent.id,
            fieldType: question.fieldType,
            name: question.name,
            label: question.label,
            isRequired: question.isRequired,
            fieldConfig: question.fieldConfig ?? Prisma.JsonNull,
          },
          update: {
            fieldType: question.fieldType,
            label: question.label,
            isRequired: question.isRequired,
            fieldConfig: question.fieldConfig ?? Prisma.JsonNull,
          },
        });
      }
    }
  }

  console.log(
    `Persona schema v${data.schemaVersion} seeded (${data.personaComponents.length} personaComponents).`,
  );
}
