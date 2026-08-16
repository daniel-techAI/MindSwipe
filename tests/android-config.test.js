import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const variables = readFileSync(new URL('../android/variables.gradle', import.meta.url), 'utf8');
const appGradle = readFileSync(new URL('../android/app/build.gradle', import.meta.url), 'utf8');
const manifest = readFileSync(new URL('../android/app/src/main/AndroidManifest.xml', import.meta.url), 'utf8');
const androidGitignore = readFileSync(new URL('../android/.gitignore', import.meta.url), 'utf8');

test('Android wrapper targets API 36 with V2 release numbering', () => {
  assert.match(variables, /compileSdkVersion\s*=\s*36/);
  assert.match(variables, /targetSdkVersion\s*=\s*36/);
  assert.match(appGradle, /versionCode\s+2/);
  assert.match(appGradle, /versionName\s+"0\.2\.0"/);
});

test('Android trust boundary contains notifications but no location access', () => {
  assert.match(manifest, /android\.permission\.INTERNET/);
  assert.match(manifest, /android\.permission\.POST_NOTIFICATIONS/);
  assert.match(manifest, /android\.permission\.SCHEDULE_EXACT_ALARM/);
  assert.doesNotMatch(manifest, /android\.permission\.[A-Z_]*LOCATION/);
  assert.match(manifest, /android:allowBackup="false"/);
  assert.match(manifest, /android:usesCleartextTraffic="false"/);
});

test('Android signing credentials are excluded from version control', () => {
  assert.match(androidGitignore, /^\*\.jks$/m);
  assert.match(androidGitignore, /^\*\.keystore$/m);
});
