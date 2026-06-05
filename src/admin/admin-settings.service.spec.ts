import { AdminSettingsService } from './admin-settings.service';

describe('AdminSettingsService', () => {
  let service: AdminSettingsService;

  beforeEach(() => {
    service = new AdminSettingsService();
  });

  it('returns default settings with appVersion', () => {
    const settings = service.getSettings();
    expect(settings.maintenanceMode).toBe(false);
    expect(settings.allowRegistration).toBe(true);
    expect(settings.appVersion).toBeDefined();
  });

  it('updates partial settings', () => {
    const updated = service.updateSettings({ maintenanceMode: true });
    expect(updated.maintenanceMode).toBe(true);
    expect(updated.allowRegistration).toBe(true);
  });
});
