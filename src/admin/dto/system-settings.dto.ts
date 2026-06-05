import { ApiProperty } from '@nestjs/swagger';

export class SystemSettingsDto {
  @ApiProperty({ example: false })
  maintenanceMode: boolean;

  @ApiProperty({ example: true })
  allowRegistration: boolean;

  @ApiProperty({ example: '0.0.1' })
  appVersion: string;
}
