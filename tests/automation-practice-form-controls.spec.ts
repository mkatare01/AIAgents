import { test, expect } from '@playwright/test';

test.describe('Automation Practice Core Flows', () => {
  test('Form controls and selection state', async ({ page }) => {
    // 1. Load the Practice Page in a fresh browser session.
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
    await expect(page).toHaveTitle('Practice Page');
    await expect(page.getByRole('heading', { name: 'Practice Page' })).toBeVisible();

    // 2. Select a radio option such as Radio2.
    // The label's `for` attribute doesn't match its input's id on this page, so clicking the
    // label text no longer checks the input - click the radio input directly instead.
    await page.locator('input[type="radio"]').nth(1).check();
    await expect(page.locator('input[type="radio"]').nth(1)).toBeChecked();

    // 3. Type a country name like 'Ind' in the suggestion box.
    // 'Ind' now also matches "British Indian Ocean Territory" and "Indonesia", so filter for an
    // exact match rather than a substring to avoid a strict-mode violation on multiple suggestions.
    await page.getByRole('textbox', { name: 'Type to Select Countries' }).fill('Ind');
    const indiaSuggestion = page.locator('.ui-menu-item').filter({ hasText: /^India$/ });
    await expect(indiaSuggestion).toBeVisible();
    await indiaSuggestion.click();
    await expect(page.getByRole('textbox', { name: 'Type to Select Countries' })).toHaveValue('India');

    // 4. Choose an option from the dropdown list, such as Option2.
    await page.getByRole('combobox').selectOption({ label: 'Option2' });
    await expect(page.getByRole('combobox')).toHaveValue('option2');

    // 5. Select multiple checkboxes such as Option1 and Option3.
    // Same broken label association as the radio buttons above - check the inputs directly.
    await page.locator('input[type="checkbox"]').nth(0).check();
    await page.locator('input[type="checkbox"]').nth(2).check();
    await expect(page.locator('input[type="checkbox"]').nth(0)).toBeChecked();
    await expect(page.locator('input[type="checkbox"]').nth(2)).toBeChecked();
  });
});