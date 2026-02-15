/**
 * E2E: Invalid credentials show error and do not navigate to dashboard.
 */

describe('Auth — Invalid Credentials', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('shows error for invalid email/password and stays on sign-in', async () => {
    await element(by.label('Sign in')).tap();
    await expect(element(by.text('Welcome Back'))).toBeVisible();
    await element(by.label('Email address')).tap();
    await element(by.label('Email address')).typeText('invalid@example.com');
    await element(by.label('Password')).tap();
    await element(by.label('Password')).typeText('wrongpassword');
    await element(by.label('Sign in')).tap();
    // App shows Alert.alert('Sign In Failed', 'Invalid email or password...')
    await waitFor(element(by.text('Invalid email or password')))
      .toBeVisible()
      .withTimeout(10000);
    // Should not see dashboard
    await expect(element(by.text('Home'))).not.toBeVisible();
  });
});
