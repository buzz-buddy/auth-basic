import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsEnum,
  IsInt,
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
  @IsInt()
  personaSubComponentId?: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PersonaResponseItemDto)
  responses: PersonaResponseItemDto[];
}
