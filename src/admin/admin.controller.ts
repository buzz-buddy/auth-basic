import { Body, Controller, Get, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ValidationErrorResponseDto } from '../common/swagger/api-responses.dto';
import { AdminSettingsService } from './admin-settings.service';
import { SystemSettingsDto } from './dto/system-settings.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@ApiTags('Admin')
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private adminSettings: AdminSettingsService) {}

  @Get('settings')
  @ApiOperation({
    summary: 'Get system settings',
    description:
      'Platform operator config. In-memory until persistent settings storage is added.',
  })
  @ApiResponse({ status: 200, type: SystemSettingsDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  getSettings() {
    return this.adminSettings.getSettings();
  }

  @Patch('settings')
  @ApiOperation({ summary: 'Update system settings' })
  @ApiResponse({ status: 200, type: SystemSettingsDto })
  @ApiResponse({ status: 400, type: ValidationErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  updateSettings(@Body() dto: UpdateSettingsDto) {
    return this.adminSettings.updateSettings(dto);
  }
}
