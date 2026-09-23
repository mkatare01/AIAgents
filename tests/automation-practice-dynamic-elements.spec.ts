import { test, expect } from '@playwright/test';

test.describe('Automation Practice Core Flows', () => {
  test('Dynamic hide/show and total amount checks', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
    const input = page.getByRole('textbox', { name: 'Hide/Show Example' });

    // 1. In the Hide/Show Example, type text in the input and click Hide.
    await input.fill('Persistent value');
    await page.getByRole('button', { name: 'Hide' }).click();
    await expect(input).toBeHidden();

    // 2. Click Show.
    await page.getByRole('button', { name: 'Show' }).click();
    await expect(input).toBeVisible();
    await expect(input).toHaveValue('Persistent value');

    // 3. Review the Web Table Fixed header section and note the displayed total amount.
    await expect(page.getByText('Total Amount Collected: 296')).toBeVisible();

    // 4. Compare the displayed total with the table values.
    const amounts = await page.locator('table').nth(1).locator('tbody tr').evaluateAll(rows => rows.map(row => Number(row.cells[3]?.textContent?.trim())));
    expect(amounts.reduce((sum, amount) => sum + amount, 0)).toBe(296);
  });
});