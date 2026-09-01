export interface PhonicsWord {
  id: string;
  word: string;
  sounds: string[]; // e.g., ['c', 'a', 't']
  emoji: string;
  pattern: string; // e.g., 'CVC'
}

export interface PhonicsLevel {
  id: number;
  title: string;
  patternFocus: string;
  words: PhonicsWord[];
}

// 100+ Phonics words across 10 progressive levels
export const PHONICS_CURRICULUM: PhonicsLevel[] = [
  {
    id: 1, title: 'Level 1: SATPIN', patternFocus: 's, a, t, p, i, n',
    words: [
      { id: 'p1', word: 'sat', sounds: ['s', 'a', 't'], emoji: '🧘', pattern: 'CVC' },
      { id: 'p2', word: 'pat', sounds: ['p', 'a', 't'], emoji: '👋', pattern: 'CVC' },
      { id: 'p3', word: 'tap', sounds: ['t', 'a', 'p'], emoji: '🚰', pattern: 'CVC' },
      { id: 'p4', word: 'sip', sounds: ['s', 'i', 'p'], emoji: '🥤', pattern: 'CVC' },
      { id: 'p5', word: 'pin', sounds: ['p', 'i', 'n'], emoji: '📌', pattern: 'CVC' },
      { id: 'p6', word: 'nip', sounds: ['n', 'i', 'p'], emoji: '🤏', pattern: 'CVC' },
      { id: 'p7', word: 'sit', sounds: ['s', 'i', 't'], emoji: '🪑', pattern: 'CVC' },
      { id: 'p8', word: 'tan', sounds: ['t', 'a', 'n'], emoji: '🏖️', pattern: 'CVC' },
      { id: 'p9', word: 'pan', sounds: ['p', 'a', 'n'], emoji: '🍳', pattern: 'CVC' },
      { id: 'p10', word: 'nap', sounds: ['n', 'a', 'p'], emoji: '😴', pattern: 'CVC' },
    ]
  },
  {
    id: 2, title: 'Level 2: Short E', patternFocus: 'e, d, g, m, n',
    words: [
      { id: 'p11', word: 'bed', sounds: ['b', 'e', 'd'], emoji: '🛏️', pattern: 'CVC' },
      { id: 'p12', word: 'den', sounds: ['d', 'e', 'n'], emoji: '🦊', pattern: 'CVC' },
      { id: 'p13', word: 'hen', sounds: ['h', 'e', 'n'], emoji: '🐔', pattern: 'CVC' },
      { id: 'p14', word: 'men', sounds: ['m', 'e', 'n'], emoji: '👬', pattern: 'CVC' },
      { id: 'p15', word: 'pen', sounds: ['p', 'e', 'n'], emoji: '🖊️', pattern: 'CVC' },
      { id: 'p16', word: 'ten', sounds: ['t', 'e', 'n'], emoji: '🔟', pattern: 'CVC' },
      { id: 'p17', word: 'red', sounds: ['r', 'e', 'd'], emoji: '🔴', pattern: 'CVC' },
      { id: 'p18', word: 'wet', sounds: ['w', 'e', 't'], emoji: '💧', pattern: 'CVC' },
      { id: 'p19', word: 'pet', sounds: ['p', 'e', 't'], emoji: '🐶', pattern: 'CVC' },
      { id: 'p20', word: 'net', sounds: ['n', 'e', 't'], emoji: '🥅', pattern: 'CVC' },
    ]
  },
  {
    id: 3, title: 'Level 3: Short I', patternFocus: 'i, g, h, b, f',
    words: [
      { id: 'p21', word: 'big', sounds: ['b', 'i', 'g'], emoji: '🐘', pattern: 'CVC' },
      { id: 'p22', word: 'dig', sounds: ['d', 'i', 'g'], emoji: '⛏️', pattern: 'CVC' },
      { id: 'p23', word: 'fig', sounds: ['f', 'i', 'g'], emoji: '🍐', pattern: 'CVC' },
      { id: 'p24', word: 'pig', sounds: ['p', 'i', 'g'], emoji: '🐷', pattern: 'CVC' },
      { id: 'p25', word: 'wig', sounds: ['w', 'i', 'g'], emoji: '👱', pattern: 'CVC' },
      { id: 'p26', word: 'bin', sounds: ['b', 'i', 'n'], emoji: '🗑️', pattern: 'CVC' },
      { id: 'p27', word: 'fin', sounds: ['f', 'i', 'n'], emoji: '🐟', pattern: 'CVC' },
      { id: 'p28', word: 'pin', sounds: ['p', 'i', 'n'], emoji: '📌', pattern: 'CVC' },
      { id: 'p29', word: 'win', sounds: ['w', 'i', 'n'], emoji: '🏆', pattern: 'CVC' },
      { id: 'p30', word: 'lip', sounds: ['l', 'i', 'p'], emoji: '👄', pattern: 'CVC' },
    ]
  },
  {
    id: 4, title: 'Level 4: Short O', patternFocus: 'o, c, l, r, m',
    words: [
      { id: 'p31', word: 'cot', sounds: ['c', 'o', 't'], emoji: '🛏️', pattern: 'CVC' },
      { id: 'p32', word: 'dot', sounds: ['d', 'o', 't'], emoji: '🔘', pattern: 'CVC' },
      { id: 'p33', word: 'hot', sounds: ['h', 'o', 't'], emoji: '🔥', pattern: 'CVC' },
      { id: 'p34', word: 'lot', sounds: ['l', 'o', 't'], emoji: '📦', pattern: 'CVC' },
      { id: 'p35', word: 'pot', sounds: ['p', 'o', 't'], emoji: '🍲', pattern: 'CVC' },
      { id: 'p36', word: 'rot', sounds: ['r', 'o', 't'], emoji: '🍂', pattern: 'CVC' },
      { id: 'p37', word: 'dog', sounds: ['d', 'o', 'g'], emoji: '🐶', pattern: 'CVC' },
      { id: 'p38', word: 'log', sounds: ['l', 'o', 'g'], emoji: '🪵', pattern: 'CVC' },
      { id: 'p39', word: 'mop', sounds: ['m', 'o', 'p'], emoji: '🧹', pattern: 'CVC' },
      { id: 'p40', word: 'top', sounds: ['t', 'o', 'p'], emoji: '🔝', pattern: 'CVC' },
    ]
  },
  {
    id: 5, title: 'Level 5: Short U', patternFocus: 'u, b, c, f, g',
    words: [
      { id: 'p41', word: 'bug', sounds: ['b', 'u', 'g'], emoji: '🐛', pattern: 'CVC' },
      { id: 'p42', word: 'cub', sounds: ['c', 'u', 'b'], emoji: '🐻', pattern: 'CVC' },
      { id: 'p43', word: 'dug', sounds: ['d', 'u', 'g'], emoji: '⛏️', pattern: 'CVC' },
      { id: 'p44', word: 'fun', sounds: ['f', 'u', 'n'], emoji: '🎉', pattern: 'CVC' },
      { id: 'p45', word: 'gut', sounds: ['g', 'u', 't'], emoji: '🫀', pattern: 'CVC' },
      { id: 'p46', word: 'hut', sounds: ['h', 'u', 't'], emoji: '🛖', pattern: 'CVC' },
      { id: 'p47', word: 'jug', sounds: ['j', 'u', 'g'], emoji: '🏺', pattern: 'CVC' },
      { id: 'p48', word: 'mud', sounds: ['m', 'u', 'd'], emoji: '🟤', pattern: 'CVC' },
      { id: 'p49', word: 'nut', sounds: ['n', 'u', 't'], emoji: '🥜', pattern: 'CVC' },
      { id: 'p50', word: 'run', sounds: ['r', 'u', 'n'], emoji: '🏃', pattern: 'CVC' },
    ]
  },
  {
    id: 6, title: 'Level 6: Digraphs SH & CH', patternFocus: 'sh, ch',
    words: [
      { id: 'p51', word: 'ship', sounds: ['sh', 'i', 'p'], emoji: '🚢', pattern: 'Digraph' },
      { id: 'p52', word: 'shop', sounds: ['sh', 'o', 'p'], emoji: '🏪', pattern: 'Digraph' },
      { id: 'p53', word: 'shed', sounds: ['sh', 'e', 'd'], emoji: '🏚️', pattern: 'Digraph' },
      { id: 'p54', word: 'shut', sounds: ['sh', 'u', 't'], emoji: '🚪', pattern: 'Digraph' },
      { id: 'p55', word: 'dish', sounds: ['d', 'i', 'sh'], emoji: '🍽️', pattern: 'Digraph' },
      { id: 'p56', word: 'fish', sounds: ['f', 'i', 'sh'], emoji: '🐟', pattern: 'Digraph' },
      { id: 'p57', word: 'chip', sounds: ['ch', 'i', 'p'], emoji: '🥔', pattern: 'Digraph' },
      { id: 'p58', word: 'chop', sounds: ['ch', 'o', 'p'], emoji: '🔪', pattern: 'Digraph' },
      { id: 'p59', word: 'chat', sounds: ['ch', 'a', 't'], emoji: '💬', pattern: 'Digraph' },
      { id: 'p60', word: 'chin', sounds: ['ch', 'i', 'n'], emoji: '👤', pattern: 'Digraph' },
    ]
  },
  {
    id: 7, title: 'Level 7: Digraphs TH & CK', patternFocus: 'th, ck',
    words: [
      { id: 'p61', word: 'thin', sounds: ['th', 'i', 'n'], emoji: '📏', pattern: 'Digraph' },
      { id: 'p62', word: 'thick', sounds: ['th', 'i', 'ck'], emoji: '🧱', pattern: 'Digraph' },
      { id: 'p63', word: 'bath', sounds: ['b', 'a', 'th'], emoji: '🛁', pattern: 'Digraph' },
      { id: 'p64', word: 'moth', sounds: ['m', 'o', 'th'], emoji: '🦋', pattern: 'Digraph' },
      { id: 'p65', word: 'path', sounds: ['p', 'a', 'th'], emoji: '🛤️', pattern: 'Digraph' },
      { id: 'p66', word: 'back', sounds: ['b', 'a', 'ck'], emoji: '🔙', pattern: 'Digraph' },
      { id: 'p67', word: 'pack', sounds: ['p', 'a', 'ck'], emoji: '🎒', pattern: 'Digraph' },
      { id: 'p68', word: 'sick', sounds: ['s', 'i', 'ck'], emoji: '🤒', pattern: 'Digraph' },
      { id: 'p69', word: 'kick', sounds: ['k', 'i', 'ck'], emoji: '🦵', pattern: 'Digraph' },
      { id: 'p70', word: 'lock', sounds: ['l', 'o', 'ck'], emoji: '🔒', pattern: 'Digraph' },
    ]
  },
  {
    id: 8, title: 'Level 8: Magic E', patternFocus: 'a_e, i_e, o_e, u_e',
    words: [
      { id: 'p71', word: 'cake', sounds: ['c', 'a', 'k', 'e'], emoji: '🎂', pattern: 'Magic E' },
      { id: 'p72', word: 'lake', sounds: ['l', 'a', 'k', 'e'], emoji: '🌊', pattern: 'Magic E' },
      { id: 'p73', word: 'make', sounds: ['m', 'a', 'k', 'e'], emoji: '🛠️', pattern: 'Magic E' },
      { id: 'p74', word: 'take', sounds: ['t', 'a', 'k', 'e'], emoji: '✋', pattern: 'Magic E' },
      { id: 'p75', word: 'bike', sounds: ['b', 'i', 'k', 'e'], emoji: '🚲', pattern: 'Magic E' },
      { id: 'p76', word: 'like', sounds: ['l', 'i', 'k', 'e'], emoji: '❤️', pattern: 'Magic E' },
      { id: 'p77', word: 'hike', sounds: ['h', 'i', 'k', 'e'], emoji: '🥾', pattern: 'Magic E' },
      { id: 'p78', word: 'home', sounds: ['h', 'o', 'm', 'e'], emoji: '🏠', pattern: 'Magic E' },
      { id: 'p79', word: 'bone', sounds: ['b', 'o', 'n', 'e'], emoji: '🦴', pattern: 'Magic E' },
      { id: 'p80', word: 'cute', sounds: ['c', 'u', 't', 'e'], emoji: '😊', pattern: 'Magic E' },
    ]
  },
  {
    id: 9, title: 'Level 9: Blends ST, TR, BL', patternFocus: 'st, tr, bl',
    words: [
      { id: 'p81', word: 'stop', sounds: ['st', 'o', 'p'], emoji: '🛑', pattern: 'Blend' },
      { id: 'p82', word: 'star', sounds: ['st', 'a', 'r'], emoji: '⭐', pattern: 'Blend' },
      { id: 'p83', word: 'step', sounds: ['st', 'e', 'p'], emoji: '👣', pattern: 'Blend' },
      { id: 'p84', word: 'tree', sounds: ['tr', 'e', 'e'], emoji: '🌳', pattern: 'Blend' },
      { id: 'p85', word: 'trip', sounds: ['tr', 'i', 'p'], emoji: '✈️', pattern: 'Blend' },
      { id: 'p86', word: 'truck', sounds: ['tr', 'u', 'ck'], emoji: '🚛', pattern: 'Blend' },
      { id: 'p87', word: 'blue', sounds: ['bl', 'u', 'e'], emoji: '💙', pattern: 'Blend' },
      { id: 'p88', word: 'black', sounds: ['bl', 'a', 'ck'], emoji: '⬛', pattern: 'Blend' },
      { id: 'p89', word: 'block', sounds: ['bl', 'o', 'ck'], emoji: '🧱', pattern: 'Blend' },
      { id: 'p90', word: 'flat', sounds: ['fl', 'a', 't'], emoji: '🟫', pattern: 'Blend' },
    ]
  },
  {
    id: 10, title: 'Level 10: Challenge Words', patternFocus: 'gr, sh, st, br',
    words: [
      { id: 'p91', word: 'grand', sounds: ['gr', 'a', 'n', 'd'], emoji: '🏰', pattern: 'Challenge' },
      { id: 'p92', word: 'green', sounds: ['gr', 'e', 'e', 'n'], emoji: '💚', pattern: 'Challenge' },
      { id: 'p93', word: 'ground', sounds: ['gr', 'o', 'u', 'n', 'd'], emoji: '🌍', pattern: 'Challenge' },
      { id: 'p94', word: 'shine', sounds: ['sh', 'i', 'n', 'e'], emoji: '✨', pattern: 'Challenge' },
      { id: 'p95', word: 'stone', sounds: ['st', 'o', 'n', 'e'], emoji: '🪨', pattern: 'Challenge' },
      { id: 'p96', word: 'brave', sounds: ['br', 'a', 'v', 'e'], emoji: '🦁', pattern: 'Challenge' },
      { id: 'p97', word: 'branch', sounds: ['br', 'a', 'n', 'ch'], emoji: '🌿', pattern: 'Challenge' },
      { id: 'p98', word: 'water', sounds: ['w', 'a', 't', 'e', 'r'], emoji: '💧', pattern: 'Challenge' },
      { id: 'p99', word: 'flower', sounds: ['fl', 'o', 'w', 'e', 'r'], emoji: '🌸', pattern: 'Challenge' },
      { id: 'p100', word: 'animal', sounds: ['a', 'n', 'i', 'm', 'a', 'l'], emoji: '🐾', pattern: 'Challenge' },
    ]
  }
];