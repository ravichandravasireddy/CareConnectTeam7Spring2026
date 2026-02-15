/**
 * E2E: Sign in as patient (Welcome → Sign In → Patient dashboard).
 */

const { credentials } = require('../../helpers/auth');

describe('Auth — Sign In (Patient)', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('opens sign-in from welcome and signs in as patient', async () => {
    await element(by.label('Sign in')).tap();
    await expect(element(by.text('Welcome Back'))).toBeVisible();
    await element(by.label('Email address')).tap();
    await element(by.label('Email address')).typeText(credentials.patient.email);
    await element(by.label('Password')).tap();
    await element(by.label('Password')).typeText(credentials.patient.password);
    await element(by.label('Sign in')).tap();
    await waitFor(element(by.text('Home')))
      .toBeVisible()
      .withTimeout(15000);
    await expect(element(by.text('Robert'))).toBeVisible();
  });
});
