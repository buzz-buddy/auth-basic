import { PersonaFieldType } from '../common/enums/persona-field-type.enum';

export type PersonaResponseShape = 'string' | 'array' | 'number';

/** API-facing name for the JSON shape of `userResponse`. */
export type PersonaResponseType = PersonaResponseShape;

export type PersonaFieldTypeMeta = {
  responseShape: PersonaResponseShape;
};

/** Per-type defaults used by schema DTOs and response validation. */
export const PERSONA_FIELD_TYPE_META: {
  [K in PersonaFieldType]: PersonaFieldTypeMeta;
} = {
  [PersonaFieldType.text]: { responseShape: 'string' },
  [PersonaFieldType.multi_text]: { responseShape: 'array' },
  [PersonaFieldType.multi_date_entry]: { responseShape: 'array' },
  [PersonaFieldType.textarea]: { responseShape: 'string' },
  [PersonaFieldType.single_dropdown]: { responseShape: 'string' },
  [PersonaFieldType.single_broad_selector]: { responseShape: 'array' },
  [PersonaFieldType.single_dropdown_with_icon]: { responseShape: 'string' },
  [PersonaFieldType.multi_radio]: { responseShape: 'array' },
  [PersonaFieldType.multi_radio_with_icon]: { responseShape: 'array' },
  [PersonaFieldType.multi_radio_with_brief]: { responseShape: 'string' },
  [PersonaFieldType.multi_slider]: { responseShape: 'array' },
  [PersonaFieldType.single_slider]: { responseShape: 'number' },
  [PersonaFieldType.radio]: { responseShape: 'string' },
  [PersonaFieldType.file_upload_single]: { responseShape: 'string' },
  [PersonaFieldType.file_upload_multiple]: { responseShape: 'array' },
  [PersonaFieldType.range_slider]: { responseShape: 'array' },
};

const PERSONA_FIELD_TYPE_VALUES = new Set<string>(
  Object.values(PersonaFieldType),
);

export function isPersonaFieldType(value: string): value is PersonaFieldType {
  return PERSONA_FIELD_TYPE_VALUES.has(value);
}

export function assertPersonaFieldType(
  value: string,
  context?: string,
): PersonaFieldType {
  if (!isPersonaFieldType(value)) {
    const where = context ? ` in ${context}` : '';
    throw new Error(`Unknown persona fieldType "${value}"${where}`);
  }
  return value;
}

export function isArrayFieldType(fieldType: PersonaFieldType): boolean {
  return PERSONA_FIELD_TYPE_META[fieldType].responseShape === 'array';
}

export function isNumericFieldType(fieldType: PersonaFieldType): boolean {
  return PERSONA_FIELD_TYPE_META[fieldType].responseShape === 'number';
}

export function responseTypeForFieldType(
  fieldType: PersonaFieldType,
): PersonaResponseType {
  return PERSONA_FIELD_TYPE_META[fieldType].responseShape;
}

export function defaultResponseValue(
  fieldType: PersonaFieldType,
): string | unknown[] | null {
  if (isArrayFieldType(fieldType)) {
    return [];
  }
  if (isNumericFieldType(fieldType)) {
    return null;
  }
  return '';
}
