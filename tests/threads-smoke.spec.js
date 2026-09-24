const { test, expect } = require('@playwright/test');

test('Threads of Fortune Giza vertical slice core loop', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  await expect(page.getByRole('button', { name: 'PLAY OPENING' })).toBeVisible();

  await page.getByRole('button', { name: 'PLAY OPENING' }).click();
  await expect(page.getByRole('button', { name: 'Skip' })).toBeVisible();
  await page.getByRole('button', { name: 'Skip' }).click();

  await expect(page.getByRole('button', { name: 'BEGIN DAY ONE' })).toBeVisible();
  await page.getByRole('button', { name: 'BEGIN DAY ONE' }).click();

  await expect(page.getByText('Start with the buyer, not the rug. Ask about the room.')).toBeVisible();
  await page.getByRole('button', { name: /Ask about room/i }).click();
  await expect(page.getByText(/choose a rug/i)).toBeVisible();

  await page.getByRole('button', { name: /Desert Star/i }).click();
  await expect(page.getByText(/Inspect the rug/i)).toBeVisible();
  await page.getByRole('button', { name: /Inspect/i }).first().click();
  await expect(page.getByRole('button', { name: /Simulated reverse/i })).toBeVisible();
  await page.getByRole('button', { name: '×' }).click();

  await page.getByRole('button', { name: /Tell its story/i }).click();
  await expect(page.getByText(/Negotiate without/i)).toBeVisible();
  await page.getByRole('button', { name: /Ask 112 pt/i }).click();

  await expect(page.getByText('232')).toBeVisible({ timeout: 3000 });
  await expect(page.getByText(/Next customer/i)).toBeVisible();

  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.getByText('Samira')).toBeVisible();
  await expect(page.getByText(/The Desert Star worked beautifully/i)).toBeVisible();

  await page.getByRole('button', { name: /Rashid/i }).click();
  await expect(page.getByText('Uncle Rashid')).toBeVisible();
  const cedar = page.locator('.supplier-item').filter({ hasText: 'Cedar Caravan' });
  await expect(cedar).toBeVisible();
  await cedar.getByRole('button', { name: /Buy/i }).click();

  await page.getByRole('button', { name: /Inventory/i }).click();
  const invCedar = page.locator('.inv').filter({ hasText: 'Cedar Caravan' });
  await expect(invCedar).toBeVisible();
  await invCedar.getByRole('button', { name: /Restore/i }).click();
  await expect(invCedar).toContainText('Restored');

  await page.getByRole('button', { name: /Rashid/i }).click();
  await page.getByRole('button', { name: /End Day/i }).click();
  await page.getByRole('button', { name: /Back/i }).click();
  await expect(page.getByText(/Day 2/)).toBeVisible();
});
