export interface VocabWord {
  id: string;
  word: string;
  meaning: string;
  emoji: string;
  family: string; // e.g., "at", "an", "ig"
}

export interface VocabLevel {
  id: number;
  title: string;
  syllabusFocus: string; // e.g., "Short 'a' sounds", "Digraph 'sh'"
  words: VocabWord[];
}

// 100+ Words across 10 Progressive Levels
export const VOCABULARY_CURRICULUM: VocabLevel[] = [
  {
    id: 1, title: 'Level 1: Simple CVC', syllabusFocus: 'Consonant-Vowel-Consonant (at, an, ap)',
    words: [
      { id: 'v1', word: 'cat', meaning: 'A small animal that meows', emoji: '🐱', family: 'at' },
      { id: 'v2', word: 'bat', meaning: 'Flies at night and sleeps upside down', emoji: '🦇', family: 'at' },
      { id: 'v3', word: 'hat', meaning: 'You wear it on your head', emoji: '🎩', family: 'at' },
      { id: 'v4', word: 'mat', meaning: 'You wipe your feet on it', emoji: '🟫', family: 'at' },
      { id: 'v5', word: 'rat', meaning: 'A small rodent', emoji: '🐀', family: 'at' },
      { id: 'v6', word: 'can', meaning: 'A metal container', emoji: '🥫', family: 'an' },
      { id: 'v7', word: 'fan', meaning: 'Spins to make you cool', emoji: '🌀', family: 'an' },
      { id: 'v8', word: 'pan', meaning: 'Used for cooking', emoji: '🍳', family: 'an' },
      { id: 'v9', word: 'ran', meaning: 'Moved very fast', emoji: '🏃', family: 'an' },
      { id: 'v10', word: 'man', meaning: 'A grown boy', emoji: '👨', family: 'an' },
    ]
  },
  {
    id: 2, title: 'Level 2: Short "e"', syllabusFocus: 'Words with the short "e" sound (et, en, ed)',
    words: [
      { id: 'v11', word: 'bed', meaning: 'Where you sleep', emoji: '🛏️', family: 'ed' },
      { id: 'v12', word: 'red', meaning: 'The color of an apple', emoji: '🔴', family: 'ed' },
      { id: 'v13', word: 'fed', meaning: 'Gave food to', emoji: '🍽️', family: 'ed' },
      { id: 'v14', word: 'hen', meaning: 'A female chicken', emoji: '🐔', family: 'en' },
      { id: 'v15', word: 'pen', meaning: 'Used for writing', emoji: '🖊️', family: 'en' },
      { id: 'v16', word: 'ten', meaning: 'The number after nine', emoji: '🔟', family: 'en' },
      { id: 'v17', word: 'men', meaning: 'More than one man', emoji: '👬', family: 'en' },
      { id: 'v18', word: 'net', meaning: 'Used for catching fish', emoji: '🥅', family: 'et' },
      { id: 'v19', word: 'pet', meaning: 'An animal you keep at home', emoji: '🐶', family: 'et' },
      { id: 'v20', word: 'wet', meaning: 'Covered in water', emoji: '💧', family: 'et' },
    ]
  },
  {
    id: 3, title: 'Level 3: Short "i"', syllabusFocus: 'Words with the short "i" sound (ig, in, ip)',
    words: [
      { id: 'v21', word: 'big', meaning: 'Very large', emoji: '🐘', family: 'ig' },
      { id: 'v22', word: 'dig', meaning: 'To make a hole in the ground', emoji: '⛏️', family: 'ig' },
      { id: 'v23', word: 'fig', meaning: 'A sweet fruit', emoji: '🍐', family: 'ig' },
      { id: 'v24', word: 'pig', meaning: 'A farm animal that says oink', emoji: '🐷', family: 'ig' },
      { id: 'v25', word: 'wig', meaning: 'Hair you can take off', emoji: '👱', family: 'ig' },
      { id: 'v26', word: 'bin', meaning: 'You throw trash in it', emoji: '🗑️', family: 'in' },
      { id: 'v27', word: 'pin', meaning: 'Sharp metal used for sewing', emoji: '📌', family: 'in' },
      { id: 'v28', word: 'win', meaning: 'To come in first place', emoji: '🏆', family: 'in' },
      { id: 'v29', word: 'lip', meaning: 'Part of your mouth', emoji: '👄', family: 'ip' },
      { id: 'v30', word: 'sip', meaning: 'A tiny drink', emoji: '🥤', family: 'ip' },
    ]
  },
  {
    id: 4, title: 'Level 4: Short "o"', syllabusFocus: 'Words with the short "o" sound (ot, op, og)',
    words: [
      { id: 'v31', word: 'pot', meaning: 'A deep container for cooking', emoji: '🍲', family: 'ot' },
      { id: 'v32', word: 'hot', meaning: 'Very warm', emoji: '🔥', family: 'ot' },
      { id: 'v33', word: 'dot', meaning: 'A tiny round spot', emoji: '🔘', family: 'ot' },
      { id: 'v34', word: 'lot', meaning: 'A large amount', emoji: '📦', family: 'ot' },
      { id: 'v35', word: 'not', meaning: 'The opposite of yes', emoji: '❌', family: 'ot' },
      { id: 'v36', word: 'top', meaning: 'The highest point', emoji: '🔝', family: 'op' },
      { id: 'v37', word: 'mop', meaning: 'Used for cleaning floors', emoji: '🧹', family: 'op' },
      { id: 'v38', word: 'hop', meaning: 'To jump on one foot', emoji: '🐇', family: 'op' },
      { id: 'v39', word: 'dog', meaning: 'A barking pet', emoji: '🐶', family: 'og' },
      { id: 'v40', word: 'log', meaning: 'A piece of a tree', emoji: '🪵', family: 'og' },
    ]
  },
  {
    id: 5, title: 'Level 5: Short "u"', syllabusFocus: 'Words with the short "u" sound (ug, un, ub)',
    words: [
      { id: 'v41', word: 'bug', meaning: 'A small insect', emoji: '🐛', family: 'ug' },
      { id: 'v42', word: 'hug', meaning: 'To squeeze with love', emoji: '🤗', family: 'ug' },
      { id: 'v43', word: 'rug', meaning: 'A small carpet', emoji: '🧶', family: 'ug' },
      { id: 'v44', word: 'jug', meaning: 'A big container for water', emoji: '🏺', family: 'ug' },
      { id: 'v45', word: 'mug', meaning: 'A cup for coffee', emoji: '☕', family: 'ug' },
      { id: 'v46', word: 'sun', meaning: 'The bright star in the sky', emoji: '☀️', family: 'un' },
      { id: 'v47', word: 'run', meaning: 'To move fast with your legs', emoji: '🏃', family: 'un' },
      { id: 'v48', word: 'fun', meaning: 'Something that makes you happy', emoji: '🎉', family: 'un' },
      { id: 'v49', word: 'bun', meaning: 'A small bread roll', emoji: '🥯', family: 'un' },
      { id: 'v50', word: 'tub', meaning: 'A big container for baths', emoji: '🛁', family: 'ub' },
    ]
  },
  {
    id: 6, title: 'Level 6: Digraphs "sh" & "ch"', syllabusFocus: 'Sounds made by two letters together',
    words: [
      { id: 'v51', word: 'ship', meaning: 'A large boat', emoji: '🚢', family: 'sh' },
      { id: 'v52', word: 'shop', meaning: 'A place to buy things', emoji: '🏪', family: 'sh' },
      { id: 'v53', word: 'shut', meaning: 'To close tightly', emoji: '🚪', family: 'sh' },
      { id: 'v54', word: 'fish', meaning: 'Swims in water', emoji: '🐟', family: 'sh' },
      { id: 'v55', word: 'dish', meaning: 'A plate used for eating', emoji: '🍽️', family: 'sh' },
      { id: 'v56', word: 'chip', meaning: 'A tiny piece of something', emoji: '🥔', family: 'ch' },
      { id: 'v57', word: 'chin', meaning: 'The bottom of your face', emoji: '👤', family: 'ch' },
      { id: 'v58', word: 'chat', meaning: 'To talk with friends', emoji: '💬', family: 'ch' },
      { id: 'v59', word: 'much', meaning: 'A large amount', emoji: '💯', family: 'ch' },
      { id: 'v60', word: 'rich', meaning: 'Has lots of money', emoji: '💰', family: 'ch' },
    ]
  },
  {
    id: 7, title: 'Level 7: Digraphs "th" & "ck"', syllabusFocus: 'More two-letter sounds',
    words: [
      { id: 'v61', word: 'thin', meaning: 'Not thick, narrow', emoji: '📏', family: 'th' },
      { id: 'v62', word: 'thick', meaning: 'Wide and fat', emoji: '🧱', family: 'th' },
      { id: 'v63', word: 'bath', meaning: 'Where you wash yourself', emoji: '🛁', family: 'th' },
      { id: 'v64', word: 'moth', meaning: 'A flying insect that likes light', emoji: '🦋', family: 'th' },
      { id: 'v65', word: 'path', meaning: 'The way you walk', emoji: '🛤️', family: 'th' },
      { id: 'v66', word: 'back', meaning: 'The opposite of front', emoji: '🔙', family: 'ck' },
      { id: 'v67', word: 'pack', meaning: 'A bag you carry', emoji: '🎒', family: 'ck' },
      { id: 'v68', word: 'sick', meaning: 'When you feel unwell', emoji: '🤒', family: 'ck' },
      { id: 'v69', word: 'kick', meaning: 'To hit with your foot', emoji: '🦵', family: 'ck' },
      { id: 'v70', word: 'lock', meaning: 'Keeps a door safe', emoji: '🔒', family: 'ck' },
    ]
  },
  {
    id: 8, title: 'Level 8: Magic "e"', syllabusFocus: 'The "e" at the end makes the vowel say its name',
    words: [
      { id: 'v71', word: 'cake', meaning: 'A sweet dessert', emoji: '🎂', family: 'ake' },
      { id: 'v72', word: 'lake', meaning: 'A large body of water', emoji: '🌊', family: 'ake' },
      { id: 'v73', word: 'make', meaning: 'To build or create', emoji: '🛠️', family: 'ake' },
      { id: 'v74', word: 'take', meaning: 'To pick up and carry', emoji: '✋', family: 'ake' },
      { id: 'v75', word: 'bike', meaning: 'Two wheels you ride', emoji: '🚲', family: 'ike' },
      { id: 'v76', word: 'like', meaning: 'To enjoy something', emoji: '❤️', family: 'ike' },
      { id: 'v77', word: 'hike', meaning: 'A long walk outside', emoji: '🥾', family: 'ike' },
      { id: 'v78', word: 'mike', meaning: 'A device for speaking loudly', emoji: '🎤', family: 'ike' },
      { id: 'v79', word: 'home', meaning: 'Where you live', emoji: '🏠', family: 'ome' },
      { id: 'v80', word: 'game', meaning: 'Something you play', emoji: '🎮', family: 'ame' },
    ]
  },
  {
    id: 9, title: 'Level 9: Blends', syllabusFocus: 'Blends like "st", "tr", "bl"',
    words: [
      { id: 'v81', word: 'stop', meaning: 'To come to a halt', emoji: '🛑', family: 'st' },
      { id: 'v82', word: 'star', meaning: 'A bright point in the sky', emoji: '⭐', family: 'st' },
      { id: 'v83', word: 'step', meaning: 'One foot forward', emoji: '👣', family: 'st' },
      { id: 'v84', word: 'tree', meaning: 'A big plant with leaves', emoji: '🌳', family: 'tr' },
      { id: 'v85', word: 'trip', meaning: 'A journey', emoji: '✈️', family: 'tr' },
      { id: 'v86', word: 'truck', meaning: 'A large vehicle', emoji: '🚛', family: 'tr' },
      { id: 'v87', word: 'blue', meaning: 'The color of the sky', emoji: '💙', family: 'bl' },
      { id: 'v88', word: 'black', meaning: 'The darkest color', emoji: '⬛', family: 'bl' },
      { id: 'v89', word: 'block', meaning: 'A piece of wood', emoji: '🧱', family: 'bl' },
      { id: 'v90', word: 'flat', meaning: 'Even and level', emoji: '🟫', family: 'fl' },
    ]
  },
  {
    id: 10, title: 'Level 10: Challenging Words', syllabusFocus: 'Longer words and sight words',
    words: [
      { id: 'v91', word: 'grand', meaning: 'Very big and impressive', emoji: '🏰', family: 'gr' },
      { id: 'v92', word: 'green', meaning: 'The color of grass', emoji: '💚', family: 'gr' },
      { id: 'v93', word: 'ground', meaning: 'The surface of the Earth', emoji: '🌍', family: 'gr' },
      { id: 'v94', word: 'shine', meaning: 'To give off light', emoji: '✨', family: 'sh' },
      { id: 'v95', word: 'stone', meaning: 'A hard rock', emoji: '🪨', family: 'st' },
      { id: 'v96', word: 'brave', meaning: 'Not afraid', emoji: '🦁', family: 'br' },
      { id: 'v97', word: 'branch', meaning: 'Part of a tree', emoji: '🌿', family: 'br' },
      { id: 'v98', word: 'water', meaning: 'What you drink', emoji: '💧', family: 'wa' },
      { id: 'v99', word: 'flower', meaning: 'A blooming plant', emoji: '🌸', family: 'fl' },
      { id: 'v100', word: 'animal', meaning: 'A living creature', emoji: '🐾', family: 'an' },
    ]
  }
];