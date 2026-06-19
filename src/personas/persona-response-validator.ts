import { Injectable } from '@nestjs/common';
import { PersonaFieldType, PersonaQuestion, Prisma } from '@prisma/client';
import { badRequestWithFieldErrors } from '../common/exceptions/field-http.exception';
import { StorageService } from '../storage/storage.service';
import { isPersonaFileKeyForQuestion } from './persona-file.util';
import { flattenFieldConfig, isArrayFieldType, isEmptyPersonaResponse, isNumericFieldType } from './persona-field.util';

type ValidationContext = {
  workspaceId: string;
};

type FieldValidator = (
  question: PersonaQuestion,
  userResponse: unknown,
  context: ValidationContext,
) => Promise<string | null> | string | null;

@Injectable()
export class PersonaResponseValidator {
  constructor(private storageService: StorageService) {}

  private readonly validators: { [K in PersonaFieldType]: FieldValidator } = {
    [PersonaFieldType.text]: (q, v) => this.validateText(q, v),
    [PersonaFieldType.multi_text]: (q, v) => this.validateMultiText(q, v),
    [PersonaFieldType.multi_date_entry]: (q, v) =>
      this.validateMultiDateEntry(q, v),
    [PersonaFieldType.textarea]: (q, v) => this.validateText(q, v),
    [PersonaFieldType.single_dropdown]: (q, v) =>
      this.validateSingleOption(q, v),
    [PersonaFieldType.single_banner_selector]: (q, v) =>
      this.validateBannerSelector(q, v),
    [PersonaFieldType.single_broad_selector]: (q, v) =>
      this.validateBroadSelector(q, v),
    [PersonaFieldType.single_dropdown_with_icon]: (q, v) =>
      this.validateIconDropdown(q, v),
    [PersonaFieldType.multi_radio]: (q, v) => this.validateMultiRadio(q, v),
    [PersonaFieldType.multi_radio_with_icon]: (q, v) =>
      this.validateMultiRadioWithIcon(q, v),
    [PersonaFieldType.multi_radio_with_brief]: (q, v) =>
      this.validateMultiRadioWithBrief(q, v),
    [PersonaFieldType.multi_slider]: (q, v) => this.validateMultiSlider(q, v),
    [PersonaFieldType.single_slider]: (q, v) => this.validateSingleSlider(q, v),
    [PersonaFieldType.switch]: (q, v) => this.validateSingleOption(q, v),
    [PersonaFieldType.file_upload_single]: (q, v, ctx) =>
      this.validateFileUploadSingle(q, v, ctx),
    [PersonaFieldType.file_upload_multiple]: (q, v, ctx) =>
      this.validateFileUploadMultiple(q, v, ctx),
    [PersonaFieldType.range_slider]: (q, v) => this.validateRangeSlider(q, v),
  };

  async validate(
    question: PersonaQuestion,
    userResponse: unknown,
    context: ValidationContext,
  ): Promise<void> {
    if (isEmptyPersonaResponse(userResponse)) {
      if (!question.isRequired) {
        return;
      }

      throw badRequestWithFieldErrors(
        {
          [question.name]: [
            `${question.name} should not be null or undefined`,
          ],
        },
        'Validation failed',
      );
    }

    const validator = this.validators[question.fieldType];
    const error = await validator(question, userResponse, context);
    if (error) {
      throw badRequestWithFieldErrors(
        { [question.name]: [error] },
        'Validation failed',
      );
    }
  }

  isAnswered(question: PersonaQuestion, userResponse: unknown): boolean {
    if (isEmptyPersonaResponse(userResponse)) {
      return false;
    }
    if (question.fieldType === PersonaFieldType.single_broad_selector) {
      return (
        Array.isArray(userResponse) &&
        userResponse.some((item) => this.isValidBriefOption(item))
      );
    }
    if (isArrayFieldType(question.fieldType)) {
      return Array.isArray(userResponse) && userResponse.length > 0;
    }
    if (isNumericFieldType(question.fieldType)) {
      return typeof userResponse === 'number' && Number.isFinite(userResponse);
    }
    if (question.fieldType === PersonaFieldType.multi_text) {
      return (
        Array.isArray(userResponse) &&
        userResponse.some(
          (item) => typeof item === 'string' && item.trim().length > 0,
        )
      );
    }
    if (question.fieldType === PersonaFieldType.multi_date_entry) {
      return (
        Array.isArray(userResponse) &&
        userResponse.some((item) => this.isValidDateEntry(item))
      );
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

  private validateMultiText(question: PersonaQuestion, userResponse: unknown) {
    if (!Array.isArray(userResponse)) {
      return 'Must be an array';
    }
    if (!userResponse.every((item) => typeof item === 'string')) {
      return 'All values must be strings';
    }

    const config = flattenFieldConfig(question.fieldConfig);
    const max = typeof config.max === 'number' ? config.max : undefined;
    const itemMax = typeof config.itemMax === 'number' ? config.itemMax : undefined;

    if (max !== undefined && userResponse.length > max) {
      return `Enter at most ${max} value(s)`;
    }

    for (const item of userResponse as string[]) {
      if (itemMax !== undefined && item.length > itemMax) {
        return `Each value must be at most ${itemMax} characters`;
      }
    }

    return null;
  }

  private validateMultiDateEntry(
    question: PersonaQuestion,
    userResponse: unknown,
  ) {
    if (!Array.isArray(userResponse)) {
      return 'Must be an array';
    }

    const config = flattenFieldConfig(question.fieldConfig);
    const max = typeof config.max === 'number' ? config.max : undefined;
    const nameMax =
      typeof config.nameMax === 'number' ? config.nameMax : undefined;

    if (max !== undefined && userResponse.length > max) {
      return `Enter at most ${max} event(s)`;
    }

    for (const item of userResponse) {
      if (!this.isValidDateEntry(item)) {
        return 'Each event must have a non-empty name and a valid date';
      }

      const entry = item as { name: string; date: string };
      if (nameMax !== undefined && entry.name.length > nameMax) {
        return `Each event name must be at most ${nameMax} characters`;
      }

      if (!this.isValidIsoDate(entry.date)) {
        return 'Each event date must be a valid ISO date (YYYY-MM-DD)';
      }
    }

    return null;
  }

  private isValidDateEntry(item: unknown): item is { name: string; date: string } {
    if (item === null || typeof item !== 'object' || Array.isArray(item)) {
      return false;
    }

    const entry = item as Record<string, unknown>;
    return (
      typeof entry.name === 'string' &&
      entry.name.trim().length > 0 &&
      typeof entry.date === 'string' &&
      entry.date.trim().length > 0
    );
  }

  private isValidIsoDate(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false;
    }

    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  }

  private validateSingleOption(
    question: PersonaQuestion,
    userResponse: unknown,
  ) {
    if (typeof userResponse !== 'string') {
      return 'Must be a string';
    }
    const allowed = this.dropdownOptionValues(question.fieldConfig);
    if (allowed.length === 0) {
      return 'Question has no options configured';
    }
    if (!allowed.includes(userResponse)) {
      return 'Must be one of the allowed options';
    }
    return null;
  }

  private validateBannerSelector(
    question: PersonaQuestion,
    userResponse: unknown,
  ) {
    if (typeof userResponse !== 'string') {
      return 'Must be a string';
    }
    const allowed = this.bannerSelectorSlugs(question.fieldConfig);
    if (allowed.length === 0) {
      return 'Question has no options configured';
    }
    if (!allowed.includes(userResponse)) {
      return 'Must be one of the allowed options';
    }
    return null;
  }

  private validateBroadSelector(
    question: PersonaQuestion,
    userResponse: unknown,
  ) {
    if (!Array.isArray(userResponse)) {
      return 'Must be an array';
    }

    const config = flattenFieldConfig(question.fieldConfig);
    const allowed = this.broadSelectorOptions(question.fieldConfig);
    if (allowed.length === 0) {
      return 'Question has no options configured';
    }

    const min = typeof config.min === 'number' ? config.min : 0;
    const max = typeof config.max === 'number' ? config.max : 1;

    if (userResponse.length < min) {
      return `Select at least ${min} option(s)`;
    }
    if (userResponse.length > max) {
      return `Select at most ${max} option(s)`;
    }

    const seenTitles = new Set<string>();
    for (const item of userResponse) {
      if (!this.isValidBriefOption(item)) {
        return 'Each selection must be an object with title and brief';
      }

      if (seenTitles.has(item.title)) {
        return 'Selections must be unique';
      }
      seenTitles.add(item.title);

      const match = allowed.some(
        (option) => option.title === item.title && option.brief === item.brief,
      );
      if (!match) {
        return 'All selections must be allowed options';
      }
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
    const dependsOn =
      typeof config.dependsOn === 'string' ? config.dependsOn : undefined;

    if (dependsOn) {
      const minCount = typeof config.minCount === 'number' ? config.minCount : 1;
      const maxCount =
        typeof config.maxCount === 'number' ? config.maxCount : undefined;

      if (userResponse.length < minCount) {
        return `Must have at least ${minCount} value(s)`;
      }
      if (maxCount !== undefined && userResponse.length > maxCount) {
        return `Must have at most ${maxCount} value(s)`;
      }
    } else {
      if (!Array.isArray(options)) {
        return 'Question has no options configured';
      }

      if (userResponse.length !== options.length) {
        return `Must have exactly ${options.length} value(s)`;
      }
    }

    if (
      !userResponse.every(
        (item) => typeof item === 'number' && Number.isFinite(item),
      )
    ) {
      return 'All values must be numbers';
    }

    const minVal = typeof config.min === 'number' ? config.min : 0;
    const maxVal = typeof config.max === 'number' ? config.max : 100;

    for (const value of userResponse as number[]) {
      if (value < minVal || value > maxVal) {
        return `All values must be between ${minVal} and ${maxVal}`;
      }
    }

    const sumTo = typeof config.sumTo === 'number' ? config.sumTo : undefined;
    if (sumTo !== undefined) {
      const sum = (userResponse as number[]).reduce(
        (total, value) => total + value,
        0,
      );
      if (sum !== sumTo) {
        return `Values must sum to ${sumTo}`;
      }
    }

    return null;
  }

  private validateSingleSlider(
    question: PersonaQuestion,
    userResponse: unknown,
  ) {
    if (typeof userResponse !== 'number' || !Number.isFinite(userResponse)) {
      return 'Must be a number';
    }

    const config = flattenFieldConfig(question.fieldConfig);
    const minVal = typeof config.min === 'number' ? config.min : 0;
    const maxVal = typeof config.max === 'number' ? config.max : 100;

    if (userResponse < minVal || userResponse > maxVal) {
      return `Value must be between ${minVal} and ${maxVal}`;
    }

    return null;
  }

  private validateRangeSlider(question: PersonaQuestion, userResponse: unknown) {
    if (!Array.isArray(userResponse)) {
      return 'Must be an array';
    }

    if (userResponse.length !== 2) {
      return 'Must have exactly 2 value(s)';
    }

    if (
      !userResponse.every(
        (item) => typeof item === 'number' && Number.isFinite(item),
      )
    ) {
      return 'All values must be numbers';
    }

    const config = flattenFieldConfig(question.fieldConfig);
    const minVal = typeof config.min === 'number' ? config.min : 0;
    const maxVal = typeof config.max === 'number' ? config.max : 100;
    const [start, end] = userResponse as number[];

    if (start < minVal || end > maxVal || start > end) {
      return `Values must be between ${minVal} and ${maxVal}, with start <= end`;
    }

    return null;
  }

  private async validateFileUploadSingle(
    question: PersonaQuestion,
    userResponse: unknown,
    context: ValidationContext,
  ) {
    if (isEmptyPersonaResponse(userResponse)) {
      return question.isRequired ? 'A file is required' : null;
    }

    if (typeof userResponse !== 'string') {
      return 'Must be a string';
    }

    return this.validateFileKeys(question, [userResponse], context, 1);
  }

  private async validateFileUploadMultiple(
    question: PersonaQuestion,
    userResponse: unknown,
    context: ValidationContext,
  ) {
    if (!Array.isArray(userResponse)) {
      return 'Must be an array';
    }

    const config = flattenFieldConfig(question.fieldConfig);
    const max = typeof config.max === 'number' ? config.max : undefined;

    if (max !== undefined && userResponse.length > max) {
      return `Upload at most ${max} file(s)`;
    }

    const keys = userResponse.filter(
      (item): item is string => typeof item === 'string' && item.length > 0,
    );

    if (keys.length !== userResponse.length) {
      return 'Each file must be a non-empty string';
    }

    if (keys.length === 0 && question.isRequired) {
      return 'At least one file is required';
    }

    return this.validateFileKeys(question, keys, context, max);
  }

  private async validateFileKeys(
    question: PersonaQuestion,
    keys: string[],
    context: ValidationContext,
    maxFiles: number | undefined,
  ) {
    const unique = new Set(keys);
    if (unique.size !== keys.length) {
      return 'File keys must be unique';
    }

    if (maxFiles !== undefined && keys.length > maxFiles) {
      return `Upload at most ${maxFiles} file(s)`;
    }

    const prefix = this.storageService.getPersonaPrefix();

    for (const key of keys) {
      if (
        !isPersonaFileKeyForQuestion(
          prefix,
          key,
          context.workspaceId,
          question.name,
        )
      ) {
        return 'File key does not belong to this question';
      }

      const exists = await this.storageService.objectExists(key);
      if (!exists) {
        return `File not found: ${key}`;
      }
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

  private validateMultiRadioWithIcon(
    question: PersonaQuestion,
    userResponse: unknown,
  ) {
    if (!Array.isArray(userResponse)) {
      return 'Must be an array';
    }
    if (!userResponse.every((item) => typeof item === 'string')) {
      return 'All selections must be strings';
    }

    const config = flattenFieldConfig(question.fieldConfig);
    const allowed = this.iconDropdownLabels(question.fieldConfig);

    return this.validateStringSelectionCount(
      userResponse as string[],
      allowed,
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

  private isValidBriefOption(
    item: unknown,
  ): item is { title: string; brief: string } {
    if (item === null || typeof item !== 'object' || Array.isArray(item)) {
      return false;
    }

    const entry = item as Record<string, unknown>;
    return (
      typeof entry.title === 'string' &&
      entry.title.trim().length > 0 &&
      typeof entry.brief === 'string' &&
      entry.brief.trim().length > 0
    );
  }

  private broadSelectorOptions(
    fieldConfig: Prisma.JsonValue | null,
  ): Array<{ title: string; brief: string }> {
    const { options } = flattenFieldConfig(fieldConfig);
    if (!Array.isArray(options)) {
      return [];
    }
    return options
      .filter((item): item is { title: string; brief: string } =>
        this.isValidBriefOption(item),
      )
      .map((item) => ({ title: item.title, brief: item.brief }));
  }

  private broadSelectorValues(fieldConfig: Prisma.JsonValue | null): string[] {
    return this.broadSelectorOptions(fieldConfig).map((option) => option.title);
  }

  private dropdownOptionValues(
    fieldConfig: Prisma.JsonValue | null,
  ): string[] {
    const { options } = flattenFieldConfig(fieldConfig);
    if (!Array.isArray(options)) {
      return [];
    }

    return options.flatMap((item) => {
      if (typeof item === 'string') {
        return item.length > 0 ? [item] : [];
      }

      if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
        const entry = item as Record<string, unknown>;
        if (typeof entry.value === 'string' && entry.value.trim().length > 0) {
          return [entry.value];
        }
      }

      return [];
    });
  }

  private bannerSelectorSlugs(fieldConfig: Prisma.JsonValue | null): string[] {
    const { options } = flattenFieldConfig(fieldConfig);
    if (!Array.isArray(options)) {
      return [];
    }

    return options.flatMap((item) => {
      if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
        const entry = item as Record<string, unknown>;
        if (typeof entry.slug === 'string' && entry.slug.trim().length > 0) {
          return [entry.slug];
        }
      }

      return [];
    });
  }

  private iconDropdownLabels(fieldConfig: Prisma.JsonValue | null): string[] {
    const { options } = flattenFieldConfig(fieldConfig);
    if (!Array.isArray(options)) {
      return [];
    }

    return options.flatMap((item) => {
      if (Array.isArray(item) && typeof item[0] === 'string') {
        return item[0].trim().length > 0 ? [item[0]] : [];
      }

      if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
        const entry = item as Record<string, unknown>;
        if (typeof entry.title === 'string' && entry.title.trim().length > 0) {
          return [entry.title];
        }
      }

      return [];
    });
  }
}
