// The roadmap: three stages built from PowerPyx's roadmap and the official
// descriptions. Each stage lists what to do, how long it takes, and which
// trophy ids it covers, so the roadmap view can count them.

export const ROADMAP_STAGES = [
  {
    title: 'Stage 1 — Play the story',
    time: '60–80 hours',
    trophyIds: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 20, 21, 28],
    points: [
      'Finish the story: 5 chapters, ending with the final mission. The 12 story trophies (chapters 1–4, the final mission and the named missions) pop automatically as you go.',
      'Do the one thing that cannot wait: the Chapter 1 meditation at Jason\u2019s house (see Missables). It is the only trophy PowerPyx flags as potentially missable.',
      'Take the side calls as they come — Andy (Chapter 3, Lucia only), Kenton (Chapter 1), Billy (Chapter 2), Randy and Tyrone (Chapter 3) — but every one of their questlines stays open after the story.',
      'Scan vehicles with the WAiNK app and study animals with binoculars as you travel: the 100% checklist counts progress made during the story.',
      'Keep a save at the start and end of each chapter. There is no mission replay and no New Game+, so chapter saves are your safety net.',
    ],
  },
  {
    title: 'Stage 2 — The 100% completion checklist',
    time: 'about 100 hours',
    trophyIds: [14, 15, 17, 18, 25, 29, 30, 31, 32, 35, 40, 41, 42, 43, 52, 53, 54],
    points: [
      'After the credits the checklist appears under Progress, then Stats, then 100% Completion. It is lenient — closer to 60% true completion — and nothing on it is missable.',
      'Finish what the checklist needs in full: all robberies, all underwater discoveries, all shooting ranges, all drone races and all of Bret\u2019s quests.',
      'For the partial requirements, take the easy share: any 200 of 277 base-model vehicles scanned, any 100 of 255 animals studied, any 70 of 80 challenges, any 100 optional missions, any 15 of 18 meditations, 300 of 397 stunts.',
      'The checklist stage earns the gold A Long Road and, on the way, the silver trophies for stunts, shooting ranges, card sets and WAiNK scans, plus the robbery and money trophies.',
    ],
  },
  {
    title: 'Stage 3 — Strangers & Freaks and the one-offs',
    time: 'about 10 hours',
    trophyIds: [16, 19, 22, 23, 24, 26, 27, 33, 34, 36, 37, 38, 39, 44, 45, 46, 47, 48, 49, 50, 51, 55],
    points: [
      'Clean up the Strangers & Freaks strands that count (Kirk, Kyle, Yago, Pilot Pete and the rest) — they are not needed for 100%, so this is a separate pass.',
      'Sweep the one-off moments: the VCIA plane, the Rhino tank, the undetected jewelry robbery, the Ocean Beach cocktail and the showroom smash.',
      'Mop up the counters: 9 activity types, 20 different races, 5 enemies in one Combat Focus, 500 criminal-profile actions, 10 vehicles on the Scooter Bros app.',
      'The platinum, Vice Got a Price!, pops the moment the last of the other 54 is earned.',
    ],
  },
];

// How the 55 trophies group by what they ask of you, with the counts the
// roadmap view shows beside each group.
export const ROADMAP_GROUPS = [
  { count: 14, title: 'Story', text: 'Chapter and mission trophies, including the gold for the final mission. All automatic — finish the mission and the trophy pops.' },
  { count: 11, title: 'Side quests', text: 'The five character questlines (Andy, Kenton, Billy, Randy, Tyrone), the 8 Strangers & Freaks strands, Cal\u2019s fishing and Bret\u2019s hunts.' },
  { count: 13, title: 'Activities', text: 'Stunts, shooting ranges, drone races, races, challenges, arcade games, meditation, bowling and maxing both characters\u2019 strength.' },
  { count: 7, title: 'Robbery', text: 'Shops, jewelry stores, armored trucks, bank vaults and one illegal operation for each of the 9 gangs.' },
  { count: 6, title: 'Collectibles', text: 'Card sets, WAiNK scans, vehicle discoveries and exploring all 52 areas of Leonida.' },
  { count: 4, title: 'Money', text: 'Laundering $250,000 of marked bills, spending $100,000 in shops, buying all 8 garages and registering 10 vehicles.' },
  { count: 8, title: 'One-offs', text: 'Single moments and counters — the VCIA departure, the Rhino, the cocktail on Ocean Beach and the cryptic ones.' },
];
