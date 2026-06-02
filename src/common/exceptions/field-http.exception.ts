import { BadRequestException, ConflictException } from '@nestjs/common';

export type FieldErrors = Record<string, string[]>;

/** Use when an error maps to a specific form field (e.g. invalid reset token). */
export function badRequestWithFieldErrors(
  errors: FieldErrors,
  message = 'Bad Request',
) {
  return new BadRequestException({
    statusCode: 400,
    message,
    error: 'Bad Request',
    errors,
  });
}

/** Use when an error maps to a specific form field (e.g. email already registered). */
export function conflictWithFieldErrors(
  errors: FieldErrors,
  message = 'Conflict',
) {
  return new ConflictException({
    statusCode: 409,
    message,
    error: 'Conflict',
    errors,
  });
}
