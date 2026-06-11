import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
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

  @Get('schema/persona-components/:personaComponentId')
  @ApiOperation({ summary: 'Get one PersonaComponent with responses' })
  getPersonaComponent(
    @CurrentUser() user: AuthenticatedUser,
    @Param('personaComponentId', ParseIntPipe) personaComponentId: number,
  ) {
    return this.getContext(user.sub).then(({ workspaceId, persona }) =>
      this.schemaService.getPersonaComponent(
        workspaceId,
        persona.schemaVersion,
        personaComponentId,
      ),
    );
  }

  @Get(
    'schema/persona-components/:personaComponentId/persona-sub-components/:personaSubComponentId',
  )
  @ApiOperation({ summary: 'Get one PersonaSubComponent wizard page' })
  getPersonaSubComponent(
    @CurrentUser() user: AuthenticatedUser,
    @Param('personaComponentId', ParseIntPipe) personaComponentId: number,
    @Param('personaSubComponentId', ParseIntPipe)
    personaSubComponentId: number,
  ) {
    return this.getContext(user.sub).then(({ workspaceId, persona }) =>
      this.schemaService.getPersonaSubComponent(
        workspaceId,
        persona.schemaVersion,
        personaComponentId,
        personaSubComponentId,
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
