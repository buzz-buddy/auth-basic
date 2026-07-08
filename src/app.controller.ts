import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Public } from './auth/decorators/public.decorator';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

/** Hidden from Swagger until re-enabled — remove `@ApiExcludeController()` to document again. */
@ApiExcludeController()
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Public()
  @Get()
  // @ApiOperation({ summary: 'Health / hello', description: 'Returns a simple "Hello World!" message.' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('health')
  async getHealth(): Promise<{ status: string }> {
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: 'ok' };
  }

  @Get('protected')
  // @ApiBearerAuth('access-token')
  // @ApiOperation({ summary: 'Test JWT-protected route', description: 'Returns a simple "You are authenticated" message.' })
  getProtected() {
    return { message: 'You are authenticated' };
  }
}
