import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Public } from './auth/decorators/public.decorator';
import { AppService } from './app.service';

/** Hidden from Swagger until re-enabled — remove `@ApiExcludeController()` to document again. */
@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  // @ApiOperation({ summary: 'Health / hello', description: 'Returns a simple "Hello World!" message.' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('protected')
  // @ApiBearerAuth('access-token')
  // @ApiOperation({ summary: 'Test JWT-protected route', description: 'Returns a simple "You are authenticated" message.' })
  getProtected() {
    return { message: 'You are authenticated' };
  }
}
