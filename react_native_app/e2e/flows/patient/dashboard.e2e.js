/**
 * E2E: Patient dashboard after sign-in (Home, tasks, BP Today).
 */

const { signInAsPatient } = require('../../helpers/auth');

describe('Patient — Dashboard', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    await signInAsPatient();
  });

  it('shows patient dashboard with Home, tasks, and BP Today', async () => {
    await expect(element(by.text('Home'))).toBeVisible();
    await expect(element(by.text('Robert'))).toBeVisible();
    await expect(element(by.text('Tasks'))).toBeVisible();
    await expect(element(by.text('BP Today'))).toBeVisible();
    await expect(element(by.text('Upcoming Tasks'))).toBeVisible();
  });
});
