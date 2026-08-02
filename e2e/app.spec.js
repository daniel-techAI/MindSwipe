import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('loads an accessible first-run experience', async ({ page }) => {
  await expect(page).toHaveTitle('MindSwipe');
  await expect(page.getByRole('heading', { level: 1, name: /learn the app/i })).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  const seriousViolations = results.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical');
  expect(seriousViolations).toEqual([]);
});

test('supports keyboard navigation and registers its offline worker', async ({ page }) => {
  const skipLink = page.getByRole('link', { name: 'Skip to main content' });
  await skipLink.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();

  await page.locator('.tutorialStartOrb').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Move the card, then let it fly.')).toBeVisible();

  const scope = await page.evaluate(async () => (await navigator.serviceWorker.ready).scope);
  expect(scope).toBe(new URL('./', page.url()).href);
});

test('keeps the home and card flows usable without swipe gestures', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('mindSwipeProgress', JSON.stringify({
      tutorialSeen: true,
      onboarded: true,
      interests: ['focus', 'money'],
      activePack: 'all'
    }));
  });
  await page.reload();

  await expect(page.getByRole('heading', { level: 1, name: 'MindSwipe' })).toBeVisible();
  await expect(page.getByRole('heading', { name: /use mindswipe like an app/i })).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')).toEqual([]);

  await page.getByRole('button', { name: /start a new swipe/i }).click();
  await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
  await page.getByRole('button', { name: 'Save' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[aria-label="Card 2 of 3"]')).toBeVisible();
});

test('ships a project-path-safe install manifest', async ({ request }) => {
  const response = await request.get('./manifest.webmanifest');
  expect(response.ok()).toBeTruthy();
  const manifest = await response.json();
  expect(manifest.start_url).toBe('./');
  expect(manifest.scope).toBe('./');
  expect(manifest.icons).toEqual(expect.arrayContaining([
    expect.objectContaining({ sizes: '192x192', type: 'image/png' }),
    expect.objectContaining({ sizes: '512x512', type: 'image/png', purpose: 'maskable' })
  ]));
});
