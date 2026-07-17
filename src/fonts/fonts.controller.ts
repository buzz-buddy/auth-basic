import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ListFontsQueryDto } from './dto/list-fonts-query.dto';
import { PaginatedFontsDto } from './dto/paginated-fonts.dto';
import { FontsService } from './fonts.service';

@ApiTags('Fonts')
@ApiBearerAuth('access-token')
@Controller('fonts')
export class FontsController {
  constructor(private fontsService: FontsService) {}

  @Get()
  @ApiOperation({ summary: 'List curated fonts (paginated)' })
  @ApiResponse({ status: 200, type: PaginatedFontsDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  listFonts(@Query() query: ListFontsQueryDto) {
    return this.fontsService.listFonts(query);
  }
}
