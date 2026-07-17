import { Prisma, PrismaClient } from '@prisma/client';
import { personaSchemaV1 } from './seeds/persona/schema-v1';

export async function seedPersonaSchema(prisma: PrismaClient) {
  const data = personaSchemaV1;

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
        title: component.title,
        sortOrder: component.sortOrder,
        schemaVersion: data.schemaVersion,
      },
      update: {
        label: component.label,
        title: component.title,
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
          sideTitle: sub.sideTitle,
          description: sub.description,
          sideInfo: sub.sideInfo,
          sidePanelShortInfo: sub.sidePanelShortInfo,
          sortOrder: sub.sortOrder,
        },
        update: {
          label: sub.label,
          title: sub.title,
          sideTitle: sub.sideTitle,
          description: sub.description,
          sideInfo: sub.sideInfo,
          sidePanelShortInfo: sub.sidePanelShortInfo,
          sortOrder: sub.sortOrder,
        },
      });

      for (const question of sub.personaQuestions ?? []) {
        await prisma.personaQuestion.upsert({
          where: { name: question.name },
          create: {
            personaSubComponentId: personaSubComponent.id,
            fieldType: question.fieldType,
            name: question.name,
            label: question.label,
            isRequired: question.isRequired,
            fieldConfig: question.fieldConfig ?? Prisma.JsonNull,
          },
          update: {
            personaSubComponentId: personaSubComponent.id,
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
