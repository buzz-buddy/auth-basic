import { PersonaFieldType } from '../common/enums/persona-field-type.enum';

export function normalizeStoragePrefix(prefix: string): string {
  return prefix.replace(/^\/+|\/+$/g, '');
}

export function buildPersonaFileKeyPrefix(
  prefix: string,
  workspaceId: string,
  questionName: string,
): string {
  return `${normalizeStoragePrefix(prefix)}/${workspaceId}/${questionName}`;
}

export function buildPersonaFileKey(
  prefix: string,
  workspaceId: string,
  questionName: string,
  extension: string,
): string {
  const timestamp = Date.now();
  const random = Math.random().toString(16).slice(2, 10);
  return `${buildPersonaFileKeyPrefix(prefix, workspaceId, questionName)}/${timestamp}-${random}.${extension}`;
}

export function isPersonaFileKeyForQuestion(
  prefix: string,
  key: string,
  workspaceId: string,
  questionName: string,
): boolean {
  const expectedPrefix = `${buildPersonaFileKeyPrefix(prefix, workspaceId, questionName)}/`;
  return key.startsWith(expectedPrefix) && key.length > expectedPrefix.length;
}

export function isFileUploadFieldType(fieldType: PersonaFieldType): boolean {
  return (
    fieldType === PersonaFieldType.file_upload_single ||
    fieldType === PersonaFieldType.file_upload_multiple
  );
}

export function extractFileKeysFromResponse(
  fieldType: PersonaFieldType,
  userResponse: unknown,
): string[] {
  if (fieldType === PersonaFieldType.file_upload_single) {
    return typeof userResponse === 'string' && userResponse.length > 0
      ? [userResponse]
      : [];
  }

  if (fieldType === PersonaFieldType.file_upload_multiple) {
    if (!Array.isArray(userResponse)) {
      return [];
    }
    return userResponse.filter(
      (item): item is string => typeof item === 'string' && item.length > 0,
    );
  }

  return [];
}

export function extensionForMime(mimeType: string): string | null {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  return map[mimeType] ?? null;
}

export function allowedMimeTypesFromConfig(
  fieldConfig: Record<string, unknown>,
): string[] {
  const allowed = fieldConfig.allowedFileTypes;
  if (!Array.isArray(allowed)) {
    return ['image/jpeg', 'image/png', 'image/webp'];
  }
  return allowed.filter((item): item is string => typeof item === 'string');
}
