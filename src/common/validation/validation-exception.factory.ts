import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { formatValidationErrors } from './format-validation-errors';

export function validationExceptionFactory(errors: ValidationError[]) {
  const fieldErrors = formatValidationErrors(errors);

  return new BadRequestException({
    statusCode: 400,
    message: 'Validation failed',
    error: 'Bad Request',
    errors: fieldErrors,
  });
}
