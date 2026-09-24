import { test, expect, type Page } from '@playwright/test';

function expectDialog(page: Page, type: 'alert' | 'confirm', action: 'accept' | 'dismiss', message?: string) {
  return new Promise<void>(resolve => {
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe(type);
      if (message) expect(dialog.message()).toContain(message);
      await dialog[action]();
      resolve();
    });
  });
}

test.describe('Automation Practice Core Flows', () => {
  test('Alert and confirmation dialog handling', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/', { waitUntil: 'domcontentloaded' });
    const nameInput = page.getByRole('textbox', { name: 'Enter Your Name' });

    // 1. Enter a customer name, click Alert, and accept the alert.
    await nameInput.fill('Test Customer');
    await Promise.all([
      expectDialog(page, 'alert', 'accept', 'Test Customer'),
      page.getByRole('button', { name: 'Alert' }).click(),
    ]);
    await expect(nameInput).toBeVisible();

    // 2. Click Confirm and choose Cancel.
    await Promise.all([
      expectDialog(page, 'confirm', 'dismiss'),
      page.getByRole('button', { name: 'Confirm' }).click(),
    ]);

    // 3. Click Confirm again and accept it.
    await Promise.all([
      expectDialog(page, 'confirm', 'accept'),
      page.getByRole('button', { name: 'Confirm' }).click(),
    ]);
    await expect(page).toHaveTitle('Practice Page');
  });
});
