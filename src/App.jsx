import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const lessons = [
  {
    id: 'money-1',
    area: 'Money',
    mood: 'Money ideas',
    title: 'Revenue is not profit',
    hook: 'Making money is not the same as keeping money.',
    body: 'Revenue is money coming in. Profit is what remains after costs, refunds, fees, and mistakes. This one distinction stops weak business ideas from fooling you.',
    quiz: 'If you earn 1000 and spend 700, what is profit?',
    answer: '300'
  },
  {
    id: 'money-2',
    area: 'Money',
    mood: 'Money ideas',
    title: 'Cash flow beats vibes',
    hook: 'A plan is not real until money timing works.',
    body: 'A business can look profitable and still die if bills arrive before payments. Track when money enters, when it leaves, and how long you can survive between both.',
    quiz: 'What does cash flow track?',
    answer: 'When money enters and leaves.'
  },
  {
    id: 'money-3',
    area: 'Money',
    mood: 'Money ideas',
    title: 'Start with demand',
    hook: 'Do not build first and hope people care.',
    body: 'The fastest test is simple: can you find people already trying to solve this problem, spending time on it, or paying for a weaker solution?',
    quiz: 'What should you prove before building?',
    answer: 'That real demand already exists.'
  },
  {
    id: 'mind-1',
    area: 'Mind',
    mood: 'Stressed',
    title: 'The spotlight effect',
    hook: 'People notice you less than you think.',
    body: 'Most people are busy thinking about themselves. Remembering this makes embarrassment smaller and action easier.',
    quiz: 'What does the spotlight effect mean?',
    answer: 'You overestimate how much others notice you.'
  },
  {
    id: 'mind-2',
    area: 'Mind',
    mood: 'Stressed',
    title: 'Name the feeling',
    hook: 'A named emotion is easier to handle.',
    body: 'Saying "I am anxious" is cleaner than drowning in the whole storm. Naming the state gives your brain a little distance from it.',
    quiz: 'Why name a feeling?',
    answer: 'It creates distance and control.'
  },
  {
    id: 'mind-3',
    area: 'Mind',
    mood: 'Bored',
    title: 'Boredom is a signal',
    hook: 'Your brain is asking for stimulation.',
    body: 'Boredom is not proof that you need social media. It is a signal to choose a better input: move, learn, message someone, or finish one tiny task.',
    quiz: 'What is boredom asking for?',
    answer: 'Stimulation or direction.'
  },
  {
    id: 'habit-1',
    area: 'Habits',
    mood: 'Need focus',
    title: 'Never miss twice',
    hook: 'Missing once is normal. Missing twice becomes a pattern.',
    body: 'A habit can survive one bad day. The danger is letting shame turn one miss into quitting.',
    quiz: 'What should you do after missing a habit?',
    answer: 'Restart the next day.'
  },
  {
    id: 'habit-2',
    area: 'Habits',
    mood: 'Need focus',
    title: 'Lower the first step',
    hook: 'Make starting almost too easy to reject.',
    body: 'When motivation is low, shrink the entry point. One push-up, one paragraph, one cleaned plate. Starting is the win that unlocks more.',
    quiz: 'What should you shrink when motivation is low?',
    answer: 'The first step.'
  },
  {
    id: 'habit-3',
    area: 'Habits',
    mood: 'Bored',
    title: 'Replace, do not only remove',
    hook: 'A habit leaves a hole if nothing fills it.',
    body: 'If you remove doomscrolling, your brain still wants a reward. Replace it with a fast useful reward: three cards, a walk, a note, or a message.',
    quiz: 'Why replace a bad habit?',
    answer: 'Because the old reward still needs somewhere to go.'
  },
  {
    id: 'strategy-1',
    area: 'Strategy',
    mood: 'Need focus',
    title: 'Second-order thinking',
    hook: 'Think about the result of the result.',
    body: 'First-order thinking asks what happens next. Second-order thinking asks what happens after that.',
    quiz: 'What question captures second-order thinking?',
    answer: 'And then what?'
  },
  {
    id: 'strategy-2',
    area: 'Strategy',
    mood: 'Money ideas',
    title: 'A niche is a wedge',
    hook: 'Small can be a starting advantage.',
    body: 'You do not need everyone first. A clear small group is easier to understand, reach, and satisfy. Expand after the first group cares.',
    quiz: 'Why start with a niche?',
    answer: 'It is easier to understand and reach.'
  },
  {
    id: 'strategy-3',
    area: 'Strategy',
    mood: 'Need focus',
    title: 'One constraint clarifies',
    hook: 'Limits force better choices.',
    body: 'A deadline, tiny budget, or small feature list can make decisions easier. Constraint turns vague ambition into tradeoffs.',
    quiz: 'What do constraints create?',
    answer: 'Clearer tradeoffs.'
  },
  {
    id: 'health-1',
    area: 'Health',
    mood: 'Stressed',
    title: 'Sleep debt is real',
    hook: 'You do not adapt to bad sleep. You degrade.',
    body: 'Low sleep reduces focus, impulse control, mood, and learning. Better sleep makes every other self-improvement goal easier.',
    quiz: 'What does chronic poor sleep damage?',
    answer: 'Focus, mood, and recovery.'
  },
  {
    id: 'health-2',
    area: 'Health',
    mood: 'Need focus',
    title: 'Walk before you negotiate',
    hook: 'Movement changes your mental state fast.',
    body: 'A ten-minute walk can lower stress enough to stop a bad decision. When your head is loud, move your body first.',
    quiz: 'What quick action can change your state?',
    answer: 'A short walk.'
  },
  {
    id: 'people-1',
    area: 'People',
    mood: 'Stressed',
    title: 'The platinum rule',
    hook: 'Treat people how they want to be treated.',
    body: 'The golden rule starts with you. The platinum rule starts with the other person.',
    quiz: 'What is the platinum rule?',
    answer: 'Treat people how they want to be treated.'
  },
  {
    id: 'people-2',
    area: 'People',
    mood: 'Bored',
    title: 'Ask one better question',
    hook: 'Most conversations improve when curiosity gets specific.',
    body: 'Instead of "how are you", ask what someone is working on, learning, or trying to fix. Specific questions make better answers easier.',
    quiz: 'What improves small talk fastest?',
    answer: 'A specific curious question.'
  }
];

const actionMoves = {
  'money-1': 'Before calling anything profit, write one line: money in minus all costs. If the second number is ugly, the idea is not dead, it just needs fixing.',
  'money-2': 'Open your notes and write: paid when, bills when, survive how long. That is your cash-flow reality check.',
  'money-3': 'Search for people already complaining about the problem. If nobody is talking about it, do not build yet.',
  'mind-1': 'Do one slightly embarrassing useful thing today. Send the message, ask the question, post the thing. Most people will forget faster than you think.',
  'mind-2': 'Say the state out loud: “I am stressed, not broken.” That tiny wording change gives you room to choose the next move.',
  'mind-3': 'When boredom hits, start a 60-second replacement: stand up, learn one card, or clean one visible thing. Do not negotiate with the feed first.',
  'habit-1': 'If you missed yesterday, make today tiny. Two minutes counts. The goal is to keep the identity alive.',
  'habit-2': 'Cut the task until it feels almost stupid: one sentence, one rep, one tab closed. Starting is the real target.',
  'habit-3': 'Pick the replacement before the urge hits. If TikTok is the old reward, your new reward needs to be ready in one tap.',
  'strategy-1': 'Ask “and then what?” twice before a decision. The second answer usually reveals the real cost.',
  'strategy-2': 'Name one exact group you can help first. If you cannot describe them clearly, you cannot reach them cheaply.',
  'strategy-3': 'Give the next move a hard limit: 20 minutes, no spending, one feature. Limits make the answer easier.',
  'health-1': 'Tonight, protect the first 30 minutes before sleep. No feed, dim screen, same bedtime target. Recovery compounds.',
  'health-2': 'Before reacting, walk for ten minutes. If the problem still matters after the walk, handle it cleaner.',
  'people-1': 'Before giving advice, ask what the other person actually wants: comfort, ideas, or help deciding.',
  'people-2': 'Replace “how are you?” with “what are you trying to fix this week?” Better questions create better conversations.'
};

const interests = ['Money', 'Mind', 'Habits', 'Strategy', 'Health', 'People'];
const triggerOptions = ['Bored in bed', 'Avoiding work', 'Stressed', 'Waiting around', 'After waking up'];
const moods = [
  { label: 'Bored', detail: 'fast curiosity' },
  { label: 'Stressed', detail: 'calm reset' },
  { label: 'Need focus', detail: 'get moving' },
  { label: 'Money ideas', detail: 'build options' }
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
  return actionMoves[lesson.id] || 'Steal the idea, use it once today, then keep moving.';
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem('mindSwipeProgress'));
    if (!saved) return null;
    return {
      onboarded: false,
      interests: [],
      trigger: '',
      xp: 0,
      streak: 0,
      freezes: 1,
      completed: [],
      saved: [],
      sessions: 0,
      minutesReplaced: 0,
      lastActive: '',
      savedToday: '',
      reviewedToday: '',
      ...saved
    };
  } catch {
    return null;
  }
}

function saveProgress(progress) {
  localStorage.setItem('mindSwipeProgress', JSON.stringify(progress));
}

function initialProgress() {
  return loadProgress() || {
    onboarded: false,
    interests: [],
    trigger: '',
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
}

function App() {
  const [progress, setProgress] = useState(initialProgress);
  const [screen, setScreen] = useState(progress.onboarded ? 'home' : 'onboarding');
  const [selected, setSelected] = useState(progress.interests.length ? progress.interests : ['Money', 'Habits']);
  const [selectedTrigger, setSelectedTrigger] = useState(progress.trigger || triggerOptions[0]);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [activeMood, setActiveMood] = useState('Need focus');
  const [moveOpen, setMoveOpen] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  function commit(next) {
    setProgress(next);
    saveProgress(next);
  }

  const nextSession = useMemo(() => {
    const activeMoodLabel = typeof activeMood === 'string' ? activeMood : activeMood.label;
    const chosen = lessons.filter((lesson) => progress.interests.includes(lesson.area) || lesson.mood === activeMoodLabel);
    const unfinished = chosen.filter((lesson) => !progress.completed.includes(lesson.id));
    const pool = unfinished.length >= sessionSize ? unfinished : [...unfinished, ...chosen, ...lessons];
    const unique = [];
    pool.forEach((lesson) => {
      if (!unique.some((item) => item.id === lesson.id)) unique.push(lesson);
    });
    return unique.slice(0, sessionSize);
  }, [activeMood, progress.completed, progress.interests]);

  const savedLessons = lessons.filter((lesson) => progress.saved.includes(lesson.id));
  const completedPercent = Math.round((progress.completed.length / lessons.length) * 100);
  const today = todayKey();
  const todayDone = progress.lastActive === today;
  const missions = [
    { id: 'rescue', label: 'Complete one rescue', done: todayDone },
    { id: 'save', label: 'Save one useful card', done: progress.savedToday === today },
    { id: 'review', label: 'Replay one saved idea', done: progress.reviewedToday === today || savedLessons.length === 0 }
  ];
  const missionDoneCount = missions.filter((mission) => mission.done).length;

  function finishOnboarding() {
    const next = {
      ...progress,
      onboarded: true,
      interests: selected.length ? selected : interests,
      trigger: selectedTrigger,
      freezes: progress.freezes || 1
    };
    commit(next);
    setScreen('home');
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
      completed: already ? withDaily.completed : [...withDaily.completed, lesson.id]
    };

    if (sessionIndex >= nextSession.length - 1) {
      completeSession(next);
      return;
    }

    commit(next);
    setSessionIndex(sessionIndex + 1);
    setMoveOpen(false);
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
    if (delta > 0) {
      saveAndContinue(lesson);
      return;
    }
    skipLesson();
  }

  if (screen === 'onboarding') {
    return (
      <main className="app center">
        <section className="heroPanel introPanel">
          <p className="eyebrow">Mind Swipe</p>
          <h1>Open this when your thumb wants the feed.</h1>
          <p className="lead">Build a tiny rescue feed around your real scroll trigger. Three useful cards, then you are out.</p>
          <div className="fieldGroup">
            <h2>What usually starts the scroll?</h2>
            <div className="chips" aria-label="Choose scroll trigger">
              {triggerOptions.map((trigger) => (
                <button key={trigger} className={selectedTrigger === trigger ? 'chip active' : 'chip'} onClick={() => setSelectedTrigger(trigger)}>
                  {trigger}
                </button>
              ))}
            </div>
          </div>
          <div className="fieldGroup">
            <h2>Pick your useful lanes</h2>
            <div className="chips" aria-label="Choose learning interests">
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
          <button className="primary wide" disabled={selected.length < 2} onClick={finishOnboarding}>
            {selected.length < 2 ? 'Pick at least 2 lanes' : 'Build my rescue feed'}
          </button>
        </section>
      </main>
    );
  }

  if (screen === 'learn') {
    const lesson = nextSession[sessionIndex];
    return (
      <main className="app sessionShell">
        <header className="topBar">
          <button className="ghost" onClick={() => setScreen('home')}>Close</button>
          <div className="progressText">Swipe session</div>
        </header>
        <div className="cardDots" aria-label="Session progress">
          {nextSession.map((item, index) => (
            <span key={item.id} className={index === sessionIndex ? 'active' : index < sessionIndex ? 'done' : ''} />
          ))}
        </div>
        <div className="cardDeck">
          <section
            className="lessonCard swipeCard"
            onTouchStart={(event) => setTouchStart(event.changedTouches[0].clientX)}
            onTouchEnd={(event) => handleTouchEnd(event, lesson)}
          >
            <div className="swipeHint"><span>Save</span><span>Skip</span></div>
            <div className="cardMeta">
              <span className="pill">{lesson.area}</span>
              <span>{sessionIndex + 1} / {nextSession.length}</span>
            </div>
            <h1>{lesson.title}</h1>
            <p className="hook">{lesson.hook}</p>
            <p className="ideaText">{lesson.body}</p>
            <div className={moveOpen ? 'moveBox open' : 'moveBox'}>
              <span className="miniLabel">Tiny move</span>
              {moveOpen ? <strong>{getMove(lesson)}</strong> : <strong>Want the part you can actually use?</strong>}
              {moveOpen ? <p>No test. Just steal the move, save it, or keep swiping.</p> : <button className="textButton" onClick={() => setMoveOpen(true)}>Show me the move</button>}
            </div>
          </section>
        </div>
        <div className="swipeControls">
          <button className="roundAction skipAction" onClick={skipLesson}><span>Skip</span></button>
          <button className="roundAction saveAction" onClick={() => saveAndContinue(lesson)}><span>Save</span></button>
          <button className="roundAction doneAction" onClick={() => completeLesson(lesson)}><span>Done</span></button>
        </div>
      </main>
    );
  }

  if (screen === 'review') {
    const lesson = savedLessons[reviewIndex];
    return (
      <main className="app">
        <header className="topBar">
          <button className="ghost" onClick={() => setScreen('home')}>Back</button>
          <div className="progressText">Saved ideas</div>
        </header>
        {lesson ? (
          <section className="lessonCard compact">
            <span className="pill">{lesson.area}</span>
            <h1>{lesson.title}</h1>
            <p className="hook">{lesson.hook}</p>
            <p className="ideaText">{lesson.body}</p>
            <div className="moveBox open">
              <span className="miniLabel">Saved move</span>
              <strong>{getMove(lesson)}</strong>
            </div>
            <div className="actions single">
              <button className="primary" onClick={completeReview}>Next saved idea</button>
            </div>
          </section>
        ) : (
          <section className="emptyState">
            <h1>No saved ideas yet.</h1>
            <p>Save useful cards during a session. They will come back here without turning into homework.</p>
            <button className="primary wide" onClick={() => startSession('Need focus')}>Start a session</button>
          </section>
        )}
      </main>
    );
  }

  if (screen === 'complete') {
    return (
      <main className="app center">
        <section className="heroPanel completionPanel">
          <p className="eyebrow">Session complete</p>
          <h1>You beat the scroll for 3 minutes.</h1>
          <p className="lead">No homework, no test. You caught the impulse and took three better inputs.</p>
          <div className="rewardGrid">
            <div><strong>+45</strong><span>possible XP</span></div>
            <div><strong>{progress.minutesReplaced}</strong><span>minutes rescued</span></div>
          </div>
          <button className="primary wide" onClick={() => setScreen('home')}>Back home</button>
          <button className="secondary wide" onClick={() => startSession(activeMood)}>Give me 3 more</button>
        </section>
      </main>
    );
  }

  return (
    <main className="app">
      <header className="homeHeader">
        <div>
          <p className="eyebrow">Mind Swipe</p>
          <h1>Rescue your next scroll.</h1>
        </div>
        <button className="startButton" onClick={() => startSession(activeMood)}>Start</button>
      </header>

      <section className="missionPanel">
        <div className="sectionTitle">
          <div>
            <p className="eyebrow">Today</p>
            <h2>{missionDoneCount} of {missions.length} missions done</h2>
          </div>
          <span className="missionBadge">{todayDone ? 'Done' : 'Open'}</span>
        </div>
        <div className="missionList">
          {missions.map((mission) => (
            <div key={mission.id} className={mission.done ? 'mission done' : 'mission'}>
              <span>{mission.done ? 'Done' : 'Todo'}</span>
              <p>{mission.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="scoreboard" aria-label="Progress stats">
        <div><strong>{progress.xp}</strong><span>XP</span></div>
        <div><strong>{progress.streak}</strong><span>streak</span></div>
        <div><strong>{progress.freezes}</strong><span>freezes</span></div>
      </section>

      <section className="rescuePanel">
        <div>
          <p className="eyebrow">Rescue mode</p>
          <h2>{progress.trigger ? `When: ${progress.trigger}` : 'What are you feeling right now?'}</h2>
          <p>Pick the urge. You get three cards instead of an endless feed.</p>
        </div>
        <div className="moodGrid">
          {moods.map((mood) => (
            <button key={mood.label} className={activeMood === mood.label ? 'mood active' : 'mood'} onClick={() => startSession(mood.label)}>
              <strong>{mood.label}</strong>
              <span>{mood.detail}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="progressBand">
        <div>
          <span>{completedPercent}%</span>
          <p>of starter cards completed</p>
        </div>
        <div>
          <span>{progress.minutesReplaced}</span>
          <p>minutes of scrolling replaced</p>
        </div>
      </section>

      <section className="sectionBlock">
        <div className="sectionTitle">
          <h2>Next 3 cards</h2>
          <button className="textButton" onClick={() => startSession(activeMood)}>Run</button>
        </div>
        <div className="list">
          {nextSession.map((lesson) => (
            <article className="miniCard" key={lesson.id}>
              <span className="pill">{lesson.area}</span>
              <h3>{lesson.title}</h3>
              <p>{lesson.hook}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sectionBlock">
        <div className="sectionTitle">
          <h2>Saved ideas</h2>
          <button className="textButton" onClick={() => setScreen('review')}>Open</button>
        </div>
        {savedLessons.length ? (
          <div className="savedStrip">
            {savedLessons.slice(0, 3).map((lesson) => <span key={lesson.id}>{lesson.title}</span>)}
          </div>
        ) : (
          <p className="muted">Save a card during a session to keep the ideas worth stealing.</p>
        )}
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
