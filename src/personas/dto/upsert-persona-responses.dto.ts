import { Type } from 'class-transformer';
import {
  Allow,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ResponseValueSource } from '@prisma/client';

export class PersonaResponseItemDto {
  @IsString()
  name: string;

  @Allow()
  userResponse: unknown;

  @IsOptional()
  @IsEnum(ResponseValueSource)
  valueSource?: ResponseValueSource;
}

export class UpsertPersonaResponsesDto {
  @IsOptional()
  @IsString()
  personaComponentSlug?: string;

  @IsOptional()
  @IsString()
  personaSubComponentSlug?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PersonaResponseItemDto)
  responses: PersonaResponseItemDto[];
}
