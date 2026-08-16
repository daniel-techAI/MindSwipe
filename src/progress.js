import { normalizeTrips } from './trips.js';

export const progressStorageKey = 'mindSwipeProgress';
export const progressBackupKey = 'mindSwipeProgressBackupV1';
export const corruptProgressBackupKey = 'mindSwipeProgressCorrupt';
export const progressSchemaVersion = 2;

const reminderModes = new Set(['off', 'in-app', 'background-flexible', 'background-exact']);

function stringArray(value) {
  return Array.isArray(value)
    ? value.filter((item) => typeof item === 'string' && item).filter((item, index, list) => list.indexOf(item) === index)
    : [];
}

function finiteNumber(value, fallback = 0) {
  return Number.isFinite(value) ? Math.max(0, value) : fallback;
}

export function createDefaultProgress() {
  return {
    schemaVersion: progressSchemaVersion,
    tutorialSeen: false,
    tutorialVersion: 0,
    v2IntroSeen: false,
    onboarded: false,
    interests: [],
    activePack: 'all',
    reminderTime: '20:30',
    quoteReminderTime: '12:00',
    quoteReminderEnabled: false,
    quoteReminderMode: 'off',
    quoteNotifiedToday: '',
    xp: 0,
    streak: 0,
    freezes: 1,
    completed: [],
    saved: [],
    savedPlaces: [],
    recent: [],
    sessions: 0,
    learnSessions: 0,
    exploreSessions: 0,
    minutesReplaced: 0,
    lastActive: '',
    savedToday: '',
    reviewedToday: '',
    lastMode: 'learn',
    lastDestinationId: 'city-amsterdam',
    travelCategory: 'Mixed',
    trips: []
  };
}

export function normalizeProgress(value) {
  const fallback = createDefaultProgress();
  const source = value && typeof value === 'object' ? value : {};
  const reminderMode = reminderModes.has(source.quoteReminderMode)
    ? source.quoteReminderMode
    : source.quoteReminderEnabled ? 'background-flexible' : 'off';
  const sessions = finiteNumber(source.sessions);
  return {
    ...fallback,
    tutorialSeen: Boolean(source.tutorialSeen),
    tutorialVersion: finiteNumber(source.tutorialVersion, source.tutorialSeen ? 1 : 0),
    v2IntroSeen: Boolean(source.v2IntroSeen),
    onboarded: Boolean(source.onboarded),
    interests: stringArray(source.interests),
    activePack: typeof source.activePack === 'string' ? source.activePack : fallback.activePack,
    reminderTime: typeof source.reminderTime === 'string' ? source.reminderTime : fallback.reminderTime,
    quoteReminderTime: typeof source.quoteReminderTime === 'string' ? source.quoteReminderTime : fallback.quoteReminderTime,
    quoteReminderEnabled: reminderMode !== 'off',
    quoteReminderMode: reminderMode,
    quoteNotifiedToday: typeof source.quoteNotifiedToday === 'string' ? source.quoteNotifiedToday : '',
    xp: finiteNumber(source.xp),
    streak: finiteNumber(source.streak),
    freezes: finiteNumber(source.freezes, 1),
    completed: stringArray(source.completed),
    saved: stringArray(source.saved),
    savedPlaces: stringArray(source.savedPlaces),
    recent: stringArray(source.recent).slice(0, 24),
    sessions,
    learnSessions: finiteNumber(source.learnSessions, sessions),
    exploreSessions: finiteNumber(source.exploreSessions),
    minutesReplaced: finiteNumber(source.minutesReplaced),
    lastActive: typeof source.lastActive === 'string' ? source.lastActive : '',
    savedToday: typeof source.savedToday === 'string' ? source.savedToday : '',
    reviewedToday: typeof source.reviewedToday === 'string' ? source.reviewedToday : '',
    lastMode: source.lastMode === 'explore' ? 'explore' : 'learn',
    lastDestinationId: typeof source.lastDestinationId === 'string' ? source.lastDestinationId : fallback.lastDestinationId,
    travelCategory: typeof source.travelCategory === 'string' ? source.travelCategory : fallback.travelCategory,
    trips: normalizeTrips(source.trips),
    schemaVersion: progressSchemaVersion
  };
}

export function readProgress(storage = globalThis.localStorage) {
  const raw = storage?.getItem(progressStorageKey);
  if (!raw) return createDefaultProgress();
  try {
    const parsed = JSON.parse(raw);
    const normalized = normalizeProgress(parsed);
    if (parsed.schemaVersion !== progressSchemaVersion) {
      if (!storage.getItem(progressBackupKey)) storage.setItem(progressBackupKey, raw);
      storage.setItem(progressStorageKey, JSON.stringify(normalized));
    }
    return normalized;
  } catch {
    if (!storage.getItem(corruptProgressBackupKey)) storage.setItem(corruptProgressBackupKey, raw);
    const fallback = createDefaultProgress();
    storage.setItem(progressStorageKey, JSON.stringify(fallback));
    return fallback;
  }
}

export function saveProgress(value, storage = globalThis.localStorage) {
  const normalized = normalizeProgress(value);
  storage?.setItem(progressStorageKey, JSON.stringify(normalized));
  return normalized;
}

function previousDateKey(today) {
  const [year, month, day] = today.split('-').map(Number);
  const value = new Date(year, month - 1, day, 12);
  value.setDate(value.getDate() - 1);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
}

export function completeSession(progress, { today, mode }) {
  const current = normalizeProgress(progress);
  const alreadyActive = current.lastActive === today;
  const consecutive = current.lastActive === previousDateKey(today);
  const streak = alreadyActive ? current.streak : consecutive ? current.streak + 1 : 1;
  return {
    progress: {
      ...current,
      lastActive: today,
      lastMode: mode,
      streak,
      sessions: current.sessions + 1,
      learnSessions: current.learnSessions + (mode === 'learn' ? 1 : 0),
      exploreSessions: current.exploreSessions + (mode === 'explore' ? 1 : 0),
      minutesReplaced: current.minutesReplaced + 3
    },
    newStreak: !alreadyActive
  };
}
