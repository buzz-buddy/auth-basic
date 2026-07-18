import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class PersonaSideInfoItemDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  @MaxLength(1000)
  description: string;
}

export class PersonaSideInfoDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  @MaxLength(1000)
  description: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PersonaSideInfoItemDto)
  items?: PersonaSideInfoItemDto[];
}

export class UpdatePersonaSubComponentDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  label?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  sideTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PersonaSideInfoDto)
  sideInfo?: PersonaSideInfoDto;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  sidePanelShortInfo?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
