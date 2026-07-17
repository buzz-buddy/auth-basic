import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ListFontsQueryDto } from './dto/list-fonts-query.dto';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

@Injectable()
export class FontsService {
  constructor(private prisma: PrismaService) {}

  async listFonts(query: ListFontsQueryDto) {
    const page = query.page ?? DEFAULT_PAGE;
    const limit = Math.min(query.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    const skip = (page - 1) * limit;
    const where = this.buildListWhere(query);

    const [total, fonts] = await Promise.all([
      this.prisma.font.count({ where }),
      this.prisma.font.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sortOrder: 'asc' }, { family: 'asc' }],
        select: {
          slug: true,
          family: true,
          category: true,
          tags: true,
          suitableForDisplay: true,
          suitableForBody: true,
        },
      }),
    ]);

    return {
      items: fonts,
      total,
      page,
      limit,
      totalPages: total === 0 ? 0 : Math.ceil(total / limit),
    };
  }

  async findActiveBySlug(slug: string) {
    return this.prisma.font.findFirst({
      where: { slug, isActive: true },
      select: {
        slug: true,
        family: true,
        suitableForDisplay: true,
        suitableForBody: true,
      },
    });
  }

  private buildListWhere(query: ListFontsQueryDto): Prisma.FontWhereInput {
    const where: Prisma.FontWhereInput = { isActive: true };

    if (query.role === 'display') {
      where.suitableForDisplay = true;
    } else if (query.role === 'body') {
      where.suitableForBody = true;
    }

    const search = query.search?.trim();
    if (search) {
      where.OR = [
        { family: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    return where;
  }
}
