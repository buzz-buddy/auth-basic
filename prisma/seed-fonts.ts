import { PrismaClient } from '@prisma/client';
import { fontsV1 } from './seeds/fonts/fonts-v1';

export async function seedFonts(prisma: PrismaClient) {
  for (const font of fontsV1) {
    await prisma.font.upsert({
      where: { slug: font.slug },
      create: {
        slug: font.slug,
        family: font.family,
        category: font.category,
        tags: font.tags,
        suitableForDisplay: font.suitableForDisplay,
        suitableForBody: font.suitableForBody,
        sortOrder: font.sortOrder,
        isActive: true,
      },
      update: {
        family: font.family,
        category: font.category,
        tags: font.tags,
        suitableForDisplay: font.suitableForDisplay,
        suitableForBody: font.suitableForBody,
        sortOrder: font.sortOrder,
        isActive: true,
      },
    });
  }

  console.log(`Fonts seeded: ${fontsV1.length}`);
}
