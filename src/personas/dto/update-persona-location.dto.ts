import { IsInt } from 'class-validator';

export class UpdatePersonaLocationDto {
  @IsInt()
  personaSubComponentId: number;
}
