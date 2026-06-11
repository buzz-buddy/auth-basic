import { Module, forwardRef } from '@nestjs/common';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { PersonasController } from './personas.controller';
import { PersonaResponseService } from './persona-response.service';
import { PersonaResponseValidator } from './persona-response-validator';
import { PersonaSchemaService } from './persona-schema.service';

@Module({
  imports: [forwardRef(() => WorkspacesModule)],
  controllers: [PersonasController],
  providers: [
    PersonaSchemaService,
    PersonaResponseService,
    PersonaResponseValidator,
  ],
  exports: [
    PersonaSchemaService,
    PersonaResponseService,
    PersonaResponseValidator,
  ],
})
export class PersonasModule {}
