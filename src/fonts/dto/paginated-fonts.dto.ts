import { ApiProperty } from '@nestjs/swagger';

export class FontItemDto {
  @ApiProperty({ example: 'space-grotesk' })
  slug: string;

  @ApiProperty({ example: 'Space Grotesk' })
  family: string;

  @ApiProperty({ example: 'sans-serif' })
  category: string;

  @ApiProperty({ example: ['Modern', 'Tech', 'Confident'], type: [String] })
  tags: string[];

  @ApiProperty({ example: true })
  suitableForDisplay: boolean;

  @ApiProperty({ example: true })
  suitableForBody: boolean;
}

export class PaginatedFontsDto {
  @ApiProperty({ type: [FontItemDto] })
  items: FontItemDto[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}
