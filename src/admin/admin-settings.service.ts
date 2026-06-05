import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

export type SystemSettings = {
  maintenanceMode: boolean;
  allowRegistration: boolean;
};

const DEFAULT_SETTINGS: SystemSettings = {
  maintenanceMode: false,
  allowRegistration: true,
};

@Injectable()
export class AdminSettingsService {
  private settings: SystemSettings = { ...DEFAULT_SETTINGS };

  getSettings(): SystemSettings & { appVersion: string } {
    return {
      ...this.settings,
      appVersion: this.readAppVersion(),
    };
  }

  updateSettings(partial: Partial<SystemSettings>): SystemSettings & {
    appVersion: string;
  } {
    this.settings = { ...this.settings, ...partial };
    return this.getSettings();
  }

  private readAppVersion(): string {
    try {
      const pkgPath = join(process.cwd(), 'package.json');
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as {
        version?: string;
      };
      return pkg.version ?? '0.0.0';
    } catch {
      return '0.0.0';
    }
  }
}
