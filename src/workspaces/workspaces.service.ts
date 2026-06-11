import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, WorkspaceRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PersonaSchemaService } from '../personas/persona-schema.service';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

type PrismaTx = Prisma.TransactionClient;

@Injectable()
export class WorkspacesService {
  constructor(
    private prisma: PrismaService,
    private personaSchemaService: PersonaSchemaService,
  ) {}

  async createDefaultForUser(
    userId: string,
    tx: PrismaTx,
    defaultName?: string | null,
  ) {
    const workspace = await tx.workspace.create({
      data: {
        name: defaultName ?? undefined,
        members: {
          create: {
            userId,
            role: WorkspaceRole.OWNER,
          },
        },
        persona: {
          create: {
            schemaVersion: 1,
          },
        },
      },
      include: {
        persona: true,
      },
    });

    return workspace;
  }

  async getMembershipForUser(userId: string) {
    return this.prisma.workspaceMember.findFirst({
      where: { userId, role: WorkspaceRole.OWNER },
      include: {
        workspace: {
          include: { persona: true },
        },
      },
    });
  }

  async getWorkspaceContextForUser(userId: string) {
    const membership = await this.getMembershipForUser(userId);
    if (!membership) {
      throw new NotFoundException('Workspace not found');
    }
    return membership;
  }

  async assertUserOwnsWorkspace(userId: string, workspaceId: string) {
    const membership = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('Workspace access denied');
    }

    return membership;
  }

  async getWorkspaceMe(userId: string) {
    const membership = await this.getWorkspaceContextForUser(userId);
    const { workspace } = membership;
    const persona = workspace.persona;

    if (!persona) {
      throw new NotFoundException('Persona not found');
    }

    const resume = await this.personaSchemaService.resolveResume(persona);

    return {
      id: workspace.id,
      name: workspace.name,
      websiteUrl: workspace.websiteUrl,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
      persona: {
        id: persona.id,
        status: persona.status,
        schemaVersion: persona.schemaVersion,
        resume,
      },
    };
  }

  async updateWorkspace(userId: string, dto: UpdateWorkspaceDto) {
    const membership = await this.getWorkspaceContextForUser(userId);

    const workspace = await this.prisma.workspace.update({
      where: { id: membership.workspaceId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.websiteUrl !== undefined ? { websiteUrl: dto.websiteUrl } : {}),
      },
      include: { persona: true },
    });

    const persona = workspace.persona;
    if (!persona) {
      throw new NotFoundException('Persona not found');
    }

    const resume = await this.personaSchemaService.resolveResume(persona);

    return {
      id: workspace.id,
      name: workspace.name,
      websiteUrl: workspace.websiteUrl,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
      persona: {
        id: persona.id,
        status: persona.status,
        schemaVersion: persona.schemaVersion,
        resume,
      },
    };
  }
}
