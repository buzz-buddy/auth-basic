import { Body, Controller, Get, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ValidationErrorResponseDto } from '../common/swagger/api-responses.dto';
import type { AuthenticatedUser } from '../common/types/jwt-payload.type';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { WorkspacesService } from './workspaces.service';

@ApiTags('Workspaces')
@ApiBearerAuth('access-token')
@Controller('workspaces')
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user workspace and persona summary' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.workspacesService.getWorkspaceMe(user.sub);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current workspace' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: ValidationErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateMe(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateWorkspaceDto,
  ) {
    return this.workspacesService.updateWorkspace(user.sub, dto);
  }
}
