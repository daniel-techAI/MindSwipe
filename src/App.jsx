import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { extraActionMoves, extraLessons, packOptions } from './content.js';
import './styles.css';
import './packs.css';

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
    id: 'money-3',
    area: 'Money',
    mood: 'Money ideas',
    title: 'Demand first',
    hook: 'Do not build first and pray people care.',
    body: 'Find people already complaining, searching, asking, or paying for a weaker solution. If nobody wants the problem solved, your idea is still fantasy.'
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
    id: 'mind-2',
    area: 'Mind',
    mood: 'Stressed',
    title: 'Name the state',
    hook: 'You are stressed, not finished.',
    body: 'Saying the real state gives you space. I am stressed. I am tired. I am avoiding. Then choose the next small move without making it your identity.'
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
    id: 'habit-2',
    area: 'Habits',
    mood: 'Need focus',
    title: 'Lower the first step',
    hook: 'Make starting too small to reject.',
    body: 'One push-up, one paragraph, one cleaned plate, one job application. Starting is the win that unlocks more.'
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
  'money-1': 'Open notes. Write: money in minus all real costs. If the leftover is weak, pick one leak to cut today.',
  'money-2': 'Write three lines: paid when, bills when, survive how long. No story. Just dates and numbers.',
  'money-3': 'Search for people already complaining about the problem. If nobody is talking, do not build yet.',
  'mind-1': 'Send one useful message you have been avoiding. Most people will forget the awkwardness faster than you think.',
  'mind-2': 'Say it clean: I am stressed, not broken. Then do the next visible task for two minutes.',
  'habit-1': 'If you missed yesterday, make today stupid small. Two minutes counts.',
  'habit-2': 'Cut the task until it feels almost too easy: one sentence, one rep, one tab closed.',
  'strategy-1': 'Put a hard limit on the next move: 20 minutes, no spending, one result.',
  'health-1': 'Pick tonights sleep target now. Protect the first 30 minutes before bed from the feed.',
  'people-1': 'Ask one specific question today instead of sending dead small talk.'
};

const allLessons = [...baseLessons, ...extraLessons];
const allActionMoves = { ...baseActionMoves, ...extraActionMoves };
const interests = ['Money', 'Mind', 'Habits', 'Strategy', 'Health', 'People'];
const triggerOptions = ['Bored in bed', 'Avoiding work', 'Stressed', 'Waiting around', 'After waking up'];
const moods = [
  { label: 'Bored', detail: 'kill the scroll' },
  { label: 'Stressed', detail: 'calm then move' },
  { label: 'Need focus', detail: 'get one win' },
  { label: 'Money ideas', detail: 'fix options' }
];
const sessionSize = 3;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(from, to) {
  if (!from) return 999;
  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);
  return Math.round((end - start) / 86400000);
}

function getMove(lesson) {
  return allActionMoves[lesson.id] || 'Steal the idea, use it once today, then keep moving.';
}

function getPackPool(activePack) {
  if (activePack === 'all') return allLessons;
  if (activePack === 'starter') return allLessons.filter((lesson) => !lesson.pack || lesson.pack === 'starter');
  const packPool = allLessons.filter((lesson) => lesson.pack === activePack);
  return packPool.length ? packPool : allLessons;
}

function readProgress() {
  const fallback = {
    onboarded: false,
    interests: [],
    trigger: '',
    activePack: 'comeback',
    reminderTime: '',
    xp: 0,
    streak: 0,
    freezes: 1,
    completed: [],
    saved: [],
    sessions: 0,
    minutesReplaced: 0,
    lastActive: '',
    savedToday: '',
    reviewedToday: ''
  };

  try {
    const saved = JSON.parse(localStorage.getItem('mindSwipeProgress'));
    return saved ? { ...fallback, ...saved } : fallback;
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
  const [selected, setSelected] = useState(progress.interests.length ? progress.interests : ['Money', 'Habits']);
  const [selectedTrigger, setSelectedTrigger] = useState(progress.trigger || triggerOptions[0]);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [activeMood, setActiveMood] = useState('Need focus');
  const [activePack, setActivePack] = useState(progress.activePack || 'comeback');
  const [reminderTime, setReminderTime] = useState(progress.reminderTime || '20:30');
  const [moveOpen, setMoveOpen] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  function commit(next) {
    setProgress(next);
    saveProgress(next);
  }

  const nextSession = useMemo(() => {
    const packPool = getPackPool(activePack);
    const chosen = packPool.filter((lesson) => progress.interests.includes(lesson.area) || lesson.mood === activeMood);
    const unfinished = chosen.filter((lesson) => !progress.completed.includes(lesson.id));
    const pool = unfinished.length >= sessionSize ? unfinished : [...unfinished, ...chosen, ...packPool, ...allLessons];
    const unique = [];
    pool.forEach((lesson) => {
      if (!unique.some((item) => item.id === lesson.id)) unique.push(lesson);
    });
    return unique.slice(0, sessionSize);
  }, [activeMood, activePack, progress.completed, progress.interests]);

  const savedLessons = allLessons.filter((lesson) => progress.saved.includes(lesson.id));
  const completedPercent = Math.round((progress.completed.length / allLessons.length) * 100);
  const currentPack = packOptions.find((pack) => pack.id === activePack) || packOptions[0];
  const today = todayKey();
  const todayDone = progress.lastActive === today;
  const missions = [
    { id: 'rescue', label: 'Do one 3-card rescue', done: todayDone },
    { id: 'save', label: 'Save one move worth stealing', done: progress.savedToday === today },
    { id: 'review', label: 'Replay one saved move', done: progress.reviewedToday === today || savedLessons.length === 0 },
    { id: 'reminder', label: 'Set your feed blocker time', done: Boolean(progress.reminderTime) }
  ];
  const missionDoneCount = missions.filter((mission) => mission.done).length;

  function finishOnboarding() {
    const next = {
      ...progress,
      onboarded: true,
      interests: selected.length ? selected : interests,
      trigger: selectedTrigger,
      activePack,
      reminderTime,
      freezes: progress.freezes || 1
    };
    commit(next);
    setScreen('home');
  }

  function choosePack(packId) {
    setActivePack(packId);
    commit({ ...progress, activePack: packId });
  }

  function saveReminder() {
    commit({ ...progress, reminderTime });
  }

  function startSession(mood = activeMood) {
    setActiveMood(typeof mood === 'string' ? mood : mood.label);
    setSessionIndex(0);
    setMoveOpen(false);
    setScreen('learn');
  }

  function updateDailyProgress(current) {
    const gap = daysBetween(current.lastActive, today);
    if (gap === 0) return current;
    if (gap <= 1) return { ...current, streak: current.streak + 1, lastActive: today };
    if (current.freezes > 0) return { ...current, freezes: current.freezes - 1, lastActive: today };
    return { ...current, streak: 1, lastActive: today };
  }

  function completeSession(nextProgress) {
    const completedSessions = nextProgress.sessions + 1;
    commit({
      ...nextProgress,
      activePack,
      sessions: completedSessions,
      minutesReplaced: nextProgress.minutesReplaced + 3,
      freezes: nextProgress.sessions > 0 && completedSessions % 4 === 0 ? nextProgress.freezes + 1 : nextProgress.freezes
    });
    setSessionIndex(0);
    setMoveOpen(false);
    setScreen('complete');
  }

  function moveToNextCard(nextProgress = progress) {
    if (sessionIndex >= nextSession.length - 1) {
      completeSession(updateDailyProgress(nextProgress));
      return;
    }
    commit(nextProgress);
    setSessionIndex(sessionIndex + 1);
    setMoveOpen(false);
  }

  function saveAndContinue(lesson) {
    const alreadySaved = progress.saved.includes(lesson.id);
    const next = alreadySaved ? progress : { ...progress, saved: [...progress.saved, lesson.id], savedToday: today };
    moveToNextCard(next);
  }

  function skipLesson() {
    moveToNextCard(progress);
  }

  function completeLesson(lesson) {
    const already = progress.completed.includes(lesson.id);
    const withDaily = updateDailyProgress(progress);
    const next = {
      ...withDaily,
      xp: withDaily.xp + (already ? 5 : 15),
      activePack,
      completed: already ? withDaily.completed : [...withDaily.completed, lesson.id]
    };
    moveToNextCard(next);
  }

  function completeReview() {
    commit({ ...progress, xp: progress.xp + 5, reviewedToday: today });
    setMoveOpen(false);
    setReviewIndex(savedLessons.length ? (reviewIndex + 1) % savedLessons.length : 0);
  }

  function handleTouchEnd(event, lesson) {
    if (touchStart === null) return;
    const touchEnd = event.changedTouches[0].clientX;
    const delta = touchEnd - touchStart;
    setTouchStart(null);
    if (Math.abs(delta) < 64) return;
    if (delta > 0) saveAndContinue(lesson);
    else skipLesson();
  }

  if (screen === 'onboarding') {
    return (
      <main className='app center'>
        <section className='heroPanel introPanel'>
          <p className='eyebrow'>MindSwipe</p>
          <h1>Broke, stressed, scrolling? Swipe 3 cards and move.</h1>
          <p className='lead'>No lectures. No fake guru energy. Pick your trap, get three direct cards, steal one tiny move, then get back to real life.</p>
          <div className='fieldGroup'>
            <h2>What usually starts the scroll?</h2>
            <div className='chips' aria-label='Choose scroll trigger'>
              {triggerOptions.map((trigger) => (
                <button key={trigger} className={selectedTrigger === trigger ? 'chip active' : 'chip'} onClick={() => setSelectedTrigger(trigger)}>
                  {trigger}
                </button>
              ))}
            </div>
          </div>
          <div className='fieldGroup'>
            <h2>Pick your first comeback pack</h2>
            <div className='packGrid compactPackGrid'>
              {packOptions.slice(0, 6).map((pack) => (
                <button key={pack.id} className={activePack === pack.id ? 'packCard active' : 'packCard'} onClick={() => setActivePack(pack.id)}>
                  <strong>{pack.label}</strong>
                  <span>{pack.detail}</span>
                </button>
              ))}
            </div>
          </div>
          <div className='fieldGroup'>
            <h2>Pick what you need most</h2>
            <div className='chips' aria-label='Choose learning interests'>
              {interests.map((interest) => (
                <button
                  key={interest}
                  className={selected.includes(interest) ? 'chip active' : 'chip'}
                  onClick={() => setSelected(selected.includes(interest) ? selected.filter((item) => item !== interest) : [...selected, interest])}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
          <button className='primary wide' disabled={selected.length < 2} onClick={finishOnboarding}>
            {selected.length < 2 ? 'Pick at least 2 lanes' : 'Build my comeback feed'}
          </button>
        </section>
      </main>
    );
  }

  if (screen === 'learn') {
    const lesson = nextSession[sessionIndex];
    return (
      <main className='app sessionShell'>
        <header className='topBar'>
          <button className='ghost' onClick={() => setScreen('home')}>Close</button>
          <div className='progressText'>{currentPack.label}</div>
        </header>
        <div className='cardDots' aria-label='Session progress'>
          {nextSession.map((item, index) => (
            <span key={item.id} className={index === sessionIndex ? 'active' : index < sessionIndex ? 'done' : ''} />
          ))}
        </div>
        <div className='cardDeck'>
          <section
            className='lessonCard swipeCard'
            onTouchStart={(event) => setTouchStart(event.changedTouches[0].clientX)}
            onTouchEnd={(event) => handleTouchEnd(event, lesson)}
          >
            <div className='swipeHint'><span>Save</span><span>Skip</span></div>
            <div className='cardMeta'>
              <span className='pill'>{lesson.area}</span>
              <span>{sessionIndex + 1} / {nextSession.length}</span>
            </div>
            <h1>{lesson.title}</h1>
            <p className='hook'>{lesson.hook}</p>
            <p className='ideaText'>{lesson.body}</p>
            <div className={moveOpen ? 'moveBox open' : 'moveBox'}>
              <span className='miniLabel'>Tiny move</span>
              {moveOpen ? <strong>{getMove(lesson)}</strong> : <strong>Need the part you can actually use?</strong>}
              {moveOpen ? <p>No test. Use it, save it, or keep swiping.</p> : <button className='textButton' onClick={() => setMoveOpen(true)}>Show me the move</button>}
            </div>
          </section>
        </div>
        <div className='swipeControls'>
          <button className='roundAction skipAction' onClick={skipLesson}><span>Skip</span></button>
          <button className='roundAction saveAction' onClick={() => saveAndContinue(lesson)}><span>Save</span></button>
          <button className='roundAction doneAction' onClick={() => completeLesson(lesson)}><span>Done</span></button>
        </div>
      </main>
    );
  }

  if (screen === 'review') {
    const lesson = savedLessons[reviewIndex];
    return (
      <main className='app'>
        <header className='topBar'>
          <button className='ghost' onClick={() => setScreen('home')}>Back</button>
          <div className='progressText'>Saved moves</div>
        </header>
        {lesson ? (
          <section className='lessonCard compact'>
            <span className='pill'>{lesson.area}</span>
            <h1>{lesson.title}</h1>
            <p className='hook'>{lesson.hook}</p>
            <p className='ideaText'>{lesson.body}</p>
            <div className='moveBox open'>
              <span className='miniLabel'>Saved move</span>
              <strong>{getMove(lesson)}</strong>
            </div>
            <div className='actions single'>
              <button className='primary' onClick={completeReview}>Next saved move</button>
            </div>
          </section>
        ) : (
          <section className='emptyState'>
            <h1>No saved moves yet.</h1>
            <p>Save a card during a session. This becomes your small private playbook, not homework.</p>
            <button className='primary wide' onClick={() => startSession('Need focus')}>Start a session</button>
          </section>
        )}
      </main>
    );
  }

  if (screen === 'complete') {
    return (
      <main className='app center'>
        <section className='heroPanel completionPanel'>
          <p className='eyebrow'>Session complete</p>
          <h1>You beat the feed for 3 minutes.</h1>
          <p className='lead'>Small win. Real rep. Take the move into the day before the scroll tries again.</p>
          <div className='rewardGrid'>
            <div><strong>+45</strong><span>possible XP</span></div>
            <div><strong>{progress.minutesReplaced}</strong><span>minutes rescued</span></div>
          </div>
          <button className='primary wide' onClick={() => setScreen('home')}>Back home</button>
          <button className='secondary wide' onClick={() => startSession(activeMood)}>Give me 3 more</button>
        </section>
      </main>
    );
  }

  return (
    <main className='app'>
      <header className='homeHeader'>
        <div>
          <p className='eyebrow'>MindSwipe</p>
          <h1>Broke comeback, one swipe at a time.</h1>
        </div>
        <button className='startButton' onClick={() => startSession(activeMood)}>Start</button>
      </header>

      <section className='missionPanel'>
        <div className='sectionTitle'>
          <div>
            <p className='eyebrow'>Right now</p>
            <h2>Stop the leak. Get one option. Take one tiny win.</h2>
          </div>
          <span className='missionBadge'>{currentPack.label}</span>
        </div>
        <div className='missionList'>
          {missions.map((mission) => (
            <div key={mission.id} className={mission.done ? 'mission done' : 'mission'}>
              <span>{mission.done ? 'Done' : 'Todo'}</span>
              <p>{mission.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className='scoreboard' aria-label='Progress stats'>
        <div><strong>{progress.xp}</strong><span>XP</span></div>
        <div><strong>{progress.streak}</strong><span>streak</span></div>
        <div><strong>{progress.freezes}</strong><span>freezes</span></div>
      </section>

      <section className='rescuePanel'>
        <div>
          <p className='eyebrow'>Swipe mode</p>
          <h2>{progress.trigger ? `When: ${progress.trigger}` : 'What are you fighting right now?'}</h2>
          <p>Pick the urge. Three cards. One usable move. Then out.</p>
        </div>
        <div className='moodGrid'>
          {moods.map((mood) => (
            <button key={mood.label} className={activeMood === mood.label ? 'mood active' : 'mood'} onClick={() => startSession(mood.label)}>
              <strong>{mood.label}</strong>
              <span>{mood.detail}</span>
            </button>
          ))}
        </div>
      </section>

      <section className='packPanel'>
        <div className='sectionTitle'>
          <div>
            <p className='eyebrow'>Content pack</p>
            <h2>{currentPack.label}</h2>
          </div>
          <button className='textButton' onClick={() => startSession(activeMood)}>Swipe</button>
        </div>
        <div className='packGrid'>
          {packOptions.map((pack) => (
            <button key={pack.id} className={activePack === pack.id ? 'packCard active' : 'packCard'} onClick={() => choosePack(pack.id)}>
              <strong>{pack.label}</strong>
              <span>{pack.detail}</span>
            </button>
          ))}
        </div>
      </section>

      <section className='reminderPanel'>
        <div>
          <p className='eyebrow'>Reminder</p>
          <h2>Before TikTok, do 3 cards</h2>
          <p>This stores your preferred rescue time for now. Real phone push reminders come in the release build phase.</p>
        </div>
        <div className='reminderRow'>
          <input aria-label='Reminder time' type='time' value={reminderTime} onChange={(event) => setReminderTime(event.target.value)} />
          <button className='secondary' onClick={saveReminder}>{progress.reminderTime ? 'Update' : 'Set'}</button>
        </div>
      </section>

      <section className='progressBand'>
        <div>
          <span>{completedPercent}%</span>
          <p>of cards completed</p>
        </div>
        <div>
          <span>{progress.minutesReplaced}</span>
          <p>minutes of scrolling replaced</p>
        </div>
      </section>

      <section className='sectionBlock'>
        <div className='sectionTitle'>
          <h2>Next 3 cards</h2>
          <button className='textButton' onClick={() => startSession(activeMood)}>Run</button>
        </div>
        <div className='list'>
          {nextSession.map((lesson) => (
            <article className='miniCard' key={lesson.id}>
              <span className='pill'>{lesson.area}</span>
              <h3>{lesson.title}</h3>
              <p>{lesson.hook}</p>
            </article>
          ))}
        </div>
      </section>

      <section className='sectionBlock'>
        <div className='sectionTitle'>
          <h2>Saved moves</h2>
          <button className='textButton' onClick={() => setScreen('review')}>Open</button>
        </div>
        {savedLessons.length ? (
          <div className='savedStrip'>
            {savedLessons.slice(0, 3).map((lesson) => <span key={lesson.id}>{lesson.title}</span>)}
          </div>
        ) : (
          <p className='muted'>Save cards that hit. They become your quick comeback list.</p>
        )}
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
