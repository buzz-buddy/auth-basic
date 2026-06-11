import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { PersonasModule } from '../personas/personas.module';
import { UsersModule } from '../users/users.module';
import { AdminController } from './admin.controller';
import { AdminPersonaController } from './admin-persona.controller';
import { AdminPersonaService } from './admin-persona.service';
import { AdminSettingsService } from './admin-settings.service';
import { AdminUsersController } from './admin-users.controller';
import { AdminUsersService } from './admin-users.service';

@Module({
  imports: [UsersModule, MailModule, AuthModule, PersonasModule],
  controllers: [AdminController, AdminUsersController, AdminPersonaController],
  providers: [AdminSettingsService, AdminUsersService, AdminPersonaService],
})
export class AdminModule {}
