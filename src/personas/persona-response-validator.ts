import { Injectable } from '@nestjs/common';
import { PersonaQuestion, Prisma } from '@prisma/client';
import { badRequestWithFieldErrors } from '../common/exceptions/field-http.exception';
import { flattenFieldConfig, isArrayFieldType } from './persona-field.util';

type FieldValidator = (
  question: PersonaQuestion,
  userResponse: unknown,
) => string | null;

@Injectable()
export class PersonaResponseValidator {
  private readonly validators: Record<string, FieldValidator> = {
    text: (q, v) => this.validateText(q, v),
    textarea: (q, v) => this.validateText(q, v),
    single_dropdown: (q, v) => this.validateSingleOption(q, v),
    single_broad_selector: (q, v) => this.validateBroadSelector(q, v),
    single_dropdown_with_icon: (q, v) => this.validateIconDropdown(q, v),
    multi_radio: (q, v) => this.validateMultiRadio(q, v),
  };

  validate(question: PersonaQuestion, userResponse: unknown): void {
    const validator = this.validators[question.fieldType];
    if (!validator) {
      throw badRequestWithFieldErrors(
        {
          [String(question.id)]: [
            `Unsupported fieldType: ${question.fieldType}`,
          ],
        },
        'Validation failed',
      );
    }

    const error = validator(question, userResponse);
    if (error) {
      throw badRequestWithFieldErrors(
        { [String(question.id)]: [error] },
        'Validation failed',
      );
    }
  }

  isAnswered(question: PersonaQuestion, userResponse: unknown): boolean {
    if (userResponse === null || userResponse === undefined) {
      return false;
    }
    if (isArrayFieldType(question.fieldType)) {
      return Array.isArray(userResponse) && userResponse.length > 0;
    }
    return typeof userResponse === 'string' && userResponse.length > 0;
  }

  private validateText(question: PersonaQuestion, userResponse: unknown) {
    if (typeof userResponse !== 'string') {
      return 'Must be a string';
    }
    const { max } = flattenFieldConfig(question.fieldConfig);
    if (typeof max === 'number' && userResponse.length > max) {
      return `Must be at most ${max} characters`;
    }
    return null;
  }

  private validateSingleOption(
    question: PersonaQuestion,
    userResponse: unknown,
  ) {
    if (typeof userResponse !== 'string') {
      return 'Must be a string';
    }
    const { options } = flattenFieldConfig(question.fieldConfig);
    if (!Array.isArray(options)) {
      return 'Question has no options configured';
    }
    if (!options.includes(userResponse)) {
      return 'Must be one of the allowed options';
    }
    return null;
  }

  private validateBroadSelector(
    question: PersonaQuestion,
    userResponse: unknown,
  ) {
    if (typeof userResponse !== 'string') {
      return 'Must be a string';
    }
    const allowed = this.broadSelectorValues(question.fieldConfig);
    if (!allowed.includes(userResponse)) {
      return 'Must be one of the allowed options';
    }
    return null;
  }

  private validateIconDropdown(
    question: PersonaQuestion,
    userResponse: unknown,
  ) {
    if (typeof userResponse !== 'string') {
      return 'Must be a string';
    }
    const allowed = this.iconDropdownLabels(question.fieldConfig);
    if (!allowed.includes(userResponse)) {
      return 'Must be one of the allowed options';
    }
    return null;
  }

  private validateMultiRadio(question: PersonaQuestion, userResponse: unknown) {
    if (!Array.isArray(userResponse)) {
      return 'Must be an array';
    }
    if (!userResponse.every((item) => typeof item === 'string')) {
      return 'All selections must be strings';
    }

    const config = flattenFieldConfig(question.fieldConfig);
    const options = config.options;
    if (!Array.isArray(options)) {
      return 'Question has no options configured';
    }

    const unique = new Set(userResponse as string[]);
    if (unique.size !== userResponse.length) {
      return 'Selections must be unique';
    }

    for (const item of userResponse as string[]) {
      if (!options.includes(item)) {
        return 'All selections must be allowed options';
      }
    }

    const min = typeof config.min === 'number' ? config.min : 0;
    const max = typeof config.max === 'number' ? config.max : undefined;

    if (userResponse.length < min) {
      return `Select at least ${min} option(s)`;
    }
    if (max !== undefined && userResponse.length > max) {
      return `Select at most ${max} option(s)`;
    }

    return null;
  }

  private broadSelectorValues(fieldConfig: Prisma.JsonValue | null): string[] {
    const { options } = flattenFieldConfig(fieldConfig);
    if (!Array.isArray(options)) {
      return [];
    }
    return options
      .filter((item): item is [string, string] => Array.isArray(item))
      .map((item) => item[0]);
  }

  private iconDropdownLabels(fieldConfig: Prisma.JsonValue | null): string[] {
    const { options } = flattenFieldConfig(fieldConfig);
    if (!Array.isArray(options)) {
      return [];
    }
    return options
      .filter((item): item is [string, string] => Array.isArray(item))
      .map((item) => item[0]);
  }
}
