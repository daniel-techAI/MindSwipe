export const knowledgeLessons = [
  {
    id: 'ai-output-is-evidence', area: 'AI', mood: 'Need focus', pack: 'work',
    title: 'Treat AI output as a draft', hook: 'Fluent is not the same as verified.',
    body: 'AI can produce confident mistakes. Use it to create options, then check important claims against reliable sources before you act.',
    sourceName: 'NIST AI Risk Management Framework', sourceUrl: 'https://www.nist.gov/itl/ai-risk-management-framework'
  },
  {
    id: 'ai-evaluate-first', area: 'AI', mood: 'Money ideas', pack: 'work',
    title: 'Define the test before the prompt', hook: 'A clever output is useless without a success condition.',
    body: 'Write what a good answer must contain, what it must avoid, and how you will verify it. Evaluation turns prompting from guessing into a repeatable process.',
    sourceName: 'NIST AI Risk Management Framework', sourceUrl: 'https://www.nist.gov/itl/ai-risk-management-framework'
  },
  {
    id: 'science-change-one-variable', area: 'Science', mood: 'Need focus', pack: 'focus',
    title: 'Change one variable', hook: 'When everything changes, you learn almost nothing.',
    body: 'Keep the rest of a small experiment stable and change one factor. The result will not prove everything, but it gives you cleaner evidence about what mattered.',
    sourceName: 'Understanding Science, UC Berkeley', sourceUrl: 'https://undsci.berkeley.edu/understanding-science-101/how-science-works/'
  },
  {
    id: 'science-correlation', area: 'Science', mood: 'Bored', pack: 'starter',
    title: 'Correlation needs another question', hook: 'Two things moving together does not prove one caused the other.',
    body: 'A third factor, reverse direction, or coincidence may explain the pattern. Ask what mechanism and comparison would separate those possibilities.',
    sourceName: 'National Academies, Reproducibility and Replicability in Science', sourceUrl: 'https://nap.nationalacademies.org/catalog/25303/reproducibility-and-replicability-in-science'
  },
  {
    id: 'history-source-position', area: 'History', mood: 'Bored', pack: 'starter',
    title: 'Ask who made the record', hook: 'Every source has a position, purpose, and missing view.',
    body: 'Before trusting a historical account, ask who created it, when, for whom, and what they could gain or fear. Context changes what the document can prove.',
    sourceName: 'Library of Congress primary source analysis', sourceUrl: 'https://www.loc.gov/programs/teachers/getting-started-with-primary-sources/guides/'
  },
  {
    id: 'history-primary-secondary', area: 'History', mood: 'Need focus', pack: 'starter',
    title: 'Use sources for different jobs', hook: 'A diary and a textbook answer different questions.',
    body: 'Primary sources expose a perspective from the time. Secondary sources compare evidence and interpretation. Strong understanding usually needs both.',
    sourceName: 'Library of Congress primary source analysis', sourceUrl: 'https://www.loc.gov/programs/teachers/getting-started-with-primary-sources/'
  },
  {
    id: 'psych-implementation-intention', area: 'Psychology', mood: 'Need focus', pack: 'discipline',
    title: 'Give the intention a trigger', hook: 'I will do it later leaves the decision open.',
    body: 'Use an if-then plan: if a clear situation occurs, then I do one specific action. Linking a cue to behavior reduces the need to decide again in the moment.',
    sourceName: 'National Library of Medicine overview', sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/19703293/'
  },
  {
    id: 'psych-retrieval-practice', area: 'Psychology', mood: 'Need focus', pack: 'focus',
    title: 'Recall beats rereading', hook: 'Looking familiar can feel like knowing.',
    body: 'Close the page and retrieve the idea from memory. The effort exposes gaps and usually strengthens later recall more than another passive read.',
    sourceName: 'Dunlosky et al., Psychological Science in the Public Interest', sourceUrl: 'https://journals.sagepub.com/doi/10.1177/1529100612453266'
  },
  {
    id: 'business-problem-language', area: 'Business', mood: 'Money ideas', pack: 'income',
    title: 'Collect problem language', hook: 'Customers describe pain better than founders predict it.',
    body: 'Ask about the last real time the problem happened, what they tried, and what it cost. Their concrete words are better input than asking whether they like your idea.',
    sourceName: 'U.S. Small Business Administration market research guide', sourceUrl: 'https://www.sba.gov/business-guide/plan-your-business/market-research-competitive-analysis'
  },
  {
    id: 'economics-opportunity-cost', area: 'Economics', mood: 'Money ideas', pack: 'income',
    title: 'Count the option you gave up', hook: 'The price is not the whole cost.',
    body: 'Time, attention, and money used here cannot be used elsewhere. Compare the chosen option with the best realistic alternative you are giving up.',
    sourceName: 'Federal Reserve Education, opportunity cost', sourceUrl: 'https://www.stlouisfed.org/education/economic-lowdown-podcast-series/episode-1-opportunity-cost'
  },
  {
    id: 'social-check-understanding', area: 'Social skills', mood: 'Bored', pack: 'confidence',
    title: 'Check before you advise', hook: 'Being understood often matters before being fixed.',
    body: 'Reflect the main point in your own words and ask whether you got it right. Advice lands better after the other person knows you understood the problem.',
    sourceName: 'APA Dictionary, active listening', sourceUrl: 'https://dictionary.apa.org/active-listening'
  },
  {
    id: 'digital-friction', area: 'Digital life', mood: 'Bored', pack: 'focus',
    title: 'Add friction to the reflex', hook: 'A tiny obstacle can interrupt an automatic scroll.',
    body: 'Remove the shortcut, log out, or keep the phone outside reach during one task. The goal is not perfect willpower; it is enough time to make a conscious choice.',
    sourceName: 'American Psychological Association habit overview', sourceUrl: 'https://www.apa.org/topics/behavioral-health/healthy-habits'
  }
];

export const knowledgeActionMoves = {
  'ai-output-is-evidence': 'Pick one important AI claim and verify it with a primary or authoritative source.',
  'ai-evaluate-first': 'Write three checks your next AI answer must pass before you prompt it.',
  'science-change-one-variable': 'Turn one uncertain choice into a tiny one-variable test.',
  'science-correlation': 'For one pattern you noticed, write two explanations besides direct cause.',
  'history-source-position': 'Open one historical source and identify its creator, audience, date, and purpose.',
  'history-primary-secondary': 'Pair one firsthand source with one later analysis of the same event.',
  'psych-implementation-intention': 'Write one sentence: If [cue], then I will [small action].',
  'psych-retrieval-practice': 'Close what you studied and write five points from memory.',
  'business-problem-language': 'Ask one person about the last time their problem happened; do not pitch.',
  'economics-opportunity-cost': 'Name the best realistic alternative your next choice gives up.',
  'social-check-understanding': 'Reflect one person\'s point before giving your view.',
  'digital-friction': 'Move one distracting app one step farther from your reflex.'
};

export const knowledgeInterestCategories = [
  { id: 'world', label: 'World & ideas', detail: 'science, history, technology, AI' }
];

export const knowledgeInterests = [
  { id: 'ai', category: 'world', label: 'Artificial intelligence', detail: 'verification, evaluation, useful workflows', areas: ['AI'], moods: ['Need focus', 'Money ideas'], packs: ['work', 'focus'] },
  { id: 'science', category: 'world', label: 'Science', detail: 'evidence, experiments, causation', areas: ['Science'], moods: ['Need focus', 'Bored'], packs: ['focus', 'starter'] },
  { id: 'history', category: 'world', label: 'History', detail: 'sources, context, interpretation', areas: ['History'], moods: ['Bored', 'Need focus'], packs: ['starter'] },
  { id: 'psychology', category: 'world', label: 'Psychology', detail: 'memory, behavior, practical cognition', areas: ['Psychology', 'Mind'], moods: ['Need focus', 'Stressed'], packs: ['focus', 'discipline'] },
  { id: 'technology', category: 'world', label: 'Technology', detail: 'tools, digital choices, modern systems', areas: ['Digital life', 'AI'], moods: ['Bored', 'Need focus'], packs: ['work', 'focus'] },
  { id: 'social-skills', category: 'people', label: 'Social skills', detail: 'listening, clarity, useful conversations', areas: ['Social skills', 'People'], moods: ['Bored', 'Stressed'], packs: ['confidence'] }
];
