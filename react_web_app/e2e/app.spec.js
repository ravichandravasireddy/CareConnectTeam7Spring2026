import { test, expect } from '@playwright/test';

test.describe('CareConnect Web App', () => {
  test('homepage loads and shows Caregiver Dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Caregiver Dashboard/i })).toBeVisible();
  });

  test('navigates to Patients page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Patients/i }).click();
    await expect(page).toHaveURL(/\/patients/);
    await expect(page.getByRole('heading', { name: /Patients/i })).toBeVisible();
  });

  test('navigates to Login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /Sign In/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /Email/i })).toBeVisible();
  });

  test('patient card links to patient details', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /View details for Margaret Johnson/i }).click();
    await expect(page).toHaveURL(/\/patient\/1/);
  });

  test('skip link exists with correct href for accessibility', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.getByRole('link', { name: /Skip to main content/i });
    await expect(skipLink).toBeAttached();
    await expect(skipLink).toHaveAttribute('href', '#main');
    await expect(page.getByRole('main')).toBeVisible();
  });
});
