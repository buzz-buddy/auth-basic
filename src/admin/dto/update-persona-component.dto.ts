import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdatePersonaComponentDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  label?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  title?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
