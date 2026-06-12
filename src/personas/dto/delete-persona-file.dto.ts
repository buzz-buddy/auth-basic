import { IsString, MinLength } from 'class-validator';

export class DeletePersonaFileDto {
  @IsString()
  @MinLength(1)
  key: string;
}
