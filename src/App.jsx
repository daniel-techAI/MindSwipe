import React, { useEffect, useMemo, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { createRoot } from 'react-dom/client';
import { dailyQuotes, extraActionMoves, extraLessons, packOptions } from './content.js';
import { famousQuotes } from './quoteBank.js';
import './styles.css';
import './packs.css';
import './app-shell.css';

const quoteNotificationBaseId = 43000;
const quoteTestNotificationId = 43999;
const quoteScheduleDays = 30;
const quoteChannelId = 'mindswipe-daily-quote';
const sessionSize = 3;

const baseLessons = [
  {
    id: 'money-1',
    area: 'Money',
    mood: 'Money ideas',
    title: 'Revenue is not profit',
    hook: 'Money coming in means nothing if it leaves faster.',
    body: 'Profit is what stays after costs, fees, refunds, food, travel, and mistakes. If the math is ugly, fix the leak before chasing bigger dreams.'
  },
  {
    id: 'money-2',
    area: 'Money',
    mood: 'Money ideas',
    title: 'Cash flow beats vibes',
    hook: 'A plan is only real when the dates work.',
    body: 'Track when money enters, when bills hit, and how long you can survive between both. Panic gets quieter when the numbers are on paper.'
  },
  {
    id: 'mind-1',
    area: 'Mind',
    mood: 'Stressed',
    title: 'Nobody is watching that hard',
    hook: 'You think people notice everything. They do not.',
    body: 'Most people are busy with themselves. That means you can ask, post, apply, message, and recover faster than your fear says.'
  },
  {
    id: 'habit-1',
    area: 'Habits',
    mood: 'Need focus',
    title: 'Never miss twice',
    hook: 'One bad day is normal. Two becomes a pattern.',
    body: 'A habit survives one miss. The danger is letting shame turn one miss into quitting. Restart tiny and keep the identity alive.'
  },
  {
    id: 'strategy-1',
    area: 'Strategy',
    mood: 'Need focus',
    title: 'One constraint clarifies',
    hook: 'Limits make decisions cleaner.',
    body: 'A tiny budget, one feature, or a 20-minute timer turns vague ambition into a real choice. Give the next move a limit.'
  },
  {
    id: 'health-1',
    area: 'Health',
    mood: 'Stressed',
    title: 'Sleep debt is expensive',
    hook: 'Bad sleep taxes every decision tomorrow.',
    body: 'Low sleep hits focus, mood, impulse control, and learning. If life is heavy, recovery is not soft. It is maintenance.'
  },
  {
    id: 'people-1',
    area: 'People',
    mood: 'Bored',
    title: 'Ask one better question',
    hook: 'Better questions save dead conversations.',
    body: 'Replace how are you with what are you trying to fix this week? Specific curiosity gives people something real to answer.'
  }
];

const baseActionMoves = {
  'money-1': 'Write money in minus real costs. Pick one leak to cut today.',
  'money-2': 'Write three dates: paid when, bills when, survive how long.',
  'mind-1': 'Send one useful message you have been avoiding.',
  'habit-1': 'If you missed yesterday, make today stupid small. Two minutes counts.',
  'strategy-1': 'Put a hard limit on the next move: 20 minutes, no spending, one result.',
  'health-1': 'Pick tonights sleep target now and protect the first 30 minutes before bed.',
  'people-1': 'Ask one specific question today instead of sending dead small talk.'
};

const broadInterests = [
  { id: 'mindset', label: 'Mindset', detail: 'stress, confidence, emotions', areas: ['Mind'], moods: ['Stressed'], packs: ['starter', 'confidence', 'work'] },
  { id: 'focus', label: 'Focus', detail: 'phone loops, attention, habits', areas: ['Habits', 'Strategy'], moods: ['Need focus', 'Bored'], packs: ['focus', 'discipline'] },
  { id: 'money', label: 'Money & work', detail: 'cash, jobs, income basics', areas: ['Money', 'Strategy'], moods: ['Money ideas'], packs: ['comeback', 'income', 'work'] },
  { id: 'health', label: 'Health', detail: 'sleep, energy, recovery', areas: ['Health'], moods: ['Stressed', 'Need focus'], packs: ['work', 'starter'] },
  { id: 'people', label: 'People', detail: 'social confidence, talking', areas: ['People'], moods: ['Bored', 'Stressed'], packs: ['confidence', 'starter'] },
  { id: 'learning', label: 'Learning', detail: 'skills, discipline, growth', areas: ['Learning', 'Habits'], moods: ['Need focus'], packs: ['discipline', 'income'] },
  { id: 'life', label: 'Life skills', detail: 'decisions, routines, resets', areas: ['Life', 'Strategy', 'Mind'], moods: ['Need focus', 'Stressed'], packs: ['starter', 'comeback'] },
  { id: 'relationships', label: 'Relationships', detail: 'communication, boundaries', areas: ['People', 'Mind'], moods: ['Stressed', 'Bored'], packs: ['confidence', 'starter'] }
];

const moodOptions = [
  { label: 'Bored', detail: 'break the scroll' },
  { label: 'Stressed', detail: 'calm then act' },
  { label: 'Need focus', detail: 'one useful rep' },
  { label: 'Money ideas', detail: 'find options' }
];

const reminderPresets = [
  { label: 'Morning', time: '08:30' },
  { label: 'Midday', time: '12:00' },
  { label: 'Evening', time: '18:30' },
  { label: 'Night', time: '21:30' }
];

const pages = ['Home', 'Quote', 'History', 'Profile', 'Settings'];
const allLessons = [...baseLessons, ...extraLessons];
const allActionMoves = { ...baseActionMoves, ...extraActionMoves };
const allQuotes = [...dailyQuotes, ...famousQuotes];

function todayKey() {
  return dateKey(new Date());
}

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getMove(lesson) {
  return allActionMoves[lesson.id] || 'Use the idea once today, then keep moving.';
}

function normalizeInterestIds(value = []) {
  const map = {
    Money: 'money',
    Strategy: 'life',
    Mind: 'mindset',
    Habits: 'focus',
    Health: 'health',
    People: 'people'
  };
  return value
    .map((item) => (broadInterests.some((interest) => interest.id === item) ? item : map[item]))
    .filter(Boolean)
    .filter((item, index, list) => list.indexOf(item) === index);
}

function getInterestProfile(ids) {
  const chosen = broadInterests.filter((interest) => ids.includes(interest.id));
  const source = chosen.length ? chosen : broadInterests;
  return {
    areas: source.flatMap((interest) => interest.areas),
    moods: source.flatMap((interest) => interest.moods),
    packs: source.flatMap((interest) => interest.packs)
  };
}

function getDailyQuote(day, mood, activePack, interestIds) {
  const profile = getInterestProfile(interestIds);
  const pool = allQuotes.filter((quote) => {
    const moodMatch = quote.moods.includes(mood) || profile.moods.some((item) => quote.moods.includes(item));
    const packMatch = quote.pack === activePack || profile.packs.includes(quote.pack);
    const areaMatch = quote.areas.some((area) => profile.areas.includes(area));
    return moodMatch || packMatch || areaMatch;
  });
  const usable = pool.length ? pool : allQuotes;
  const seedText = `${day}-${mood}-${activePack}-${interestIds.join('-')}`;
  const seed = seedText.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return usable[seed % usable.length];
}

function getNextReminderDate(time, offsetDays = 0) {
  const [hourValue, minuteValue] = time.split(':').map(Number);
  const now = new Date();
  const target = new Date(now);
  target.setHours(Number.isFinite(hourValue) ? hourValue : 12, Number.isFinite(minuteValue) ? minuteValue : 0, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  target.setDate(target.getDate() + offsetDays);
  return target;
}

function quoteNotificationIds() {
  return Array.from({ length: quoteScheduleDays }, (_, index) => ({ id: quoteNotificationBaseId + index }));
}

async function ensureNativeNotificationPermission() {
  const current = await LocalNotifications.checkPermissions();
  if (current.display === 'granted') return true;
  const requested = await LocalNotifications.requestPermissions();
  return requested.display === 'granted';
}

async function prepareNativeQuoteChannel() {
  try {
    await LocalNotifications.createChannel({
      id: quoteChannelId,
      name: 'MindSwipe Daily Quote',
      description: 'Daily quote reminders from MindSwipe',
      importance: 4
    });
  } catch {
    // Android-only channel setup.
  }
}

async function cancelNativeQuoteReminders() {
  if (!Capacitor.isNativePlatform()) return;
  await LocalNotifications.cancel({ notifications: [...quoteNotificationIds(), { id: quoteTestNotificationId }] });
}

async function scheduleNativeQuoteReminders({ time, mood, activePack, interestIds }) {
  if (!Capacitor.isNativePlatform()) return { scheduled: false, message: 'Browser reminders only work while the app is open.' };
  const allowed = await ensureNativeNotificationPermission();
  if (!allowed) return { scheduled: false, message: 'Notification permission was not granted.' };

  await prepareNativeQuoteChannel();
  await cancelNativeQuoteReminders();

  const notifications = Array.from({ length: quoteScheduleDays }, (_, index) => {
    const at = getNextReminderDate(time, index);
    const quote = getDailyQuote(dateKey(at), mood, activePack, interestIds);
    const body = quote.source ? `${quote.text} - ${quote.source}` : quote.text;
    return {
      id: quoteNotificationBaseId + index,
      title: 'MindSwipe daily quote',
      body,
      largeBody: `${body}\n\n${quote.action}`,
      summaryText: 'Daily quote reminder',
      channelId: quoteChannelId,
      autoCancel: true,
      schedule: { at, allowWhileIdle: true },
      extra: { type: 'dailyQuote', quoteId: quote.id }
    };
  });

  await LocalNotifications.schedule({ notifications });
  return { scheduled: true, message: `Daily reminders active at ${time}.` };
}

async function scheduleNativeTestQuote(quote) {
  if (!Capacitor.isNativePlatform()) return false;
  const allowed = await ensureNativeNotificationPermission();
  if (!allowed) return false;
  await prepareNativeQuoteChannel();
  await LocalNotifications.cancel({ notifications: [{ id: quoteTestNotificationId }] });
  const body = quote.source ? `${quote.text} - ${quote.source}` : quote.text;
  await LocalNotifications.schedule({
    notifications: [
      {
        id: quoteTestNotificationId,
        title: 'MindSwipe test quote',
        body,
        largeBody: `${body}\n\n${quote.action}`,
        summaryText: 'Test reminder',
        channelId: quoteChannelId,
        autoCancel: true,
        schedule: { at: new Date(Date.now() + 5000), allowWhileIdle: true },
        extra: { type: 'testQuote', quoteId: quote.id }
      }
    ]
  });
  return true;
}

function readProgress() {
  const fallback = {
    onboarded: false,
    interests: [],
    activePack: 'all',
    reminderTime: '20:30',
    quoteReminderTime: '12:00',
    quoteReminderEnabled: false,
    quoteNotifiedToday: '',
    xp: 0,
    streak: 0,
    freezes: 1,
    completed: [],
    saved: [],
    recent: [],
    sessions: 0,
    minutesReplaced: 0,
    lastActive: '',
    savedToday: '',
    reviewedToday: ''
  };

  try {
    const saved = JSON.parse(localStorage.getItem('mindSwipeProgress'));
    if (!saved) return fallback;
    return { ...fallback, ...saved, interests: normalizeInterestIds(saved.interests || []) };
  } catch {
    return fallback;
  }
}

function saveProgress(progress) {
  localStorage.setItem('mindSwipeProgress', JSON.stringify(progress));
}

function App() {
  const [progress, setProgress] = useState(readProgress);
  const [screen, setScreen] = useState(progress.onboarded ? 'home' : 'onboarding');
  const [activePage, setActivePage] = useState('Home');
  const [selectedInterests, setSelectedInterests] = useState(progress.onboarded ? normalizeInterestIds(progress.interests) : []);
  const [activeMood, setActiveMood] = useState('Need focus');
  const [activePack, setActivePack] = useState(progress.activePack || 'all');
  const [quoteReminderTime, setQuoteReminderTime] = useState(progress.quoteReminderTime || '12:00');
  const [quoteMessage, setQuoteMessage] = useState('');
  const [quoteToast, setQuoteToast] = useState(null);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  function commit(next) {
    setProgress(next);
    saveProgress(next);
  }

  const today = todayKey();
  const interestKey = selectedInterests.join('|');
  const dailyQuote = useMemo(() => getDailyQuote(today, activeMood, activePack, selectedInterests), [today, activeMood, activePack, interestKey]);
  const yesterdayQuote = useMemo(() => getDailyQuote(dateKey(addDays(new Date(), -1)), activeMood, activePack, selectedInterests), [activeMood, activePack, interestKey]);

  const nextSession = useMemo(() => {
    const profile = getInterestProfile(selectedInterests);
    const scored = allLessons
      .map((lesson) => {
        let score = 0;
        if (profile.areas.includes(lesson.area)) score += 3;
        if (profile.moods.includes(lesson.mood)) score += 2;
        if (profile.packs.includes(lesson.pack)) score += 2;
        if (lesson.mood === activeMood) score += 3;
        if (lesson.pack === activePack) score += 2;
        if (progress.completed.includes(lesson.id)) score -= 2;
        return { lesson, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((item) => item.lesson);
    const offset = progress.sessions % Math.max(1, scored.length);
    return [...scored.slice(offset), ...scored.slice(0, offset)].slice(0, sessionSize);
  }, [activeMood, activePack, interestKey, progress.completed, progress.sessions]);

  const savedLessons = allLessons.filter((lesson) => progress.saved.includes(lesson.id));
  const recentLessons = allLessons.filter((lesson) => progress.recent.includes(lesson.id)).slice(0, 6);
  const currentLesson = nextSession[sessionIndex] || nextSession[0];

  useEffect(() => {
    if (!progress.quoteReminderEnabled || !progress.quoteReminderTime || Capacitor.isNativePlatform()) return undefined;
    const target = getNextReminderDate(progress.quoteReminderTime);
    const timeoutId = window.setTimeout(() => showQuoteReminder(dailyQuote), target.getTime() - Date.now());
    return () => window.clearTimeout(timeoutId);
  }, [dailyQuote, progress.quoteNotifiedToday, progress.quoteReminderEnabled, progress.quoteReminderTime]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform() || !progress.quoteReminderEnabled) return;
    scheduleNativeQuoteReminders({ time: progress.quoteReminderTime, mood: activeMood, activePack, interestIds: selectedInterests })
      .catch(() => setQuoteMessage('Native quote reminder needs notification permission.'));
  }, [activeMood, activePack, progress.quoteReminderEnabled, progress.quoteReminderTime, interestKey]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return undefined;
    let actionHandle;
    LocalNotifications.addListener('localNotificationActionPerformed', () => {
      setScreen('home');
      setActivePage('Quote');
    }).then((handle) => {
      actionHandle = handle;
    });
    return () => {
      if (actionHandle) actionHandle.remove();
    };
  }, []);

  function toggleInterest(id) {
    setSelectedInterests((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function finishOnboarding() {
    const next = { ...progress, onboarded: true, interests: selectedInterests, activePack };
    commit(next);
    setScreen('home');
  }

  function showQuoteReminder(quote, force = false) {
    if (!force && progress.quoteNotifiedToday === today) return;
    const body = quote.source ? `${quote.text} - ${quote.source}` : quote.text;
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('MindSwipe daily quote', { body: `${body} ${quote.action}` });
    }
    setQuoteToast(quote);
    commit({ ...progress, quoteNotifiedToday: today });
  }

  async function enableQuoteReminder() {
    if (Capacitor.isNativePlatform()) {
      const result = await scheduleNativeQuoteReminders({ time: quoteReminderTime, mood: activeMood, activePack, interestIds: selectedInterests });
      commit({ ...progress, quoteReminderTime, quoteReminderEnabled: result.scheduled });
      setQuoteMessage(result.message);
      return;
    }

    let message = 'Browser reminder saved while MindSwipe is open.';
    if ('Notification' in window) {
      const permission = Notification.permission === 'default' ? await Notification.requestPermission() : Notification.permission;
      message = permission === 'granted' ? 'Browser reminder ready while MindSwipe is open.' : 'Reminder saved. In-app popup will show when possible.';
    }
    commit({ ...progress, quoteReminderTime, quoteReminderEnabled: true });
    setQuoteMessage(message);
  }

  async function disableQuoteReminder() {
    await cancelNativeQuoteReminders();
    commit({ ...progress, quoteReminderEnabled: false, quoteReminderTime });
    setQuoteMessage('Daily reminder turned off.');
  }

  async function testQuoteReminder() {
    if (Capacitor.isNativePlatform()) {
      const scheduled = await scheduleNativeTestQuote(dailyQuote);
      setQuoteMessage(scheduled ? 'Test notification scheduled for 5 seconds from now.' : 'Notification permission was not granted.');
      return;
    }
    showQuoteReminder(dailyQuote, true);
  }

  function startSession(mood = activeMood) {
    setActiveMood(mood);
    setSessionIndex(0);
    setScreen('session');
  }

  function finishCard(lesson, mode) {
    const completed = progress.completed.includes(lesson.id) ? progress.completed : [...progress.completed, lesson.id];
    const saved = mode === 'save' && !progress.saved.includes(lesson.id) ? [...progress.saved, lesson.id] : progress.saved;
    const recent = [lesson.id, ...progress.recent.filter((id) => id !== lesson.id)].slice(0, 8);
    const nextProgress = {
      ...progress,
      completed: mode === 'skip' ? progress.completed : completed,
      saved,
      recent,
      savedToday: mode === 'save' ? today : progress.savedToday,
      xp: progress.xp + (mode === 'skip' ? 0 : mode === 'save' ? 10 : 15)
    };

    if (sessionIndex >= nextSession.length - 1) {
      const wasActiveToday = nextProgress.lastActive === today;
      commit({
        ...nextProgress,
        lastActive: today,
        streak: wasActiveToday ? nextProgress.streak : nextProgress.streak + 1,
        sessions: nextProgress.sessions + 1,
        minutesReplaced: nextProgress.minutesReplaced + 3
      });
      setScreen('home');
      setActivePage('Home');
      return;
    }

    commit(nextProgress);
    setSessionIndex(sessionIndex + 1);
  }

  function resetProgress() {
    localStorage.removeItem('mindSwipeProgress');
    const fresh = readProgress();
    setProgress(fresh);
    setSelectedInterests([]);
    setScreen('onboarding');
    setActivePage('Home');
  }

  if (screen === 'onboarding') {
    return (
      <main className='appShell center'>
        <section className='onboardingPanel'>
          <h1>Pick what you want MindSwipe to help with.</h1>
          <p>No preselected answers. Choose at least two broad lanes and the app will shape the cards and quote reminders around them.</p>
          <div className='interestGrid'>
            {broadInterests.map((interest) => (
              <button key={interest.id} className={selectedInterests.includes(interest.id) ? 'interestButton active' : 'interestButton'} onClick={() => toggleInterest(interest.id)}>
                <strong>{interest.label}</strong>
                <span>{interest.detail}</span>
              </button>
            ))}
          </div>
          <div className='packGrid'>
            {packOptions.slice(0, 4).map((pack) => (
              <button key={pack.id} className={activePack === pack.id ? 'packCard active' : 'packCard'} onClick={() => setActivePack(pack.id)}>
                <strong>{pack.label}</strong>
                <span>{pack.detail}</span>
              </button>
            ))}
          </div>
          <button className='primaryWide' disabled={selectedInterests.length < 2} onClick={finishOnboarding}>
            {selectedInterests.length < 2 ? 'Pick at least 2' : 'Start MindSwipe'}
          </button>
        </section>
      </main>
    );
  }

  if (screen === 'session') {
    return (
      <main className='appShell'>
        <header className='appTop'>
          <button className='iconButton' aria-label='Close session' onClick={() => setScreen('home')}><span className='closeMark' /></button>
          <h1 className='brandTitle'>{sessionIndex + 1} / {nextSession.length}</h1>
          <span />
        </header>
        <section className='sessionCard'>
          <span className='pill'>{currentLesson.area}</span>
          <h1>{currentLesson.title}</h1>
          <p className='sessionHook'>{currentLesson.hook}</p>
          <p className='sessionBody'>{currentLesson.body}</p>
          <div className='moveBox open'>
            <span className='miniLabel'>Tiny move</span>
            <strong>{getMove(currentLesson)}</strong>
          </div>
          <div className='sessionActionsNew'>
            <button className='secondaryWide' onClick={() => finishCard(currentLesson, 'skip')}>Skip</button>
            <button className='secondaryWide' onClick={() => finishCard(currentLesson, 'save')}>Save</button>
            <button className='primaryWide' onClick={() => finishCard(currentLesson, 'done')}>Done</button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className='appShell'>
      <header className='appTop'>
        <button className='iconButton' aria-label='Open menu' onClick={() => setMenuOpen(!menuOpen)}><span className='hamburgerMark'><span /></span></button>
        <h1 className='brandTitle'>MindSwipe</h1>
        <button className='iconButton' aria-label='Profile' onClick={() => setActivePage('Profile')}><span className='smallLabel'>{progress.streak}</span></button>
      </header>

      <nav className='pageRail' aria-label='MindSwipe sections'>
        {pages.map((page) => (
          <button key={page} className={activePage === page ? 'active' : ''} onClick={() => { setActivePage(page); setMenuOpen(false); }}>
            {page}
          </button>
        ))}
      </nav>

      {menuOpen ? (
        <section className='cleanPanel menuList'>
          {pages.map((page) => <button key={page} onClick={() => { setActivePage(page); setMenuOpen(false); }}>{page}<span>Open</span></button>)}
        </section>
      ) : null}

      {activePage === 'Home' ? (
        <section className='homeHero'>
          <div>
            <span className='streakChip'>{progress.streak} day streak</span>
            <button className='bigStart' onClick={() => startSession(activeMood)}>Start</button>
            <section className='todayQuotePreview'>
              <p>{progress.quoteReminderEnabled ? 'Todays reminder' : 'Yesterday / preview quote'}</p>
              <strong>{progress.quoteReminderEnabled ? dailyQuote.text : yesterdayQuote.text}</strong>
            </section>
            <section className='recentPanel'>
              <strong>Recent themes</strong>
              <div className='recentList'>
                {(recentLessons.length ? recentLessons : nextSession).map((lesson) => <span key={lesson.id}>{lesson.area}</span>)}
              </div>
            </section>
          </div>
        </section>
      ) : null}

      {activePage === 'Quote' ? (
        <section className='dashboardPage'>
          <article className='quoteCardLarge'>
            <span className='quoteSource'>{dailyQuote.source || 'MindSwipe'}</span>
            <h2>{dailyQuote.text}</h2>
            <p className='quoteActionText'>{dailyQuote.action}</p>
          </article>
          <div className='quickTimes'>
            {reminderPresets.map((preset) => (
              <button key={preset.time} className={quoteReminderTime === preset.time ? 'active' : ''} onClick={() => setQuoteReminderTime(preset.time)}>
                {preset.label} {preset.time}
              </button>
            ))}
          </div>
          <div className='reminderRow'>
            <input aria-label='Quote reminder time' type='time' value={quoteReminderTime} onChange={(event) => setQuoteReminderTime(event.target.value)} />
            <button className='secondary' onClick={enableQuoteReminder}>{progress.quoteReminderEnabled ? 'Update' : 'Turn on'}</button>
          </div>
          <button className='secondaryWide' onClick={testQuoteReminder}>Test notification</button>
          {progress.quoteReminderEnabled ? <button className='secondaryWide dangerText' onClick={disableQuoteReminder}>Turn off reminder</button> : null}
          {quoteMessage ? <p className='statusLine'>{quoteMessage}</p> : null}
        </section>
      ) : null}

      {activePage === 'History' ? (
        <section className='dashboardPage'>
          <section className='cleanPanel'>
            <strong>Recently seen</strong>
            <div className='list'>
              {(recentLessons.length ? recentLessons : nextSession).map((lesson) => (
                <article className='miniCard' key={lesson.id}>
                  <span className='pill'>{lesson.area}</span>
                  <h3>{lesson.title}</h3>
                  <p>{lesson.hook}</p>
                </article>
              ))}
            </div>
          </section>
          <section className='cleanPanel'>
            <strong>Saved moves</strong>
            <div className='list'>
              {savedLessons.length ? savedLessons.map((lesson) => <p key={lesson.id}>{lesson.title}: {getMove(lesson)}</p>) : <p>No saved moves yet.</p>}
            </div>
          </section>
        </section>
      ) : null}

      {activePage === 'Profile' ? (
        <section className='dashboardPage'>
          <div className='statGrid'>
            <div><strong>{progress.xp}</strong><span>XP</span></div>
            <div><strong>{progress.streak}</strong><span>streak</span></div>
            <div><strong>{progress.minutesReplaced}</strong><span>minutes</span></div>
          </div>
          <section className='cleanPanel'>
            <strong>Badges</strong>
            <div className='badgeGrid'>
              <div><strong>First swipe</strong><span>{progress.sessions > 0 ? 'Unlocked' : 'Locked'}</span></div>
              <div><strong>Saved one</strong><span>{savedLessons.length ? 'Unlocked' : 'Locked'}</span></div>
              <div><strong>Reminder set</strong><span>{progress.quoteReminderEnabled ? 'Unlocked' : 'Locked'}</span></div>
              <div><strong>Comeback week</strong><span>{progress.streak >= 7 ? 'Unlocked' : 'Locked'}</span></div>
            </div>
          </section>
        </section>
      ) : null}

      {activePage === 'Settings' ? (
        <section className='dashboardPage'>
          <section className='cleanPanel menuList'>
            <strong>Preferences</strong>
            <button onClick={() => setScreen('onboarding')}>Edit interests<span>Open</span></button>
            <button onClick={() => setActivePage('Quote')}>Notifications<span>Open</span></button>
            <button>Appearance<span>Soon</span></button>
            <button>Contact support<span>Soon</span></button>
            <button>Privacy policy<span>Soon</span></button>
            <button className='dangerText' onClick={resetProgress}>Reset local progress<span>Reset</span></button>
          </section>
        </section>
      ) : null}

      {quoteToast ? (
        <div className='quoteToast' role='status'>
          <p className='eyebrow'>MindSwipe reminder</p>
          <strong>{quoteToast.text}</strong>
          {quoteToast.source ? <span>{quoteToast.source}</span> : null}
          <span>{quoteToast.action}</span>
          <button className='textButton' onClick={() => setQuoteToast(null)}>Close</button>
        </div>
      ) : null}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
