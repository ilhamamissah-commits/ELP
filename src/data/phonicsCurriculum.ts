export type PhonicsStageId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type PhonicsPattern =
  | 'CVC'
  | 'DIGRAPH'
  | 'MAGIC_E'
  | 'BLEND'
  | 'COMPLEX_BLEND'
  | 'MULTISYLLABIC';

export type PhonicsSkill =
  | 'phoneme-recognition'
  | 'phoneme-blending'
  | 'phoneme-segmenting'
  | 'grapheme-recognition'
  | 'decoding'
  | 'encoding'
  | 'digraph-recognition'
  | 'blend-recognition'
  | 'vowel-pattern-recognition'
  | 'word-reading'
  | 'spelling'
  | 'fluency';

export type WordDifficulty =
  | 'emerging'
  | 'developing'
  | 'secure'
  | 'challenge';

export interface PhonicsWord {
  id: string;

  /** Written form of the word. */
  word: string;

  /** Phonemes/grapheme units used for decoding. */
  sounds: readonly string[];

  /** Optional teacher/learner meaning. */
  meaning?: string;

  /** Professional UI icon name. */
  icon?: string;

  /** Kept for backwards compatibility with older UI components. */
  emoji?: string;

  /** Structural phonics pattern. */
  pattern: PhonicsPattern;

  /** Specific phonics skill(s) practised by this word. */
  skillIds: readonly string[];

  /** Main grapheme focus. */
  graphemeFocus: readonly string[];

  /** Difficulty inside the stage. */
  difficulty: WordDifficulty;

  /** Whether this is suitable as a decodable word. */
  decodable: boolean;

  /** Whether the word is useful for spelling/encoding practice. */
  encodable: boolean;

  /** Whether this word is suitable for early fluency practice. */
  fluencyReady: boolean;

  /** Optional words that should be mastered before this one. */
  prerequisiteWordIds?: readonly string[];

  /** Optional tags for lesson/activity generation. */
  tags: readonly string[];
}

export interface PhonicsStage {
  id: PhonicsStageId;

  title: string;

  description: string;

  /** Grapheme/phoneme focus for the stage. */
  patternFocus: readonly string[];

  /** Human-readable display of the focus. */
  focusLabel: string;

  pattern: PhonicsPattern;

  skillIds: readonly string[];

  prerequisiteStageIds: readonly PhonicsStageId[];

  masteryThreshold: number;

  recommendedReviewIntervalDays: number;

  words: readonly PhonicsWord[];
}

export interface PhonicsCurriculumMetadata {
  academyId: 'language';

  subjectId: 'english';

  domain: 'literacy';

  curriculumArea: 'phonics';

  version: string;

  language: 'en-GB';

  totalStages: number;

  progressionModel: 'mastery';

  note: string;
}

/**
 * Phonics is a Language & Literacy curriculum area.
 *
 * These stages are NOT the learner's overall ELP level.
 * A learner may be advanced in phonics while requiring support
 * in another literacy competency.
 */
export const PHONICS_CURRICULUM_METADATA: PhonicsCurriculumMetadata = {
  academyId: 'language',
  subjectId: 'english',
  domain: 'literacy',
  curriculumArea: 'phonics',
  version: '2.0.0',
  language: 'en-GB',
  totalStages: 10,
  progressionModel: 'mastery',
  note:
    'Progress through phonics stages is determined by demonstrated mastery, not chronological age.',
};

export const PHONICS_CURRICULUM: readonly PhonicsStage[] = [
  {
    id: 1,
    title: 'Stage 1: SATPIN',
    description:
      'Build early decoding through a small set of highly useful graphemes and simple CVC words.',
    patternFocus: ['s', 'a', 't', 'p', 'i', 'n'],
    focusLabel: 's · a · t · p · i · n',
    pattern: 'CVC',
    skillIds: [
      'phoneme-recognition',
      'grapheme-recognition',
      'phoneme-blending',
      'phoneme-segmenting',
      'decoding',
    ],
    prerequisiteStageIds: [],
    masteryThreshold: 80,
    recommendedReviewIntervalDays: 3,
    words: [
      {
        id: 'p1',
        word: 'sat',
        sounds: ['s', 'a', 't'],
        meaning: 'sat',
        icon: 'Armchair',
        pattern: 'CVC',
        skillIds: ['phoneme-blending', 'decoding'],
        graphemeFocus: ['s', 'a', 't'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-a', 'early-cvc'],
      },
      {
        id: 'p2',
        word: 'pat',
        sounds: ['p', 'a', 't'],
        meaning: 'pat',
        icon: 'Hand',
        pattern: 'CVC',
        skillIds: ['phoneme-blending', 'decoding'],
        graphemeFocus: ['p', 'a', 't'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-a', 'early-cvc'],
      },
      {
        id: 'p3',
        word: 'tap',
        sounds: ['t', 'a', 'p'],
        meaning: 'tap',
        icon: 'Droplets',
        pattern: 'CVC',
        skillIds: ['phoneme-blending', 'decoding'],
        graphemeFocus: ['t', 'a', 'p'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-a', 'early-cvc'],
      },
      {
        id: 'p4',
        word: 'sip',
        sounds: ['s', 'i', 'p'],
        meaning: 'sip',
        icon: 'GlassWater',
        pattern: 'CVC',
        skillIds: ['phoneme-blending', 'decoding'],
        graphemeFocus: ['s', 'i', 'p'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-i', 'early-cvc'],
      },
      {
        id: 'p5',
        word: 'pin',
        sounds: ['p', 'i', 'n'],
        meaning: 'pin',
        icon: 'Pin',
        pattern: 'CVC',
        skillIds: ['phoneme-blending', 'decoding'],
        graphemeFocus: ['p', 'i', 'n'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-i', 'early-cvc'],
      },
      {
        id: 'p6',
        word: 'nip',
        sounds: ['n', 'i', 'p'],
        meaning: 'nip',
        icon: 'Hand',
        pattern: 'CVC',
        skillIds: ['phoneme-blending', 'decoding'],
        graphemeFocus: ['n', 'i', 'p'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-i', 'early-cvc'],
      },
      {
        id: 'p7',
        word: 'sit',
        sounds: ['s', 'i', 't'],
        meaning: 'sit',
        icon: 'Armchair',
        pattern: 'CVC',
        skillIds: ['phoneme-blending', 'decoding'],
        graphemeFocus: ['s', 'i', 't'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-i', 'early-cvc'],
      },
      {
        id: 'p8',
        word: 'tan',
        sounds: ['t', 'a', 'n'],
        meaning: 'tan',
        icon: 'Sun',
        pattern: 'CVC',
        skillIds: ['phoneme-blending', 'decoding'],
        graphemeFocus: ['t', 'a', 'n'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-a', 'early-cvc'],
      },
      {
        id: 'p9',
        word: 'pan',
        sounds: ['p', 'a', 'n'],
        meaning: 'pan',
        icon: 'CookingPot',
        pattern: 'CVC',
        skillIds: ['phoneme-blending', 'decoding'],
        graphemeFocus: ['p', 'a', 'n'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-a', 'early-cvc'],
      },
      {
        id: 'p10',
        word: 'nap',
        sounds: ['n', 'a', 'p'],
        meaning: 'nap',
        icon: 'Bed',
        pattern: 'CVC',
        skillIds: ['phoneme-blending', 'decoding'],
        graphemeFocus: ['n', 'a', 'p'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-a', 'early-cvc'],
      },
    ],
  },

  {
    id: 2,
    title: 'Stage 2: Short E',
    description:
      'Extend CVC decoding with the short e vowel and a wider consonant set.',
    patternFocus: ['e', 'b', 'd', 'g', 'h', 'm', 'n', 'p', 'r', 't', 'w'],
    focusLabel: 'Short e · b · d · g · h · m · n · p · r · t · w',
    pattern: 'CVC',
    skillIds: [
      'phoneme-recognition',
      'phoneme-blending',
      'phoneme-segmenting',
      'decoding',
      'encoding',
    ],
    prerequisiteStageIds: [1],
    masteryThreshold: 80,
    recommendedReviewIntervalDays: 4,
    words: [
      {
        id: 'p11',
        word: 'bed',
        sounds: ['b', 'e', 'd'],
        meaning: 'bed',
        icon: 'Bed',
        pattern: 'CVC',
        skillIds: ['decoding', 'encoding'],
        graphemeFocus: ['b', 'e', 'd'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-e'],
      },
      {
        id: 'p12',
        word: 'den',
        sounds: ['d', 'e', 'n'],
        meaning: 'den',
        icon: 'House',
        pattern: 'CVC',
        skillIds: ['decoding', 'encoding'],
        graphemeFocus: ['d', 'e', 'n'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-e'],
      },
      {
        id: 'p13',
        word: 'hen',
        sounds: ['h', 'e', 'n'],
        meaning: 'hen',
        icon: 'Bird',
        pattern: 'CVC',
        skillIds: ['decoding', 'encoding'],
        graphemeFocus: ['h', 'e', 'n'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-e', 'animals'],
      },
      {
        id: 'p14',
        word: 'men',
        sounds: ['m', 'e', 'n'],
        meaning: 'men',
        icon: 'Users',
        pattern: 'CVC',
        skillIds: ['decoding'],
        graphemeFocus: ['m', 'e', 'n'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-e'],
      },
      {
        id: 'p15',
        word: 'pen',
        sounds: ['p', 'e', 'n'],
        meaning: 'pen',
        icon: 'PenLine',
        pattern: 'CVC',
        skillIds: ['decoding', 'encoding'],
        graphemeFocus: ['p', 'e', 'n'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-e', 'school'],
      },
      {
        id: 'p16',
        word: 'ten',
        sounds: ['t', 'e', 'n'],
        meaning: 'ten',
        icon: 'Badge',
        pattern: 'CVC',
        skillIds: ['decoding', 'encoding'],
        graphemeFocus: ['t', 'e', 'n'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-e', 'numbers'],
      },
      {
        id: 'p17',
        word: 'red',
        sounds: ['r', 'e', 'd'],
        meaning: 'red',
        icon: 'Circle',
        pattern: 'CVC',
        skillIds: ['decoding', 'encoding'],
        graphemeFocus: ['r', 'e', 'd'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-e', 'colours'],
      },
      {
        id: 'p18',
        word: 'wet',
        sounds: ['w', 'e', 't'],
        meaning: 'wet',
        icon: 'Droplets',
        pattern: 'CVC',
        skillIds: ['decoding'],
        graphemeFocus: ['w', 'e', 't'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-e'],
      },
      {
        id: 'p19',
        word: 'pet',
        sounds: ['p', 'e', 't'],
        meaning: 'pet',
        icon: 'PawPrint',
        pattern: 'CVC',
        skillIds: ['decoding', 'encoding'],
        graphemeFocus: ['p', 'e', 't'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-e', 'animals'],
      },
      {
        id: 'p20',
        word: 'net',
        sounds: ['n', 'e', 't'],
        meaning: 'net',
        icon: 'Goal',
        pattern: 'CVC',
        skillIds: ['decoding'],
        graphemeFocus: ['n', 'e', 't'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-e'],
      },
    ],
  },

  {
    id: 3,
    title: 'Stage 3: Short I',
    description:
      'Develop automatic recognition and decoding of short-i CVC words.',
    patternFocus: ['i', 'b', 'd', 'f', 'g', 'h', 'l', 'p', 'w'],
    focusLabel: 'Short i · b · d · f · g · h · l · p · w',
    pattern: 'CVC',
    skillIds: [
      'phoneme-blending',
      'phoneme-segmenting',
      'decoding',
      'encoding',
      'word-reading',
    ],
    prerequisiteStageIds: [2],
    masteryThreshold: 80,
    recommendedReviewIntervalDays: 5,
    words: [
      {
        id: 'p21',
        word: 'big',
        sounds: ['b', 'i', 'g'],
        meaning: 'big',
        icon: 'Maximize',
        pattern: 'CVC',
        skillIds: ['decoding', 'word-reading'],
        graphemeFocus: ['b', 'i', 'g'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-i'],
      },
      {
        id: 'p22',
        word: 'dig',
        sounds: ['d', 'i', 'g'],
        meaning: 'dig',
        icon: 'Shovel',
        pattern: 'CVC',
        skillIds: ['decoding', 'encoding'],
        graphemeFocus: ['d', 'i', 'g'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-i'],
      },
      {
        id: 'p23',
        word: 'fig',
        sounds: ['f', 'i', 'g'],
        meaning: 'fig',
        icon: 'Apple',
        pattern: 'CVC',
        skillIds: ['decoding'],
        graphemeFocus: ['f', 'i', 'g'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-i', 'food'],
      },
      {
        id: 'p24',
        word: 'pig',
        sounds: ['p', 'i', 'g'],
        meaning: 'pig',
        icon: 'PawPrint',
        pattern: 'CVC',
        skillIds: ['decoding', 'word-reading'],
        graphemeFocus: ['p', 'i', 'g'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-i', 'animals'],
      },
      {
        id: 'p25',
        word: 'wig',
        sounds: ['w', 'i', 'g'],
        meaning: 'wig',
        icon: 'UserRound',
        pattern: 'CVC',
        skillIds: ['decoding'],
        graphemeFocus: ['w', 'i', 'g'],
        difficulty: 'challenge',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-i'],
      },
      {
        id: 'p26',
        word: 'bin',
        sounds: ['b', 'i', 'n'],
        meaning: 'bin',
        icon: 'Trash2',
        pattern: 'CVC',
        skillIds: ['decoding', 'encoding'],
        graphemeFocus: ['b', 'i', 'n'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-i'],
      },
      {
        id: 'p27',
        word: 'fin',
        sounds: ['f', 'i', 'n'],
        meaning: 'fin',
        icon: 'Fish',
        pattern: 'CVC',
        skillIds: ['decoding'],
        graphemeFocus: ['f', 'i', 'n'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-i', 'animals'],
      },
      {
        id: 'p28',
        word: 'pin',
        sounds: ['p', 'i', 'n'],
        meaning: 'pin',
        icon: 'Pin',
        pattern: 'CVC',
        skillIds: ['decoding', 'encoding'],
        graphemeFocus: ['p', 'i', 'n'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-i'],
      },
      {
        id: 'p29',
        word: 'win',
        sounds: ['w', 'i', 'n'],
        meaning: 'win',
        icon: 'Trophy',
        pattern: 'CVC',
        skillIds: ['decoding', 'word-reading'],
        graphemeFocus: ['w', 'i', 'n'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-i'],
      },
      {
        id: 'p30',
        word: 'lip',
        sounds: ['l', 'i', 'p'],
        meaning: 'lip',
        icon: 'Smile',
        pattern: 'CVC',
        skillIds: ['decoding'],
        graphemeFocus: ['l', 'i', 'p'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-i', 'body'],
      },
    ],
  },

  {
    id: 4,
    title: 'Stage 4: Short O',
    description:
      'Extend CVC decoding with short-o words and improve reading automaticity.',
    patternFocus: ['o', 'c', 'd', 'h', 'l', 'm', 'p', 'r', 't'],
    focusLabel: 'Short o · c · d · h · l · m · p · r · t',
    pattern: 'CVC',
    skillIds: [
      'phoneme-blending',
      'phoneme-segmenting',
      'decoding',
      'encoding',
      'fluency',
    ],
    prerequisiteStageIds: [3],
    masteryThreshold: 80,
    recommendedReviewIntervalDays: 5,
    words: [
      {
        id: 'p31',
        word: 'cot',
        sounds: ['c', 'o', 't'],
        meaning: 'cot',
        icon: 'Bed',
        pattern: 'CVC',
        skillIds: ['decoding', 'encoding'],
        graphemeFocus: ['c', 'o', 't'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-o'],
      },
      {
        id: 'p32',
        word: 'dot',
        sounds: ['d', 'o', 't'],
        meaning: 'dot',
        icon: 'Circle',
        pattern: 'CVC',
        skillIds: ['decoding'],
        graphemeFocus: ['d', 'o', 't'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-o'],
      },
      {
        id: 'p33',
        word: 'hot',
        sounds: ['h', 'o', 't'],
        meaning: 'hot',
        icon: 'Flame',
        pattern: 'CVC',
        skillIds: ['decoding', 'word-reading'],
        graphemeFocus: ['h', 'o', 't'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-o'],
      },
      {
        id: 'p34',
        word: 'lot',
        sounds: ['l', 'o', 't'],
        meaning: 'lot',
        icon: 'Boxes',
        pattern: 'CVC',
        skillIds: ['decoding'],
        graphemeFocus: ['l', 'o', 't'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-o'],
      },
      {
        id: 'p35',
        word: 'pot',
        sounds: ['p', 'o', 't'],
        meaning: 'pot',
        icon: 'CookingPot',
        pattern: 'CVC',
        skillIds: ['decoding', 'encoding'],
        graphemeFocus: ['p', 'o', 't'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-o'],
      },
      {
        id: 'p36',
        word: 'rot',
        sounds: ['r', 'o', 't'],
        meaning: 'rot',
        icon: 'Leaf',
        pattern: 'CVC',
        skillIds: ['decoding'],
        graphemeFocus: ['r', 'o', 't'],
        difficulty: 'challenge',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-o'],
      },
      {
        id: 'p37',
        word: 'dog',
        sounds: ['d', 'o', 'g'],
        meaning: 'dog',
        icon: 'Dog',
        pattern: 'CVC',
        skillIds: ['decoding', 'word-reading'],
        graphemeFocus: ['d', 'o', 'g'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-o', 'animals'],
      },
      {
        id: 'p38',
        word: 'log',
        sounds: ['l', 'o', 'g'],
        meaning: 'log',
        icon: 'TreePine',
        pattern: 'CVC',
        skillIds: ['decoding'],
        graphemeFocus: ['l', 'o', 'g'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-o', 'nature'],
      },
      {
        id: 'p39',
        word: 'mop',
        sounds: ['m', 'o', 'p'],
        meaning: 'mop',
        icon: 'Brush',
        pattern: 'CVC',
        skillIds: ['decoding', 'word-reading'],
        graphemeFocus: ['m', 'o', 'p'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-o', 'practical-life'],
      },
      {
        id: 'p40',
        word: 'top',
        sounds: ['t', 'o', 'p'],
        meaning: 'top',
        icon: 'ArrowUp',
        pattern: 'CVC',
        skillIds: ['decoding', 'word-reading'],
        graphemeFocus: ['t', 'o', 'p'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-o'],
      },
    ],
  },

  {
    id: 5,
    title: 'Stage 5: Short U',
    description:
      'Complete the core short-vowel sequence with short-u CVC words.',
    patternFocus: ['u', 'b', 'c', 'd', 'f', 'g', 'h', 'j', 'm', 'n', 'r', 't'],
    focusLabel: 'Short u · b · c · d · f · g · h · j · m · n · r · t',
    pattern: 'CVC',
    skillIds: [
      'phoneme-blending',
      'phoneme-segmenting',
      'decoding',
      'encoding',
      'word-reading',
      'fluency',
    ],
    prerequisiteStageIds: [4],
    masteryThreshold: 80,
    recommendedReviewIntervalDays: 7,
    words: [
      {
        id: 'p41',
        word: 'bug',
        sounds: ['b', 'u', 'g'],
        meaning: 'bug',
        icon: 'Bug',
        pattern: 'CVC',
        skillIds: ['decoding', 'word-reading'],
        graphemeFocus: ['b', 'u', 'g'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-u', 'animals'],
      },
      {
        id: 'p42',
        word: 'cub',
        sounds: ['c', 'u', 'b'],
        meaning: 'cub',
        icon: 'PawPrint',
        pattern: 'CVC',
        skillIds: ['decoding'],
        graphemeFocus: ['c', 'u', 'b'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-u', 'animals'],
      },
      {
        id: 'p43',
        word: 'dug',
        sounds: ['d', 'u', 'g'],
        meaning: 'dug',
        icon: 'Shovel',
        pattern: 'CVC',
        skillIds: ['decoding', 'encoding'],
        graphemeFocus: ['d', 'u', 'g'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-u'],
      },
      {
        id: 'p44',
        word: 'fun',
        sounds: ['f', 'u', 'n'],
        meaning: 'fun',
        icon: 'Smile',
        pattern: 'CVC',
        skillIds: ['decoding', 'word-reading'],
        graphemeFocus: ['f', 'u', 'n'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-u'],
      },
      {
        id: 'p45',
        word: 'gut',
        sounds: ['g', 'u', 't'],
        meaning: 'gut',
        icon: 'CircleDot',
        pattern: 'CVC',
        skillIds: ['decoding'],
        graphemeFocus: ['g', 'u', 't'],
        difficulty: 'challenge',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-u'],
      },
      {
        id: 'p46',
        word: 'hut',
        sounds: ['h', 'u', 't'],
        meaning: 'hut',
        icon: 'House',
        pattern: 'CVC',
        skillIds: ['decoding', 'word-reading'],
        graphemeFocus: ['h', 'u', 't'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-u'],
      },
      {
        id: 'p47',
        word: 'jug',
        sounds: ['j', 'u', 'g'],
        meaning: 'jug',
        icon: 'Milk',
        pattern: 'CVC',
        skillIds: ['decoding'],
        graphemeFocus: ['j', 'u', 'g'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-u'],
      },
      {
        id: 'p48',
        word: 'mud',
        sounds: ['m', 'u', 'd'],
        meaning: 'mud',
        icon: 'Mountain',
        pattern: 'CVC',
        skillIds: ['decoding', 'word-reading'],
        graphemeFocus: ['m', 'u', 'd'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-u', 'nature'],
      },
      {
        id: 'p49',
        word: 'nut',
        sounds: ['n', 'u', 't'],
        meaning: 'nut',
        icon: 'Circle',
        pattern: 'CVC',
        skillIds: ['decoding', 'encoding'],
        graphemeFocus: ['n', 'u', 't'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-u', 'food'],
      },
      {
        id: 'p50',
        word: 'run',
        sounds: ['r', 'u', 'n'],
        meaning: 'run',
        icon: 'PersonStanding',
        pattern: 'CVC',
        skillIds: ['decoding', 'word-reading', 'fluency'],
        graphemeFocus: ['r', 'u', 'n'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['short-u', 'actions'],
      },
    ],
  },

  {
    id: 6,
    title: 'Stage 6: Digraphs SH & CH',
    description:
      'Introduce consonant digraphs where two letters represent one phoneme.',
    patternFocus: ['sh', 'ch'],
    focusLabel: 'sh · ch',
    pattern: 'DIGRAPH',
    skillIds: [
      'digraph-recognition',
      'phoneme-blending',
      'phoneme-segmenting',
      'decoding',
      'encoding',
    ],
    prerequisiteStageIds: [5],
    masteryThreshold: 80,
    recommendedReviewIntervalDays: 7,
    words: [
      {
        id: 'p51',
        word: 'ship',
        sounds: ['sh', 'i', 'p'],
        meaning: 'ship',
        icon: 'Ship',
        pattern: 'DIGRAPH',
        skillIds: ['digraph-recognition', 'decoding'],
        graphemeFocus: ['sh'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['sh', 'digraph'],
      },
      {
        id: 'p52',
        word: 'shop',
        sounds: ['sh', 'o', 'p'],
        meaning: 'shop',
        icon: 'Store',
        pattern: 'DIGRAPH',
        skillIds: ['digraph-recognition', 'decoding'],
        graphemeFocus: ['sh'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['sh', 'digraph'],
      },
      {
        id: 'p53',
        word: 'shed',
        sounds: ['sh', 'e', 'd'],
        meaning: 'shed',
        icon: 'Warehouse',
        pattern: 'DIGRAPH',
        skillIds: ['digraph-recognition', 'decoding'],
        graphemeFocus: ['sh'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['sh', 'digraph'],
      },
      {
        id: 'p54',
        word: 'shut',
        sounds: ['sh', 'u', 't'],
        meaning: 'shut',
        icon: 'DoorClosed',
        pattern: 'DIGRAPH',
        skillIds: ['digraph-recognition', 'decoding'],
        graphemeFocus: ['sh'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['sh', 'digraph'],
      },
      {
        id: 'p55',
        word: 'dish',
        sounds: ['d', 'i', 'sh'],
        meaning: 'dish',
        icon: 'Utensils',
        pattern: 'DIGRAPH',
        skillIds: ['digraph-recognition', 'decoding'],
        graphemeFocus: ['sh'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['sh', 'digraph', 'food'],
      },
      {
        id: 'p56',
        word: 'fish',
        sounds: ['f', 'i', 'sh'],
        meaning: 'fish',
        icon: 'Fish',
        pattern: 'DIGRAPH',
        skillIds: ['digraph-recognition', 'decoding'],
        graphemeFocus: ['sh'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['sh', 'digraph', 'animals'],
      },
      {
        id: 'p57',
        word: 'chip',
        sounds: ['ch', 'i', 'p'],
        meaning: 'chip',
        icon: 'Cookie',
        pattern: 'DIGRAPH',
        skillIds: ['digraph-recognition', 'decoding'],
        graphemeFocus: ['ch'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['ch', 'digraph'],
      },
      {
        id: 'p58',
        word: 'chop',
        sounds: ['ch', 'o', 'p'],
        meaning: 'chop',
        icon: 'CookingPot',
        pattern: 'DIGRAPH',
        skillIds: ['digraph-recognition', 'decoding'],
        graphemeFocus: ['ch'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['ch', 'digraph'],
      },
      {
        id: 'p59',
        word: 'chat',
        sounds: ['ch', 'a', 't'],
        meaning: 'chat',
        icon: 'MessageCircle',
        pattern: 'DIGRAPH',
        skillIds: ['digraph-recognition', 'decoding', 'fluency'],
        graphemeFocus: ['ch'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['ch', 'digraph', 'communication'],
      },
      {
        id: 'p60',
        word: 'chin',
        sounds: ['ch', 'i', 'n'],
        meaning: 'chin',
        icon: 'UserRound',
        pattern: 'DIGRAPH',
        skillIds: ['digraph-recognition', 'decoding'],
        graphemeFocus: ['ch'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['ch', 'digraph', 'body'],
      },
    ],
  },

  {
    id: 7,
    title: 'Stage 7: Digraphs TH & CK',
    description:
      'Develop recognition of additional consonant digraphs and common final spellings.',
    patternFocus: ['th', 'ck'],
    focusLabel: 'th · ck',
    pattern: 'DIGRAPH',
    skillIds: [
      'digraph-recognition',
      'phoneme-blending',
      'phoneme-segmenting',
      'decoding',
      'encoding',
      'spelling',
    ],
    prerequisiteStageIds: [6],
    masteryThreshold: 80,
    recommendedReviewIntervalDays: 7,
    words: [
      {
        id: 'p61',
        word: 'thin',
        sounds: ['th', 'i', 'n'],
        meaning: 'thin',
        icon: 'MoveVertical',
        pattern: 'DIGRAPH',
        skillIds: ['digraph-recognition', 'decoding'],
        graphemeFocus: ['th'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['th', 'digraph'],
      },
      {
        id: 'p62',
        word: 'thick',
        sounds: ['th', 'i', 'ck'],
        meaning: 'thick',
        icon: 'Layers',
        pattern: 'DIGRAPH',
        skillIds: ['digraph-recognition', 'decoding', 'spelling'],
        graphemeFocus: ['th', 'ck'],
        difficulty: 'challenge',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['th', 'ck', 'digraph'],
      },
      {
        id: 'p63',
        word: 'bath',
        sounds: ['b', 'a', 'th'],
        meaning: 'bath',
        icon: 'Bath',
        pattern: 'DIGRAPH',
        skillIds: ['digraph-recognition', 'decoding'],
        graphemeFocus: ['th'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['th', 'digraph'],
      },
      {
        id: 'p64',
        word: 'moth',
        sounds: ['m', 'o', 'th'],
        meaning: 'moth',
        icon: 'Bug',
        pattern: 'DIGRAPH',
        skillIds: ['digraph-recognition', 'decoding'],
        graphemeFocus: ['th'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['th', 'digraph', 'animals'],
      },
      {
        id: 'p65',
        word: 'path',
        sounds: ['p', 'a', 'th'],
        meaning: 'path',
        icon: 'Route',
        pattern: 'DIGRAPH',
        skillIds: ['digraph-recognition', 'decoding'],
        graphemeFocus: ['th'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['th', 'digraph', 'nature'],
      },
      {
        id: 'p66',
        word: 'back',
        sounds: ['b', 'a', 'ck'],
        meaning: 'back',
        icon: 'ArrowLeft',
        pattern: 'DIGRAPH',
        skillIds: ['digraph-recognition', 'decoding', 'spelling'],
        graphemeFocus: ['ck'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['ck', 'digraph'],
      },
      {
        id: 'p67',
        word: 'pack',
        sounds: ['p', 'a', 'ck'],
        meaning: 'pack',
        icon: 'Package',
        pattern: 'DIGRAPH',
        skillIds: ['digraph-recognition', 'decoding', 'spelling'],
        graphemeFocus: ['ck'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['ck', 'digraph'],
      },
      {
        id: 'p68',
        word: 'sick',
        sounds: ['s', 'i', 'ck'],
        meaning: 'sick',
        icon: 'Thermometer',
        pattern: 'DIGRAPH',
        skillIds: ['digraph-recognition', 'decoding', 'spelling'],
        graphemeFocus: ['ck'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['ck', 'digraph'],
      },
      {
        id: 'p69',
        word: 'kick',
        sounds: ['k', 'i', 'ck'],
        meaning: 'kick',
        icon: 'Footprints',
        pattern: 'DIGRAPH',
        skillIds: ['digraph-recognition', 'decoding'],
        graphemeFocus: ['ck'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['ck', 'digraph', 'actions'],
      },
      {
        id: 'p70',
        word: 'lock',
        sounds: ['l', 'o', 'ck'],
        meaning: 'lock',
        icon: 'Lock',
        pattern: 'DIGRAPH',
        skillIds: ['digraph-recognition', 'decoding', 'spelling'],
        graphemeFocus: ['ck'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['ck', 'digraph'],
      },
    ],
  },

  {
    id: 8,
    title: 'Stage 8: Magic E',
    description:
      'Introduce split digraphs and long-vowel patterns in common one-syllable words.',
    patternFocus: ['a_e', 'i_e', 'o_e', 'u_e'],
    focusLabel: 'a_e · i_e · o_e · u_e',
    pattern: 'MAGIC_E',
    skillIds: [
      'vowel-pattern-recognition',
      'decoding',
      'encoding',
      'spelling',
      'word-reading',
    ],
    prerequisiteStageIds: [7],
    masteryThreshold: 80,
    recommendedReviewIntervalDays: 10,
    words: [
      {
        id: 'p71',
        word: 'cake',
        sounds: ['c', 'a_e', 'k'],
        meaning: 'cake',
        icon: 'Cake',
        pattern: 'MAGIC_E',
        skillIds: ['vowel-pattern-recognition', 'decoding'],
        graphemeFocus: ['a_e'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['a-e', 'long-a'],
      },
      {
        id: 'p72',
        word: 'lake',
        sounds: ['l', 'a_e', 'k'],
        meaning: 'lake',
        icon: 'Waves',
        pattern: 'MAGIC_E',
        skillIds: ['vowel-pattern-recognition', 'decoding'],
        graphemeFocus: ['a_e'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['a-e', 'long-a'],
      },
      {
        id: 'p73',
        word: 'make',
        sounds: ['m', 'a_e', 'k'],
        meaning: 'make',
        icon: 'Hammer',
        pattern: 'MAGIC_E',
        skillIds: ['vowel-pattern-recognition', 'decoding', 'encoding'],
        graphemeFocus: ['a_e'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['a-e', 'long-a'],
      },
      {
        id: 'p74',
        word: 'take',
        sounds: ['t', 'a_e', 'k'],
        meaning: 'take',
        icon: 'Hand',
        pattern: 'MAGIC_E',
        skillIds: ['vowel-pattern-recognition', 'decoding'],
        graphemeFocus: ['a_e'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['a-e', 'long-a'],
      },
      {
        id: 'p75',
        word: 'bike',
        sounds: ['b', 'i_e', 'k'],
        meaning: 'bike',
        icon: 'Bike',
        pattern: 'MAGIC_E',
        skillIds: ['vowel-pattern-recognition', 'decoding'],
        graphemeFocus: ['i_e'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['i-e', 'long-i'],
      },
      {
        id: 'p76',
        word: 'like',
        sounds: ['l', 'i_e', 'k'],
        meaning: 'like',
        icon: 'Heart',
        pattern: 'MAGIC_E',
        skillIds: ['vowel-pattern-recognition', 'decoding'],
        graphemeFocus: ['i_e'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['i-e', 'long-i'],
      },
      {
        id: 'p77',
        word: 'hike',
        sounds: ['h', 'i_e', 'k'],
        meaning: 'hike',
        icon: 'Footprints',
        pattern: 'MAGIC_E',
        skillIds: ['vowel-pattern-recognition', 'decoding'],
        graphemeFocus: ['i_e'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['i-e', 'long-i'],
      },
      {
        id: 'p78',
        word: 'home',
        sounds: ['h', 'o_e', 'm'],
        meaning: 'home',
        icon: 'House',
        pattern: 'MAGIC_E',
        skillIds: ['vowel-pattern-recognition', 'decoding', 'word-reading'],
        graphemeFocus: ['o_e'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['o-e', 'long-o'],
      },
      {
        id: 'p79',
        word: 'bone',
        sounds: ['b', 'o_e', 'n'],
        meaning: 'bone',
        icon: 'Bone',
        pattern: 'MAGIC_E',
        skillIds: ['vowel-pattern-recognition', 'decoding'],
        graphemeFocus: ['o_e'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['o-e', 'long-o'],
      },
      {
        id: 'p80',
        word: 'cute',
        sounds: ['c', 'u_e', 't'],
        meaning: 'cute',
        icon: 'Smile',
        pattern: 'MAGIC_E',
        skillIds: ['vowel-pattern-recognition', 'decoding'],
        graphemeFocus: ['u_e'],
        difficulty: 'challenge',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['u-e', 'long-u'],
      },
    ],
  },

  {
    id: 9,
    title: 'Stage 9: Initial Blends',
    description:
      'Develop fluent decoding of words containing common consonant blends.',
    patternFocus: ['st', 'tr', 'bl', 'fl'],
    focusLabel: 'st · tr · bl · fl',
    pattern: 'BLEND',
    skillIds: [
      'blend-recognition',
      'phoneme-blending',
      'phoneme-segmenting',
      'decoding',
      'encoding',
      'fluency',
    ],
    prerequisiteStageIds: [8],
    masteryThreshold: 80,
    recommendedReviewIntervalDays: 10,
    words: [
      {
        id: 'p81',
        word: 'stop',
        sounds: ['st', 'o', 'p'],
        meaning: 'stop',
        icon: 'Octagon',
        pattern: 'BLEND',
        skillIds: ['blend-recognition', 'decoding'],
        graphemeFocus: ['st'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['st', 'blend'],
      },
      {
        id: 'p82',
        word: 'star',
        sounds: ['st', 'a', 'r'],
        meaning: 'star',
        icon: 'Star',
        pattern: 'BLEND',
        skillIds: ['blend-recognition', 'decoding'],
        graphemeFocus: ['st'],
        difficulty: 'emerging',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['st', 'blend'],
      },
      {
        id: 'p83',
        word: 'step',
        sounds: ['st', 'e', 'p'],
        meaning: 'step',
        icon: 'Footprints',
        pattern: 'BLEND',
        skillIds: ['blend-recognition', 'decoding'],
        graphemeFocus: ['st'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['st', 'blend'],
      },
      {
        id: 'p84',
        word: 'tree',
        sounds: ['tr', 'ee'],
        meaning: 'tree',
        icon: 'TreePine',
        pattern: 'BLEND',
        skillIds: ['blend-recognition', 'decoding'],
        graphemeFocus: ['tr'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['tr', 'blend', 'nature'],
      },
      {
        id: 'p85',
        word: 'trip',
        sounds: ['tr', 'i', 'p'],
        meaning: 'trip',
        icon: 'Map',
        pattern: 'BLEND',
        skillIds: ['blend-recognition', 'decoding'],
        graphemeFocus: ['tr'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['tr', 'blend'],
      },
      {
        id: 'p86',
        word: 'truck',
        sounds: ['tr', 'u', 'ck'],
        meaning: 'truck',
        icon: 'Truck',
        pattern: 'BLEND',
        skillIds: ['blend-recognition', 'decoding', 'spelling'],
        graphemeFocus: ['tr', 'ck'],
        difficulty: 'challenge',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['tr', 'ck', 'blend'],
      },
      {
        id: 'p87',
        word: 'blue',
        sounds: ['bl', 'ue'],
        meaning: 'blue',
        icon: 'Palette',
        pattern: 'BLEND',
        skillIds: ['blend-recognition', 'decoding'],
        graphemeFocus: ['bl'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['bl', 'blend', 'colours'],
      },
      {
        id: 'p88',
        word: 'black',
        sounds: ['bl', 'a', 'ck'],
        meaning: 'black',
        icon: 'Square',
        pattern: 'BLEND',
        skillIds: ['blend-recognition', 'decoding', 'spelling'],
        graphemeFocus: ['bl', 'ck'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['bl', 'ck', 'blend'],
      },
      {
        id: 'p89',
        word: 'block',
        sounds: ['bl', 'o', 'ck'],
        meaning: 'block',
        icon: 'Blocks',
        pattern: 'BLEND',
        skillIds: ['blend-recognition', 'decoding', 'spelling'],
        graphemeFocus: ['bl', 'ck'],
        difficulty: 'developing',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['bl', 'ck', 'blend'],
      },
      {
        id: 'p90',
        word: 'flat',
        sounds: ['fl', 'a', 't'],
        meaning: 'flat',
        icon: 'Square',
        pattern: 'BLEND',
        skillIds: ['blend-recognition', 'decoding'],
        graphemeFocus: ['fl'],
        difficulty: 'challenge',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['fl', 'blend'],
      },
    ],
  },

  {
    id: 10,
    title: 'Stage 10: Advanced Decoding',
    description:
      'Integrate blends, digraphs, vowel patterns and longer words to develop confident independent decoding.',
    patternFocus: ['gr', 'sh', 'st', 'br', 'fl', 'ch'],
    focusLabel: 'gr · sh · st · br · fl · ch',
    pattern: 'COMPLEX_BLEND',
    skillIds: [
      'blend-recognition',
      'digraph-recognition',
      'vowel-pattern-recognition',
      'decoding',
      'encoding',
      'spelling',
      'word-reading',
      'fluency',
    ],
    prerequisiteStageIds: [9],
    masteryThreshold: 85,
    recommendedReviewIntervalDays: 14,
    words: [
      {
        id: 'p91',
        word: 'grand',
        sounds: ['gr', 'a', 'n', 'd'],
        meaning: 'grand',
        icon: 'Castle',
        pattern: 'COMPLEX_BLEND',
        skillIds: ['blend-recognition', 'decoding', 'fluency'],
        graphemeFocus: ['gr'],
        difficulty: 'challenge',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['gr', 'blend', 'advanced'],
      },
      {
        id: 'p92',
        word: 'green',
        sounds: ['gr', 'ee', 'n'],
        meaning: 'green',
        icon: 'Leaf',
        pattern: 'COMPLEX_BLEND',
        skillIds: ['blend-recognition', 'decoding', 'fluency'],
        graphemeFocus: ['gr'],
        difficulty: 'challenge',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['gr', 'blend', 'advanced', 'colours'],
      },
      {
        id: 'p93',
        word: 'ground',
        sounds: ['gr', 'ou', 'n', 'd'],
        meaning: 'ground',
        icon: 'Mountain',
        pattern: 'COMPLEX_BLEND',
        skillIds: ['blend-recognition', 'decoding'],
        graphemeFocus: ['gr'],
        difficulty: 'challenge',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['gr', 'advanced', 'nature'],
      },
      {
        id: 'p94',
        word: 'shine',
        sounds: ['sh', 'i_e', 'n'],
        meaning: 'shine',
        icon: 'Sparkles',
        pattern: 'COMPLEX_BLEND',
        skillIds: [
          'digraph-recognition',
          'vowel-pattern-recognition',
          'decoding',
        ],
        graphemeFocus: ['sh', 'i_e'],
        difficulty: 'challenge',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['sh', 'i-e', 'advanced'],
      },
      {
        id: 'p95',
        word: 'stone',
        sounds: ['st', 'o_e', 'n'],
        meaning: 'stone',
        icon: 'Mountain',
        pattern: 'COMPLEX_BLEND',
        skillIds: [
          'blend-recognition',
          'vowel-pattern-recognition',
          'decoding',
        ],
        graphemeFocus: ['st', 'o_e'],
        difficulty: 'challenge',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['st', 'o-e', 'advanced'],
      },
      {
        id: 'p96',
        word: 'brave',
        sounds: ['br', 'a_e', 'v'],
        meaning: 'brave',
        icon: 'Shield',
        pattern: 'COMPLEX_BLEND',
        skillIds: [
          'blend-recognition',
          'vowel-pattern-recognition',
          'decoding',
          'fluency',
        ],
        graphemeFocus: ['br', 'a_e'],
        difficulty: 'challenge',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['br', 'a-e', 'advanced'],
      },
      {
        id: 'p97',
        word: 'branch',
        sounds: ['br', 'a', 'n', 'ch'],
        meaning: 'branch',
        icon: 'GitBranch',
        pattern: 'COMPLEX_BLEND',
        skillIds: [
          'blend-recognition',
          'digraph-recognition',
          'decoding',
        ],
        graphemeFocus: ['br', 'ch'],
        difficulty: 'challenge',
        decodable: true,
        encodable: true,
        fluencyReady: true,
        tags: ['br', 'ch', 'advanced', 'nature'],
      },
      {
        id: 'p98',
        word: 'water',
        sounds: ['w', 'a', 't', 'er'],
        meaning: 'water',
        icon: 'Droplets',
        pattern: 'MULTISYLLABIC',
        skillIds: ['decoding', 'word-reading', 'fluency'],
        graphemeFocus: ['a', 'er'],
        difficulty: 'challenge',
        decodable: false,
        encodable: false,
        fluencyReady: true,
        tags: ['advanced', 'common-word', 'irregular-phonics'],
      },
      {
        id: 'p99',
        word: 'flower',
        sounds: ['fl', 'ow', 'er'],
        meaning: 'flower',
        icon: 'Flower2',
        pattern: 'MULTISYLLABIC',
        skillIds: [
          'blend-recognition',
          'decoding',
          'word-reading',
          'fluency',
        ],
        graphemeFocus: ['fl', 'ow', 'er'],
        difficulty: 'challenge',
        decodable: false,
        encodable: false,
        fluencyReady: true,
        tags: ['fl', 'advanced', 'nature'],
      },
      {
        id: 'p100',
        word: 'animal',
        sounds: ['a', 'n', 'i', 'm', 'a', 'l'],
        meaning: 'animal',
        icon: 'PawPrint',
        pattern: 'MULTISYLLABIC',
        skillIds: ['decoding', 'word-reading', 'fluency'],
        graphemeFocus: ['a', 'i', 'a'],
        difficulty: 'challenge',
        decodable: false,
        encodable: false,
        fluencyReady: true,
        tags: ['advanced', 'multisyllabic', 'animals'],
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Curriculum utilities                                                       */
/* -------------------------------------------------------------------------- */

export function getPhonicsStage(
  stageId: PhonicsStageId,
): PhonicsStage | undefined {
  return PHONICS_CURRICULUM.find((stage) => stage.id === stageId);
}

export function getPhonicsWord(
  wordId: string,
): PhonicsWord | undefined {
  for (const stage of PHONICS_CURRICULUM) {
    const word = stage.words.find((item) => item.id === wordId);

    if (word) {
      return word;
    }
  }

  return undefined;
}

export function getWordsForStage(
  stageId: PhonicsStageId,
): readonly PhonicsWord[] {
  return getPhonicsStage(stageId)?.words ?? [];
}

export function getWordsByPattern(
  pattern: PhonicsPattern,
): readonly PhonicsWord[] {
  return PHONICS_CURRICULUM.flatMap((stage) =>
    stage.words.filter((word) => word.pattern === pattern),
  );
}

export function getWordsBySkill(
  skillId: PhonicsSkill,
): readonly PhonicsWord[] {
  return PHONICS_CURRICULUM.flatMap((stage) =>
    stage.words.filter((word) => word.skillIds.includes(skillId)),
  );
}

export function getWordsByGrapheme(
  grapheme: string,
): readonly PhonicsWord[] {
  const normalized = grapheme.trim().toLowerCase();

  if (!normalized) {
    return [];
  }

  return PHONICS_CURRICULUM.flatMap((stage) =>
    stage.words.filter((word) =>
      word.graphemeFocus.some(
        (focus) => focus.toLowerCase() === normalized,
      ),
    ),
  );
}

export function getDecodableWords(): readonly PhonicsWord[] {
  return PHONICS_CURRICULUM.flatMap((stage) =>
    stage.words.filter((word) => word.decodable),
  );
}

export function getFluencyWords(): readonly PhonicsWord[] {
  return PHONICS_CURRICULUM.flatMap((stage) =>
    stage.words.filter((word) => word.fluencyReady),
  );
}

export function getStagePrerequisites(
  stageId: PhonicsStageId,
): readonly PhonicsStage[] {
  const stage = getPhonicsStage(stageId);

  if (!stage) {
    return [];
  }

  return stage.prerequisiteStageIds
    .map((id) => getPhonicsStage(id))
    .filter((item): item is PhonicsStage => item !== undefined);
}

/**
 * A stage is considered ready when all prerequisite stages
 * have reached the supplied mastery threshold.
 */
export function isPhonicsStageReady(
  stageId: PhonicsStageId,
  stageMastery: Readonly<Record<number, number>>,
): boolean {
  const stage = getPhonicsStage(stageId);

  if (!stage) {
    return false;
  }

  if (stage.prerequisiteStageIds.length === 0) {
    return true;
  }

  return stage.prerequisiteStageIds.every(
    (prerequisiteId) =>
      (stageMastery[prerequisiteId] ?? 0) >=
      (getPhonicsStage(prerequisiteId)?.masteryThreshold ?? 80),
  );
}

/**
 * Returns the highest stage whose mastery target has been met.
 *
 * This function reports mastery; it does not decide the learner's
 * overall ELP level.
 */
export function getHighestMasteredPhonicsStage(
  stageMastery: Readonly<Record<number, number>>,
): PhonicsStageId {
  let highest: PhonicsStageId = 1;

  for (const stage of PHONICS_CURRICULUM) {
    const mastery = stageMastery[stage.id] ?? 0;

    if (mastery >= stage.masteryThreshold) {
      highest = stage.id;
    } else {
      break;
    }
  }

  return highest;
}

/**
 * Returns the next phonics stage that still requires mastery.
 */
export function getNextPhonicsStage(
  stageMastery: Readonly<Record<number, number>>,
): PhonicsStage | undefined {
  for (const stage of PHONICS_CURRICULUM) {
    const mastery = stageMastery[stage.id] ?? 0;

    if (mastery < stage.masteryThreshold) {
      return stage;
    }
  }

  return undefined;
}