import 'dotenv/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { readdir, readFile } from 'fs/promises';
import { extname, join, relative, resolve, sep } from 'path';

import { PERSONA_SCHEMA_ASSET_PREFIX } from './seeds/persona/asset-url';

const CONTENT_TYPES: Record<string, string> = {
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

async function imageFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        return imageFiles(path);
      }
      return CONTENT_TYPES[extname(entry.name).toLowerCase()] ? [path] : [];
    }),
  );
  return nested.flat();
}

async function main() {
  const region = requiredEnv('AWS_REGION');
  const bucket = requiredEnv('AWS_S3_PUBLIC_ASSETS_BUCKET');
  const prefix = PERSONA_SCHEMA_ASSET_PREFIX.replace(/^\/+|\/+$/g, '');
  const sourceDirectory = resolve(
    process.env.PERSONA_ASSET_DIR ?? 'prisma/seeds/assets/persona/schema-v1',
  );

  const files = await imageFiles(sourceDirectory);
  if (files.length === 0) {
    throw new Error(`No supported image files found in ${sourceDirectory}`);
  }

  const client = new S3Client({
    region,
    credentials: {
      accessKeyId: requiredEnv('AWS_ACCESS_KEY_ID'),
      secretAccessKey: requiredEnv('AWS_SECRET_ACCESS_KEY'),
    },
  });

  await Promise.all(
    files.map(async (file) => {
      const assetPath = relative(sourceDirectory, file).split(sep).join('/');
      const key = `${prefix}/${assetPath}`;
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: await readFile(file),
          ContentType: CONTENT_TYPES[extname(file).toLowerCase()],
          CacheControl: 'public, max-age=31536000, immutable',
        }),
      );
      console.log(`Uploaded s3://${bucket}/${key}`);
    }),
  );

  console.log(`Uploaded ${files.length} persona assets.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
