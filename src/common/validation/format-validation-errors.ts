import { ValidationError } from 'class-validator';

/** Maps class-validator errors to field name → message list for the frontend. */
export function formatValidationErrors(
  errors: ValidationError[],
  parentPath = '',
): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  for (const error of errors) {
    const field = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    if (error.constraints) {
      result[field] = Object.values(error.constraints);
    }

    if (error.children?.length) {
      Object.assign(result, formatValidationErrors(error.children, field));
    }
  }

  return result;
}
