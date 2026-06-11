import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { seedPersonaSchema } from './seed-persona';

const BCRYPT_ROUNDS = 12;

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is required for prisma seed');
  }

  const pool = new Pool({ connectionString });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    await seedPersonaSchema(prisma);

    const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim();
    const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

    if (!email || !password) {
      console.log(
        'Skipping bootstrap admin: set BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD to create one.',
      );
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });

    if (!existing) {
      const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
      await prisma.user.create({
        data: {
          email,
          password: passwordHash,
          role: Role.ADMIN,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          emailVerifiedAt: new Date(),
        },
      });
      console.log(`Bootstrap admin created: ${email}`);
      return;
    }

    if (existing.role === Role.ADMIN) {
      console.log(`Bootstrap admin already exists: ${email}`);
      return;
    }

    throw new Error(
      `Bootstrap aborted: ${email} exists as ${existing.role}. Remove the user or use a different BOOTSTRAP_ADMIN_EMAIL.`,
    );
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
