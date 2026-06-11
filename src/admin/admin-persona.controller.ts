import { Body, Controller, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ValidationErrorResponseDto } from '../common/swagger/api-responses.dto';
import { AdminPersonaService } from './admin-persona.service';
import { UpdatePersonaComponentDto } from './dto/update-persona-component.dto';
import { UpdatePersonaQuestionDto } from './dto/update-persona-question.dto';
import { UpdatePersonaSubComponentDto } from './dto/update-persona-sub-component.dto';

@ApiTags('Admin Persona')
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN)
@Controller('admin/persona')
export class AdminPersonaController {
  constructor(private adminPersona: AdminPersonaService) {}

  @Get('schema')
  @ApiOperation({ summary: 'Get persona schema (no user responses)' })
  getSchema() {
    return this.adminPersona.getSchema();
  }

  @Patch('persona-questions/:id')
  @ApiOperation({ summary: 'Update PersonaQuestion metadata' })
  @ApiResponse({ status: 400, type: ValidationErrorResponseDto })
  updateQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePersonaQuestionDto,
  ) {
    return this.adminPersona.updatePersonaQuestion(id, dto);
  }

  @Patch('persona-sub-components/:id')
  @ApiOperation({ summary: 'Update PersonaSubComponent metadata' })
  updateSubComponent(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePersonaSubComponentDto,
  ) {
    return this.adminPersona.updatePersonaSubComponent(id, dto);
  }

  @Patch('persona-components/:id')
  @ApiOperation({ summary: 'Update PersonaComponent metadata' })
  updateComponent(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePersonaComponentDto,
  ) {
    return this.adminPersona.updatePersonaComponent(id, dto);
  }
}
