import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

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
  @IsString()
  sideInfo?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
