import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ResponseValueSource } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { UpsertPersonaResponsesDto } from './dto/upsert-persona-responses.dto';
import { UpdatePersonaLocationDto } from './dto/update-persona-location.dto';
import {
  extractFileKeysFromResponse,
  isFileUploadFieldType,
} from './persona-file.util';
import { isEmptyPersonaResponse } from './persona-field.util';
import { PersonaResponseValidator } from './persona-response-validator';
import { PersonaSchemaService } from './persona-schema.service';

@Injectable()
export class PersonaResponseService {
  constructor(
    private prisma: PrismaService,
    private validator: PersonaResponseValidator,
    private schemaService: PersonaSchemaService,
    private storageService: StorageService,
  ) {}

  async upsertResponses(
    workspaceId: string,
    personaId: string,
    schemaVersion: number,
    dto: UpsertPersonaResponsesDto,
  ) {
    const personaSubComponentId = await this.resolveOptionalSubComponentId(
      schemaVersion,
      dto.personaComponentSlug,
      dto.personaSubComponentSlug,
    );

    const names = dto.responses.map((r) => r.name);
    const questions = await this.prisma.personaQuestion.findMany({
      where: { name: { in: names }, isActive: true },
    });

    if (questions.length !== names.length) {
      const found = new Set(questions.map((q) => q.name));
      const missing = names.filter((name) => !found.has(name));
      throw new NotFoundException(
        `Unknown persona question(s): ${missing.join(', ')}`,
      );
    }

    const questionMap = new Map(questions.map((q) => [q.name, q]));
    const questionIds = questions.map((q) => q.id);
    const existingResponses =
      await this.prisma.workspaceQuestionResponse.findMany({
        where: {
          workspaceId,
          personaQuestionId: { in: questionIds },
        },
      });
    const existingByQuestionId = new Map(
      existingResponses.map((response) => [
        response.personaQuestionId,
        response,
      ]),
    );

    for (const item of dto.responses) {
      const question = questionMap.get(item.name)!;
      await this.validator.validate(question, item.userResponse, {
        workspaceId,
      });
    }

    await this.prisma.$transaction(async (tx) => {
      for (const item of dto.responses) {
        const question = questionMap.get(item.name)!;
        const valueSource =
          item.valueSource ??
          (isEmptyPersonaResponse(item.userResponse)
            ? ResponseValueSource.EMPTY
            : ResponseValueSource.USER);

        await tx.workspaceQuestionResponse.upsert({
          where: {
            workspaceId_personaQuestionId: {
              workspaceId,
              personaQuestionId: question.id,
            },
          },
          create: {
            workspaceId,
            personaQuestionId: question.id,
            userResponse: item.userResponse as object,
            valueSource,
          },
          update: {
            userResponse: item.userResponse as object,
            valueSource,
          },
        });
      }

      if (personaSubComponentId !== undefined) {
        await tx.persona.update({
          where: { id: personaId },
          data: { currentPersonaSubComponentId: personaSubComponentId },
        });
      }
    });

    for (const item of dto.responses) {
      const question = questionMap.get(item.name)!;
      if (!isFileUploadFieldType(question.fieldType)) {
        continue;
      }

      const existing = existingByQuestionId.get(question.id);
      const oldKeys = extractFileKeysFromResponse(
        question.fieldType,
        existing?.userResponse,
      );
      const newKeys = extractFileKeysFromResponse(
        question.fieldType,
        item.userResponse,
      );
      const removedKeys = oldKeys.filter((key) => !newKeys.includes(key));

      for (const key of removedKeys) {
        await this.storageService.deleteObject(key);
      }
    }

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

  private async resolveOptionalSubComponentId(
    schemaVersion: number,
    personaComponentSlug?: string,
    personaSubComponentSlug?: string,
  ): Promise<number | undefined> {
    if (
      personaComponentSlug === undefined &&
      personaSubComponentSlug === undefined
    ) {
      return undefined;
    }

    if (!personaComponentSlug || !personaSubComponentSlug) {
      throw new BadRequestException(
        'personaComponentSlug and personaSubComponentSlug must be provided together',
      );
    }

    const subComponent = await this.resolveSubComponentBySlugs(
      schemaVersion,
      personaComponentSlug,
      personaSubComponentSlug,
    );

    return subComponent.id;
  }

  private async resolveSubComponentBySlugs(
    schemaVersion: number,
    personaComponentSlug: string,
    personaSubComponentSlug: string,
  ) {
    const subComponent = await this.prisma.personaSubComponent.findFirst({
      where: {
        slug: personaSubComponentSlug,
        personaComponent: {
          slug: personaComponentSlug,
          schemaVersion,
        },
      },
    });

    if (!subComponent) {
      throw new NotFoundException('PersonaSubComponent not found');
    }

    return subComponent;
  }
}
