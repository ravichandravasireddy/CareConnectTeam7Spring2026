/**
 * E2E: Sign in as caregiver (Welcome → Sign In → Caregiver dashboard).
 */

const { credentials } = require('../../helpers/auth');

describe('Auth — Sign In (Caregiver)', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('opens sign-in from welcome and signs in as caregiver', async () => {
    await element(by.label('Sign in')).tap();
    await expect(element(by.text('Welcome Back'))).toBeVisible();
    await element(by.label('Email address')).tap();
    await element(by.label('Email address')).typeText(credentials.caregiver.email);
    await element(by.label('Password')).tap();
    await element(by.label('Password')).typeText(credentials.caregiver.password);
    await element(by.label('Sign in')).tap();
    await waitFor(element(by.text('Patients')))
      .toBeVisible()
      .withTimeout(15000);
    await expect(element(by.text('Tasks'))).toBeVisible();
    await expect(element(by.text('Alerts'))).toBeVisible();
  });
});
