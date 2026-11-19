// Filters: the kind chips, grade and earned selectors, the search box and the
// spoiler setting. One function decides whether a trophy is shown.

export const KIND_LABELS = {
  all: 'All trophies',
  story: 'Story',
  missable: 'Missable',
  collectibles: 'Collectibles',
  activities: 'Activities',
  side: 'Side quests',
  combat: 'Combat',
  robbery: 'Robbery',
  exploration: 'Exploration',
  money: 'Money',
  misc: 'One-offs',
  online: 'Online',
};

export const KIND_ORDER = [
  'all', 'story', 'missable', 'collectibles', 'activities', 'side',
  'combat', 'robbery', 'exploration', 'money', 'misc', 'online',
];

// The game has no online trophies at all, so the online filter always matches
// nothing; the tracker says so instead of looking broken.
export function trophyMatches(trophy, filters, earnedIds) {
  if (filters.kind === 'missable' && !trophy.missable) return false;
  if (filters.kind === 'online') return false;
  if (filters.kind !== 'all' && filters.kind !== 'missable' && !trophy.kinds.includes(filters.kind)) return false;
  if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
  if (filters.earned === 'earned' && !earnedIds.has(trophy.id)) return false;
  if (filters.earned === 'missing' && earnedIds.has(trophy.id)) return false;
  if (filters.search) {
    const haystack = `${trophy.name} ${trophy.description} ${trophy.guide} ${trophy.kinds.join(' ')}`.toLowerCase();
    if (!haystack.includes(filters.search.toLowerCase())) return false;
  }
  return true;
}

// A hidden story trophy stays spoiler-free (name and description replaced)
// while the spoiler setting is on and the trophy is not yet earned.
export function isSpoilerHidden(trophy, spoilerOn, earnedIds) {
  return spoilerOn && trophy.hidden && !earnedIds.has(trophy.id);
}
