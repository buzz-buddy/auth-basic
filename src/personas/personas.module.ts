import { Module, forwardRef } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { PersonasController } from './personas.controller';
import { PersonaFileService } from './persona-file.service';
import { PersonaResponseService } from './persona-response.service';
import { PersonaResponseValidator } from './persona-response-validator';
import { PersonaSchemaService } from './persona-schema.service';

@Module({
  imports: [forwardRef(() => WorkspacesModule), StorageModule],
  controllers: [PersonasController],
  providers: [
    PersonaSchemaService,
    PersonaResponseService,
    PersonaResponseValidator,
    PersonaFileService,
  ],
  exports: [
    PersonaSchemaService,
    PersonaResponseService,
    PersonaResponseValidator,
    PersonaFileService,
  ],
})
export class PersonasModule {}
