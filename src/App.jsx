import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const lessons = [
  { id: 'money-1', area: 'Money', title: 'Revenue is not profit', hook: 'Making money is not the same as keeping money.', body: 'Revenue is money coming in. Profit is what remains after costs. This distinction prevents weak business decisions.', quiz: 'If you earn 1000 and spend 700, what is profit?', answer: '300' },
  { id: 'mind-1', area: 'Mind', title: 'The spotlight effect', hook: 'People notice you less than you think.', body: 'Most people are busy thinking about themselves. This helps you act despite embarrassment or fear.', quiz: 'What does the spotlight effect mean?', answer: 'You overestimate how much others notice you.' },
  { id: 'habit-1', area: 'Habits', title: 'Never miss twice', hook: 'Missing once is normal. Missing twice becomes a pattern.', body: 'A habit can survive one bad day. The danger is letting shame turn one miss into quitting.', quiz: 'What should you do after missing a habit?', answer: 'Restart the next day.' },
  { id: 'strategy-1', area: 'Strategy', title: 'Second-order thinking', hook: 'Think about the result of the result.', body: 'First-order thinking asks what happens next. Second-order thinking asks what happens after that.', quiz: 'What question captures second-order thinking?', answer: 'And then what?' },
  { id: 'health-1', area: 'Health', title: 'Sleep debt is real', hook: 'You do not adapt to bad sleep. You degrade.', body: 'Low sleep reduces focus, impulse control, mood, and learning. Better sleep makes everything else easier.', quiz: 'What does chronic poor sleep damage?', answer: 'Focus and recovery.' },
  { id: 'people-1', area: 'People', title: 'The platinum rule', hook: 'Treat people how they want to be treated.', body: 'The golden rule starts with you. The platinum rule starts with the other person.', quiz: 'What is the platinum rule?', answer: 'Treat people how they want to be treated.' }
];

const interests = ['Money', 'Mind', 'Habits', 'Strategy', 'Health', 'People'];

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem('mindSwipeProgress')) || null;
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
    completed: [],
    saved: [],
    lastActive: ''
  };
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function App() {
  const [progress, setProgress] = useState(initialProgress);
  const [screen, setScreen] = useState(progress.onboarded ? 'home' : 'onboarding');
  const [selected, setSelected] = useState(progress.interests);
  const [sessionIndex, setSessionIndex] = useState(0);

  function commit(next) {
    setProgress(next);
    saveProgress(next);
  }

  const sessionLessons = useMemo(() => {
    const preferred = lessons.filter((lesson) => progress.interests.includes(lesson.area));
    const pool = preferred.length ? preferred : lessons;
    return pool.slice(0, 3);
  }, [progress.interests]);

  function finishOnboarding() {
    const next = { ...progress, onboarded: true, interests: selected.length ? selected : interests, streak: 1, lastActive: todayKey() };
    commit(next);
    setScreen('home');
  }

  function completeLesson(lesson) {
    const already = progress.completed.includes(lesson.id);
    const activeToday = progress.lastActive === todayKey();
    const next = {
      ...progress,
      xp: progress.xp + (already ? 5 : 15),
      streak: activeToday ? progress.streak : progress.streak + 1,
      lastActive: todayKey(),
      completed: already ? progress.completed : [...progress.completed, lesson.id]
    };
    commit(next);
    if (sessionIndex >= sessionLessons.length - 1) {
      setScreen('complete');
      setSessionIndex(0);
    } else {
      setSessionIndex(sessionIndex + 1);
    }
  }

  function toggleSave(id) {
    const saved = progress.saved.includes(id)
      ? progress.saved.filter((item) => item !== id)
      : [...progress.saved, id];
    commit({ ...progress, saved });
  }

  if (screen === 'onboarding') {
    return <main className="app center"><section className="hero"><p className="eyebrow">Mind Swipe</p><h1>Swap doomscrolling for useful learning.</h1><p>Pick what you care about. When the scroll urge hits, swipe through three short lessons instead.</p><div className="chips">{interests.map((interest) => <button key={interest} className={selected.includes(interest) ? 'chip active' : 'chip'} onClick={() => setSelected(selected.includes(interest) ? selected.filter((x) => x !== interest) : [...selected, interest])}>{interest}</button>)}</div><button className="primary" disabled={selected.length < 2} onClick={finishOnboarding}>{selected.length < 2 ? 'Pick at least 2' : 'Start Mind Swipe'}</button></section></main>;
  }

  if (screen === 'learn') {
    const lesson = sessionLessons[sessionIndex];
    return <main className="app"><header className="top"><button className="ghost" onClick={() => setScreen('home')}>Cancel</button><span>{sessionIndex + 1} / {sessionLessons.length}</span></header><section className="lesson"><span className="pill">{lesson.area}</span><h1>{lesson.title}</h1><p className="hook">{lesson.hook}</p><p>{lesson.body}</p><div className="quiz"><strong>{lesson.quiz}</strong><span>{lesson.answer}</span></div><div className="actions"><button className="secondary" onClick={() => toggleSave(lesson.id)}>{progress.saved.includes(lesson.id) ? 'Saved' : 'Save'}</button><button className="primary" onClick={() => completeLesson(lesson)}>Got it</button></div></section></main>;
  }

  if (screen === 'complete') {
    return <main className="app center"><section className="hero"><p className="eyebrow">Session complete</p><h1>You avoided the scroll.</h1><p>That is the whole game: turn the impulse into a tiny useful win.</p><button className="primary" onClick={() => setScreen('home')}>Back home</button></section></main>;
  }

  const completion = Math.round((progress.completed.length / lessons.length) * 100);
  const savedLessons = lessons.filter((lesson) => progress.saved.includes(lesson.id));

  return <main className="app"><header className="homeHeader"><div><p className="eyebrow">Mind Swipe</p><h1>Ready to swipe smarter?</h1></div><button className="iconButton" onClick={() => setScreen('learn')}>Start</button></header><section className="stats"><div><strong>{progress.xp}</strong><span>XP</span></div><div><strong>{progress.streak}</strong><span>Streak</span></div><div><strong>{completion}%</strong><span>Done</span></div></section><button className="doom" onClick={() => setScreen('learn')}>I am about to doomscroll</button><section><h2>For you</h2><div className="list">{sessionLessons.map((lesson) => <article className="card" key={lesson.id}><span className="pill">{lesson.area}</span><h3>{lesson.title}</h3><p>{lesson.hook}</p></article>)}</div></section><section><h2>Saved</h2>{savedLessons.length ? savedLessons.map((lesson) => <p className="saved" key={lesson.id}>{lesson.title}</p>) : <p className="muted">Save lessons during a session and they show here.</p>}</section></main>;
}

createRoot(document.getElementById('root')).render(<App />);
