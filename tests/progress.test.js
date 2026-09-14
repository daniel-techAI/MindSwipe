import assert from 'node:assert/strict';
import test from 'node:test';
import { completeSession, createDefaultProgress, progressBackupKey, progressStorageKey, readProgress } from '../src/progress.js';

function memoryStorage(entries = {}) {
  const values = new Map(Object.entries(entries));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key)
  };
}

test('migrates V1 progress without destroying existing values', () => {
  const original = JSON.stringify({ tutorialSeen: true, onboarded: true, xp: 90, streak: 4, sessions: 3, saved: ['money-1'] });
  const storage = memoryStorage({ [progressStorageKey]: original });
  const progress = readProgress(storage);
  assert.equal(progress.schemaVersion, 2);
  assert.equal(progress.xp, 90);
  assert.equal(progress.learnSessions, 3);
  assert.deepEqual(progress.saved, ['money-1']);
  assert.equal(storage.getItem(progressBackupKey), original);
});

test('recovers corrupt progress while retaining a usable state', () => {
  const storage = memoryStorage({ [progressStorageKey]: '{broken' });
  const progress = readProgress(storage);
  assert.deepEqual(progress, createDefaultProgress());
  assert.doesNotThrow(() => JSON.parse(storage.getItem(progressStorageKey)));
});

test('shared streak increments only on consecutive calendar days', () => {
  const first = completeSession({ ...createDefaultProgress(), streak: 7, lastActive: '2026-08-10' }, { today: '2026-08-12', mode: 'explore' });
  assert.equal(first.progress.streak, 1);
  assert.equal(first.progress.exploreSessions, 1);
  const next = completeSession(first.progress, { today: '2026-08-13', mode: 'learn' });
  assert.equal(next.progress.streak, 2);
  assert.equal(next.progress.learnSessions, 1);
  const duplicate = completeSession(next.progress, { today: '2026-08-13', mode: 'explore' });
  assert.equal(duplicate.progress.streak, 2);
  assert.equal(duplicate.newStreak, false);
});
