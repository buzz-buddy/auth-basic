import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdatePersonaComponentDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  label?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
