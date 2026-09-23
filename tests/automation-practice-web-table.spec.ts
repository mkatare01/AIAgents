import { test, expect } from '@playwright/test';

test.describe('Automation Practice Core Flows', () => {
  test('Web table validation', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
    const table = page.getByRole('table').first();

    // 1. Examine the main Web Table Example and identify rows and columns.
    await expect(table.getByRole('columnheader', { name: 'Instructor' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Course' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Price' })).toBeVisible();
    await expect(table.getByRole('row')).toHaveCount(11);

    // 2. Find a known entry or record in the table and verify the expected text across columns.
    const sqlRow = table.getByRole('row').filter({ hasText: 'Learn SQL' });
    await expect(sqlRow).toContainText('Rahul Shetty');
    await expect(sqlRow).toContainText('25');

    // 3. Scroll or navigate within the table if needed to inspect more rows.
    await table.scrollIntoViewIfNeeded();
    await expect(table.getByRole('row').last()).toBeVisible();

    // 4. Check for broken or missing cells in a random row.
    const dataRows = table.getByRole('row').filter({ has: table.getByRole('cell') });
    for (let index = 0; index < await dataRows.count(); index++) {
      await expect(dataRows.nth(index).getByRole('cell')).toHaveCount(3);
    }
  });
});