const publicAssetsBaseUrl =
  process.env.AWS_S3_PUBLIC_ASSETS_BASE_URL?.trim().replace(/\/+$/, '');

/** Path namespace for persona schema UI assets inside the public assets bucket/CDN. */
export const PERSONA_SCHEMA_ASSET_PREFIX = 'persona-schema/v1';

/**
 * Uses the shared public assets CDN when configured, while preserving the
 * current frontend-relative value for local development.
 */
export function personaAssetUrl(path: string, localFallback: string): string {
  if (!publicAssetsBaseUrl) {
    return localFallback;
  }

  return `${publicAssetsBaseUrl}/${PERSONA_SCHEMA_ASSET_PREFIX}/${path.replace(/^\/+/, '')}`;
}
