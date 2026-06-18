import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ResponseValueSource } from '@prisma/client';

export class PersonaResponseItemDto {
  @IsString()
  name: string;

  @IsDefined()
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
