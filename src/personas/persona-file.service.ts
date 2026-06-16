import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PersonaFieldType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import {
  allowedMimeTypesFromConfig,
  isFileUploadFieldType,
  isPersonaFileKeyForQuestion,
} from './persona-file.util';
import { flattenFieldConfig } from './persona-field.util';

@Injectable()
export class PersonaFileService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async uploadFile(
    workspaceId: string,
    questionName: string,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('file is required');
    }

    const question = await this.getFileUploadQuestion(questionName);
    const config = flattenFieldConfig(question.fieldConfig);

    this.assertAllowedMimeType(file, config);
    this.assertFileSize(file, config);

    const key = await this.storageService.uploadPersonaFile(
      workspaceId,
      question.name,
      file,
    );
    const previewUrl = await this.storageService.getPresignedReadUrl(key);

    return {
      files: [{ key, previewUrl }],
    };
  }

  async deleteFile(
    workspaceId: string,
    questionName: string,
    key: string,
  ) {
    const question = await this.getFileUploadQuestion(questionName);
    this.assertKeyBelongsToQuestion(workspaceId, question.name, key);

    const saved = await this.prisma.workspaceQuestionResponse.findUnique({
      where: {
        workspaceId_personaQuestionId: {
          workspaceId,
          personaQuestionId: question.id,
        },
      },
    });

    const savedKeys = this.extractKeysFromStoredResponse(
      question.fieldType,
      saved?.userResponse,
    );

    if (savedKeys.includes(key)) {
      throw new BadRequestException(
        'File is already saved. Remove it by updating persona responses.',
      );
    }

    await this.storageService.deleteObject(key);

    return { success: true };
  }

  private async getFileUploadQuestion(questionName: string) {
    const question = await this.prisma.personaQuestion.findFirst({
      where: { name: questionName, isActive: true },
    });

    if (!question) {
      throw new NotFoundException(`Persona question not found: ${questionName}`);
    }

    if (!isFileUploadFieldType(question.fieldType)) {
      throw new BadRequestException('Question is not a file upload field');
    }

    return question;
  }

  private assertKeyBelongsToQuestion(
    workspaceId: string,
    questionName: string,
    key: string,
  ) {
    if (
      !isPersonaFileKeyForQuestion(
        this.storageService.getPersonaPrefix(),
        key,
        workspaceId,
        questionName,
      )
    ) {
      throw new BadRequestException('File key does not belong to this question');
    }
  }

  private assertAllowedMimeType(
    file: Express.Multer.File,
    config: Record<string, unknown>,
  ) {
    const allowed = allowedMimeTypesFromConfig(config);
    if (!allowed.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed`,
      );
    }
  }

  private assertFileSize(
    file: Express.Multer.File,
    config: Record<string, unknown>,
  ) {
    const sizeLimit = config.sizeLimit;
    if (typeof sizeLimit === 'number' && file.size > sizeLimit) {
      throw new BadRequestException(
        `File must be no larger than ${sizeLimit} bytes`,
      );
    }
  }

  private extractKeysFromStoredResponse(
    fieldType: PersonaFieldType,
    userResponse: unknown,
  ): string[] {
    if (fieldType === PersonaFieldType.file_upload_single) {
      return typeof userResponse === 'string' && userResponse.length > 0
        ? [userResponse]
        : [];
    }

    if (
      fieldType === PersonaFieldType.file_upload_multiple &&
      Array.isArray(userResponse)
    ) {
      return userResponse.filter(
        (item): item is string => typeof item === 'string' && item.length > 0,
      );
    }

    return [];
  }
}
