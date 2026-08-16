import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowLeft, ArrowRight, Bell, Bookmark, BookOpen, Check, Compass, Home, Library, MapPin, Settings, UserRound } from 'lucide-react';
import { dailyQuotes, extraActionMoves, extraLessons, packOptions } from './content.js';
import { knowledgeActionMoves, knowledgeInterestCategories, knowledgeInterests, knowledgeLessons } from './knowledgeContent.js';
import { famousQuotes } from './quoteBank.js';
import MindSwipeLogo from './MindSwipeLogo.jsx';
import { registerMindSwipeServiceWorker } from './pwa.js';
import { completeSession, corruptProgressBackupKey, progressBackupKey, progressStorageKey, readProgress, saveProgress } from './progress.js';
import TripEditor from './TripEditor.jsx';
import { ExplorePage, SavedPage } from './TravelViews.jsx';
import { getDestination, getPlace, getTravelCards, travelAssetUrl, travelCards } from './travelData.js';
import './styles.css';
import './packs.css';
import './app-shell.css';
import './v2.css';

const quoteNotificationBaseId = 43000;
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
  'health-1': "Pick tonight's sleep target now and protect the first 30 minutes before bed.",
  'people-1': 'Ask one specific question today instead of sending dead small talk.'
};

const bookLessons = [
  {
    id: 'book-stoic-control',
    area: 'Philosophy',
    mood: 'Stressed',
    pack: 'discipline',
    title: 'Control the controllable',
    hook: 'Peace starts when you stop negotiating with things you cannot move.',
    body: 'Separate what you can act on from what you only complain about. Your job is the next honest move, not controlling every reaction around you.'
  },
  {
    id: 'book-meaning-hardship',
    area: 'Philosophy',
    mood: 'Stressed',
    pack: 'comeback',
    title: 'Give the hard thing a job',
    hook: 'Pain gets heavier when it has no meaning.',
    body: 'Pick what this rough season is supposed to build in you: patience, skill, courage, discipline, or self-respect. Then act like that is the training.'
  },
  {
    id: 'book-habit-cue',
    area: 'Habits',
    mood: 'Need focus',
    pack: 'discipline',
    title: 'Design the cue',
    hook: 'Discipline is easier when the room helps you.',
    body: 'Do not rely only on mood. Put the useful action where your hand already goes and put the bad loop one step farther away.'
  },
  {
    id: 'book-deep-work',
    area: 'Focus',
    mood: 'Need focus',
    pack: 'focus',
    title: 'Protect one deep block',
    hook: 'Your best work needs a wall around it.',
    body: 'One focused block without tabs, messages, or checking gives more progress than a whole day of half-attention.'
  },
  {
    id: 'book-attention-cost',
    area: 'Focus',
    mood: 'Bored',
    pack: 'focus',
    title: 'Scrolling has a receipt',
    hook: 'Free apps still charge you attention.',
    body: 'Every random feed trains your brain to leave when work gets boring. Notice the cost before you open the loop.'
  },
  {
    id: 'book-influence-reciprocity',
    area: 'Influence',
    mood: 'Bored',
    pack: 'confidence',
    title: 'Give first, but stay awake',
    hook: 'Generosity builds trust. Forced favors build traps.',
    body: 'Use helpfulness to create real value, but notice when someone uses guilt to push you into a decision you did not choose.'
  },
  {
    id: 'book-manipulation-defense',
    area: 'Manipulation',
    mood: 'Stressed',
    pack: 'confidence',
    title: 'Slow pressure down',
    hook: 'Manipulation hates a pause.',
    body: 'When someone rushes you, flatters you, threatens loss, or makes the deal feel secret, slow the situation down before answering.'
  },
  {
    id: 'book-strategy-second-order',
    area: 'Strategy',
    mood: 'Need focus',
    pack: 'work',
    title: 'Think one move later',
    hook: 'Smart choices survive the second consequence.',
    body: 'Before acting, ask what this creates tomorrow: more options, fewer options, debt, trust, skill, or drama.'
  },
  {
    id: 'book-money-pay-yourself',
    area: 'Money',
    mood: 'Money ideas',
    pack: 'income',
    title: 'Keep a piece first',
    hook: 'If every euro leaves, you are only passing money through your hands.',
    body: 'Before spending expands, decide the small percentage that stays with you. Wealth starts as a habit before it becomes a number.'
  },
  {
    id: 'book-money-assets',
    area: 'Money',
    mood: 'Money ideas',
    pack: 'income',
    title: 'Buy less future stress',
    hook: 'An asset is anything that makes tomorrow lighter.',
    body: 'Skills, savings, tools, useful relationships, and simple systems can all reduce future pressure. Pick one that fits your current level.'
  },
  {
    id: 'book-thinking-bias',
    area: 'Mind',
    mood: 'Stressed',
    pack: 'starter',
    title: 'Your first thought is not always yours',
    hook: 'Fast reactions are useful, but they are not always accurate.',
    body: 'Before believing the panic story, ask what evidence supports it, what evidence weakens it, and what a calmer person would do next.'
  },
  {
    id: 'book-ego-check',
    area: 'Mind',
    mood: 'Need focus',
    pack: 'comeback',
    title: 'Ego wants applause, growth wants receipts',
    hook: 'Feeling talented is weaker than proving progress.',
    body: 'Choose the boring proof: reps done, money tracked, message sent, page studied, workout finished. Let evidence replace image.'
  },
  {
    id: 'book-listen-better',
    area: 'People',
    mood: 'Bored',
    pack: 'confidence',
    title: 'Make people feel heard',
    hook: 'Most people are starving for real attention.',
    body: 'Repeat the core point back, ask one specific follow-up, and do not rush to turn the story into yours.'
  },
  {
    id: 'book-boundaries',
    area: 'Relationships',
    mood: 'Stressed',
    pack: 'confidence',
    title: 'A boundary needs a behavior',
    hook: 'A boundary is not a speech. It is what you will do next.',
    body: 'Decide the action: leave, pause, stop replying, say no, or change the plan. Clear behavior beats emotional arguing.'
  },
  {
    id: 'book-economics-incentives',
    area: 'Economics',
    mood: 'Money ideas',
    pack: 'income',
    title: 'Follow the incentive',
    hook: 'People often move toward what gets rewarded.',
    body: 'Before judging a situation, ask who gains, who pays, who avoids risk, and what behavior the system quietly encourages.'
  },
  {
    id: 'book-eco-systems',
    area: 'Environment',
    mood: 'Need focus',
    pack: 'starter',
    title: 'Small waste repeats',
    hook: 'The environment problem also lives in daily habits.',
    body: 'Look for one repeating waste pattern: food, power, clothes, transport, plastic, or impulse buying. Fix the repeat, not just one moment.'
  },
  {
    id: 'book-motivation-action',
    area: 'Motivation',
    mood: 'Bored',
    pack: 'discipline',
    title: 'Action creates motivation',
    hook: 'Waiting to feel ready is a beautiful way to stay stuck.',
    body: 'Start badly for two minutes. Momentum usually arrives after movement, not before it.'
  },
  {
    id: 'book-targeting-one-person',
    area: 'Targeting',
    mood: 'Money ideas',
    pack: 'work',
    title: 'Aim at one real person',
    hook: 'Everyone is too blurry to build for.',
    body: 'Pick one person with one painful problem and one situation where they feel it. Clear targeting makes ideas easier to sell or improve.'
  }
];

const bookActionMoves = {
  'book-stoic-control': 'Write two columns: mine to act on, not mine to control. Do one from the first column.',
  'book-meaning-hardship': 'Name what this season is training, then do one rep that matches it.',
  'book-habit-cue': 'Move one useful cue closer and one bad cue farther away.',
  'book-deep-work': 'Set a 25-minute block with one task and no switching.',
  'book-attention-cost': 'Before opening a feed, say the task you are avoiding out loud.',
  'book-influence-reciprocity': 'Do one useful favor without pressure, and notice one favor that feels like a hook.',
  'book-manipulation-defense': 'Use this sentence once: I need time to think before I answer.',
  'book-strategy-second-order': 'Ask what this choice creates tomorrow before you do it.',
  'book-money-pay-yourself': 'Pick a tiny percentage or amount that stays untouched next time money arrives.',
  'book-money-assets': 'Choose one future-stress reducer: skill, savings, tool, contact, or system.',
  'book-thinking-bias': 'Write the panic story, then write the boring evidence.',
  'book-ego-check': 'Replace one image goal with one proof goal today.',
  'book-listen-better': 'In your next conversation, ask a follow-up before giving your own story.',
  'book-boundaries': 'Choose the behavior behind one boundary before you need it.',
  'book-economics-incentives': 'For one situation, write who gains, who pays, and what gets rewarded.',
  'book-eco-systems': 'Find one repeating waste pattern and make it harder to repeat.',
  'book-motivation-action': 'Start the avoided thing for two minutes with permission to do it badly.',
  'book-targeting-one-person': 'Write one person, one painful problem, one moment they feel it.'
};

const baseInterestCategories = [
  { id: 'mind', label: 'Mind & emotions', detail: 'stress, confidence, identity, mental reset' },
  { id: 'focus', label: 'Focus & discipline', detail: 'attention, habits, motivation, phone loops' },
  { id: 'money', label: 'Money & career', detail: 'income, work, economics, selling, options' },
  { id: 'people', label: 'People & influence', detail: 'relationships, communication, manipulation defense' },
  { id: 'meaning', label: 'Philosophy & meaning', detail: 'stoicism, purpose, ethics, self-respect' },
  { id: 'body', label: 'Body & lifestyle', detail: 'sleep, energy, environment, routine' },
  { id: 'learning', label: 'Learning & strategy', detail: 'skills, decisions, systems, creativity' }
];

const baseBroadInterests = [
  { id: 'mindset', category: 'mind', label: 'Mindset', detail: 'confidence, emotions, self-talk', areas: ['Mind'], moods: ['Stressed'], packs: ['starter', 'confidence', 'work'] },
  { id: 'stress', category: 'mind', label: 'Stress control', detail: 'calm, pressure, overthinking', areas: ['Mind', 'Health'], moods: ['Stressed'], packs: ['starter', 'comeback'] },
  { id: 'mental-reset', category: 'mind', label: 'Mental reset', detail: 'spirals, bad days, recovery', areas: ['Mind', 'Philosophy'], moods: ['Stressed'], packs: ['comeback', 'starter'] },
  { id: 'confidence', category: 'mind', label: 'Confidence', detail: 'fear, action, self-respect', areas: ['Mind', 'People'], moods: ['Stressed', 'Bored'], packs: ['confidence'] },
  { id: 'focus', category: 'focus', label: 'Focus', detail: 'attention, phone loops, deep work', areas: ['Focus', 'Habits', 'Strategy'], moods: ['Need focus', 'Bored'], packs: ['focus', 'discipline'] },
  { id: 'discipline', category: 'focus', label: 'Discipline', detail: 'consistency, boring reps, standards', areas: ['Habits', 'Motivation'], moods: ['Need focus'], packs: ['discipline', 'comeback'] },
  { id: 'motivation', category: 'focus', label: 'Motivation', detail: 'starting, momentum, resistance', areas: ['Motivation', 'Habits'], moods: ['Bored', 'Need focus'], packs: ['discipline', 'starter'] },
  { id: 'procrastination', category: 'focus', label: 'Procrastination', detail: 'avoidance, tiny starts, friction', areas: ['Habits', 'Focus'], moods: ['Need focus', 'Bored'], packs: ['focus'] },
  { id: 'money', category: 'money', label: 'Money & work', detail: 'cash, jobs, income basics', areas: ['Money', 'Strategy'], moods: ['Money ideas'], packs: ['comeback', 'income', 'work'] },
  { id: 'finance', category: 'money', label: 'Personal finance', detail: 'saving, leaks, cash flow', areas: ['Money'], moods: ['Money ideas'], packs: ['income', 'comeback'] },
  { id: 'career', category: 'money', label: 'Career', detail: 'skills, jobs, leverage', areas: ['Learning', 'Strategy'], moods: ['Need focus', 'Money ideas'], packs: ['work', 'income'] },
  { id: 'economics', category: 'money', label: 'Economics', detail: 'incentives, tradeoffs, systems', areas: ['Economics', 'Money'], moods: ['Money ideas'], packs: ['income', 'work'] },
  { id: 'business', category: 'money', label: 'Business basics', detail: 'offers, profit, customers', areas: ['Money', 'Targeting'], moods: ['Money ideas'], packs: ['income', 'work'] },
  { id: 'people', category: 'people', label: 'People', detail: 'social confidence, talking', areas: ['People'], moods: ['Bored', 'Stressed'], packs: ['confidence', 'starter'] },
  { id: 'relationships', category: 'people', label: 'Relationships', detail: 'communication, boundaries', areas: ['Relationships', 'People', 'Mind'], moods: ['Stressed', 'Bored'], packs: ['confidence', 'starter'] },
  { id: 'influence', category: 'people', label: 'Influence', detail: 'trust, persuasion, social signals', areas: ['Influence', 'People'], moods: ['Bored', 'Money ideas'], packs: ['confidence', 'work'] },
  { id: 'manipulation', category: 'people', label: 'Manipulation defense', detail: 'pressure, guilt, rush tactics', areas: ['Manipulation', 'Mind'], moods: ['Stressed'], packs: ['confidence'] },
  { id: 'targeting', category: 'people', label: 'Targeting', detail: 'audience, offers, one clear person', areas: ['Targeting', 'Strategy'], moods: ['Money ideas', 'Need focus'], packs: ['work', 'income'] },
  { id: 'philosophy', category: 'meaning', label: 'Philosophy', detail: 'meaning, values, clear thinking', areas: ['Philosophy', 'Mind'], moods: ['Stressed', 'Need focus'], packs: ['starter', 'comeback'] },
  { id: 'stoicism', category: 'meaning', label: 'Stoicism', detail: 'control, patience, strong reactions', areas: ['Philosophy', 'Mind'], moods: ['Stressed'], packs: ['discipline', 'comeback'] },
  { id: 'purpose', category: 'meaning', label: 'Purpose', detail: 'direction, identity, hard seasons', areas: ['Philosophy', 'Motivation'], moods: ['Stressed', 'Need focus'], packs: ['comeback'] },
  { id: 'ethics', category: 'meaning', label: 'Ethics', detail: 'choices, character, consequences', areas: ['Philosophy', 'Strategy'], moods: ['Need focus'], packs: ['starter', 'work'] },
  { id: 'health', category: 'body', label: 'Health', detail: 'sleep, energy, recovery', areas: ['Health'], moods: ['Stressed', 'Need focus'], packs: ['work', 'starter'] },
  { id: 'sleep', category: 'body', label: 'Sleep', detail: 'recovery, mood, decisions', areas: ['Health', 'Focus'], moods: ['Stressed', 'Need focus'], packs: ['starter'] },
  { id: 'energy', category: 'body', label: 'Energy', detail: 'movement, food, daily rhythm', areas: ['Health', 'Habits'], moods: ['Need focus'], packs: ['discipline', 'starter'] },
  { id: 'environment', category: 'body', label: 'Environment & eco', detail: 'waste, surroundings, daily systems', areas: ['Environment', 'Habits'], moods: ['Need focus'], packs: ['starter', 'work'] },
  { id: 'learning', category: 'learning', label: 'Learning', detail: 'skills, discipline, growth', areas: ['Learning', 'Habits'], moods: ['Need focus'], packs: ['discipline', 'income'] },
  { id: 'strategy', category: 'learning', label: 'Strategy', detail: 'tradeoffs, priorities, second order', areas: ['Strategy'], moods: ['Need focus', 'Money ideas'], packs: ['work', 'income'] },
  { id: 'decision-making', category: 'learning', label: 'Decision making', detail: 'bias, options, consequences', areas: ['Mind', 'Strategy'], moods: ['Need focus', 'Stressed'], packs: ['work', 'starter'] },
  { id: 'life', category: 'learning', label: 'Life skills', detail: 'decisions, routines, resets', areas: ['Life', 'Strategy', 'Mind'], moods: ['Need focus', 'Stressed'], packs: ['starter', 'comeback'] }
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

const interestCategories = [...baseInterestCategories, ...knowledgeInterestCategories];
const broadInterests = [...baseBroadInterests, ...knowledgeInterests];
const allLessons = [...baseLessons, ...bookLessons, ...extraLessons, ...knowledgeLessons];
const allActionMoves = { ...baseActionMoves, ...bookActionMoves, ...extraActionMoves, ...knowledgeActionMoves };
const allQuotes = [...dailyQuotes, ...famousQuotes];

const quizBank = [
  {
    id: 'control',
    areas: ['Philosophy', 'Mind', 'Stress'],
    prompt: 'Which answers are inside your control today?',
    options: [
      { text: 'The next useful action', correct: true },
      { text: 'How someone reacts', correct: false },
      { text: 'Whether you pause before replying', correct: true },
      { text: 'The past mistake changing itself', correct: false },
      { text: 'What you practice for 10 minutes', correct: true }
    ]
  },
  {
    id: 'money-leaks',
    areas: ['Money', 'Economics'],
    prompt: 'Which choices help you understand your money better?',
    options: [
      { text: 'Writing income and real costs', correct: true },
      { text: 'Ignoring small repeat payments', correct: false },
      { text: 'Checking bill dates before spending', correct: true },
      { text: 'Counting revenue as profit', correct: false },
      { text: 'Keeping a small amount before lifestyle expands', correct: true }
    ]
  },
  {
    id: 'focus',
    areas: ['Focus', 'Habits', 'Motivation'],
    prompt: 'Which moves protect focus?',
    options: [
      { text: 'One task for a timed block', correct: true },
      { text: 'Checking messages between every step', correct: false },
      { text: 'Moving the phone one room away', correct: true },
      { text: 'Waiting until motivation arrives first', correct: false },
      { text: 'Starting badly for two minutes', correct: true }
    ]
  },
  {
    id: 'influence-defense',
    areas: ['Influence', 'Manipulation', 'People', 'Relationships'],
    prompt: 'Which signs mean you should slow a decision down?',
    options: [
      { text: 'They rush you with a fake deadline', correct: true },
      { text: 'They give clear facts and time to think', correct: false },
      { text: 'They use guilt to force yes', correct: true },
      { text: 'They let you compare options', correct: false },
      { text: 'They make the deal feel secret', correct: true }
    ]
  },
  {
    id: 'strategy',
    areas: ['Strategy', 'Learning', 'Targeting'],
    prompt: 'Which are second-order questions?',
    options: [
      { text: 'What does this create tomorrow?', correct: true },
      { text: 'Will this only feel good right now?', correct: true },
      { text: 'Who is the exact person this helps?', correct: true },
      { text: 'Can I avoid all discomfort forever?', correct: false },
      { text: 'Does this reduce or increase future options?', correct: true }
    ]
  },
  {
    id: 'eco-systems',
    areas: ['Environment', 'Health', 'Life'],
    prompt: 'Which are system fixes instead of one-time guilt fixes?',
    options: [
      { text: 'Making the wasteful choice harder to repeat', correct: true },
      { text: 'Feeling bad once and changing nothing', correct: false },
      { text: 'Planning food before buying random snacks', correct: true },
      { text: 'Leaving lights on because it is only one day', correct: false },
      { text: 'Changing the default route, basket, or setup', correct: true }
    ]
  },
  {
    id: 'boundaries',
    areas: ['Relationships', 'People', 'Mind'],
    prompt: 'Which are real boundaries?',
    options: [
      { text: 'Deciding what you will do if the line is crossed', correct: true },
      { text: 'Arguing until the other person becomes different', correct: false },
      { text: 'Leaving a conversation that keeps turning disrespectful', correct: true },
      { text: 'Saying yes while building resentment', correct: false },
      { text: 'Pausing replies when pressure gets unhealthy', correct: true }
    ]
  }
];

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
  return lesson?.action || allActionMoves[lesson?.id] || 'Use the idea once today, then keep moving.';
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

function getQuizForSession(day, session, attempt = 0) {
  const areas = session.map((lesson) => lesson.area);
  const pool = quizBank.filter((quiz) => quiz.areas.some((area) => areas.includes(area)));
  const usable = pool.length ? pool : quizBank;
  const seedText = `${day}-${attempt}-${session.map((lesson) => lesson.id).join('-')}`;
  const seed = seedText.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return usable[seed % usable.length];
}

function isCorrectQuizSelection(quiz, selected) {
  const selectedSet = new Set(selected);
  const correctIndexes = quiz.options
    .map((option, index) => option.correct ? index : null)
    .filter((index) => index !== null);
  if (selectedSet.size !== correctIndexes.length) return false;
  return correctIndexes.every((index) => selectedSet.has(index));
}

const swipeActionMeta = {
  Save: {
    mode: 'save',
    label: 'Saved',
    cue: 'Saved for later',
    detail: '+10 XP - moved to Saved',
    tone: 'save'
  },
  Done: {
    mode: 'done',
    label: 'Done',
    cue: 'Marked done',
    detail: '+15 XP - progress counted',
    tone: 'done'
  },
  Skip: {
    mode: 'skip',
    label: 'Skipped',
    cue: 'Skipped cleanly',
    detail: 'No XP - next card',
    tone: 'skip'
  }
};


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
  await LocalNotifications.cancel({ notifications: quoteNotificationIds() });
}

async function scheduleNativeQuoteReminders({ time, mood, activePack, interestIds, mode = 'background-flexible' }) {
  if (!Capacitor.isNativePlatform()) return { scheduled: false, message: 'Browser reminders only work while the app is open.' };
  const allowed = await ensureNativeNotificationPermission();
  if (!allowed) return { scheduled: false, message: 'Notification permission was not granted.' };

  if (mode === 'background-exact' && Capacitor.getPlatform() === 'android') {
    let exact = await LocalNotifications.checkExactNotificationSetting();
    if (exact.exact_alarm !== 'granted') exact = await LocalNotifications.changeExactNotificationSetting();
    if (exact.exact_alarm !== 'granted') {
      return { scheduled: false, message: 'Exact timing is not enabled in Android settings. Choose flexible timing or enable Alarms and reminders.' };
    }
  }

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
      schedule: { at, allowWhileIdle: mode === 'background-exact' },
      extra: { type: 'dailyQuote', quoteId: quote.id }
    };
  });

  await LocalNotifications.schedule({ notifications });
  const timing = mode === 'background-exact' ? 'exact' : 'battery-friendly';
  return { scheduled: true, message: `${timing} daily reminders active around ${time}.` };
}

function vibrateFallback(pattern = 10) {
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    navigator.vibrate(pattern);
  }
}

async function hapticImpact(style = ImpactStyle.Light, fallback = 10) {
  try {
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style });
      return;
    }
  } catch {
    // Fall through to browser vibration.
  }
  vibrateFallback(fallback);
}

async function hapticNotify(type = NotificationType.Success, fallback = [18, 20, 18]) {
  try {
    if (Capacitor.isNativePlatform()) {
      await Haptics.notification({ type });
      return;
    }
  } catch {
    // Fall through to browser vibration.
  }
  vibrateFallback(fallback);
}

async function hapticSelect(fallback = 7) {
  try {
    if (Capacitor.isNativePlatform()) {
      await Haptics.selectionChanged();
      return;
    }
  } catch {
    // Fall through to browser vibration.
  }
  vibrateFallback(fallback);
}

function hapticSwipe(mode) {
  if (mode === "skip") {
    hapticNotify(NotificationType.Warning, [12, 28, 12]);
    return;
  }
  if (mode === "done") {
    hapticNotify(NotificationType.Success, [16, 18, 28]);
    return;
  }
  hapticImpact(ImpactStyle.Medium, 18);
}

function getLevelFromXp(xp) {
  return Math.max(1, Math.floor(xp / 120) + 1);
}

function getLevelProgress(xp) {
  return Math.min(100, Math.round(((xp % 120) / 120) * 100));
}

function getXpToNextLevel(xp) {
  const remainder = xp % 120;
  return remainder === 0 ? 120 : 120 - remainder;
}

function isRunningStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function SkipLink() {
  function focusMain(event) {
    event.preventDefault();
    document.getElementById('main-content')?.focus();
  }

  return <a className='skipLink' href='#main-content' onClick={focusMain}>Skip to main content</a>;
}

const bottomNavigation = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'saved', label: 'Saved', icon: Library },
  { id: 'profile', label: 'Profile', icon: UserRound }
];

function routeFromHash() {
  if (!window.location.hash.startsWith('#/')) return null;
  return window.location.hash.slice(2).replace(/^\/+|\/+$/g, '') || 'home';
}

function BottomNavigation({ route, navigate }) {
  const activeRoot = route.startsWith('trip/') ? 'saved' : route.split('/')[0];
  return (
    <nav className='bottomNav' aria-label='Primary navigation'>
      {bottomNavigation.map(({ id, label, icon: Icon }) => (
        <button type='button' key={id} className={activeRoot === id ? 'active' : ''} aria-current={activeRoot === id ? 'page' : undefined} onClick={() => navigate(id === 'saved' ? 'saved/cards' : id)}>
          <Icon size={21} strokeWidth={activeRoot === id ? 2.4 : 1.8} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

function App() {
  const [progress, setProgress] = useState(readProgress);
  const [screen, setScreen] = useState(progress.tutorialSeen ? (progress.onboarded ? 'home' : 'onboarding') : 'tutorial');
  const [route, setRoute] = useState(() => routeFromHash() || 'home');
  const [selectedInterests, setSelectedInterests] = useState(progress.onboarded ? normalizeInterestIds(progress.interests) : []);
  const [activeMood, setActiveMood] = useState('Need focus');
  const [activePack, setActivePack] = useState(progress.activePack || 'all');
  const [quoteReminderTime, setQuoteReminderTime] = useState(progress.quoteReminderTime || '12:00');
  const [quoteMessage, setQuoteMessage] = useState('');
  const [quoteToast, setQuoteToast] = useState(null);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [quizAttempt, setQuizAttempt] = useState(0);
  const [quiz, setQuiz] = useState(null);
  const [quizSelected, setQuizSelected] = useState([]);
  const [pendingProgress, setPendingProgress] = useState(null);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [exitSwipe, setExitSwipe] = useState('');
  const [dragState, setDragState] = useState({ x: 0, y: 0, active: false });
  const [actionFlash, setActionFlash] = useState(null);
  const [sessionResult, setSessionResult] = useState(null);
  const [sessionMode, setSessionMode] = useState('learn');
  const [travelSession, setTravelSession] = useState([]);
  const [reminderMode, setReminderMode] = useState(progress.quoteReminderMode || 'off');
  const touchStartRef = useRef(null);
  const actionLockRef = useRef(false);
  const [swipeFeedback, setSwipeFeedback] = useState('');
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installMessage, setInstallMessage] = useState(isRunningStandalone() ? 'MindSwipe is installed on this device.' : '');
  const [isInstalled, setIsInstalled] = useState(isRunningStandalone);

  function commit(next) {
    const normalized = saveProgress(next);
    setProgress(normalized);
  }

  function navigate(nextRoute) {
    const clean = nextRoute.replace(/^\/+|\/+$/g, '') || 'home';
    setRoute(clean);
    const nextHash = `#/${clean}`;
    if (window.location.hash !== nextHash) window.history.pushState(null, '', nextHash);
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  const routeRoot = route.startsWith('trip/') ? 'trip' : route.split('/')[0];
  const activePage = routeRoot === 'profile' && route.endsWith('/quote') ? 'Quote'
    : routeRoot === 'profile' && route.endsWith('/settings') ? 'Settings'
      : routeRoot === 'saved' ? 'Saved'
        : routeRoot[0]?.toUpperCase() + routeRoot.slice(1);
  const savedView = ['cards', 'places', 'trips', 'recent'].includes(route.split('/')[1]) ? route.split('/')[1] : 'cards';

  const today = todayKey();
  const dailyQuote = useMemo(() => getDailyQuote(today, activeMood, activePack, selectedInterests), [today, activeMood, activePack, selectedInterests]);
  const yesterdayQuote = useMemo(() => getDailyQuote(dateKey(addDays(new Date(), -1)), activeMood, activePack, selectedInterests), [activeMood, activePack, selectedInterests]);

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
    const offset = (progress.sessions + quizAttempt * sessionSize) % Math.max(1, scored.length);
    return [...scored.slice(offset), ...scored.slice(0, offset)].slice(0, sessionSize);
  }, [activeMood, activePack, selectedInterests, progress.completed, progress.sessions, quizAttempt]);

  const savedLessons = allLessons.filter((lesson) => progress.saved.includes(lesson.id));
  const recentLessons = allLessons.filter((lesson) => progress.recent.includes(lesson.id)).slice(0, 6);
  const exploredAreas = [...new Set(recentLessons.map((lesson) => lesson.area))];
  const currentSession = sessionMode === 'explore' ? travelSession : nextSession;
  const currentLesson = currentSession[sessionIndex] || currentSession[0];
  const tutorialItems = [
    { label: 'Start', title: 'Start from the water button.', body: 'That opens the daily 3-card run. The app is built around fast action, not reading forever.', target: 'start' },
    { label: 'Swipe', title: 'Move the card, then let it fly.', body: 'Left saves it, down skips it, right marks it done. A real swipe throws the card off screen.', target: 'card' },
    { label: 'Check', title: 'Pass the streak check.', body: 'After 3 cards, one short quiz proves you understood the idea before the streak counts.', target: 'quiz' },
    { label: 'Quote', title: 'Use the quote reminder.', body: 'Pick a time and MindSwipe reminds you with a quote based on your mood and interests.', target: 'quote' }
  ];
  const activeTutorial = tutorialItems[tutorialStep] || tutorialItems[0];

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    function handleHashChange() {
      const nextRoute = routeFromHash();
      if (nextRoute) setRoute(nextRoute);
    }
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  useEffect(() => {
    if (progress.quoteReminderMode !== 'in-app' || !progress.quoteReminderTime) return undefined;
    const target = getNextReminderDate(progress.quoteReminderTime);
    const timeoutId = window.setTimeout(() => {
      if (progress.quoteNotifiedToday === today) return;
      hapticNotify(NotificationType.Success, [12, 18, 12]);
      const body = dailyQuote.source ? `${dailyQuote.text} - ${dailyQuote.source}` : dailyQuote.text;
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('MindSwipe daily quote', { body: `${body} ${dailyQuote.action}` });
      }
      setQuoteToast(dailyQuote);
      setProgress((current) => {
        const next = { ...current, quoteNotifiedToday: today };
        saveProgress(next);
        return next;
      });
    }, target.getTime() - Date.now());
    return () => window.clearTimeout(timeoutId);
  }, [dailyQuote, progress.quoteNotifiedToday, progress.quoteReminderMode, progress.quoteReminderTime, today]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform() || !progress.quoteReminderMode.startsWith('background-')) return;
    scheduleNativeQuoteReminders({ time: progress.quoteReminderTime, mood: activeMood, activePack, interestIds: selectedInterests, mode: progress.quoteReminderMode })
      .catch(() => setQuoteMessage('Native quote reminder needs notification permission.'));
  }, [activeMood, activePack, progress.quoteReminderMode, progress.quoteReminderTime, selectedInterests]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return undefined;
    let actionHandle;
    LocalNotifications.addListener('localNotificationActionPerformed', () => {
      setScreen('home');
      navigate('profile/quote');
    }).then((handle) => {
      actionHandle = handle;
    });
    return () => {
      if (actionHandle) actionHandle.remove();
    };
  }, []);

  useEffect(() => {
    function handleInstallPrompt(event) {
      event.preventDefault();
      setInstallPrompt(event);
      setInstallMessage('MindSwipe is ready to install.');
    }

    function handleInstalled() {
      setInstallPrompt(null);
      setIsInstalled(true);
      setInstallMessage('MindSwipe is installed and can open from your apps.');
    }

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  function toggleInterest(id) {
    hapticSelect();
    setSelectedInterests((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function finishOnboarding() {
    hapticImpact(ImpactStyle.Medium, 18);
    const next = { ...progress, onboarded: true, interests: selectedInterests, activePack };
    commit(next);
    setScreen('home');
  }

  function finishTutorial() {
    hapticImpact(ImpactStyle.Medium, 18);
    const next = { ...progress, tutorialSeen: true };
    commit(next);
    setScreen(progress.onboarded ? 'home' : 'onboarding');
  }

  async function enableQuoteReminder() {
    hapticImpact(ImpactStyle.Light, 8);
    if (reminderMode === 'off') {
      await disableQuoteReminder();
      return;
    }
    if (Capacitor.isNativePlatform() && reminderMode.startsWith('background-')) {
      const result = await scheduleNativeQuoteReminders({ time: quoteReminderTime, mood: activeMood, activePack, interestIds: selectedInterests, mode: reminderMode });
      commit({ ...progress, quoteReminderTime, quoteReminderEnabled: result.scheduled, quoteReminderMode: result.scheduled ? reminderMode : 'off' });
      setQuoteMessage(result.message);
      return;
    }

    await cancelNativeQuoteReminders();
    let message = 'In-app reminder saved. MindSwipe must be open at that time.';
    if ('Notification' in window) {
      const permission = Notification.permission === 'default' ? await Notification.requestPermission() : Notification.permission;
      message = permission === 'granted' ? 'In-app reminder ready while MindSwipe is open.' : 'In-app reminder saved; MindSwipe will show its own popup while open.';
    }
    commit({ ...progress, quoteReminderTime, quoteReminderEnabled: true, quoteReminderMode: 'in-app' });
    setQuoteMessage(message);
  }

  async function disableQuoteReminder() {
    hapticImpact(ImpactStyle.Light, 8);
    await cancelNativeQuoteReminders();
    setReminderMode('off');
    commit({ ...progress, quoteReminderEnabled: false, quoteReminderMode: 'off', quoteReminderTime });
    setQuoteMessage('Daily reminder turned off.');
  }

  function startSession(mood = activeMood) {
    hapticImpact(ImpactStyle.Medium, 18);
    setSessionMode('learn');
    setActiveMood(mood);
    actionLockRef.current = false;
    setSessionIndex(0);
    setSwipeFeedback('');
    setExitSwipe('');
    setDragState({ x: 0, y: 0, active: false });
    setActionFlash(null);
    setSessionResult(null);
    setQuiz(null);
    setQuizSelected([]);
    setPendingProgress(null);
    setScreen('session');
  }

  function startExploreSession(destinationId, category = 'Mixed') {
    const filtered = getTravelCards(destinationId, category);
    const filteredIds = new Set(filtered.map((item) => item.id));
    const fallback = getTravelCards(destinationId, 'Mixed').filter((item) => !filteredIds.has(item.id));
    const pool = [...filtered, ...fallback];
    if (!pool.length) {
      setQuoteMessage('No verified cards are available for this destination yet.');
      return;
    }
    const offset = (progress.exploreSessions * sessionSize) % pool.length;
    const rotated = [...pool.slice(offset), ...pool.slice(0, offset)].slice(0, sessionSize);
    hapticImpact(ImpactStyle.Medium, 18);
    setSessionMode('explore');
    setTravelSession(rotated);
    setSessionIndex(0);
    setSwipeFeedback('');
    setExitSwipe('');
    setDragState({ x: 0, y: 0, active: false });
    setActionFlash(null);
    setSessionResult(null);
    setQuiz(null);
    setQuizSelected([]);
    setPendingProgress(null);
    actionLockRef.current = false;
    setScreen('session');
  }

  function finishCard(lesson, mode) {
    if (!lesson) return;
    const flash = Object.values(swipeActionMeta).find((item) => item.mode === mode);
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

    if (sessionIndex >= currentSession.length - 1) {
      if (sessionMode === 'explore') {
        const result = completeSession(nextProgress, { today, mode: 'explore' });
        commit(result.progress);
        setSessionResult({
          streak: result.progress.streak,
          xp: result.progress.xp,
          newStreak: result.newStreak,
          quote: dailyQuote,
          mode: 'explore'
        });
        setSwipeFeedback('');
        setExitSwipe('');
        setDragState({ x: 0, y: 0, active: false });
        navigate('explore');
        setScreen('sessionComplete');
        return;
      }
      commit(nextProgress);
      setPendingProgress(nextProgress);
      setQuiz(getQuizForSession(today, currentSession, quizAttempt));
      setQuizSelected([]);
      setSwipeFeedback('');
      setExitSwipe('');
      setDragState({ x: 0, y: 0, active: false });
      setActionFlash(flash ? { ...flash, title: lesson.title } : null);
      setScreen('quiz');
      return;
    }

    commit(nextProgress);
    actionLockRef.current = false;
    setSessionIndex(sessionIndex + 1);
    setSwipeFeedback('');
    setExitSwipe('');
    setDragState({ x: 0, y: 0, active: false });
    setActionFlash(flash ? { ...flash, title: lesson.title } : null);
  }

  function handleCardPointerStart(event) {
    if (exitSwipe || actionLockRef.current) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    touchStartRef.current = { x: event.clientX, y: event.clientY };
    setDragState({ x: 0, y: 0, active: true });
    setSwipeFeedback('');
  }

  function handleCardPointerMove(event) {
    if (exitSwipe || actionLockRef.current) return;
    const touchStart = touchStartRef.current;
    if (!touchStart) return;
    const dx = event.clientX - touchStart.x;
    const dy = event.clientY - touchStart.y;
    const limitedX = Math.max(-120, Math.min(120, dx));
    const limitedY = Math.max(-24, Math.min(150, dy));
    setDragState({ x: limitedX, y: limitedY, active: true });
    if (Math.abs(dx) < 28 && Math.abs(dy) < 28) {
      setSwipeFeedback('');
      return;
    }
    if (Math.abs(dx) > Math.abs(dy)) {
      setSwipeFeedback(dx < 0 ? 'Save' : 'Done');
    } else if (dy > 0) {
      setSwipeFeedback('Skip');
    } else {
      setSwipeFeedback('');
    }
  }

  function handleCardPointerEnd(event) {
    if (exitSwipe || actionLockRef.current) return;
    const touchStart = touchStartRef.current;
    if (!touchStart) return;
    const dx = event.clientX - touchStart.x;
    const dy = event.clientY - touchStart.y;
    const horizontal = Math.abs(dx) > Math.abs(dy);
    touchStartRef.current = null;
    setSwipeFeedback('');
    setDragState({ x: 0, y: 0, active: false });

    if (horizontal && dx <= -64) {
      queueCardAction('save');
      return;
    }
    if (horizontal && dx >= 64) {
      queueCardAction('done');
      return;
    }
    if (!horizontal && dy >= 64) {
      queueCardAction('skip');
    }
  }

  function queueCardAction(mode) {
    if (exitSwipe || actionLockRef.current) return;
    actionLockRef.current = true;
    const labels = { save: 'Save', skip: 'Skip', done: 'Done' };
    const label = labels[mode];
    hapticSwipe(mode);
    setSwipeFeedback(label);
    setExitSwipe(label);
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 20 : 280;
    window.setTimeout(() => finishCard(currentLesson, mode), delay);
  }

  function scrollToInterestCategory(id) {
    hapticSelect();
    document.getElementById(`interest-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function toggleQuizAnswer(index) {
    hapticSelect();
    setQuizSelected((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  }

  function submitQuiz() {
    if (!quiz) return;
    if (!isCorrectQuizSelection(quiz, quizSelected)) {
      hapticNotify(NotificationType.Error, [30, 30, 30]);
      setPendingProgress(null);
      setQuizSelected([]);
      setQuizAttempt((current) => current + 1);
      setSessionIndex(0);
      setSwipeFeedback('');
      setActionFlash(null);
      setScreen('quizRetry');
      return;
    }

    hapticNotify(NotificationType.Success, [18, 20, 30]);
    const base = pendingProgress || progress;
    const result = completeSession(base, { today, mode: 'learn' });
    const nextProgress = result.progress;
    commit(result.progress);
    setSessionResult({
      streak: nextProgress.streak,
      xp: nextProgress.xp,
      newStreak: result.newStreak,
      quote: dailyQuote,
      mode: 'learn'
    });
    setPendingProgress(null);
    setQuiz(null);
    setQuizSelected([]);
    setQuizAttempt(0);
    setSwipeFeedback('');
    navigate('home');
    setScreen('sessionComplete');
  }

  function retryAfterQuiz() {
    hapticImpact(ImpactStyle.Medium, 18);
    actionLockRef.current = false;
    setQuiz(null);
    setQuizSelected([]);
    setPendingProgress(null);
    setSessionIndex(0);
    setExitSwipe('');
    setSwipeFeedback('');
    setDragState({ x: 0, y: 0, active: false });
    setActionFlash(null);
    setScreen('session');
  }

  function resetProgress() {
    if (!window.confirm('Reset all MindSwipe progress stored on this device? This cannot be undone.')) return;
    localStorage.removeItem(progressStorageKey);
    localStorage.removeItem(progressBackupKey);
    localStorage.removeItem(corruptProgressBackupKey);
    cancelNativeQuoteReminders().catch(() => {});
    const fresh = readProgress();
    setProgress(fresh);
    setSelectedInterests([]);
    setQuizAttempt(0);
    setQuiz(null);
    setQuizSelected([]);
    setPendingProgress(null);
    setTutorialStep(0);
    setExitSwipe('');
    setDragState({ x: 0, y: 0, active: false });
    setActionFlash(null);
    setSessionResult(null);
    setSessionMode('learn');
    setTravelSession([]);
    setReminderMode('off');
    actionLockRef.current = false;
    setSwipeFeedback('');
    setScreen('tutorial');
    navigate('home');
  }

  async function installMindSwipe() {
    if (!installPrompt) {
      setInstallMessage('In Chrome, open the browser menu and choose Install app or Add to Home screen.');
      return;
    }

    await installPrompt.prompt();
    const result = await installPrompt.userChoice;
    setInstallPrompt(null);
    setInstallMessage(result.outcome === 'accepted'
      ? 'Installation started. MindSwipe will appear with your apps.'
      : 'Installation was cancelled. You can install it later from Settings.');
  }

  if (screen === 'tutorial') {
    return (
      <>
      <SkipLink />
      <main id='main-content' className='appShell center tutorialShell' tabIndex='-1'>
        <section className='tutorialPanel' aria-labelledby='tutorial-title'>
          <div>
            <h1 id='tutorial-title'>Learn the app by touching the flow.</h1>
            <p>MindSwipe is three cards, one check, and one reminder. Tap each step and watch the part it uses.</p>
          </div>
          <div className='tutorialStage' data-focus={activeTutorial.target}>
            <div className='tutorialPhoneTop'>
              <MindSwipeLogo className='tutorialMiniLogo' />
              <span>MindSwipe</span>
              <strong>3</strong>
            </div>
            <button className='tutorialStartOrb' onClick={() => { hapticSelect(); setTutorialStep(1); }}>Start</button>
            <div className='tutorialCardPreview'>
              <span className='tutorialTopic'>Focus</span>
              <strong>Protect one deep block</strong>
              <p>Left Save - Down Skip - Right Done</p>
            </div>
            <div className='tutorialQuizPreview'>
              <span>A</span>
              <span>B</span>
              <span>C</span>
            </div>
            <div className='tutorialQuotePreview'>Quote 12:00</div>
          </div>
          <div className='tutorialStepper' aria-label='Tutorial steps'>
            {tutorialItems.map((item, index) => (
              <button key={item.label} className={tutorialStep === index ? 'active' : ''} aria-pressed={tutorialStep === index} onClick={() => { hapticSelect(); setTutorialStep(index); }}>
                {item.label}
              </button>
            ))}
          </div>
          <div className='tutorialExplain' aria-live='polite'>
            <strong>{activeTutorial.title}</strong>
            <p>{activeTutorial.body}</p>
          </div>
          <button className='primaryWide tutorialCta' onClick={finishTutorial}>
            I understood and want to better myself
          </button>
        </section>
      </main>
      </>
    );
  }

  if (screen === 'onboarding') {
    return (
      <>
      <SkipLink />
      <main id='main-content' className='appShell center' tabIndex='-1'>
        <section className='onboardingPanel' aria-labelledby='onboarding-title'>
          <h1 id='onboarding-title'>Pick what you want MindSwipe to help with.</h1>
          <p>Choose lanes that would genuinely make your next month better. Pick useful pressure points, not random boxes.</p>
          <div className='selectionMeter' role='status'>
            <strong>{selectedInterests.length} selected</strong>
            <span>{selectedInterests.length < 2 ? 'Pick at least 2 useful lanes to unlock your daily run.' : 'Good. Your daily cards will adapt around these lanes.'}</span>
          </div>
          <nav className='interestCategoryRail' aria-label='Interest categories'>
            {interestCategories.map((category) => (
              <button key={category.id} onClick={() => scrollToInterestCategory(category.id)}>
                <span>{category.label}</span>
                <strong>{broadInterests.filter((interest) => interest.category === category.id).length}</strong>
              </button>
            ))}
          </nav>
          <div className='interestSections'>
            {interestCategories.map((category) => (
              <section className='interestCategory' id={`interest-${category.id}`} key={category.id}>
                <div className='interestCategoryTitle'>
                  <h2>{category.label}<span>{broadInterests.filter((interest) => interest.category === category.id).length}</span></h2>
                  <span>{category.detail}</span>
                </div>
                <div className='interestGrid'>
                  {broadInterests.filter((interest) => interest.category === category.id).map((interest) => (
                    <button key={interest.id} className={selectedInterests.includes(interest.id) ? 'interestButton active' : 'interestButton'} aria-pressed={selectedInterests.includes(interest.id)} onClick={() => toggleInterest(interest.id)}>
                      <strong>{interest.label}</strong>
                      <span>{interest.detail}</span>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <section className='packGrid' aria-labelledby='content-style-title'>
            <h2 id='content-style-title' className='visuallyHidden'>Choose a content style</h2>
            {packOptions.map((pack) => (
              <button key={pack.id} className={activePack === pack.id ? 'packCard active' : 'packCard'} aria-pressed={activePack === pack.id} onClick={() => { hapticSelect(); setActivePack(pack.id); }}>
                <strong>{pack.label}</strong>
                <span>{pack.detail}</span>
              </button>
            ))}
          </section>
          <button className='primaryWide' disabled={selectedInterests.length < 2} onClick={finishOnboarding}>
            {selectedInterests.length < 2 ? 'Pick at least 2' : 'Start MindSwipe'}
          </button>
        </section>
      </main>
      </>
    );
  }

  if (screen === 'session') {
    const sessionCardClass = ['sessionCard', swipeFeedback ? `swipe${swipeFeedback}` : '', exitSwipe ? `exit${exitSwipe}` : ''].filter(Boolean).join(' ');
    const sessionPlace = currentLesson?.placeId ? getPlace(currentLesson.placeId) : null;
    const dragRotation = Math.max(-10, Math.min(10, dragState.x / 14));
    const sessionCardStyle = {
      '--drag-x': `${dragState.x}px`,
      '--drag-y': `${dragState.y}px`,
      '--drag-rotate': `${dragRotation}deg`
    };
    return (
      <>
      <SkipLink />
      <main id='main-content' className='appShell' tabIndex='-1'>
        <header className='appTop'>
<button className='iconButton' aria-label='Close session' onClick={() => { hapticImpact(ImpactStyle.Light, 8); setScreen('home'); }}><span className='closeMark' /></button>
<div className='sessionCounter' aria-label={`Card ${sessionIndex + 1} of ${currentSession.length}`}>
  <strong>{sessionIndex + 1} / {currentSession.length}</strong>
  <div className='sessionDots' aria-hidden='true'>
    {currentSession.map((lesson, index) => (
      <span key={lesson.id} className={index <= sessionIndex ? 'active' : ''} />
    ))}
  </div>
</div>
<span />
        </header>
        <article
className={sessionCardClass}
style={sessionCardStyle}
aria-labelledby='session-card-title'
aria-describedby='session-card-instructions'
onPointerDown={handleCardPointerStart}
onPointerMove={handleCardPointerMove}
onPointerUp={handleCardPointerEnd}
onPointerCancel={handleCardPointerEnd}
        >
{swipeFeedback ? <div className='swipeFeedback' role='status'>{swipeFeedback}</div> : null}
{sessionPlace?.image ? <img className='travelSessionImage' src={travelAssetUrl(sessionPlace.image.src)} alt={sessionPlace.image.alt} draggable='false' /> : null}
<div className='sessionMeta'><span className='pill'>{currentLesson.type === 'travel' ? currentLesson.category : currentLesson.area}</span>{currentLesson.type === 'travel' ? <span className='sessionModeLabel'><Compass size={14} /> Explore</span> : null}</div>
<h1 id='session-card-title'>{currentLesson.title}</h1>
<p className='sessionHook'>{currentLesson.hook}</p>
<p className='sessionBody'>{currentLesson.body}</p>
<div className='moveBox open'>
  <span className='miniLabel'>{currentLesson.type === 'travel' ? 'Notice this' : 'Tiny move'}</span>
  <strong>{getMove(currentLesson)}</strong>
</div>
{currentLesson.type === 'travel' ? (
  <details className='sessionSource' onPointerDown={(event) => event.stopPropagation()}>
    <summary>Source and verification</summary>
    <span>Verified {currentLesson.lastVerified}</span>
    {currentLesson.sources.map((source) => <a key={source.url} href={source.url} target='_blank' rel='noreferrer'>{source.name}</a>)}
  </details>
) : null}
<p id='session-card-instructions' className='visuallyHidden'>Swipe left to save, down to skip, or right to mark done. You can also use the three buttons below.</p>
<div className='gestureGuide gestureActions' aria-label='Card actions'>
  <button type='button' disabled={Boolean(exitSwipe)} onPointerDown={(event) => event.stopPropagation()} onClick={() => queueCardAction('save')}><ArrowLeft size={15} /><Bookmark size={18} />Save</button>
  <button type='button' disabled={Boolean(exitSwipe)} onPointerDown={(event) => event.stopPropagation()} onClick={() => queueCardAction('skip')}><ArrowDown size={18} />Skip</button>
  <button type='button' disabled={Boolean(exitSwipe)} onPointerDown={(event) => event.stopPropagation()} onClick={() => queueCardAction('done')}><Check size={18} />Done<ArrowRight size={15} /></button>
</div>
        </article>
        {actionFlash ? (
<div className={`actionFlash ${actionFlash.tone}`} role='status'>
  <strong>{actionFlash.cue}</strong>
  <span>{actionFlash.detail}</span>
</div>
        ) : null}
      </main>
      </>
    );
  }

  if (screen === 'quiz' && quiz) {
    const correctAnswerCount = quiz.options.filter((option) => option.correct).length;
    return (
      <>
      <SkipLink />
      <main id='main-content' className='appShell center' tabIndex='-1'>
        {actionFlash ? (
<div className={`actionFlash quizReady ${actionFlash.tone}`} role='status'>
  <strong>3 cards cleared</strong>
  <span>Pass this check and the streak counts.</span>
</div>
        ) : null}
        <section className='quizPanel'>
<div className='quizTopline'>
  <p className='eyebrow'>Streak check</p>
  <span>{quizSelected.length} picked</span>
</div>
<h1>{quiz.prompt}</h1>
<p className='quizHint'>Pick every answer that belongs. This one has {correctAnswerCount} correct {correctAnswerCount === 1 ? 'answer' : 'answers'}.</p>
<div className='quizOptions'>
  {quiz.options.map((option, index) => (
    <button
      key={option.text}
      className={quizSelected.includes(index) ? 'quizOption active' : 'quizOption'}
      aria-pressed={quizSelected.includes(index)}
      onClick={() => toggleQuizAnswer(index)}
    >
      <span>{String.fromCharCode(65 + index)}</span>
      <strong>{option.text}</strong>
    </button>
  ))}
</div>
<button className='primaryWide' onClick={submitQuiz} disabled={!quizSelected.length}>Lock answers</button>
        </section>
      </main>
      </>
    );
  }

  if (screen === 'quizRetry') {
    return (
      <>
      <SkipLink />
      <main id='main-content' className='appShell center' tabIndex='-1'>
        <section className='quizPanel'>
<p className='eyebrow'>Not counted yet</p>
<h1>Close, but the streak needs proof.</h1>
<p className='quizHint'>You keep the cards you saw, but today's streak only counts after a clean check. MindSwipe will give you a fresh 3-card run.</p>
<button className='primaryWide' onClick={retryAfterQuiz}>Retry with new cards</button>
<button className='secondaryWide' onClick={() => { hapticImpact(ImpactStyle.Light, 8); setScreen('home'); }}>Back home</button>
        </section>
      </main>
      </>
    );
  }

  if (screen === 'sessionComplete') {
    const result = sessionResult || { streak: progress.streak, xp: progress.xp, newStreak: false, quote: dailyQuote, mode: 'learn' };
    const exploreComplete = result.mode === 'explore';
    const level = getLevelFromXp(result.xp);
    const levelProgress = getLevelProgress(result.xp);
    const xpToNext = getXpToNextLevel(result.xp);
    return (
      <>
      <SkipLink />
      <main id='main-content' className='appShell center' tabIndex='-1'>
        <section className={`completePanel ${result.newStreak ? 'completeWin' : 'completeDone'}`}>
<div className='rewardBurst' aria-hidden='true'>
  <span />
  <span />
  <span />
  <span />
</div>
<div className='completeOrb'>
  <span>{result.newStreak ? '+1' : 'OK'}</span>
</div>
<p className='eyebrow'>{exploreComplete ? 'Explore complete' : result.newStreak ? 'Streak earned' : 'Daily run complete'}</p>
<h1>{result.newStreak ? `${result.streak} day streak` : 'Already counted today'}</h1>
<p className='quizHint'>{exploreComplete ? 'You finished 3 sourced destination cards and turned curiosity into a place you can use.' : 'You finished 3 cards, passed the check, and kept the loop clean.'}</p>
<div className='rewardTrack'>
  <div>
    <span>Level {level}</span>
    <strong>{xpToNext} XP to next level</strong>
  </div>
  <div className='rewardMeter' role='progressbar' aria-label='Level progress' aria-valuemin='0' aria-valuemax='100' aria-valuenow={levelProgress}>
    <span style={{ width: `${levelProgress}%` }} />
  </div>
</div>
<div className='rewardChips' aria-label='Rewards earned'>
  <span>Streak protected</span>
  <span>3 cards cleared</span>
  <span>{exploreComplete ? 'Destination explored' : 'Quiz passed'}</span>
</div>
<div className='completeStats'>
  <div><strong>{result.xp}</strong><span>XP</span></div>
  <div><strong>{result.streak}</strong><span>streak</span></div>
  <div><strong>3</strong><span>cards</span></div>
</div>
<article className='completeQuote'>
  <span>Keep in mind</span>
  <strong>{result.quote.text}</strong>
</article>
<button className='primaryWide' onClick={() => { hapticImpact(ImpactStyle.Light, 8); navigate(exploreComplete ? 'explore' : 'home'); setScreen('home'); }}>{exploreComplete ? 'Back to Explore' : 'Back home'}</button>
<button className='secondaryWide' onClick={() => exploreComplete ? startExploreSession(progress.lastDestinationId, progress.travelCategory) : startSession(activeMood)}>Another run</button>
        </section>
      </main>
      </>
    );
  }

  if (routeRoot === 'trip') {
    const tripId = route.split('/')[1];
    const trip = progress.trips.find((item) => item.id === tripId);
    return (
      <>
        <SkipLink />
        <main id='main-content' className='appShell v2Shell' tabIndex='-1'>
          {trip ? <TripEditor trip={trip} progress={progress} commit={commit} navigate={navigate} /> : (
            <section className='missingRoute'>
              <MapPin size={30} />
              <h1>Trip not found</h1>
              <p>This trip may have been removed from local storage.</p>
              <button type='button' className='primaryWide' onClick={() => navigate('saved/trips')}>Back to trips</button>
            </section>
          )}
          <BottomNavigation route={route} navigate={navigate} />
        </main>
      </>
    );
  }

  return (
    <>
    <SkipLink />
    <main id='main-content' className='appShell v2Shell' tabIndex='-1'>
      <header className='appTop'>
        <span className='topSpacer' aria-hidden='true' />
        <div className='brandLockup'>
          <MindSwipeLogo className='topLogo' />
          <h1 className='brandTitle'>MindSwipe</h1>
        </div>
        <button className='iconButton streakButton' aria-label={`Profile, ${progress.streak} day streak`} onClick={() => { hapticSelect(); navigate('profile'); }}><span className='smallLabel'>{progress.streak}</span></button>
      </header>


{activePage === 'Home' ? (
  <section className='homeHero'>
    <div className='homeContent'>
      <div className='homeStatusRow'>
        <span className='streakChip'>{progress.streak} day streak</span>
        <span className='miniMetric'>Level {getLevelFromXp(progress.xp)}</span>
      </div>
      <div className='startOrbWrap'>
        <button className='bigStart' onClick={() => startSession(activeMood)}>
          <span>Start</span>
          <small>3 useful cards</small>
        </button>
      </div>
      <button type='button' className='homeExploreEntry' onClick={() => navigate('explore')}>
        <span><Compass size={20} />Explore the Netherlands</span>
        <strong>Amsterdam, Utrecht, Rotterdam</strong>
        <ArrowRight size={19} />
      </button>
      <section className='todayQuotePreview'>
        <p>{progress.quoteReminderEnabled ? "Today's reminder" : "Today's thought"}</p>
        <strong>{progress.quoteReminderEnabled ? dailyQuote.text : yesterdayQuote.text}</strong>
        <button type='button' className='inlineLink' onClick={() => navigate('profile/quote')}>Reminder settings</button>
      </section>
      <section className='recentPanel'>
        <div className='sectionHeader compact'>
          <span>Recent themes</span>
          <button type='button' className='inlineLink' onClick={() => navigate('saved/recent')}>View trail</button>
        </div>
        <div className='recentList'>
          {(exploredAreas.length ? exploredAreas : nextSession.map((lesson) => lesson.area)).map((area) => <span key={area}>{area}</span>)}
        </div>
      </section>
    </div>
  </section>
) : null}

{activePage === 'Learn' ? (
  <section className='dashboardPage learnPage'>
    <div className='pageIntro'>
      <span>Learn mode</span>
      <h2>Three cards. One useful action.</h2>
      <p>Your interests shape the order. The streak check keeps the swipe honest.</p>
    </div>
    <section className='learnLaunch'>
      <div className='sectionHeader compact'><span>Today feels like</span><strong>{activeMood}</strong></div>
      <div className='moodGrid'>
        {moodOptions.map((mood) => (
          <button type='button' key={mood.label} className={activeMood === mood.label ? 'active' : ''} aria-pressed={activeMood === mood.label} onClick={() => setActiveMood(mood.label)}>
            <strong>{mood.label}</strong><span>{mood.detail}</span>
          </button>
        ))}
      </div>
      <div className='sectionHeader compact'><span>Content style</span><strong>{packOptions.find((pack) => pack.id === activePack)?.label || 'All styles'}</strong></div>
      <div className='filterRail packRail' aria-label='Content style'>
        {packOptions.map((pack) => <button type='button' key={pack.id} className={activePack === pack.id ? 'active' : ''} aria-pressed={activePack === pack.id} onClick={() => { setActivePack(pack.id); commit({ ...progress, activePack: pack.id }); }}>{pack.label}</button>)}
      </div>
      <button type='button' className='primaryWide learnStart' onClick={() => startSession(activeMood)}><BookOpen size={19} />Start Learn</button>
    </section>
    <section className='learnTopics'>
      <div className='sectionHeader'><span>Your lanes</span><button type='button' className='inlineLink' onClick={() => setScreen('onboarding')}>Edit interests</button></div>
      <div className='recentList'>
        {selectedInterests.map((id) => broadInterests.find((interest) => interest.id === id)?.label).filter(Boolean).map((label) => <span key={label}>{label}</span>)}
      </div>
    </section>
  </section>
) : null}

{activePage === 'Explore' ? <ExplorePage progress={progress} commit={commit} onStartExplore={startExploreSession} navigate={navigate} /> : null}

{activePage === 'Saved' ? <SavedPage progress={progress} commit={commit} learnLessons={allLessons} getLearnMove={getMove} view={savedView} navigate={navigate} /> : null}


{activePage === 'Quote' ? (
  <section className='dashboardPage'>
    <div className='pageIntro'>
      <span>Daily reminder</span>
      <h2>Set the quote when it will actually hit.</h2>
      <p>Choose how precise the reminder needs to be. Exact Android timing is optional and asks for a special system setting only when selected.</p>
    </div>
    <article className='quoteCardLarge'>
      <span className='quoteSource'>{dailyQuote.source || 'MindSwipe'}</span>
      <h2>{dailyQuote.text}</h2>
      <p className='quoteActionText'>{dailyQuote.action}</p>
    </article>
    <div className='sectionHeader compact'>
      <span>Reminder time</span>
      <strong>{quoteReminderTime}</strong>
    </div>
    <div className='quickTimes'>
      {reminderPresets.map((preset) => (
        <button key={preset.time} className={quoteReminderTime === preset.time ? 'active' : ''} onClick={() => setQuoteReminderTime(preset.time)}>
          {preset.label} {preset.time}
        </button>
      ))}
    </div>
    <fieldset className='reminderModes'>
      <legend>Delivery mode</legend>
      <button type='button' className={reminderMode === 'in-app' ? 'active' : ''} aria-pressed={reminderMode === 'in-app'} onClick={() => setReminderMode('in-app')}>
        <Bell size={18} /><span><strong>While open</strong><small>No special Android setting</small></span>
      </button>
      <button type='button' disabled={!Capacitor.isNativePlatform()} className={reminderMode === 'background-flexible' ? 'active' : ''} aria-pressed={reminderMode === 'background-flexible'} onClick={() => setReminderMode('background-flexible')}>
        <Bell size={18} /><span><strong>Background flexible</strong><small>Android may deliver near the chosen time</small></span>
      </button>
      <button type='button' disabled={!Capacitor.isNativePlatform()} className={reminderMode === 'background-exact' ? 'active' : ''} aria-pressed={reminderMode === 'background-exact'} onClick={() => setReminderMode('background-exact')}>
        <Bell size={18} /><span><strong>Background exact</strong><small>Requires Android Alarms and reminders access</small></span>
      </button>
      {!Capacitor.isNativePlatform() ? <p>Install the Android build to use background delivery. The web app can remind you only while it is open.</p> : null}
    </fieldset>
    <div className='reminderRow'>
      <input aria-label='Quote reminder time' type='time' value={quoteReminderTime} onChange={(event) => setQuoteReminderTime(event.target.value)} />
      <button className='secondary' onClick={enableQuoteReminder} disabled={reminderMode === 'off'}>{progress.quoteReminderEnabled ? 'Update' : 'Turn on'}</button>
    </div>
    {progress.quoteReminderEnabled ? <button className='secondaryWide dangerText' onClick={disableQuoteReminder}>Turn off reminder</button> : null}
    {quoteMessage ? <p className='statusLine' role='status'>{quoteMessage}</p> : null}
  </section>
) : null}


{activePage === 'Profile' ? (
  <section className='dashboardPage'>
    <div className='pageIntro centerIntro'>
      <span>Progress</span>
      <h2>{progress.streak ? `${progress.streak} day streak` : 'First streak is waiting'}</h2>
      <p>{progress.sessions ? `${progress.sessions} completed runs so far.` : 'Finish a run and pass the check to start building momentum.'}</p>
    </div>
    <div className='statGrid'>
      <div><strong>{progress.xp}</strong><span>XP</span></div>
      <div><strong>{progress.streak}</strong><span>streak</span></div>
      <div><strong>{progress.completed.length}</strong><span>done cards</span></div>
    </div>
    <section className='cleanPanel'>
      <div className='sectionHeader'>
        <span>Badges</span>
        <strong>{[progress.sessions > 0, savedLessons.length > 0, progress.quoteReminderEnabled, progress.streak >= 7].filter(Boolean).length}/4</strong>
      </div>
      <div className='badgeGrid'>
        <div><strong>First swipe</strong><span>{progress.sessions > 0 ? 'Unlocked' : 'Locked'}</span></div>
        <div><strong>Saved one</strong><span>{savedLessons.length ? 'Unlocked' : 'Locked'}</span></div>
        <div><strong>Reminder set</strong><span>{progress.quoteReminderEnabled ? 'Unlocked' : 'Locked'}</span></div>
        <div><strong>Comeback week</strong><span>{progress.streak >= 7 ? 'Unlocked' : 'Locked'}</span></div>
      </div>
    </section>
    <section className='cleanPanel menuList profileMenu'>
      <button type='button' onClick={() => navigate('profile/quote')}><Bell size={19} />Quote reminder<span>{progress.quoteReminderEnabled ? progress.quoteReminderTime : 'Off'}</span></button>
      <button type='button' onClick={() => navigate('profile/settings')}><Settings size={19} />Settings<span>Open</span></button>
    </section>
  </section>
) : null}


{activePage === 'Settings' ? (
  <section className='dashboardPage'>
    <div className='pageIntro'>
      <span>Controls</span>
      <h2>Keep the app tuned to you.</h2>
      <p>These are the main controls for interests, reminders, support, and local data.</p>
    </div>
    <section className='cleanPanel menuList'>
      <div className='sectionHeader'>
        <span>Preferences</span>
        <strong>Local</strong>
      </div>
      <button onClick={() => setScreen('onboarding')}>Edit interests<span>Open</span></button>
      <button onClick={() => { hapticSelect(); navigate('profile/quote'); }}>Notifications<span>Open</span></button>
      <button onClick={installMindSwipe} disabled={isInstalled}>Install MindSwipe<span>{isInstalled ? 'Installed' : installPrompt ? 'Ready' : 'Chrome menu'}</span></button>
      <button disabled>Appearance<span>Noir / ivory</span></button>
      <a href='https://github.com/daniel-techAI/MindSwipe/issues' target='_blank' rel='noreferrer'>Contact & support<span>GitHub, new tab</span></a>
      <a href={`${import.meta.env.BASE_URL}privacy.html`}>Privacy policy<span>Open</span></a>
      <button className='dangerText' onClick={resetProgress}>Reset local progress<span>Reset</span></button>
    </section>
    {installMessage ? <p className='statusLine' role='status'>{installMessage}</p> : null}
  </section>
) : null}

      {!progress.v2IntroSeen ? (
        <div className='modalBackdrop v2IntroBackdrop' role='presentation'>
          <section className='v2Welcome' role='dialog' aria-modal='true' aria-labelledby='v2-welcome-title'>
            <MindSwipeLogo className='v2WelcomeLogo' />
            <p className='eyebrow'>MindSwipe V2</p>
            <h2 id='v2-welcome-title'>Learn here. Explore out there.</h2>
            <p>Learn keeps your focused three-card runs. Explore adds sourced destination cards, useful places, and local trips for Amsterdam, Utrecht, and Rotterdam.</p>
            <div><span><BookOpen size={18} />Learn</span><span><Compass size={18} />Explore</span><span><MapPin size={18} />Plan</span></div>
            <button type='button' className='primaryWide' onClick={() => commit({ ...progress, v2IntroSeen: true })}>Enter MindSwipe</button>
          </section>
        </div>
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
      <BottomNavigation route={route} navigate={navigate} />
    </main>
    </>
  );
}

if (import.meta.env.PROD && !Capacitor.isNativePlatform()) {
  registerMindSwipeServiceWorker().catch(() => {
    // The web app still works online when service-worker registration is unavailable.
  });
}

createRoot(document.getElementById('root')).render(<App />);
