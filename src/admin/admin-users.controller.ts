import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import {
  MessageResponseDto,
  UserPublicDto,
  ValidationErrorResponseDto,
} from '../common/swagger/api-responses.dto';
import type { AuthenticatedUser } from '../common/types/jwt-payload.type';
import { AdminUsersService } from './admin-users.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { PaginatedUsersDto } from './dto/paginated-users.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';

@ApiTags('Admin')
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN)
@Controller('admin/users')
export class AdminUsersController {
  constructor(private adminUsers: AdminUsersService) {}

  @Get()
  @ApiOperation({ summary: 'List users (paginated)' })
  @ApiResponse({ status: 200, type: PaginatedUsersDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  listUsers(@Query() query: ListUsersQueryDto) {
    return this.adminUsers.listUsers(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, type: UserPublicDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUser(@Param('id') id: string) {
    return this.adminUsers.findUserById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 201, type: UserPublicDto })
  @ApiResponse({ status: 400, type: ValidationErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  createUser(@Body() dto: CreateAdminUserDto) {
    return this.adminUsers.createUser(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user role, status, or profile' })
  @ApiResponse({ status: 200, type: UserPublicDto })
  @ApiResponse({ status: 400, type: ValidationErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateAdminUserDto,
    @CurrentUser() admin: AuthenticatedUser,
  ) {
    return this.adminUsers.updateUser(id, dto, admin.sub);
  }

  @Post(':id/send-password-reset')
  @ApiOperation({ summary: 'Send password reset email to user' })
  @ApiResponse({ status: 201, type: MessageResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  sendPasswordReset(@Param('id') id: string) {
    return this.adminUsers.sendPasswordReset(id);
  }
}
