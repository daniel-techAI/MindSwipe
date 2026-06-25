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

const interests = ['Money', 'Mind', 'Habits', 'Strategy', 'Health', 'People'];
const moods = ['Bored', 'Stressed', 'Need focus', 'Money ideas'];
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

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem('mindSwipeProgress'));
    if (!saved) return null;
    return {
      onboarded: false,
      interests: [],
      xp: 0,
      streak: 0,
      freezes: 1,
      completed: [],
      saved: [],
      sessions: 0,
      minutesReplaced: 0,
      lastActive: '',
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
    xp: 0,
    streak: 0,
    freezes: 1,
    completed: [],
    saved: [],
    sessions: 0,
    minutesReplaced: 0,
    lastActive: ''
  };
}

function App() {
  const [progress, setProgress] = useState(initialProgress);
  const [screen, setScreen] = useState(progress.onboarded ? 'home' : 'onboarding');
  const [selected, setSelected] = useState(progress.interests.length ? progress.interests : ['Money', 'Habits']);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [activeMood, setActiveMood] = useState('Need focus');
  const [answerOpen, setAnswerOpen] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);

  function commit(next) {
    setProgress(next);
    saveProgress(next);
  }

  const nextSession = useMemo(() => {
    const chosen = lessons.filter((lesson) => progress.interests.includes(lesson.area) || lesson.mood === activeMood);
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
  const todayDone = progress.lastActive === todayKey();

  function finishOnboarding() {
    const next = {
      ...progress,
      onboarded: true,
      interests: selected.length ? selected : interests,
      freezes: progress.freezes || 1
    };
    commit(next);
    setScreen('home');
  }

  function startSession(mood = activeMood) {
    setActiveMood(mood);
    setSessionIndex(0);
    setAnswerOpen(false);
    setScreen('learn');
  }

  function updateDailyProgress(current) {
    const today = todayKey();
    const gap = daysBetween(current.lastActive, today);
    if (gap === 0) return current;
    if (gap <= 1) return { ...current, streak: current.streak + 1, lastActive: today };
    if (current.freezes > 0) return { ...current, freezes: current.freezes - 1, lastActive: today };
    return { ...current, streak: 1, lastActive: today };
  }

  function toggleSave(id) {
    const nextSaved = progress.saved.includes(id)
      ? progress.saved.filter((item) => item !== id)
      : [...progress.saved, id];
    commit({ ...progress, saved: nextSaved });
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
      commit({
        ...next,
        sessions: next.sessions + 1,
        minutesReplaced: next.minutesReplaced + 3,
        freezes: next.sessions > 0 && (next.sessions + 1) % 4 === 0 ? next.freezes + 1 : next.freezes
      });
      setSessionIndex(0);
      setAnswerOpen(false);
      setScreen('complete');
      return;
    }

    commit(next);
    setSessionIndex(sessionIndex + 1);
    setAnswerOpen(false);
  }

  function completeReview(lesson) {
    commit({ ...progress, xp: progress.xp + 5 });
    setAnswerOpen(false);
    setReviewIndex(savedLessons.length ? (reviewIndex + 1) % savedLessons.length : 0);
  }

  if (screen === 'onboarding') {
    return (
      <main className="app center">
        <section className="heroPanel">
          <p className="eyebrow">Mind Swipe</p>
          <h1>Turn the scroll urge into a useful win.</h1>
          <p className="lead">Pick at least two lanes. Your home screen becomes a fast rescue button when boredom, stress, or procrastination hits.</p>
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
          <button className="primary wide" disabled={selected.length < 2} onClick={finishOnboarding}>
            {selected.length < 2 ? 'Pick at least 2' : 'Build my rescue feed'}
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
          <div className="progressText">Card {sessionIndex + 1} of {nextSession.length}</div>
        </header>
        <div className="meter"><span style={{ width: `${((sessionIndex + 1) / nextSession.length) * 100}%` }} /></div>
        <section className="lessonCard">
          <div className="cardMeta">
            <span className="pill">{lesson.area}</span>
            <span>{activeMood}</span>
          </div>
          <h1>{lesson.title}</h1>
          <p className="hook">{lesson.hook}</p>
          <p>{lesson.body}</p>
          <div className={answerOpen ? 'quiz open' : 'quiz'}>
            <strong>{lesson.quiz}</strong>
            {answerOpen ? <span>{lesson.answer}</span> : <button className="textButton" onClick={() => setAnswerOpen(true)}>Show answer</button>}
          </div>
          <div className="actions">
            <button className="secondary" onClick={() => toggleSave(lesson.id)}>{progress.saved.includes(lesson.id) ? 'Saved' : 'Save'}</button>
            <button className="primary" onClick={() => completeLesson(lesson)}>{answerOpen ? 'Got it' : 'Next'}</button>
          </div>
        </section>
      </main>
    );
  }

  if (screen === 'review') {
    const lesson = savedLessons[reviewIndex];
    return (
      <main className="app">
        <header className="topBar">
          <button className="ghost" onClick={() => setScreen('home')}>Back</button>
          <div className="progressText">Saved review</div>
        </header>
        {lesson ? (
          <section className="lessonCard compact">
            <span className="pill">{lesson.area}</span>
            <h1>{lesson.title}</h1>
            <p className="hook">{lesson.quiz}</p>
            <div className={answerOpen ? 'quiz open' : 'quiz'}>
              {answerOpen ? <span>{lesson.answer}</span> : <button className="textButton" onClick={() => setAnswerOpen(true)}>Reveal answer</button>}
            </div>
            <div className="actions single">
              <button className="primary" onClick={() => completeReview(lesson)}>Remembered it</button>
            </div>
          </section>
        ) : (
          <section className="emptyState">
            <h1>No saved cards yet.</h1>
            <p>Save useful cards during a session. They will become quick review drills here.</p>
            <button className="primary wide" onClick={() => startSession('Need focus')}>Start a session</button>
          </section>
        )}
      </main>
    );
  }

  if (screen === 'complete') {
    return (
      <main className="app center">
        <section className="heroPanel">
          <p className="eyebrow">Session complete</p>
          <h1>You beat the scroll for 3 minutes.</h1>
          <p className="lead">That is the loop: catch the impulse, learn three useful things, and leave before it becomes another feed.</p>
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
          <h1>Ready to interrupt the scroll?</h1>
        </div>
        <button className="startButton" onClick={() => startSession(activeMood)}>Start</button>
      </header>

      <section className="scoreboard" aria-label="Progress stats">
        <div><strong>{progress.xp}</strong><span>XP</span></div>
        <div><strong>{progress.streak}</strong><span>streak</span></div>
        <div><strong>{progress.freezes}</strong><span>freezes</span></div>
      </section>

      <section className="rescuePanel">
        <div>
          <p className="eyebrow">Rescue mode</p>
          <h2>{todayDone ? 'Daily win is done.' : 'What are you feeling right now?'}</h2>
          <p>Choose the urge. Mind Swipe gives you three cards instead of an endless feed.</p>
        </div>
        <div className="moodGrid">
          {moods.map((mood) => (
            <button key={mood} className={activeMood === mood ? 'mood active' : 'mood'} onClick={() => startSession(mood)}>{mood}</button>
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
          <h2>Saved review</h2>
          <button className="textButton" onClick={() => setScreen('review')}>Open</button>
        </div>
        {savedLessons.length ? (
          <div className="savedStrip">
            {savedLessons.slice(0, 3).map((lesson) => <span key={lesson.id}>{lesson.title}</span>)}
          </div>
        ) : (
          <p className="muted">Save a card during a session to build your review stack.</p>
        )}
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
