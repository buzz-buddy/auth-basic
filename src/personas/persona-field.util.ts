import { Prisma } from '@prisma/client';

export {
  assertPersonaFieldType,
  defaultResponseValue,
  isArrayFieldType,
  isPersonaFieldType,
  PERSONA_FIELD_TYPE_META,
} from './persona-field-type.util';
export type { PersonaFieldTypeMeta, PersonaResponseShape } from './persona-field-type.util';

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
