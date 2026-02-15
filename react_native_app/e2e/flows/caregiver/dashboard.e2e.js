/**
 * E2E: Caregiver dashboard after sign-in (Patients, Tasks, Alerts).
 */

const { signInAsCaregiver } = require('../../helpers/auth');

describe('Caregiver — Dashboard', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    await signInAsCaregiver();
  });

  it('shows caregiver dashboard with Patients, Tasks, Alerts', async () => {
    await expect(element(by.text('Dashboard'))).toBeVisible();
    await expect(element(by.text('Patients'))).toBeVisible();
    await expect(element(by.text('Tasks'))).toBeVisible();
    await expect(element(by.text('Alerts'))).toBeVisible();
  });
});
