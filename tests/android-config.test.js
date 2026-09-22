import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const variables = readFileSync(new URL('../android/variables.gradle', import.meta.url), 'utf8');
const appGradle = readFileSync(new URL('../android/app/build.gradle', import.meta.url), 'utf8');
const manifest = readFileSync(new URL('../android/app/src/main/AndroidManifest.xml', import.meta.url), 'utf8');
const androidGitignore = readFileSync(new URL('../android/.gitignore', import.meta.url), 'utf8');
const releaseWorkflow = readFileSync(new URL('../.github/workflows/release-android.yml', import.meta.url), 'utf8');

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
  assert.match(androidGitignore, /^\*\.p12$/m);
  assert.match(androidGitignore, /^\*\.pfx$/m);
  assert.match(appGradle, /storeType 'PKCS12'/);
  assert.match(appGradle, /MINDSWIPE_KEYSTORE_PATH/);
  assert.match(appGradle, /MINDSWIPE_KEYSTORE_PASSWORD/);
  assert.match(appGradle, /MINDSWIPE_KEY_ALIAS/);
  assert.match(appGradle, /MINDSWIPE_KEY_PASSWORD/);
  assert.match(appGradle, /Release signing is not configured/);
  assert.doesNotMatch(appGradle, /storePassword\s+['"][^'"]+['"]/);
  assert.doesNotMatch(appGradle, /keyPassword\s+['"][^'"]+['"]/);
});

test('release workflow builds and verifies protected signed APK and AAB artifacts', () => {
  assert.match(releaseWorkflow, /MINDSWIPE_UPLOAD_KEYSTORE_B64/);
  assert.match(releaseWorkflow, /packages:\s*platform-tools/);
  assert.match(releaseWorkflow, /assembleRelease/);
  assert.match(releaseWorkflow, /bundleRelease/);
  assert.match(releaseWorkflow, /jarsigner -verify -strict -certs/);
  assert.match(releaseWorkflow, /apksigner.*verify/);
  assert.match(releaseWorkflow, /MindSwipe-v0\.2\.0-signed-release-apk/);
  assert.match(releaseWorkflow, /MindSwipe-v0\.2\.0-signed-release-aab/);
  assert.doesNotMatch(releaseWorkflow, /ACCESS_[A-Z_]*LOCATION/);
});
