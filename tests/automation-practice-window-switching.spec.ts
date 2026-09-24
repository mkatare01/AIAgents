import { test, expect } from '@playwright/test';

test.describe('Automation Practice Core Flows', () => {
  test('Window and tab switching', async ({ page, context }) => {
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/', { waitUntil: 'domcontentloaded' });

    // 1. Click Open Window.
    // Open Window/Open Tab both lead to qaclickacademy.com, a 3rd-party site that currently serves
    // a Cloudflare SSL error page. Wait only for DOM content, not full load, so a slow/broken
    // destination can't burn the whole test timeout - we're testing the switching mechanics here.
    const windowPromise = context.waitForEvent('page');
    await page.getByRole('button', { name: 'Open Window' }).click();
    const newWindow = await windowPromise;
    await newWindow.waitForLoadState('domcontentloaded');
    await expect(newWindow).not.toHaveURL('https://rahulshettyacademy.com/AutomationPractice/');

    // 2. Return focus to the original page and verify the Practice Page remains loaded.
    await expect(page).toHaveTitle('Practice Page');
    await expect(page.getByRole('heading', { name: 'Practice Page' })).toBeVisible();
    await newWindow.close();

    // 3. Click Open Tab from the tab example section.
    const tabPromise = context.waitForEvent('page');
    await page.getByRole('link', { name: 'Open Tab' }).click();
    const newTab = await tabPromise;
    await newTab.waitForLoadState('domcontentloaded');

    // 4. Verify the new tab loads successfully and can be closed.
    await expect(newTab).toHaveURL(/qaclickacademy|rahulshettyacademy/);
    await newTab.close();
    await expect(page.getByRole('heading', { name: 'Practice Page' })).toBeVisible();
  });
});