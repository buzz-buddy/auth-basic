import { Prisma } from '@prisma/client';

export {
  assertPersonaFieldType,
  defaultResponseValue,
  isArrayFieldType,
  isNumericFieldType,
  isPersonaFieldType,
  PERSONA_FIELD_TYPE_META,
  responseTypeForFieldType,
} from './persona-field-type.util';
export type {
  PersonaFieldTypeMeta,
  PersonaResponseShape,
  PersonaResponseType,
} from './persona-field-type.util';

export function flattenFieldConfig(
  fieldConfig: Prisma.JsonValue | null,
): Record<string, unknown> {
  if (
    fieldConfig === null ||
    typeof fieldConfig !== 'object' ||
    Array.isArray(fieldConfig)
  ) {
    return {};
  }
  return fieldConfig as Record<string, unknown>;
}

export function isEmptyPersonaResponse(userResponse: unknown): boolean {
  if (userResponse === null || userResponse === undefined) {
    return true;
  }
  if (typeof userResponse === 'string' && userResponse.length === 0) {
    return true;
  }
  if (Array.isArray(userResponse) && userResponse.length === 0) {
    return true;
  }
  return false;
}

export function fieldConfigFromDto(
  fieldConfig?: Record<string, unknown>,
): Prisma.InputJsonValue | typeof Prisma.JsonNull | undefined {
  if (fieldConfig === undefined) {
    return undefined;
  }
  return fieldConfig === null
    ? Prisma.JsonNull
    : (fieldConfig as Prisma.InputJsonValue);
}
