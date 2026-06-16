import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
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
import { ValidationErrorResponseDto } from '../common/swagger/api-responses.dto';
import type { AuthenticatedUser } from '../common/types/jwt-payload.type';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { UpdatePersonaLocationDto } from './dto/update-persona-location.dto';
import { UpsertPersonaResponsesDto } from './dto/upsert-persona-responses.dto';
import { DeletePersonaFileDto } from './dto/delete-persona-file.dto';
import { PersonaFileService } from './persona-file.service';
import { PersonaResponseService } from './persona-response.service';
import { PersonaSchemaService } from './persona-schema.service';

@ApiTags('Personas')
@ApiBearerAuth('access-token')
@Controller('workspaces/me/persona')
export class PersonasController {
  constructor(
    private workspacesService: WorkspacesService,
    private schemaService: PersonaSchemaService,
    private responseService: PersonaResponseService,
    private fileService: PersonaFileService,
  ) {}

  private async getContext(userId: string) {
    const membership = await this.workspacesService.getWorkspaceContextForUser(
      userId,
    );
    const persona = membership.workspace.persona;
    if (!persona) {
      throw new NotFoundException('Persona not found');
    }
    return {
      workspaceId: membership.workspaceId,
      persona,
    };
  }

  @Get('schema')
  @ApiOperation({ summary: 'Get full persona schema with responses' })
  getSchema(@CurrentUser() user: AuthenticatedUser) {
    return this.getContext(user.sub).then(({ workspaceId, persona }) =>
      this.schemaService.getFullSchema(workspaceId, persona.schemaVersion),
    );
  }

  @Get('schema/persona-components/:personaComponentSlug')
  @ApiOperation({ summary: 'Get one PersonaComponent with responses' })
  getPersonaComponent(
    @CurrentUser() user: AuthenticatedUser,
    @Param('personaComponentSlug') personaComponentSlug: string,
  ) {
    return this.getContext(user.sub).then(({ workspaceId, persona }) =>
      this.schemaService.getPersonaComponent(
        workspaceId,
        persona.schemaVersion,
        personaComponentSlug,
      ),
    );
  }

  @Get(
    'schema/persona-components/:personaComponentSlug/persona-sub-components/:personaSubComponentSlug',
  )
  @ApiOperation({ summary: 'Get one PersonaSubComponent wizard page' })
  getPersonaSubComponent(
    @CurrentUser() user: AuthenticatedUser,
    @Param('personaComponentSlug') personaComponentSlug: string,
    @Param('personaSubComponentSlug') personaSubComponentSlug: string,
  ) {
    return this.getContext(user.sub).then(({ workspaceId, persona }) =>
      this.schemaService.getPersonaSubComponent(
        workspaceId,
        persona.schemaVersion,
        personaComponentSlug,
        personaSubComponentSlug,
      ),
    );
  }

  @Put('responses')
  @ApiOperation({ summary: 'Bulk upsert persona question responses' })
  @ApiResponse({ status: 400, type: ValidationErrorResponseDto })
  upsertResponses(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpsertPersonaResponsesDto,
  ) {
    return this.getContext(user.sub).then(({ workspaceId, persona }) =>
      this.responseService.upsertResponses(workspaceId, persona.id, dto),
    );
  }

  @Post('questions/:name/files')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a persona question file to S3' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded' })
  @ApiResponse({ status: 400, type: ValidationErrorResponseDto })
  uploadFile(
    @CurrentUser() user: AuthenticatedUser,
    @Param('name') name: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.getContext(user.sub).then(({ workspaceId }) =>
      this.fileService.uploadFile(workspaceId, name, file),
    );
  }

  @Delete('questions/:name/files')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete an unsaved persona file upload from S3',
  })
  deleteFile(
    @CurrentUser() user: AuthenticatedUser,
    @Param('name') name: string,
    @Body() dto: DeletePersonaFileDto,
  ) {
    return this.getContext(user.sub).then(({ workspaceId }) =>
      this.fileService.deleteFile(workspaceId, name, dto.key),
    );
  }

  @Patch('location')
  @ApiOperation({ summary: 'Update persona resume location' })
  updateLocation(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdatePersonaLocationDto,
  ) {
    return this.getContext(user.sub).then(({ persona }) =>
      this.responseService.updateLocation(
        persona.id,
        persona.schemaVersion,
        dto,
      ),
    );
  }

  @Get('progress')
  @ApiOperation({ summary: 'Get persona completion progress' })
  getProgress(@CurrentUser() user: AuthenticatedUser) {
    return this.getContext(user.sub).then(({ workspaceId, persona }) =>
      this.schemaService.getProgress(workspaceId, persona),
    );
  }
}
