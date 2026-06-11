import { Prisma } from '@prisma/client';

const ARRAY_FIELD_TYPES = new Set(['multi_radio']);

export function isArrayFieldType(fieldType: string): boolean {
  return ARRAY_FIELD_TYPES.has(fieldType);
}

export function defaultResponseValue(fieldType: string): string | unknown[] {
  return isArrayFieldType(fieldType) ? [] : '';
}

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
