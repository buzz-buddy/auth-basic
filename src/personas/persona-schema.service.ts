import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Persona,
  PersonaComponent,
  PersonaFieldType,
  PersonaQuestion,
  PersonaSubComponent,
  PersonaStatus,
  WorkspaceQuestionResponse,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import {
  defaultResponseValue,
  flattenFieldConfig,
} from './persona-field.util';
import {
  extractFileKeysFromResponse,
  isFileUploadFieldType,
} from './persona-file.util';
import { PersonaResponseValidator } from './persona-response-validator';

@Injectable()
export class PersonaSchemaService {
  constructor(
    private prisma: PrismaService,
    private validator: PersonaResponseValidator,
    private storageService: StorageService,
  ) {}

  async getFullSchema(workspaceId: string, schemaVersion: number) {
    const version = await this.getActiveSchemaVersion(schemaVersion);
    const personaComponents = await this.loadPersonaComponents(schemaVersion);
    const responseMap = await this.loadResponseMap(workspaceId);

    return {
      schemaVersion: version.version,
      description: version.description,
      personaComponents: await Promise.all(
        personaComponents.map((component) =>
          this.toPersonaComponentDto(component, responseMap, true),
        ),
      ),
    };
  }

  async getPersonaComponent(
    workspaceId: string,
    schemaVersion: number,
    personaComponentSlug: string,
  ) {
    const component = await this.prisma.personaComponent.findFirst({
      where: { slug: personaComponentSlug, schemaVersion },
      include: {
        personaSubComponents: {
          orderBy: { sortOrder: 'asc' },
          include: {
            personaQuestions: {
              where: { isActive: true },
              orderBy: { id: 'asc' },
            },
          },
        },
      },
    });

    if (!component) {
      throw new NotFoundException('PersonaComponent not found');
    }

    const responseMap = await this.loadResponseMap(workspaceId);
    return this.toPersonaComponentDto(component, responseMap, true);
  }

  async getPersonaSubComponent(
    workspaceId: string,
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
      include: {
        personaQuestions: {
          where: { isActive: true },
          orderBy: { id: 'asc' },
        },
      },
    });

    if (!subComponent) {
      throw new NotFoundException('PersonaSubComponent not found');
    }

    const responseMap = await this.loadResponseMap(workspaceId);
    return this.toPersonaSubComponentDto(subComponent, responseMap, true);
  }

  async getAdminSchema(schemaVersion: number) {
    const version = await this.getActiveSchemaVersion(schemaVersion);
    const personaComponents = await this.loadPersonaComponents(schemaVersion);

    return {
      schemaVersion: version.version,
      description: version.description,
      personaComponents: await Promise.all(
        personaComponents.map((component) =>
          this.toPersonaComponentDto(component, new Map(), false),
        ),
      ),
    };
  }

  async resolveResume(persona: Persona) {
    if (persona.currentPersonaSubComponentId) {
      const sub = await this.prisma.personaSubComponent.findUnique({
        where: { id: persona.currentPersonaSubComponentId },
      });
      if (sub) {
        return {
          personaComponentId: sub.personaComponentId,
          personaSubComponentId: sub.id,
        };
      }
    }

    const first = await this.prisma.personaSubComponent.findFirst({
      where: {
        personaComponent: { schemaVersion: persona.schemaVersion },
        personaQuestions: { some: { isActive: true } },
      },
      orderBy: [
        { personaComponent: { sortOrder: 'asc' } },
        { sortOrder: 'asc' },
      ],
    });

    if (!first) {
      return null;
    }

    return {
      personaComponentId: first.personaComponentId,
      personaSubComponentId: first.id,
    };
  }

  async getProgress(workspaceId: string, persona: Persona) {
    const questions = await this.prisma.personaQuestion.findMany({
      where: {
        isActive: true,
        personaSubComponent: {
          personaComponent: { schemaVersion: persona.schemaVersion },
        },
      },
    });

    const requiredQuestions = questions.filter((q) => q.isRequired);
    const responses = await this.prisma.workspaceQuestionResponse.findMany({
      where: { workspaceId },
    });
    const responseByQuestionId = new Map(
      responses.map((r) => [r.personaQuestionId, r.userResponse]),
    );

    let answeredRequired = 0;
    for (const question of requiredQuestions) {
      const userResponse = responseByQuestionId.get(question.id);
      if (this.validator.isAnswered(question, userResponse)) {
        answeredRequired++;
      }
    }

    const totalRequired = requiredQuestions.length;
    const percent =
      totalRequired === 0
        ? 100
        : Math.round((answeredRequired / totalRequired) * 100);

    const resume = await this.resolveResume(persona);

    return {
      status: persona.status,
      answeredRequired,
      totalRequired,
      percent,
      resume,
    };
  }

  async recomputePersonaStatus(workspaceId: string, personaId: string) {
    const persona = await this.prisma.persona.findUniqueOrThrow({
      where: { id: personaId },
    });

    const progress = await this.getProgress(workspaceId, persona);
    const status =
      progress.totalRequired > 0 &&
      progress.answeredRequired === progress.totalRequired
        ? PersonaStatus.COMPLETE
        : PersonaStatus.DRAFT;

    if (status !== persona.status) {
      await this.prisma.persona.update({
        where: { id: personaId },
        data: { status },
      });
    }

    return status;
  }

  private async getActiveSchemaVersion(schemaVersion: number) {
    const version = await this.prisma.personaSchemaVersion.findFirst({
      where: { version: schemaVersion, isActive: true },
    });
    if (!version) {
      throw new NotFoundException('Persona schema version not found');
    }
    return version;
  }

  private async loadPersonaComponents(schemaVersion: number) {
    return this.prisma.personaComponent.findMany({
      where: { schemaVersion },
      orderBy: { sortOrder: 'asc' },
      include: {
        personaSubComponents: {
          orderBy: { sortOrder: 'asc' },
          include: {
            personaQuestions: {
              where: { isActive: true },
              orderBy: { id: 'asc' },
            },
          },
        },
      },
    });
  }

  private async loadResponseMap(workspaceId: string) {
    const responses = await this.prisma.workspaceQuestionResponse.findMany({
      where: { workspaceId },
    });
    return new Map(responses.map((r) => [r.personaQuestionId, r]));
  }

  private async toPersonaComponentDto(
    component: PersonaComponent & {
      personaSubComponents: (PersonaSubComponent & {
        personaQuestions: PersonaQuestion[];
      })[];
    },
    responseMap: Map<number, WorkspaceQuestionResponse>,
    includeResponses: boolean,
  ) {
    const personaSubComponents = await Promise.all(
      component.personaSubComponents
        .filter((sub) => sub.personaQuestions.length > 0)
        .map((sub) =>
          this.toPersonaSubComponentDto(sub, responseMap, includeResponses),
        ),
    );

    return {
      id: component.id,
      slug: component.slug,
      label: component.label,
      title: component.title,
      sortOrder: component.sortOrder,
      personaSubComponents,
    };
  }

  private async toPersonaSubComponentDto(
    subComponent: PersonaSubComponent & {
      personaQuestions: PersonaQuestion[];
    },
    responseMap: Map<number, WorkspaceQuestionResponse>,
    includeResponses: boolean,
  ) {
    const personaQuestions = await Promise.all(
      subComponent.personaQuestions.map((question) =>
        this.toPersonaQuestionDto(question, responseMap, includeResponses),
      ),
    );

    return {
      id: subComponent.id,
      slug: subComponent.slug,
      personaComponentId: subComponent.personaComponentId,
      label: subComponent.label,
      title: subComponent.title,
      sideTitle: subComponent.sideTitle,
      description: subComponent.description,
      sideInfo: subComponent.sideInfo,
      sortOrder: subComponent.sortOrder,
      personaQuestions,
    };
  }

  private async toPersonaQuestionDto(
    question: PersonaQuestion,
    responseMap: Map<number, WorkspaceQuestionResponse>,
    includeResponses: boolean,
  ) {
    const stored = responseMap.get(question.id);
    const defaultValue = defaultResponseValue(question.fieldType);

    const base = {
      id: question.id,
      personaSubComponentId: question.personaSubComponentId,
      fieldType: question.fieldType,
      name: question.name,
      label: question.label,
      isRequired: question.isRequired,
      ...flattenFieldConfig(question.fieldConfig),
    };

    if (!includeResponses) {
      return base;
    }

    const userResponse = stored?.userResponse ?? defaultValue;
    const aiValue = stored?.aiValue ?? defaultValue;

    if (isFileUploadFieldType(question.fieldType)) {
      const userResponsePreview = await this.buildFilePreview(
        question.fieldType,
        userResponse,
      );
      const aiValuePreview = await this.buildFilePreview(
        question.fieldType,
        aiValue,
      );

      return {
        ...base,
        userResponse,
        userResponsePreview,
        aiValue,
        aiValuePreview,
        valueSource: stored?.valueSource ?? 'EMPTY',
      };
    }

    return {
      ...base,
      userResponse,
      aiValue,
      valueSource: stored?.valueSource ?? 'EMPTY',
    };
  }

  private async buildFilePreview(
    fieldType: PersonaFieldType,
    value: unknown,
  ): Promise<string | string[]> {
    const keys = extractFileKeysFromResponse(fieldType, value);
    const previews = await this.storageService.getPresignedReadUrls(keys);

    if (fieldType === PersonaFieldType.file_upload_single) {
      return previews[0] ?? '';
    }

    return previews;
  }
}
