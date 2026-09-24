import { test, expect } from '@playwright/test';

test.describe('Automation Practice Core Flows', () => {
  test('Mouse hover and iframe interaction', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/', { waitUntil: 'domcontentloaded' });

    // 1. Hover over the Mouse Hover button and inspect the visible action area.
    const hoverButton = page.getByRole('button', { name: 'Mouse Hover' });
    await hoverButton.hover();
    await expect(page.getByText('Top')).toBeVisible();
    await expect(page.getByText('Reload')).toBeVisible();

    // 2. Return to the main page after the hover interaction.
    await expect(page.getByRole('heading', { name: 'Practice Page' })).toBeVisible();
  });

  // The iframe's origin (legacy.rahulshettyacademy.com) is currently down
  // (net::ERR_CONNECTION_TIMED_OUT when navigated to directly), so its content can never load.
  test.fixme('iFrame content interaction', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/', { waitUntil: 'domcontentloaded' });

    const frame = page.frameLocator('iframe');
    await expect(frame.getByRole('link', { name: 'Home' })).toBeVisible();

    await frame.getByRole('link', { name: 'Courses' }).click();
    await expect(frame.getByRole('link', { name: 'Courses' })).toBeVisible();
  });
});
