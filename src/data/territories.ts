export interface Territory {
  id: string;
  name: string;
  kingdom: 'wei' | 'shu' | 'wu' | 'other';
  points: [number, number][];
  period: number;
}

export const kingdomColors = {
  wei: '#4a90d9', // Blue
  shu: '#e8613a', // Red/Coral
  wu: '#c8a85c', // Gold
  other: '#797876', // Gray
};

export const territoriesByPeriod: Territory[][] = [
  // Period 1: Late Eastern Han (184-220)
  [
    { id: 'han-empire', name: 'Han Empire', kingdom: 'other', points: [[-4, -3], [4, -3], [4, 3], [-4, 3]], period: 1 },
  ],

  // Period 2: Battle of Guandu (200)
  [
    { id: 'cao-cao', name: 'Cao Cao (North)', kingdom: 'wei', points: [[-4, 0], [0, 0], [0, 3], [-4, 3]], period: 2 },
    { id: 'yuan-shao', name: 'Yuan Shao (Defeated)', kingdom: 'other', points: [[0, 0], [2, 0], [2, 3], [0, 3]], period: 2 },
    { id: 'warlords-south', name: 'Southern Warlords', kingdom: 'other', points: [[-4, -3], [4, -3], [4, 0], [-4, 0]], period: 2 },
  ],

  // Period 3: Battle of Red Cliffs (208)
  [
    { id: 'wei-north', name: 'Wei (North)', kingdom: 'wei', points: [[-4, 0], [0, 0], [0, 3], [-4, 3]], period: 3 },
    { id: 'central-plain', name: 'Central Plain', kingdom: 'other', points: [[0, 0], [2, 0], [2, 2], [0, 2]], period: 3 },
    { id: 'shu-west', name: 'Shu (West)', kingdom: 'shu', points: [[-4, -3], [-1, -3], [-1, 0], [-4, 0]], period: 3 },
    { id: 'wu-south', name: 'Wu (South)', kingdom: 'wu', points: [[-1, -3], [4, -3], [4, 0], [-1, 0]], period: 3 },
  ],

  // Period 4: Three Kingdoms Established (220-280)
  [
    { id: 'wei-territory', name: 'Wei Kingdom', kingdom: 'wei', points: [[-4, 0], [0, 0], [0, 3], [-4, 3]], period: 4 },
    { id: 'shu-territory', name: 'Shu Han', kingdom: 'shu', points: [[-4, -3], [-1, -3], [-1, 0], [-4, 0]], period: 4 },
    { id: 'wu-territory', name: 'Wu Kingdom', kingdom: 'wu', points: [[-1, -3], [4, -3], [4, 0], [-1, 0]], period: 4 },
    { id: 'central-disputed', name: 'Disputed Territory', kingdom: 'other', points: [[0, 0], [2, 0], [2, 2], [0, 2]], period: 4 },
  ],

  // Period 5: Jin Dynasty Unification (280)
  [
    { id: 'jin-empire', name: 'Jin Dynasty', kingdom: 'other', points: [[-4, -3], [4, -3], [4, 3], [-4, 3]], period: 5 },
  ],
];

export const periodNames = [
  'Late Eastern Han (184-220)',
  'Battle of Guandu (200)',
  'Battle of Red Cliffs (208)',
  'Three Kingdoms Established (220-280)',
  'Jin Dynasty Unification (280)',
];
