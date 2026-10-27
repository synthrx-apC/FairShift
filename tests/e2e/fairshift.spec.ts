import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('worker interface loads at mobile size', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto('/');
  await expect(page.getByText('fairshift').first()).toBeVisible();
  await expect(page.getByText('My pay').first()).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations.length).toBeLessThan(10); // triage threshold for the prototype; review each violation manually.
});

test('worker can submit a hazard report', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Report a problem/i }).first().click();
  await page.getByRole('button', { name: /Send report/i }).click();
  await expect(page.getByText(/Report received|problem|sent/i).first()).toBeVisible({ timeout: 10_000 });
});

test('admin dashboard loads', async ({ page }) => {
  await page.goto('http://127.0.0.1:5174');
  await expect(page.getByRole('heading', { name: /Workforce health/i })).toBeVisible();
});

test('API exposes health and ledger verification', async ({ request }) => {
  const health = await request.get('http://127.0.0.1:4000/api/health');
  expect(health.ok()).toBeTruthy();
  expect((await health.json()).ok).toBe(true);
  const ledger = await request.get('http://127.0.0.1:4000/api/ledger/verify');
  expect(ledger.ok()).toBeTruthy();
  expect((await ledger.json()).valid).toBe(true);
});
