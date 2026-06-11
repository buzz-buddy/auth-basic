import {
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { fieldConfigFromDto } from '../../personas/persona-field.util';

export class UpdatePersonaQuestionDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  label?: string;

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @IsOptional()
  @IsObject()
  fieldConfig?: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  toUpdateData() {
    return {
      ...(this.label !== undefined ? { label: this.label } : {}),
      ...(this.isRequired !== undefined ? { isRequired: this.isRequired } : {}),
      ...(this.fieldConfig !== undefined
        ? { fieldConfig: fieldConfigFromDto(this.fieldConfig) }
        : {}),
      ...(this.isActive !== undefined ? { isActive: this.isActive } : {}),
    };
  }
}
