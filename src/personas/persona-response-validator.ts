import { Injectable } from '@nestjs/common';
import { PersonaFieldType, PersonaQuestion, Prisma } from '@prisma/client';
import { badRequestWithFieldErrors } from '../common/exceptions/field-http.exception';
import { flattenFieldConfig, isArrayFieldType } from './persona-field.util';

type FieldValidator = (
  question: PersonaQuestion,
  userResponse: unknown,
) => string | null;

@Injectable()
export class PersonaResponseValidator {
  private readonly validators: { [K in PersonaFieldType]: FieldValidator } = {
    [PersonaFieldType.text]: (q, v) => this.validateText(q, v),
    [PersonaFieldType.textarea]: (q, v) => this.validateText(q, v),
    [PersonaFieldType.single_dropdown]: (q, v) =>
      this.validateSingleOption(q, v),
    [PersonaFieldType.single_broad_selector]: (q, v) =>
      this.validateBroadSelector(q, v),
    [PersonaFieldType.single_dropdown_with_icon]: (q, v) =>
      this.validateIconDropdown(q, v),
    [PersonaFieldType.multi_radio]: (q, v) => this.validateMultiRadio(q, v),
    [PersonaFieldType.multi_radio_with_brief]: (q, v) =>
      this.validateMultiRadioWithBrief(q, v),
    [PersonaFieldType.multi_slider]: (q, v) => this.validateMultiSlider(q, v),
    [PersonaFieldType.radio]: (q, v) => this.validateSingleOption(q, v),
    [PersonaFieldType.file_upload_multiple]: (q, v) =>
      this.validateFileUploadMultiple(q, v),
  };

  validate(question: PersonaQuestion, userResponse: unknown): void {
    const validator = this.validators[question.fieldType];
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

  private validateMultiRadioWithBrief(
    question: PersonaQuestion,
    userResponse: unknown,
  ) {
    const config = flattenFieldConfig(question.fieldConfig);
    const max = typeof config.max === 'number' ? config.max : undefined;
    const selections = this.normalizeStringSelections(userResponse, max);
    if (typeof selections === 'string') {
      return selections;
    }

    const allowed = this.broadSelectorValues(question.fieldConfig);
    return this.validateStringSelectionCount(selections, allowed, config);
  }

  private validateMultiSlider(question: PersonaQuestion, userResponse: unknown) {
    if (!Array.isArray(userResponse)) {
      return 'Must be an array';
    }

    const config = flattenFieldConfig(question.fieldConfig);
    const options = config.options;
    if (!Array.isArray(options)) {
      return 'Question has no options configured';
    }

    if (userResponse.length !== options.length) {
      return `Must have exactly ${options.length} value(s)`;
    }

    if (!userResponse.every((item) => typeof item === 'number' && Number.isFinite(item))) {
      return 'All values must be numbers';
    }

    const minVal = typeof config.min === 'number' ? config.min : 0;
    const maxVal = typeof config.max === 'number' ? config.max : 100;

    for (const value of userResponse as number[]) {
      if (value < minVal || value > maxVal) {
        return `All values must be between ${minVal} and ${maxVal}`;
      }
    }

    return null;
  }

  private validateFileUploadMultiple(
    question: PersonaQuestion,
    userResponse: unknown,
  ) {
    if (!Array.isArray(userResponse)) {
      return 'Must be an array';
    }

    const config = flattenFieldConfig(question.fieldConfig);
    const max = typeof config.max === 'number' ? config.max : undefined;

    if (max !== undefined && userResponse.length > max) {
      return `Upload at most ${max} file(s)`;
    }

    if (
      !userResponse.every(
        (item) => typeof item === 'string' && item.length > 0,
      )
    ) {
      return 'Each file must be a non-empty string';
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

    return this.validateStringSelectionCount(
      userResponse as string[],
      options as string[],
      config,
    );
  }

  private normalizeStringSelections(
    userResponse: unknown,
    max: number | undefined,
  ): string[] | string {
    if (typeof userResponse === 'string') {
      if (max !== undefined && max !== 1) {
        return 'Must be an array when multiple selections are allowed';
      }
      return userResponse.length === 0 ? [] : [userResponse];
    }

    if (!Array.isArray(userResponse)) {
      return max === 1 ? 'Must be a string' : 'Must be an array';
    }

    if (!userResponse.every((item) => typeof item === 'string')) {
      return 'All selections must be strings';
    }

    return userResponse as string[];
  }

  private validateStringSelectionCount(
    selections: string[],
    allowed: string[],
    config: Record<string, unknown>,
  ) {
    const unique = new Set(selections);
    if (unique.size !== selections.length) {
      return 'Selections must be unique';
    }

    for (const item of selections) {
      if (!allowed.includes(item)) {
        return 'All selections must be allowed options';
      }
    }

    const min = typeof config.min === 'number' ? config.min : 0;
    const max = typeof config.max === 'number' ? config.max : undefined;

    if (selections.length < min) {
      return `Select at least ${min} option(s)`;
    }
    if (max !== undefined && selections.length > max) {
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
