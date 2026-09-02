import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const readyProgress = {
  schemaVersion: 2,
  tutorialSeen: true,
  tutorialVersion: 1,
  v2IntroSeen: true,
  onboarded: true,
  interests: ['focus', 'money', 'science'],
  activePack: 'all'
};

async function seedReadyUser(page, overrides = {}) {
  await page.evaluate((value) => localStorage.setItem('mindSwipeProgress', JSON.stringify(value)), { ...readyProgress, ...overrides });
  await page.reload();
}

async function expectNoSeriousAxeViolations(page) {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')).toEqual([]);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('loads an accessible interactive first-run experience', async ({ page }) => {
  await expect(page).toHaveTitle('MindSwipe');
  await expect(page.getByRole('heading', { level: 1, name: /learn the app/i })).toBeVisible();
  await expectNoSeriousAxeViolations(page);

  await page.getByRole('button', { name: 'Swipe' }).click();
  await expect(page.getByText('Move the card, then let it fly.')).toBeVisible();
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

test('preserves the Learn session and non-gesture controls', async ({ page }) => {
  await seedReadyUser(page);

  await expect(page.getByRole('heading', { level: 1, name: 'MindSwipe' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => globalThis.scrollY)).toBe(0);
  await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
  await expectNoSeriousAxeViolations(page);

  await page.getByRole('button', { name: /start 3 useful cards/i }).click();
  await expect(page.getByRole('button', { name: /save/i })).toBeVisible();
  await page.getByRole('button', { name: /save/i }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[aria-label="Card 2 of 3"]')).toBeVisible();
});

test('filters the Netherlands pilot and completes a three-card Explore run', async ({ page }) => {
  await seedReadyUser(page);
  await page.getByRole('button', { name: 'Explore', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Amsterdam', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Utrecht', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Utrecht', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Architecture', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Architecture', exact: true })).toBeVisible();

  await page.getByRole('button', { name: /start 3-card explore/i }).click();
  await page.getByRole('button', { name: /done/i }).click();
  await expect(page.locator('[aria-label="Card 2 of 3"]')).toBeVisible();
  await page.getByRole('button', { name: /done/i }).click();
  await expect(page.locator('[aria-label="Card 3 of 3"]')).toBeVisible();
  await page.getByRole('button', { name: /done/i }).click();
  await expect(page.getByText('Explore complete')).toBeVisible();
  await expect(page.getByText('Destination explored')).toBeVisible();
});

test('saves a Travel card and exposes it through Saved filters', async ({ page }) => {
  await seedReadyUser(page);
  await page.getByRole('button', { name: 'Explore', exact: true }).click();
  await page.getByRole('button', { name: /start 3-card explore/i }).click();
  await page.getByRole('button', { name: /save/i }).click();
  await expect(page.locator('[aria-label="Card 2 of 3"]')).toBeVisible();
  await page.getByRole('button', { name: /skip/i }).click();
  await expect(page.locator('[aria-label="Card 3 of 3"]')).toBeVisible();
  await page.getByRole('button', { name: /done/i }).click();
  await expect(page.getByText('Explore complete')).toBeVisible();
  await page.getByRole('button', { name: 'Back to Explore' }).click();
  await page.getByRole('button', { name: 'Saved', exact: true }).click();
  await page.getByRole('button', { name: 'Travel', exact: true }).click();

  await expect(page.locator('.libraryList > button')).toHaveCount(1);
  await expect(page.locator('.libraryList > button').first()).toContainText('Explore');
});

test('creates, edits, and persists a local trip', async ({ page }) => {
  await seedReadyUser(page);
  await page.getByRole('button', { name: 'Saved', exact: true }).click();
  await page.getByRole('tab', { name: 'Trips' }).click();
  await page.getByLabel('Create a trip').fill('Netherlands test');
  await page.getByRole('button', { name: 'Create trip' }).click();

  await expect(page.getByLabel('Trip name')).toHaveValue('Netherlands test');
  await page.getByRole('button', { name: /add place to day 1/i }).click();
  await expect(page.locator('.tripStop')).toHaveCount(1);
  await page.getByLabel(/note for/i).fill('Walk here before lunch.');
  await page.reload();

  await expect(page.getByLabel('Trip name')).toHaveValue('Netherlands test');
  await expect(page.getByLabel(/note for/i)).toHaveValue('Walk here before lunch.');
});

test('honors reduced motion and keeps Explore accessible on mobile', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await seedReadyUser(page);
  const animationName = await page.locator('.bigStart').evaluate((node) => node.ownerDocument.defaultView.getComputedStyle(node).animationName);
  expect(animationName).toBe('none');
  await page.getByRole('button', { name: 'Explore', exact: true }).click();
  await expectNoSeriousAxeViolations(page);
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

test('publishes complete Privacy, Terms, and Support pages', async ({ request }) => {
  for (const pageName of ['privacy', 'terms', 'support']) {
    const response = await request.get(`./${pageName}.html`);
    expect(response.ok()).toBeTruthy();
    const body = await response.text();
    expect(body).toContain('Daniel Laky');
    expect(body).toContain('daniellaky5.c@gmail.com');
    expect(body).not.toMatch(/OWNER DECISION REQUIRED|pre-release draft/i);
  }
});
