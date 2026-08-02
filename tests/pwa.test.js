import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createServiceWorkerSource, listBuildFiles, writeServiceWorker } from '../scripts/create-service-worker.mjs';
import { resolveServiceWorkerUrls } from '../src/pwa.js';

test('service worker URLs stay inside a GitHub project Pages path', () => {
  assert.deepEqual(resolveServiceWorkerUrls('./', 'https://daniel-techai.github.io/MindSwipe/'), {
    scope: '/MindSwipe/',
    serviceWorkerUrl: 'https://daniel-techai.github.io/MindSwipe/sw.js'
  });
});

test('build file listing is deterministic and excludes the generated worker', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'mindswipe-pwa-'));
  await mkdir(path.join(directory, 'assets'));
  await writeFile(path.join(directory, 'index.html'), 'app');
  await writeFile(path.join(directory, 'sw.js'), 'old worker');
  await writeFile(path.join(directory, 'assets', 'app.js'), 'bundle');

  assert.deepEqual(await listBuildFiles(directory), ['assets/app.js', 'index.html']);
});

test('generated worker precaches the build and uses an offline navigation fallback', () => {
  const source = createServiceWorkerSource(['assets/app.js', 'index.html'], 'abc123');
  assert.match(source, /mindswipe-abc123/);
  assert.match(source, /assets\/app\.js/);
  assert.match(source, /mode === 'navigate'/);
  assert.match(source, /caches\.match\(new URL\('index\.html'/);
});

test('worker output changes when build content changes', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'mindswipe-pwa-'));
  await writeFile(path.join(directory, 'index.html'), 'first');
  const first = await writeServiceWorker(directory);
  const firstSource = await readFile(path.join(directory, 'sw.js'), 'utf8');

  await writeFile(path.join(directory, 'index.html'), 'second');
  const second = await writeServiceWorker(directory);
  const secondSource = await readFile(path.join(directory, 'sw.js'), 'utf8');

  assert.notEqual(first.version, second.version);
  assert.notEqual(firstSource, secondSource);
});
