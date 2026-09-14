import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const pages = Object.fromEntries(['privacy', 'terms', 'support'].map((name) => [
  name,
  readFileSync(new URL(`../public/${name}.html`, import.meta.url), 'utf8')
]));

test('public policy and support pages are complete and mutually linked', () => {
  for (const [name, html] of Object.entries(pages)) {
    assert.match(html, /Daniel Laky/);
    assert.match(html, /daniellaky5\.c@gmail\.com/);
    assert.match(html, /\.\/privacy\.html/);
    assert.match(html, /\.\/terms\.html/);
    assert.match(html, /\.\/support\.html/);
    assert.match(html, /\.\/policy\.css/);
    assert.doesNotMatch(html, /OWNER DECISION REQUIRED|pre-release draft|monitored support email is required/i, `${name} contains a release placeholder`);
  }
});

test('privacy policy states the verified local-first trust boundary', () => {
  assert.match(pages.privacy, /No account/);
  assert.match(pages.privacy, /does not transmit it to a MindSwipe server/);
  assert.match(pages.privacy, /does not declare precise, approximate, foreground, or background location/);
  assert.match(pages.privacy, /Profile - Settings - Reset local progress/);
});

test('terms include travel limitations without excluding mandatory rights', () => {
  assert.match(pages.terms, /Travel information can become outdated/);
  assert.match(pages.terms, /Mandatory consumer protections/);
  assert.match(pages.terms, /Nothing excludes or limits liability where doing so would be unlawful/);
});
