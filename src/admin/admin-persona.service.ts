import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PersonaSchemaService } from '../personas/persona-schema.service';
import { UpdatePersonaComponentDto } from './dto/update-persona-component.dto';
import { UpdatePersonaQuestionDto } from './dto/update-persona-question.dto';
import { UpdatePersonaSubComponentDto } from './dto/update-persona-sub-component.dto';

@Injectable()
export class AdminPersonaService {
  constructor(
    private prisma: PrismaService,
    private personaSchemaService: PersonaSchemaService,
  ) {}

  getSchema() {
    return this.personaSchemaService.getAdminSchema(1);
  }

  async updatePersonaQuestion(id: number, dto: UpdatePersonaQuestionDto) {
    const existing = await this.prisma.personaQuestion.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('PersonaQuestion not found');
    }

    return this.prisma.personaQuestion.update({
      where: { id },
      data: dto.toUpdateData(),
    });
  }

  async updatePersonaSubComponent(
    id: number,
    dto: UpdatePersonaSubComponentDto,
  ) {
    const existing = await this.prisma.personaSubComponent.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('PersonaSubComponent not found');
    }

    return this.prisma.personaSubComponent.update({
      where: { id },
      data: {
        ...(dto.label !== undefined ? { label: dto.label } : {}),
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.sideTitle !== undefined ? { sideTitle: dto.sideTitle } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.sideInfo !== undefined ? { sideInfo: dto.sideInfo } : {}),
        ...(dto.sidePanelShortInfo !== undefined
          ? { sidePanelShortInfo: dto.sidePanelShortInfo }
          : {}),
        ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
      },
    });
  }

  async updatePersonaComponent(id: number, dto: UpdatePersonaComponentDto) {
    const existing = await this.prisma.personaComponent.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('PersonaComponent not found');
    }

    return this.prisma.personaComponent.update({
      where: { id },
      data: {
        ...(dto.label !== undefined ? { label: dto.label } : {}),
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
      },
    });
  }
}
