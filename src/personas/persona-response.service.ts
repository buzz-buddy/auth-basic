import { Injectable, NotFoundException } from '@nestjs/common';
import { ResponseValueSource } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertPersonaResponsesDto } from './dto/upsert-persona-responses.dto';
import { UpdatePersonaLocationDto } from './dto/update-persona-location.dto';
import { PersonaResponseValidator } from './persona-response-validator';
import { PersonaSchemaService } from './persona-schema.service';

@Injectable()
export class PersonaResponseService {
  constructor(
    private prisma: PrismaService,
    private validator: PersonaResponseValidator,
    private schemaService: PersonaSchemaService,
  ) {}

  async upsertResponses(
    workspaceId: string,
    personaId: string,
    dto: UpsertPersonaResponsesDto,
  ) {
    if (dto.personaSubComponentId !== undefined) {
      await this.assertPersonaSubComponentExists(dto.personaSubComponentId);
    }

    const questionIds = dto.responses.map((r) => r.personaQuestionId);
    const questions = await this.prisma.personaQuestion.findMany({
      where: { id: { in: questionIds }, isActive: true },
    });

    if (questions.length !== questionIds.length) {
      throw new NotFoundException('One or more PersonaQuestion records not found');
    }

    const questionMap = new Map(questions.map((q) => [q.id, q]));

    for (const item of dto.responses) {
      const question = questionMap.get(item.personaQuestionId)!;
      this.validator.validate(question, item.userResponse);
    }

    await this.prisma.$transaction(async (tx) => {
      for (const item of dto.responses) {
        const valueSource =
          item.valueSource ??
          (item.userResponse === null || item.userResponse === undefined
            ? ResponseValueSource.EMPTY
            : ResponseValueSource.USER);

        await tx.workspaceQuestionResponse.upsert({
          where: {
            workspaceId_personaQuestionId: {
              workspaceId,
              personaQuestionId: item.personaQuestionId,
            },
          },
          create: {
            workspaceId,
            personaQuestionId: item.personaQuestionId,
            userResponse: item.userResponse as object,
            valueSource,
          },
          update: {
            userResponse: item.userResponse as object,
            valueSource,
          },
        });
      }

      if (dto.personaSubComponentId !== undefined) {
        await tx.persona.update({
          where: { id: personaId },
          data: { currentPersonaSubComponentId: dto.personaSubComponentId },
        });
      }
    });

    const status = await this.schemaService.recomputePersonaStatus(
      workspaceId,
      personaId,
    );

    return { success: true, status };
  }

  async updateLocation(
    personaId: string,
    schemaVersion: number,
    dto: UpdatePersonaLocationDto,
  ) {
    const subComponent = await this.prisma.personaSubComponent.findFirst({
      where: {
        id: dto.personaSubComponentId,
        personaComponent: { schemaVersion },
      },
    });

    if (!subComponent) {
      throw new NotFoundException('PersonaSubComponent not found');
    }

    await this.prisma.persona.update({
      where: { id: personaId },
      data: { currentPersonaSubComponentId: dto.personaSubComponentId },
    });

    return {
      resume: {
        personaComponentId: subComponent.personaComponentId,
        personaSubComponentId: subComponent.id,
      },
    };
  }

  private async assertPersonaSubComponentExists(personaSubComponentId: number) {
    const exists = await this.prisma.personaSubComponent.findUnique({
      where: { id: personaSubComponentId },
    });
    if (!exists) {
      throw new NotFoundException('PersonaSubComponent not found');
    }
  }
}
