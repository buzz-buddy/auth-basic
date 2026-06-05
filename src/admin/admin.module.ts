import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';
import { AdminController } from './admin.controller';
import { AdminSettingsService } from './admin-settings.service';
import { AdminUsersController } from './admin-users.controller';
import { AdminUsersService } from './admin-users.service';

@Module({
  imports: [UsersModule, MailModule, AuthModule],
  controllers: [AdminController, AdminUsersController],
  providers: [AdminSettingsService, AdminUsersService],
})
export class AdminModule {}
