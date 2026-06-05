import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  UserPublicDto,
  ValidationErrorResponseDto,
} from '../common/swagger/api-responses.dto';
import type { AuthenticatedUser } from '../common/types/jwt-payload.type';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { profileFieldsFromDto } from './profile-fields.util';
import { UsersService } from './users.service';

const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
const AVATAR_MAX_SIZE_LABEL = '5 MB';

@ApiTags('User Profiles')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile', description: 'Returns the current user profile.' })
  @ApiResponse({ status: 200, type: UserPublicDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.findById(user.sub);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, type: UserPublicDto })
  @ApiResponse({ status: 400, type: ValidationErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(
      user.sub,
      profileFieldsFromDto(dto),
    );
  }

  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload profile picture',
    description: 'JPEG, PNG, or WebP. Max 5 MB. Replaces any existing avatar.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary', description: 'Image file' },
      },
    },
  })
  @ApiResponse({ status: 201, type: UserPublicDto })
  @ApiResponse({ status: 400, description: 'Invalid file type, size, or multiple files' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  uploadAvatar(
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: AVATAR_MAX_BYTES,
            message: `file must be no larger than ${AVATAR_MAX_SIZE_LABEL}`,
          }),
          new FileTypeValidator({
            fileType: /^image\/(jpeg|png|webp)$/,
            errorMessage: 'file must be a JPEG, PNG, or WebP image',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.usersService.uploadAvatar(user.sub, file);
  }

  @Delete('me/avatar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove profile picture' })
  @ApiResponse({ status: 200, type: UserPublicDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  removeAvatar(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.removeAvatar(user.sub);
  }
}
