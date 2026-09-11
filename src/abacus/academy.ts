export type AbacusMode =
  | 'beginner'
  | 'practice'
  | 'challenge'
  | 'mental';

export type AbacusStage = 1 | 2 | 3 | 4 | 5;

export type AbacusLevelId =
  | 'abacus-orientation'
  | 'count-track-beads'
  | 'number-representation'
  | 'soroban-foundations'
  | 'direct-calculation'
  | 'place-value'
  | 'small-friends'
  | 'big-friends'
  | 'multi-digit-calculation'
  | 'visualisation'
  | 'flash-anzan'
  | 'mental-calculation'
  | 'advanced-mental-operations'
  | 'mental-multiplication-division'
  | 'speed-mastery';

export type AbacusPromptType =
  | 'exploration'
  | 'counting'
  | 'representation'
  | 'bead-identification'
  | 'addition'
  | 'subtraction'
  | 'place-value'
  | 'small-friend'
  | 'big-friend'
  | 'multi-digit'
  | 'visualisation'
  | 'flash-anzan'
  | 'mental-addition'
  | 'mental-subtraction'
  | 'mental-multiplication'
  | 'mental-division'
  | 'mixed'
  | 'speed';

export interface AbacusPrompt {
  id: string;
  levelId: AbacusLevelId;
  mode: AbacusMode;
  type: AbacusPromptType;

  /**
   * Human-readable question shown to the learner.
   */
  question: string;

  /**
   * Numeric answer expected from the learner.
   */
  answer: number;

  /**
   * Optional multiple-choice answers.
   */
  options?: number[];

  /**
   * Optional learner instruction.
   */
  instruction?: string;

  /**
   * Optional Soroban formula or complement notation.
   */
  formula?: string;

  /**
   * Number of digits involved in the problem.
   */
  digits?: number;

  /**
   * Relative difficulty from 1–10.
   */
  difficulty: number;

  /**
   * Whether the learner is expected to solve mentally.
   */
  isMental: boolean;

  /**
   * Optional sequence used by visualisation / flash exercises.
   */
  sequence?: number[];

  /**
   * Optional time limit in seconds.
   */
  timeLimit?: number;
}

export interface AbacusLevel {
  id: AbacusLevelId;

  stage: AbacusStage;
  stageTitle: string;

  title: string;
  subtitle: string;
  description: string;

  prerequisites: AbacusLevelId[];

  /**
   * Mastery percentage required to complete this module.
   */
  masteryTarget: number;

  /**
   * Minimum attempts required before mastery can be awarded.
   */
  minimumAttempts: number;

  skills: string[];

  /**
   * Prompt types that belong specifically to this module.
   */
  promptTypes: AbacusPromptType[];

  /**
   * Inclusive difficulty range.
   */
  difficultyRange: readonly [number, number];

  /**
   * Number of Soroban rods required by the module.
   */
  rodCount: number;

  /**
   * True for mental / Anzan modules.
   */
  isMental: boolean;

  /**
   * True for foundational technique modules.
   */
  isFoundational: boolean;
}

/* -------------------------------------------------------------------------- */
/* Curriculum                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * The curriculum is deliberately sequential.
 *
 * IMPORTANT:
 * - Age does not determine the level.
 * - Mode does not determine the level.
 * - The selected module determines the learning objective.
 * - Modes change practice intensity/style only.
 */
export const ABACUS_LEVELS: readonly AbacusLevel[] = [
  /* ------------------------------------------------------------------------ */
  /* Stage 1 — Foundation                                                     */
  /* ------------------------------------------------------------------------ */

  {
    id: 'abacus-orientation',
    stage: 1,
    stageTitle: 'Foundation',
    title: 'Abacus Orientation',
    subtitle: 'Discover the Soroban',
    description:
      'Learn the structure of the Soroban, identify its parts, and explore how moving beads represents quantity.',
    prerequisites: [],
    masteryTarget: 80,
    minimumAttempts: 5,
    skills: [
      'Abacus awareness',
      'Rod identification',
      'Beam identification',
      'Heaven bead identification',
      'Earth bead identification',
      'Basic bead movement',
    ],
    promptTypes: [
      'exploration',
      'bead-identification',
    ],
    difficultyRange: [1, 1],
    rodCount: 1,
    isMental: false,
    isFoundational: true,
  },

  {
    id: 'count-track-beads',
    stage: 1,
    stageTitle: 'Foundation',
    title: 'Count & Track Beads',
    subtitle: 'Build quantity awareness',
    description:
      'Connect individual bead movements with quantities and learn to track how many beads are active.',
    prerequisites: ['abacus-orientation'],
    masteryTarget: 80,
    minimumAttempts: 6,
    skills: [
      'Counting',
      'One-to-one correspondence',
      'Quantity recognition',
      'Bead tracking',
      'Active bead awareness',
    ],
    promptTypes: [
      'counting',
      'representation',
    ],
    difficultyRange: [1, 2],
    rodCount: 1,
    isMental: false,
    isFoundational: true,
  },

  {
    id: 'number-representation',
    stage: 1,
    stageTitle: 'Foundation',
    title: 'Number-to-Bead Representation',
    subtitle: 'Represent numbers on the Soroban',
    description:
      'Translate written numbers into correct Soroban configurations and connect numerical symbols with bead positions.',
    prerequisites: ['count-track-beads'],
    masteryTarget: 80,
    minimumAttempts: 8,
    skills: [
      'Number representation',
      'Bead positioning',
      'Quantity-to-symbol mapping',
      'Single-rod representation',
    ],
    promptTypes: [
      'representation',
      'counting',
    ],
    difficultyRange: [1, 3],
    rodCount: 1,
    isMental: false,
    isFoundational: true,
  },

  /* ------------------------------------------------------------------------ */
  /* Stage 2 — Soroban Basics                                                 */
  /* ------------------------------------------------------------------------ */

  {
    id: 'soroban-foundations',
    stage: 2,
    stageTitle: 'Soroban Basics',
    title: 'Heaven & Earth Beads',
    subtitle: 'Master the five-plus-one structure',
    description:
      'Understand the distinct values of the heaven bead and earth beads and learn how the five-plus-one structure forms numbers.',
    prerequisites: ['number-representation'],
    masteryTarget: 85,
    minimumAttempts: 8,
    skills: [
      'Heaven bead',
      'Earth beads',
      'Five-value concept',
      'Five-plus-one structure',
      'Bead state recognition',
    ],
    promptTypes: [
      'bead-identification',
      'representation',
    ],
    difficultyRange: [2, 3],
    rodCount: 1,
    isMental: false,
    isFoundational: true,
  },

  {
    id: 'direct-calculation',
    stage: 2,
    stageTitle: 'Soroban Basics',
    title: 'Direct Addition & Subtraction',
    subtitle: 'Calculate with direct bead movement',
    description:
      'Perform simple addition and subtraction when the required beads can be moved directly without using complements.',
    prerequisites: ['soroban-foundations'],
    masteryTarget: 85,
    minimumAttempts: 10,
    skills: [
      'Direct addition',
      'Direct subtraction',
      'Bead movement sequence',
      'Calculation accuracy',
      'Direct combinations',
    ],
    promptTypes: [
      'addition',
      'subtraction',
    ],
    difficultyRange: [2, 4],
    rodCount: 2,
    isMental: false,
    isFoundational: true,
  },

  {
    id: 'place-value',
    stage: 2,
    stageTitle: 'Soroban Basics',
    title: 'Tens, Hundreds & Place Value',
    subtitle: 'Think across multiple rods',
    description:
      'Understand how each Soroban rod represents a different place value and learn to represent and read larger numbers.',
    prerequisites: ['direct-calculation'],
    masteryTarget: 85,
    minimumAttempts: 10,
    skills: [
      'Ones',
      'Tens',
      'Hundreds',
      'Place value',
      'Rod relationships',
      'Multi-rod representation',
    ],
    promptTypes: [
      'place-value',
      'representation',
    ],
    difficultyRange: [3, 5],
    rodCount: 3,
    isMental: false,
    isFoundational: false,
  },

  /* ------------------------------------------------------------------------ */
  /* Stage 3 — Soroban Logic                                                  */
  /* ------------------------------------------------------------------------ */

  {
    id: 'small-friends',
    stage: 3,
    stageTitle: 'Soroban Logic',
    title: 'Small Friends',
    subtitle: 'Master complements of 5',
    description:
      'Learn the complementary relationships that allow calculations to continue when direct earth-bead movement is not possible.',
    prerequisites: ['place-value'],
    masteryTarget: 85,
    minimumAttempts: 10,
    skills: [
      'Complements of 5',
      'Small-friend pairs',
      'Indirect addition',
      'Indirect subtraction',
      'Formula recognition',
    ],
    promptTypes: [
      'small-friend',
    ],
    difficultyRange: [4, 6],
    rodCount: 2,
    isMental: false,
    isFoundational: false,
  },

  {
    id: 'big-friends',
    stage: 3,
    stageTitle: 'Soroban Logic',
    title: 'Big Friends',
    subtitle: 'Master complements of 10',
    description:
      'Use complements of 10 to perform calculations that require exchanging value across rods.',
    prerequisites: ['small-friends'],
    masteryTarget: 85,
    minimumAttempts: 10,
    skills: [
      'Complements of 10',
      'Big-friend pairs',
      'Carrying',
      'Borrowing',
      'Cross-rod compensation',
    ],
    promptTypes: [
      'big-friend',
    ],
    difficultyRange: [5, 7],
    rodCount: 3,
    isMental: false,
    isFoundational: false,
  },

  {
    id: 'multi-digit-calculation',
    stage: 3,
    stageTitle: 'Soroban Logic',
    title: 'Multi-Digit Calculation',
    subtitle: 'Combine Soroban techniques',
    description:
      'Integrate direct movement, small friends, big friends and place value to solve larger calculations across several rods.',
    prerequisites: ['big-friends'],
    masteryTarget: 85,
    minimumAttempts: 12,
    skills: [
      'Multi-digit addition',
      'Multi-digit subtraction',
      'Carrying',
      'Borrowing',
      'Cross-rod calculation',
      'Calculation fluency',
    ],
    promptTypes: [
      'multi-digit',
    ],
    difficultyRange: [5, 8],
    rodCount: 4,
    isMental: false,
    isFoundational: false,
  },

  /* ------------------------------------------------------------------------ */
  /* Stage 4 — Mental Abacus                                                  */
  /* ------------------------------------------------------------------------ */

  {
    id: 'visualisation',
    stage: 4,
    stageTitle: 'Mental Abacus',
    title: 'Visualisation',
    subtitle: 'Build the mental Soroban',
    description:
      'Transfer physical bead positions into an internal visual model of the Soroban and begin manipulating that model mentally.',
    prerequisites: ['multi-digit-calculation'],
    masteryTarget: 90,
    minimumAttempts: 10,
    skills: [
      'Mental visualisation',
      'Internal bead position',
      'Spatial memory',
      'Mental place value',
      'Internal bead movement',
    ],
    promptTypes: [
      'visualisation',
    ],
    difficultyRange: [6, 8],
    rodCount: 3,
    isMental: true,
    isFoundational: false,
  },

  {
    id: 'flash-anzan',
    stage: 4,
    stageTitle: 'Mental Abacus',
    title: 'Flash Anzan',
    subtitle: 'Process numbers in rapid sequence',
    description:
      'Develop rapid visual recognition, working memory and mental accumulation by processing short sequences of numbers.',
    prerequisites: ['visualisation'],
    masteryTarget: 90,
    minimumAttempts: 10,
    skills: [
      'Rapid number recognition',
      'Working memory',
      'Mental accumulation',
      'Sequence processing',
      'Anzan speed',
    ],
    promptTypes: [
      'flash-anzan',
    ],
    difficultyRange: [7, 9],
    rodCount: 3,
    isMental: true,
    isFoundational: false,
  },

  {
    id: 'mental-calculation',
    stage: 4,
    stageTitle: 'Mental Abacus',
    title: 'Mental Calculation',
    subtitle: 'Calculate without physical beads',
    description:
      'Perform structured addition and subtraction entirely through an internal Soroban image.',
    prerequisites: ['flash-anzan'],
    masteryTarget: 90,
    minimumAttempts: 12,
    skills: [
      'Mental addition',
      'Mental subtraction',
      'Mental place value',
      'Mental carrying',
      'Mental borrowing',
      'Calculation fluency',
    ],
    promptTypes: [
      'mental-addition',
      'mental-subtraction',
    ],
    difficultyRange: [7, 9],
    rodCount: 4,
    isMental: true,
    isFoundational: false,
  },

  /* ------------------------------------------------------------------------ */
  /* Stage 5 — Advanced Anzan                                                 */
  /* ------------------------------------------------------------------------ */

  {
    id: 'advanced-mental-operations',
    stage: 5,
    stageTitle: 'Advanced Anzan',
    title: 'Advanced Mental Operations',
    subtitle: 'Handle larger mental calculations',
    description:
      'Perform increasingly demanding multi-digit addition and subtraction using a stable internal Soroban model.',
    prerequisites: ['mental-calculation'],
    masteryTarget: 90,
    minimumAttempts: 12,
    skills: [
      'Multi-digit mental addition',
      'Multi-digit mental subtraction',
      'Mental carrying',
      'Mental borrowing',
      'Longer mental sequences',
      'Mental endurance',
    ],
    promptTypes: [
      'mental-addition',
      'mental-subtraction',
    ],
    difficultyRange: [8, 10],
    rodCount: 5,
    isMental: true,
    isFoundational: false,
  },

  {
    id: 'mental-multiplication-division',
    stage: 5,
    stageTitle: 'Advanced Anzan',
    title: 'Mental Multiplication & Division',
    subtitle: 'Extend Anzan beyond addition',
    description:
      'Apply structured mental strategies to multiplication and exact division while maintaining place-value awareness.',
    prerequisites: ['advanced-mental-operations'],
    masteryTarget: 90,
    minimumAttempts: 12,
    skills: [
      'Mental multiplication',
      'Mental division',
      'Factor recognition',
      'Quotient reasoning',
      'Place-value strategy',
    ],
    promptTypes: [
      'mental-multiplication',
      'mental-division',
    ],
    difficultyRange: [8, 10],
    rodCount: 5,
    isMental: true,
    isFoundational: false,
  },

  {
    id: 'speed-mastery',
    stage: 5,
    stageTitle: 'Advanced Anzan',
    title: 'Speed, Accuracy & Mastery',
    subtitle: 'Demonstrate fluent Anzan',
    description:
      'Integrate mastered Anzan skills under time pressure while maintaining exceptional accuracy and mental control.',
    prerequisites: ['mental-multiplication-division'],
    masteryTarget: 90,
    minimumAttempts: 15,
    skills: [
      'Speed',
      'Accuracy',
      'Mental endurance',
      'Mixed operations',
      'Rapid processing',
      'Anzan mastery',
    ],
    promptTypes: [
      'speed',
    ],
    difficultyRange: [8, 10],
    rodCount: 5,
    isMental: true,
    isFoundational: false,
  },
];

/* -------------------------------------------------------------------------- */
/* Curriculum helpers                                                          */
/* -------------------------------------------------------------------------- */

export const DEFAULT_ABACUS_LEVEL: AbacusLevelId =
  'abacus-orientation';

export function getAbacusLevel(
  levelId: AbacusLevelId,
): AbacusLevel | undefined {
  return ABACUS_LEVELS.find(level => level.id === levelId);
}

export function getAbacusLevelIndex(
  levelId: AbacusLevelId,
): number {
  return ABACUS_LEVELS.findIndex(level => level.id === levelId);
}

export function getNextAbacusLevel(
  levelId: AbacusLevelId,
): AbacusLevel | undefined {
  const index = getAbacusLevelIndex(levelId);

  if (index < 0 || index >= ABACUS_LEVELS.length - 1) {
    return undefined;
  }

  return ABACUS_LEVELS[index + 1];
}

export function getLevelsForStage(
  stage: AbacusStage,
): AbacusLevel[] {
  return ABACUS_LEVELS.filter(
    level => level.stage === stage,
  );
}

export function getStageTitle(
  stage: AbacusStage,
): string {
  const level = ABACUS_LEVELS.find(
    candidate => candidate.stage === stage,
  );

  return level?.stageTitle ?? '';
}

/* -------------------------------------------------------------------------- */
/* Random helpers                                                              */
/* -------------------------------------------------------------------------- */

function randomInt(
  min: number,
  max: number,
): number {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));

  return (
    Math.floor(
      Math.random() * (upper - lower + 1),
    ) + lower
  );
}

function randomChoice<T>(
  items: readonly T[],
): T {
  return items[
    randomInt(0, items.length - 1)
  ];
}

function shuffle<T>(
  items: readonly T[],
): T[] {
  return [...items].sort(
    () => Math.random() - 0.5,
  );
}

function clampDifficulty(
  level: AbacusLevel,
  mode: AbacusMode,
): number {
  const [minimum, maximum] =
    level.difficultyRange;

  let difficulty = randomInt(
    minimum,
    maximum,
  );

  if (mode === 'beginner') {
    difficulty = Math.max(
      minimum,
      difficulty - 1,
    );
  }

  if (mode === 'challenge') {
    difficulty = Math.min(
      maximum,
      difficulty + 1,
    );
  }

  return difficulty;
}

function digitsForDifficulty(
  difficulty: number,
  maximumDigits: number,
): number {
  const desired =
    difficulty <= 3
      ? 1
      : difficulty <= 6
        ? 2
        : difficulty <= 8
          ? 3
          : 4;

  return Math.min(
    desired,
    maximumDigits,
  );
}

function makeId(
  levelId: AbacusLevelId,
  type: AbacusPromptType,
): string {
  return `${levelId}-${type}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

/* -------------------------------------------------------------------------- */
/* Foundation generators                                                       */
/* -------------------------------------------------------------------------- */

function createExplorationPrompt(
  level: AbacusLevel,
  mode: AbacusMode,
): AbacusPrompt {
  const target = randomInt(1, 5);

  return {
    id: makeId(level.id, 'exploration'),
    levelId: level.id,
    mode,
    type: 'exploration',
    question: `Activate ${target} bead${
      target === 1 ? '' : 's'
    } on the Soroban.`,
    answer: target,
    instruction:
      'Move the required earth beads toward the beam.',
    difficulty: clampDifficulty(
      level,
      mode,
    ),
    isMental: false,
  };
}

function createBeadIdentificationPrompt(
  level: AbacusLevel,
  mode: AbacusMode,
): AbacusPrompt {
  const targetType = randomChoice([
    'heaven',
    'earth',
    'beam',
    'rod',
  ] as const);

  let question: string;
  let answer: number;

  switch (targetType) {
    case 'heaven':
      question =
        'How much is the heaven bead worth?';
      answer = 5;
      break;

    case 'earth':
      question =
        'How many earth beads are on one rod?';
      answer = 4;
      break;

    case 'beam':
      question =
        'What separates the heaven bead from the earth beads?';
      answer = 1;
      break;

    default:
      question =
        'How many main rods are used in this beginner exercise?';
      answer = 1;
      break;
  }

  const distractors = [
    Math.max(1, answer - 1),
    answer + 1,
    answer + 2,
  ];

  return {
    id: makeId(
      level.id,
      'bead-identification',
    ),
    levelId: level.id,
    mode,
    type: 'bead-identification',
    question,
    answer,
    options: shuffle(
      Array.from(
        new Set([
          answer,
          ...distractors,
        ]),
      ),
    ),
    instruction:
      'Identify the Soroban part and choose its correct value or quantity.',
    difficulty: clampDifficulty(
      level,
      mode,
    ),
    isMental: false,
  };
}

function createCountingPrompt(
  level: AbacusLevel,
  mode: AbacusMode,
): AbacusPrompt {
  const answer = randomInt(0, 9);

  return {
    id: makeId(level.id, 'counting'),
    levelId: level.id,
    mode,
    type: 'counting',
    question: `Show the number ${answer} on the Soroban.`,
    answer,
    instruction:
      'Move the beads so the rod represents the requested quantity.',
    difficulty: clampDifficulty(
      level,
      mode,
    ),
    isMental: false,
  };
}

function createRepresentationPrompt(
  level: AbacusLevel,
  mode: AbacusMode,
): AbacusPrompt {
  const maximum =
    level.rodCount >= 4
      ? 9999
      : level.rodCount >= 3
        ? 999
        : level.rodCount >= 2
          ? 99
          : 9;

  const minimum =
    level.rodCount >= 2
      ? 10
      : 0;

  const answer = randomInt(
    minimum,
    maximum,
  );

  return {
    id: makeId(
      level.id,
      'representation',
    ),
    levelId: level.id,
    mode,
    type: 'representation',
    question: `Represent ${answer} on the Soroban.`,
    answer,
    instruction:
      'Set each rod so that the complete Soroban value matches the number.',
    digits: String(answer).length,
    difficulty: clampDifficulty(
      level,
      mode,
    ),
    isMental: false,
  };
}

/* -------------------------------------------------------------------------- */
/* Soroban calculation generators                                              */
/* -------------------------------------------------------------------------- */

function createAdditionPrompt(
  level: AbacusLevel,
  mode: AbacusMode,
): AbacusPrompt {
  const difficulty = clampDifficulty(
    level,
    mode,
  );

  const digits = digitsForDifficulty(
    difficulty,
    Math.min(level.rodCount, 3),
  );

  const limit = 10 ** digits - 1;

  /*
   * Direct-calculation exercises intentionally avoid
   * forcing complements. The learner should be able
   * to perform the movement directly.
   */
  const a = randomInt(
    0,
    Math.max(
      1,
      Math.floor(limit * 0.35),
    ),
  );

  const remaining =
    limit - a;

  const b = randomInt(
    0,
    Math.max(
      1,
      Math.floor(remaining * 0.6),
    ),
  );

  const answer = a + b;

  return {
    id: makeId(level.id, 'addition'),
    levelId: level.id,
    mode,
    type: 'addition',
    question: `Calculate ${a} + ${b}.`,
    answer,
    instruction:
      'Set the first number, then move the beads directly to add the second number.',
    digits: Math.max(
      String(a).length,
      String(b).length,
    ),
    difficulty,
    isMental: false,
  };
}

function createSubtractionPrompt(
  level: AbacusLevel,
  mode: AbacusMode,
): AbacusPrompt {
  const difficulty = clampDifficulty(
    level,
    mode,
  );

  const digits = digitsForDifficulty(
    difficulty,
    Math.min(level.rodCount, 3),
  );

  const limit = 10 ** digits - 1;

  const a = randomInt(
    Math.max(1, Math.floor(limit * 0.35)),
    limit,
  );

  const b = randomInt(
    0,
    Math.max(
      0,
      Math.floor(a * 0.45),
    ),
  );

  return {
    id: makeId(level.id, 'subtraction'),
    levelId: level.id,
    mode,
    type: 'subtraction',
    question: `Calculate ${a} − ${b}.`,
    answer: a - b,
    instruction:
      'Set the first number, then move the beads directly to subtract the second number.',
    digits: Math.max(
      String(a).length,
      String(b).length,
    ),
    difficulty,
    isMental: false,
  };
}

function createPlaceValuePrompt(
  level: AbacusLevel,
  mode: AbacusMode,
): AbacusPrompt {
  const hundreds = randomInt(1, 9);
  const tens = randomInt(0, 9);
  const ones = randomInt(0, 9);

  const answer =
    hundreds * 100 +
    tens * 10 +
    ones;

  const place = randomChoice([
    'hundreds',
    'tens',
    'ones',
  ] as const);

  const placeValue =
    place === 'hundreds'
      ? hundreds
      : place === 'tens'
        ? tens
        : ones;

  return {
    id: makeId(
      level.id,
      'place-value',
    ),
    levelId: level.id,
    mode,
    type: 'place-value',
    question: `In ${answer}, what digit is in the ${place} place?`,
    answer: placeValue,
    options: shuffle(
      Array.from(
        new Set([
          placeValue,
          randomInt(0, 9),
          randomInt(0, 9),
          randomInt(0, 9),
        ]),
      ),
    ),
    instruction:
      'Use the rods to identify the correct place value.',
    difficulty: clampDifficulty(
      level,
      mode,
    ),
    isMental: false,
  };
}

/* -------------------------------------------------------------------------- */
/* Soroban formula generators                                                  */
/* -------------------------------------------------------------------------- */

function createSmallFriendPrompt(
  level: AbacusLevel,
  mode: AbacusMode,
): AbacusPrompt {
  const base = randomInt(1, 4);
  const friend = 5 - base;

  const operation = randomChoice([
    'addition',
    'subtraction',
  ] as const);

  if (operation === 'addition') {
    return {
      id: makeId(
        level.id,
        'small-friend',
      ),
      levelId: level.id,
      mode,
      type: 'small-friend',
      question: `What small friend helps you add ${5 - base} when only ${base} is available?`,
      answer: friend,
      options: shuffle([
        friend,
        base,
        5 + base,
        Math.max(0, friend - 1),
      ]),
      instruction:
        'Find the complement that completes the pair to 5.',
      formula: `${base} + ${friend} = 5`,
      difficulty: clampDifficulty(
        level,
        mode,
      ),
      isMental: false,
    };
  }

  return {
    id: makeId(
      level.id,
      'small-friend',
    ),
    levelId: level.id,
    mode,
    type: 'small-friend',
    question: `What number must combine with ${base} to make 5?`,
    answer: friend,
    options: shuffle([
      friend,
      base,
      5 + base,
      Math.max(0, friend - 1),
    ]),
    instruction:
      'Use the small-friend relationship to complete 5.',
    formula: `${base} + ${friend} = 5`,
    difficulty: clampDifficulty(
      level,
      mode,
    ),
    isMental: false,
  };
}

function createBigFriendPrompt(
  level: AbacusLevel,
  mode: AbacusMode,
): AbacusPrompt {
  const base = randomInt(1, 9);
  const friend = 10 - base;

  return {
    id: makeId(
      level.id,
      'big-friend',
    ),
    levelId: level.id,
    mode,
    type: 'big-friend',
    question: `What is the big friend of ${base}?`,
    answer: friend,
    options: shuffle([
      friend,
      base,
      10 + base,
      Math.max(0, friend - 1),
    ]),
    instruction:
      'Find the complement that completes the pair to 10.',
    formula: `${base} + ${friend} = 10`,
    difficulty: clampDifficulty(
      level,
      mode,
    ),
    isMental: false,
  };
}

function createMultiDigitPrompt(
  level: AbacusLevel,
  mode: AbacusMode,
): AbacusPrompt {
  const difficulty = clampDifficulty(
    level,
    mode,
  );

  const digits = Math.min(
    4,
    digitsForDifficulty(
      difficulty,
      level.rodCount,
    ),
  );

  const limit = 10 ** digits - 1;

  const a = randomInt(
    Math.max(10, Math.floor(limit * 0.25)),
    Math.max(10, Math.floor(limit * 0.65)),
  );

  const b = randomInt(
    10,
    Math.max(
      10,
      Math.floor(limit * 0.25),
    ),
  );

  const addition =
    Math.random() >= 0.5;

  const first = addition
    ? a
    : Math.max(a, b);

  const second = addition
    ? b
    : Math.min(a, b);

  const answer = addition
    ? first + second
    : first - second;

  return {
    id: makeId(
      level.id,
      'multi-digit',
    ),
    levelId: level.id,
    mode,
    type: 'multi-digit',
    question: addition
      ? `Calculate ${first} + ${second}.`
      : `Calculate ${first} − ${second}.`,
    answer,
    instruction:
      'Work across the rods and apply the Soroban techniques you have learned.',
    digits: Math.max(
      String(first).length,
      String(second).length,
    ),
    difficulty,
    isMental: false,
  };
}

/* -------------------------------------------------------------------------- */
/* Mental Abacus generators                                                    */
/* -------------------------------------------------------------------------- */

function createVisualisationPrompt(
  level: AbacusLevel,
  mode: AbacusMode,
): AbacusPrompt {
  const difficulty = clampDifficulty(
    level,
    mode,
  );

  const digits = Math.min(
    3,
    Math.max(
      1,
      digitsForDifficulty(
        difficulty,
        level.rodCount,
      ),
    ),
  );

  const maximum = 10 ** digits - 1;
  const target = randomInt(
    0,
    maximum,
  );

  /*
   * Visualisation is deliberately NOT an arithmetic
   * question. The objective is to construct a stable
   * internal image of the Soroban.
   */
  return {
    id: makeId(
      level.id,
      'visualisation',
    ),
    levelId: level.id,
    mode,
    type: 'visualisation',
    question: `Visualise ${target} on your mental Soroban.`,
    answer: target,
    instruction:
      'Picture the rods, beam and bead positions in your mind. Hold the image before checking your answer.',
    digits,
    difficulty,
    isMental: true,
  };
}

function createFlashAnzanPrompt(
  level: AbacusLevel,
  mode: AbacusMode,
): AbacusPrompt {
  const difficulty = clampDifficulty(
    level,
    mode,
  );

  const sequenceLength =
    difficulty <= 7
      ? 3
      : difficulty <= 8
        ? 4
        : 5;

  const maximum =
    difficulty <= 7
      ? 9
      : difficulty <= 8
        ? 20
        : 50;

  const sequence = Array.from(
    { length: sequenceLength },
    () => randomInt(1, maximum),
  );

  const answer = sequence.reduce(
    (total, value) =>
      total + value,
    0,
  );

  return {
    id: makeId(
      level.id,
      'flash-anzan',
    ),
    levelId: level.id,
    mode,
    type: 'flash-anzan',
    question:
      'Watch the sequence, then calculate the final total mentally.',
    answer,
    instruction:
      'Keep the running total on your mental Soroban. The sequence will disappear.',
    sequence,
    difficulty,
    isMental: true,
    timeLimit: Math.max(
      3,
      sequenceLength * 1.25,
    ),
  };
}

function createMentalAdditionPrompt(
  level: AbacusLevel,
  mode: AbacusMode,
): AbacusPrompt {
  const difficulty = clampDifficulty(
    level,
    mode,
  );

  const digits = Math.min(
    4,
    digitsForDifficulty(
      difficulty,
      level.rodCount,
    ),
  );

  const limit = 10 ** digits - 1;

  const a = randomInt(
    1,
    Math.max(
      1,
      Math.floor(limit * 0.45),
    ),
  );

  const b = randomInt(
    1,
    Math.max(
      1,
      Math.floor(limit * 0.35),
    ),
  );

  return {
    id: makeId(
      level.id,
      'mental-addition',
    ),
    levelId: level.id,
    mode,
    type: 'mental-addition',
    question: `Mentally calculate ${a} + ${b}.`,
    answer: a + b,
    instruction:
      'Use your internal Soroban. Do not rely on physical bead movement.',
    digits: Math.max(
      String(a).length,
      String(b).length,
    ),
    difficulty,
    isMental: true,
  };
}

function createMentalSubtractionPrompt(
  level: AbacusLevel,
  mode: AbacusMode,
): AbacusPrompt {
  const difficulty = clampDifficulty(
    level,
    mode,
  );

  const digits = Math.min(
    4,
    digitsForDifficulty(
      difficulty,
      level.rodCount,
    ),
  );

  const limit = 10 ** digits - 1;

  const a = randomInt(
    Math.max(
      10,
      Math.floor(limit * 0.35),
    ),
    Math.max(10, limit),
  );

  const b = randomInt(
    1,
    Math.max(
      1,
      Math.floor(a * 0.55),
    ),
  );

  return {
    id: makeId(
      level.id,
      'mental-subtraction',
    ),
    levelId: level.id,
    mode,
    type: 'mental-subtraction',
    question: `Mentally calculate ${a} − ${b}.`,
    answer: a - b,
    instruction:
      'Visualise the Soroban and perform the subtraction mentally.',
    digits: Math.max(
      String(a).length,
      String(b).length,
    ),
    difficulty,
    isMental: true,
  };
}

function createMentalMultiplicationPrompt(
  level: AbacusLevel,
  mode: AbacusMode,
): AbacusPrompt {
  const difficulty = clampDifficulty(
    level,
    mode,
  );

  const maxFactor =
    difficulty <= 8
      ? 9
      : 12;

  const a = randomInt(
    2,
    maxFactor,
  );

  const b = randomInt(
    2,
    maxFactor,
  );

  return {
    id: makeId(
      level.id,
      'mental-multiplication',
    ),
    levelId: level.id,
    mode,
    type: 'mental-multiplication',
    question: `Mentally calculate ${a} × ${b}.`,
    answer: a * b,
    instruction:
      'Use mental place-value reasoning to calculate the product.',
    formula: `${a} × ${b}`,
    difficulty,
    isMental: true,
  };
}

function createMentalDivisionPrompt(
  level: AbacusLevel,
  mode: AbacusMode,
): AbacusPrompt {
  const difficulty = clampDifficulty(
    level,
    mode,
  );

  const divisor = randomInt(
    2,
    difficulty >= 9
      ? 12
      : 9,
  );

  const quotient = randomInt(
    2,
    difficulty >= 9
      ? 20
      : 12,
  );

  const dividend =
    divisor * quotient;

  return {
    id: makeId(
      level.id,
      'mental-division',
    ),
    levelId: level.id,
    mode,
    type: 'mental-division',
    question: `Mentally calculate ${dividend} ÷ ${divisor}.`,
    answer: quotient,
    instruction:
      'Find the exact quotient mentally.',
    formula: `${dividend} ÷ ${divisor}`,
    difficulty,
    isMental: true,
  };
}

/* -------------------------------------------------------------------------- */
/* Speed generator                                                             */
/* -------------------------------------------------------------------------- */

function createSpeedPrompt(
  level: AbacusLevel,
  mode: AbacusMode,
): AbacusPrompt {
  const difficulty = clampDifficulty(
    level,
    'challenge',
  );

  const operation = randomChoice([
    'addition',
    'subtraction',
    'multiplication',
  ] as const);

  let question: string;
  let answer: number;

  if (operation === 'addition') {
    const a = randomInt(10, 99);
    const b = randomInt(1, 50);

    question =
      `Quickly calculate ${a} + ${b}.`;
    answer = a + b;
  } else if (
    operation === 'subtraction'
  ) {
    const a = randomInt(30, 120);
    const b = randomInt(1, Math.min(60, a));

    question =
      `Quickly calculate ${a} − ${b}.`;
    answer = a - b;
  } else {
    const a = randomInt(2, 12);
    const b = randomInt(2, 12);

    question =
      `Quickly calculate ${a} × ${b}.`;
    answer = a * b;
  }

  return {
    id: makeId(level.id, 'speed'),
    levelId: level.id,
    mode,
    type: 'speed',
    question,
    answer,
    instruction:
      'Prioritise both speed and accuracy.',
    difficulty,
    isMental: true,
    timeLimit:
      difficulty >= 9
        ? 6
        : 8,
  };
}

/* -------------------------------------------------------------------------- */
/* Public prompt factory                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Create a prompt for the selected curriculum module.
 *
 * IMPORTANT:
 *
 * The module is authoritative.
 *
 * `mode` changes:
 * - difficulty
 * - practice intensity
 * - timing
 *
 * It does NOT replace the module with another subject.
 *
 * For example:
 *
 * direct-calculation + mental mode
 *   still remains direct-calculation.
 *
 * This prevents practice modes from destroying
 * the curriculum progression.
 */
export function createPrompt(
  levelId: AbacusLevelId,
  mode: AbacusMode = 'practice',
): AbacusPrompt {
  const level =
    getAbacusLevel(levelId);

  if (!level) {
    throw new Error(
      `Unknown Abacus Academy level: ${levelId}`,
    );
  }

  /*
   * Mental mode is only meaningful for modules
   * that actually teach mental/Anzan skills.
   *
   * We therefore do NOT substitute a physical
   * module's prompt with an unrelated mental prompt.
   */
  let selectedType: AbacusPromptType;

  if (
    mode === 'mental' &&
    level.isMental
  ) {
    selectedType =
      randomChoice(
        level.promptTypes,
      );
  } else {
    selectedType =
      randomChoice(
        level.promptTypes,
      );
  }

  switch (selectedType) {
    case 'exploration':
      return createExplorationPrompt(
        level,
        mode,
      );

    case 'counting':
      return createCountingPrompt(
        level,
        mode,
      );

    case 'representation':
      return createRepresentationPrompt(
        level,
        mode,
      );

    case 'bead-identification':
      return createBeadIdentificationPrompt(
        level,
        mode,
      );

    case 'addition':
      return createAdditionPrompt(
        level,
        mode,
      );

    case 'subtraction':
      return createSubtractionPrompt(
        level,
        mode,
      );

    case 'place-value':
      return createPlaceValuePrompt(
        level,
        mode,
      );

    case 'small-friend':
      return createSmallFriendPrompt(
        level,
        mode,
      );

    case 'big-friend':
      return createBigFriendPrompt(
        level,
        mode,
      );

    case 'multi-digit':
      return createMultiDigitPrompt(
        level,
        mode,
      );

    case 'visualisation':
      return createVisualisationPrompt(
        level,
        mode,
      );

    case 'flash-anzan':
      return createFlashAnzanPrompt(
        level,
        mode,
      );

    case 'mental-addition':
      return createMentalAdditionPrompt(
        level,
        mode,
      );

    case 'mental-subtraction':
      return createMentalSubtractionPrompt(
        level,
        mode,
      );

    case 'mental-multiplication':
      return createMentalMultiplicationPrompt(
        level,
        mode,
      );

    case 'mental-division':
      return createMentalDivisionPrompt(
        level,
        mode,
      );

    case 'speed':
      return createSpeedPrompt(
        level,
        mode,
      );

    /*
     * These should not normally be reached because
     * mixed is intentionally no longer used as a
     * primary prompt type by the curriculum.
     */
    case 'mixed':
      if (level.isMental) {
        return randomChoice([
          createMentalAdditionPrompt(
            level,
            mode,
          ),
          createMentalSubtractionPrompt(
            level,
            mode,
          ),
        ]);
      }

      return randomChoice([
        createAdditionPrompt(
          level,
          mode,
        ),
        createSubtractionPrompt(
          level,
          mode,
        ),
      ]);

    default:
      return createMixedPromptFallback(
        level,
        mode,
      );
  }
}

/* -------------------------------------------------------------------------- */
/* Internal fallback                                                           */
/* -------------------------------------------------------------------------- */

function createMixedPromptFallback(
  level: AbacusLevel,
  mode: AbacusMode,
): AbacusPrompt {
  if (level.isMental) {
    return Math.random() >= 0.5
      ? createMentalAdditionPrompt(
          level,
          mode,
        )
      : createMentalSubtractionPrompt(
          level,
          mode,
        );
  }

  return Math.random() >= 0.5
    ? createAdditionPrompt(
        level,
        mode,
      )
    : createSubtractionPrompt(
        level,
        mode,
      );
}