// src/data/vocabularyCurriculum.ts

export type VocabularyLevel =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10;

export type VocabularyPattern =
  | 'CVC'
  | 'digraph'
  | 'magic-e'
  | 'blend'
  | 'multisyllabic'
  | 'irregular'
  | 'high-frequency'
  | 'challenge';

export type VocabularyDifficulty =
  | 'emerging'
  | 'developing'
  | 'secure'
  | 'advanced'
  | 'challenge';

export type VocabularySkill =
  | 'word-recognition'
  | 'word-reading'
  | 'phonics-application'
  | 'word-family'
  | 'meaning-identification'
  | 'vocabulary-building'
  | 'oral-vocabulary'
  | 'spelling'
  | 'sentence-use'
  | 'word-classification'
  | 'contextual-meaning'
  | 'synonym-awareness'
  | 'antonym-awareness';

export type VocabularyWordType =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'high-frequency';

export type VocabularyDecodability =
  | 'decodable'
  | 'extension'
  | 'tricky';

export interface VocabWord {
  id: string;

  word: string;

  /**
   * Child-friendly primary definition.
   */
  meaning: string;

  /**
   * Kept for compatibility with the existing UI.
   * Presentation can later migrate to icon/image assets.
   */
  emoji?: string;

  /**
   * Word family / rime.
   *
   * Examples:
   * at, an, ig, ake, st
   */
  family?: string;

  /**
   * Instructional phonics/spelling pattern.
   */
  pattern: VocabularyPattern;

  wordType: VocabularyWordType;

  difficulty: VocabularyDifficulty;

  /**
   * Explicit competency links.
   */
  skillIds: readonly VocabularySkill[];

  /**
   * Skill identifiers that normally support
   * successful learning of this word.
   */
  prerequisiteSkillIds: readonly string[];

  /**
   * A simple contextual example.
   */
  exampleSentence?: string;

  /**
   * Useful when a word has more than one
   * child-relevant meaning.
   */
  alternateMeanings?: readonly string[];

  /**
   * Suitable for spoken-language activities.
   */
  supportsOralLanguage: boolean;

  /**
   * Whether the learner should reasonably be
   * able to decode the word from previously
   * introduced patterns.
   */
  decodability: VocabularyDecodability;

  tags: readonly string[];
}

export interface VocabLevel {
  id: VocabularyLevel;

  title: string;

  shortTitle: string;

  syllabusFocus: string;

  description: string;

  patternFocus: readonly VocabularyPattern[];

  skillIds: readonly VocabularySkill[];

  /**
   * Vocabulary-stage prerequisites.
   *
   * These are NOT ELP overall levels.
   */
  prerequisiteLevelIds: readonly VocabularyLevel[];

  masteryThreshold: number;

  reviewThreshold: number;

  /**
   * Foundational vocabulary can be revisited
   * by advanced learners when diagnostic data
   * shows a weakness.
   */
  isFoundational: boolean;

  words: readonly VocabWord[];
}

export const VOCABULARY_CURRICULUM_CONFIG = {
  academyId: 'language',
  subjectId: 'english',
  domain: 'literacy',

  language: 'en-US',

  minimumMasteryForProgression: 80,

  reviewThreshold: 60,

  progressionModel: 'competency-based',

  supportsAdaptiveReview: true,

  supportsSpeech: true,

  supportsWriting: true,

  supportsSentenceBuilding: true,
} as const;

const FOUNDATIONAL_SKILLS = [
  'word-recognition',
  'word-reading',
  'phonics-application',
  'word-family',
  'meaning-identification',
  'oral-vocabulary',
] as const;

const CVC_PREREQUISITES = [
  'phonics:short-vowels',
  'phonics:basic-consonants',
] as const;

const DIGRAPH_PREREQUISITES = [
  'phonics:short-vowels',
  'phonics:basic-consonants',
  'phonics:consonant-digraphs',
] as const;

const MAGIC_E_PREREQUISITES = [
  'phonics:short-vowels',
  'phonics:basic-consonants',
  'phonics:consonant-digraphs',
  'phonics:magic-e',
] as const;

const BLEND_PREREQUISITES = [
  'phonics:short-vowels',
  'phonics:consonant-blends',
] as const;

/**
 * 100 vocabulary words across 10 progressive
 * instructional stages.
 *
 * IMPORTANT:
 * These stages represent vocabulary/word-reading
 * complexity. They do not determine the learner's
 * overall ELP level.
 */
export const VOCABULARY_CURRICULUM: readonly VocabLevel[] = [
  // ============================================================
  // LEVEL 1 — CVC FOUNDATIONS
  // ============================================================

  {
    id: 1,

    title: 'Level 1: CVC Word Foundations',

    shortTitle: 'CVC Foundations',

    syllabusFocus:
      'Simple CVC words with short-a patterns such as -at and -an.',

    description:
      'Builds early word recognition, decoding, word-family awareness, and basic vocabulary using highly familiar CVC words.',

    patternFocus: ['CVC'],

    skillIds: FOUNDATIONAL_SKILLS,

    prerequisiteLevelIds: [],

    masteryThreshold: 80,

    reviewThreshold: 60,

    isFoundational: true,

    words: [
      {
        id: 'v1',
        word: 'cat',
        meaning: 'A small animal that meows.',
        emoji: '🐱',
        family: 'at',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'emerging',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'word-family',
          'meaning-identification',
          'oral-vocabulary',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The cat is on the mat.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['animal', 'pet', 'short-a', 'at-family'],
      },

      {
        id: 'v2',
        word: 'bat',
        meaning: 'A flying mammal that is often active at night.',
        emoji: '🦇',
        family: 'at',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'emerging',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'word-family',
          'meaning-identification',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'A bat can fly at night.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['animal', 'night', 'short-a', 'at-family'],
      },

      {
        id: 'v3',
        word: 'hat',
        meaning: 'Something you wear on your head.',
        emoji: '🎩',
        family: 'at',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'emerging',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'word-family',
          'meaning-identification',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'I wear a hat.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['clothing', 'body', 'short-a', 'at-family'],
      },

      {
        id: 'v4',
        word: 'mat',
        meaning: 'A piece of material placed on a floor.',
        emoji: '🟫',
        family: 'at',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'emerging',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'word-family',
          'meaning-identification',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The cat sits on the mat.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['home', 'object', 'short-a', 'at-family'],
      },

      {
        id: 'v5',
        word: 'rat',
        meaning: 'A small animal related to mice.',
        emoji: '🐀',
        family: 'at',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'emerging',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'word-family',
          'meaning-identification',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The rat ran away.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['animal', 'short-a', 'at-family'],
      },

      {
        id: 'v6',
        word: 'can',
        meaning: 'A metal container used for holding things.',
        emoji: '🥫',
        family: 'an',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'emerging',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'word-family',
          'meaning-identification',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The can is on the table.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['object', 'home', 'short-a', 'an-family'],
      },

      {
        id: 'v7',
        word: 'fan',
        meaning: 'A machine that moves air to help keep you cool.',
        emoji: '🌀',
        family: 'an',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'emerging',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'word-family',
          'meaning-identification',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The fan keeps me cool.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['home', 'object', 'short-a', 'an-family'],
      },

      {
        id: 'v8',
        word: 'pan',
        meaning: 'A container used for cooking food.',
        emoji: '🍳',
        family: 'an',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'emerging',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'word-family',
          'meaning-identification',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The food is in the pan.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['food', 'cooking', 'home', 'short-a'],
      },

      {
        id: 'v9',
        word: 'ran',
        meaning: 'Moved quickly using your legs.',
        emoji: '🏃',
        family: 'an',
        pattern: 'CVC',
        wordType: 'verb',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'sentence-use',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The boy ran home.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['action', 'movement', 'verb', 'short-a'],
      },

      {
        id: 'v10',
        word: 'man',
        meaning: 'An adult male person.',
        emoji: '👨',
        family: 'an',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'word-family',
          'meaning-identification',
          'oral-vocabulary',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The man has a hat.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['people', 'family', 'short-a', 'an-family'],
      },
    ],
  },

  // ============================================================
  // LEVEL 2 — SHORT E
  // ============================================================

  {
    id: 2,

    title: 'Level 2: Short-E Vocabulary',

    shortTitle: 'Short E',

    syllabusFocus:
      'CVC words containing the short-e vowel sound in -ed, -en, and -et families.',

    description:
      'Expands early decoding and vocabulary using familiar short-e words while introducing verbs, nouns, and descriptive words.',

    patternFocus: ['CVC'],

    skillIds: [
      'word-recognition',
      'word-reading',
      'phonics-application',
      'word-family',
      'meaning-identification',
      'oral-vocabulary',
      'sentence-use',
    ],

    prerequisiteLevelIds: [1],

    masteryThreshold: 80,

    reviewThreshold: 60,

    isFoundational: true,

    words: [
      {
        id: 'v11',
        word: 'bed',
        meaning: 'A place where you sleep.',
        emoji: '🛏️',
        family: 'ed',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'emerging',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'word-family',
          'meaning-identification',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'I sleep in my bed.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['home', 'sleep', 'short-e', 'ed-family'],
      },

      {
        id: 'v12',
        word: 'red',
        meaning: 'A color like a ripe tomato or apple.',
        emoji: '🔴',
        family: 'ed',
        pattern: 'CVC',
        wordType: 'adjective',
        difficulty: 'emerging',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'sentence-use',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The apple is red.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['color', 'description', 'short-e'],
      },

      {
        id: 'v13',
        word: 'fed',
        meaning: 'Gave food to someone or something.',
        emoji: '🍽️',
        family: 'ed',
        pattern: 'CVC',
        wordType: 'verb',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'sentence-use',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'I fed the cat.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['action', 'food', 'verb', 'short-e'],
      },

      {
        id: 'v14',
        word: 'hen',
        meaning: 'A female chicken.',
        emoji: '🐔',
        family: 'en',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'emerging',
        skillIds: FOUNDATIONAL_SKILLS,
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The hen is in the yard.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['animal', 'farm', 'short-e', 'en-family'],
      },

      {
        id: 'v15',
        word: 'pen',
        meaning: 'A tool used for writing with ink.',
        emoji: '🖊️',
        family: 'en',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'emerging',
        skillIds: FOUNDATIONAL_SKILLS,
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'I write with a pen.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['school', 'writing', 'short-e', 'en-family'],
      },

      {
        id: 'v16',
        word: 'ten',
        meaning: 'The number that comes after nine.',
        emoji: '🔟',
        family: 'en',
        pattern: 'CVC',
        wordType: 'high-frequency',
        difficulty: 'emerging',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'I have ten fingers.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['number', 'maths', 'short-e'],
      },

      {
        id: 'v17',
        word: 'men',
        meaning: 'More than one adult male person.',
        emoji: '👬',
        family: 'en',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'word-classification',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The men are talking.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['people', 'plural', 'short-e'],
      },

      {
        id: 'v18',
        word: 'net',
        meaning: 'A material with many small openings used for catching or holding things.',
        emoji: '🥅',
        family: 'et',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: FOUNDATIONAL_SKILLS,
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The fish is in the net.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['object', 'fishing', 'short-e', 'et-family'],
      },

      {
        id: 'v19',
        word: 'pet',
        meaning: 'An animal that people keep and care for at home.',
        emoji: '🐶',
        family: 'et',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'emerging',
        skillIds: FOUNDATIONAL_SKILLS,
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'My dog is my pet.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['animal', 'home', 'short-e'],
      },

      {
        id: 'v20',
        word: 'wet',
        meaning: 'Covered with water or another liquid.',
        emoji: '💧',
        family: 'et',
        pattern: 'CVC',
        wordType: 'adjective',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'sentence-use',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'My shoes are wet.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['description', 'weather', 'short-e'],
      },
    ],
  },

  // ============================================================
  // LEVEL 3 — SHORT I
  // ============================================================

  {
    id: 3,

    title: 'Level 3: Short-I Vocabulary',

    shortTitle: 'Short I',

    syllabusFocus:
      'CVC words containing the short-i sound in -ig, -in, and -ip families.',

    description:
      'Strengthens decoding, word-family recognition, action vocabulary, and simple descriptive language using short-i words.',

    patternFocus: ['CVC'],

    skillIds: [
      'word-recognition',
      'word-reading',
      'phonics-application',
      'word-family',
      'meaning-identification',
      'oral-vocabulary',
      'sentence-use',
    ],

    prerequisiteLevelIds: [1, 2],

    masteryThreshold: 80,

    reviewThreshold: 60,

    isFoundational: true,

    words: [
      {
        id: 'v21',
        word: 'big',
        meaning: 'Very large.',
        emoji: '🐘',
        family: 'ig',
        pattern: 'CVC',
        wordType: 'adjective',
        difficulty: 'emerging',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'sentence-use',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The elephant is big.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['size', 'description', 'short-i'],
      },

      {
        id: 'v22',
        word: 'dig',
        meaning: 'To make a hole in the ground.',
        emoji: '⛏️',
        family: 'ig',
        pattern: 'CVC',
        wordType: 'verb',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'sentence-use',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'We dig in the soil.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['action', 'nature', 'verb', 'short-i'],
      },

      {
        id: 'v23',
        word: 'fig',
        meaning: 'A small, soft fruit that can be eaten fresh or dried.',
        emoji: '🍐',
        family: 'ig',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: FOUNDATIONAL_SKILLS,
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The fig is a sweet fruit.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['food', 'fruit', 'short-i'],
      },

      {
        id: 'v24',
        word: 'pig',
        meaning: 'A farm animal that makes an oinking sound.',
        emoji: '🐷',
        family: 'ig',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'emerging',
        skillIds: FOUNDATIONAL_SKILLS,
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The pig is on the farm.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['animal', 'farm', 'short-i'],
      },

      {
        id: 'v25',
        word: 'wig',
        meaning: 'Hair that can be worn on the head.',
        emoji: '👱',
        family: 'ig',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: FOUNDATIONAL_SKILLS,
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The actor is wearing a wig.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['clothing', 'appearance', 'short-i'],
      },

      {
        id: 'v26',
        word: 'bin',
        meaning: 'A container used for rubbish or other things.',
        emoji: '🗑️',
        family: 'in',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'emerging',
        skillIds: FOUNDATIONAL_SKILLS,
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'Put the paper in the bin.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['home', 'cleaning', 'short-i'],
      },

      {
        id: 'v27',
        word: 'pin',
        meaning: 'A small sharp object used for holding things together.',
        emoji: '📌',
        family: 'in',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: FOUNDATIONAL_SKILLS,
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The pin holds the paper.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['object', 'school', 'short-i'],
      },

      {
        id: 'v28',
        word: 'win',
        meaning: 'To be the person or team that succeeds in a contest.',
        emoji: '🏆',
        family: 'in',
        pattern: 'CVC',
        wordType: 'verb',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'sentence-use',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'We hope to win the game.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['action', 'games', 'achievement', 'short-i'],
      },

      {
        id: 'v29',
        word: 'lip',
        meaning: 'One of the soft parts around your mouth.',
        emoji: '👄',
        family: 'ip',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: FOUNDATIONAL_SKILLS,
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'She hurt her lip.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['body', 'health', 'short-i'],
      },

      {
        id: 'v30',
        word: 'sip',
        meaning: 'To drink a small amount at a time.',
        emoji: '🥤',
        family: 'ip',
        pattern: 'CVC',
        wordType: 'verb',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'sentence-use',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'Take a small sip of water.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['action', 'food', 'drink', 'short-i'],
      },
    ],
  },

  // ============================================================
  // LEVEL 4 — SHORT O
  // ============================================================

  {
    id: 4,

    title: 'Level 4: Short-O Vocabulary',

    shortTitle: 'Short O',

    syllabusFocus:
      'CVC words containing the short-o sound in -ot, -op, and -og families.',

    description:
      'Develops short-o decoding and expands vocabulary with objects, actions, descriptions, and everyday concepts.',

    patternFocus: ['CVC'],

    skillIds: [
      'word-recognition',
      'word-reading',
      'phonics-application',
      'word-family',
      'meaning-identification',
      'oral-vocabulary',
      'sentence-use',
    ],

    prerequisiteLevelIds: [1, 2, 3],

    masteryThreshold: 80,

    reviewThreshold: 60,

    isFoundational: true,

    words: [
      {
        id: 'v31',
        word: 'pot',
        meaning: 'A deep container used for cooking or holding things.',
        emoji: '🍲',
        family: 'ot',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: FOUNDATIONAL_SKILLS,
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The soup is in the pot.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['cooking', 'home', 'short-o'],
      },

      {
        id: 'v32',
        word: 'hot',
        meaning: 'Having a high temperature.',
        emoji: '🔥',
        family: 'ot',
        pattern: 'CVC',
        wordType: 'adjective',
        difficulty: 'emerging',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'sentence-use',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The soup is hot.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['temperature', 'description', 'short-o'],
      },

      {
        id: 'v33',
        word: 'dot',
        meaning: 'A small round mark or spot.',
        emoji: '🔘',
        family: 'ot',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: FOUNDATIONAL_SKILLS,
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'Draw a red dot.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['shape', 'mark', 'short-o'],
      },

      {
        id: 'v34',
        word: 'lot',
        meaning: 'A large amount or number of something.',
        emoji: '📦',
        family: 'ot',
        pattern: 'CVC',
        wordType: 'high-frequency',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'meaning-identification',
          'contextual-meaning',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'There are a lot of books.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['quantity', 'high-frequency', 'short-o'],
      },

      {
        id: 'v35',
        word: 'not',
        meaning: 'A word used to show that something is negative or untrue.',
        emoji: '❌',
        family: 'ot',
        pattern: 'CVC',
        wordType: 'high-frequency',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'meaning-identification',
          'sentence-use',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The cup is not empty.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['grammar', 'negation', 'high-frequency'],
      },

      {
        id: 'v36',
        word: 'top',
        meaning: 'The highest part of something.',
        emoji: '🔝',
        family: 'op',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: FOUNDATIONAL_SKILLS,
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The toy is on top.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['position', 'place', 'short-o'],
      },

      {
        id: 'v37',
        word: 'mop',
        meaning: 'A tool used for cleaning floors.',
        emoji: '🧹',
        family: 'op',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'emerging',
        skillIds: FOUNDATIONAL_SKILLS,
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'I use a mop to clean the floor.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['cleaning', 'home', 'short-o'],
      },

      {
        id: 'v38',
        word: 'hop',
        meaning: 'To jump using one foot or with small jumps.',
        emoji: '🐇',
        family: 'op',
        pattern: 'CVC',
        wordType: 'verb',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'sentence-use',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The rabbit can hop.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['movement', 'animal', 'verb', 'short-o'],
      },

      {
        id: 'v39',
        word: 'dog',
        meaning: 'A common animal that people often keep as a pet.',
        emoji: '🐶',
        family: 'og',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'emerging',
        skillIds: FOUNDATIONAL_SKILLS,
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The dog can run.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['animal', 'pet', 'short-o'],
      },

      {
        id: 'v40',
        word: 'log',
        meaning: 'A piece of a tree trunk or branch.',
        emoji: '🪵',
        family: 'og',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: FOUNDATIONAL_SKILLS,
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The frog sat on a log.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['nature', 'wood', 'short-o'],
      },
    ],
  },

  // ============================================================
  // LEVEL 5 — SHORT U
  // ============================================================

  {
    id: 5,

    title: 'Level 5: Short-U Vocabulary',

    shortTitle: 'Short U',

    syllabusFocus:
      'CVC words containing the short-u sound in -ug, -un, and -ub families.',

    description:
      'Completes the core short-vowel CVC sequence while developing action, object, nature, and descriptive vocabulary.',

    patternFocus: ['CVC'],

    skillIds: [
      'word-recognition',
      'word-reading',
      'phonics-application',
      'word-family',
      'meaning-identification',
      'oral-vocabulary',
      'sentence-use',
    ],

    prerequisiteLevelIds: [1, 2, 3, 4],

    masteryThreshold: 80,

    reviewThreshold: 60,

    isFoundational: true,

    words: [
      {
        id: 'v41',
        word: 'bug',
        meaning: 'A small insect.',
        emoji: '🐛',
        family: 'ug',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'emerging',
        skillIds: FOUNDATIONAL_SKILLS,
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'I saw a bug on the leaf.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['animal', 'insect', 'short-u'],
      },

      {
        id: 'v42',
        word: 'hug',
        meaning: 'To hold someone closely to show love or care.',
        emoji: '🤗',
        family: 'ug',
        pattern: 'CVC',
        wordType: 'verb',
        difficulty: 'emerging',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'oral-vocabulary',
          'sentence-use',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'I gave my mother a hug.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['emotion', 'family', 'action', 'short-u'],
      },

      {
        id: 'v43',
        word: 'rug',
        meaning: 'A piece of material used as a floor covering.',
        emoji: '🧶',
        family: 'ug',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: FOUNDATIONAL_SKILLS,
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The cat is on the rug.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['home', 'object', 'short-u'],
      },

      {
        id: 'v44',
        word: 'jug',
        meaning: 'A container used for holding and pouring liquids.',
        emoji: '🏺',
        family: 'ug',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: FOUNDATIONAL_SKILLS,
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The jug is full of water.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['home', 'water', 'object', 'short-u'],
      },

      {
        id: 'v45',
        word: 'mug',
        meaning: 'A cup with a handle, often used for hot drinks.',
        emoji: '☕',
        family: 'ug',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: FOUNDATIONAL_SKILLS,
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The mug is on the table.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['home', 'drink', 'object', 'short-u'],
      },

      {
        id: 'v46',
        word: 'sun',
        meaning: 'The star that gives Earth light and heat.',
        emoji: '☀️',
        family: 'un',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'emerging',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'oral-vocabulary',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The sun is bright.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['space', 'nature', 'science', 'short-u'],
      },

      {
        id: 'v47',
        word: 'run',
        meaning: 'To move quickly using your legs.',
        emoji: '🏃',
        family: 'un',
        pattern: 'CVC',
        wordType: 'verb',
        difficulty: 'emerging',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'sentence-use',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'I like to run.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['movement', 'action', 'verb', 'short-u'],
      },

      {
        id: 'v48',
        word: 'fun',
        meaning: 'Something enjoyable that makes you happy.',
        emoji: '🎉',
        family: 'un',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'meaning-identification',
          'oral-vocabulary',
          'sentence-use',
        ],
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'We had fun at the park.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['emotion', 'play', 'short-u'],
      },

      {
        id: 'v49',
        word: 'bun',
        meaning: 'A small, soft bread roll.',
        emoji: '🥯',
        family: 'un',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: FOUNDATIONAL_SKILLS,
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The bun is warm.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['food', 'bread', 'short-u'],
      },

      {
        id: 'v50',
        word: 'tub',
        meaning: 'A large container used for bathing or holding water.',
        emoji: '🛁',
        family: 'ub',
        pattern: 'CVC',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: FOUNDATIONAL_SKILLS,
        prerequisiteSkillIds: CVC_PREREQUISITES,
        exampleSentence: 'The child sits in the tub.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['home', 'bath', 'short-u'],
      },
    ],
  },

  // ============================================================
  // LEVEL 6 — SH / CH
  // ============================================================

  {
    id: 6,

    title: 'Level 6: Consonant Digraphs',

    shortTitle: 'SH & CH',

    syllabusFocus:
      'Words containing common consonant digraphs such as sh and ch.',

    description:
      'Introduces two-letter consonant patterns while expanding vocabulary through familiar objects, actions, places, and animals.',

    patternFocus: ['digraph'],

    skillIds: [
      'word-recognition',
      'word-reading',
      'phonics-application',
      'word-family',
      'meaning-identification',
      'vocabulary-building',
      'oral-vocabulary',
      'spelling',
    ],

    prerequisiteLevelIds: [1, 2, 3, 4, 5],

    masteryThreshold: 80,

    reviewThreshold: 60,

    isFoundational: false,

    words: [
      {
        id: 'v51',
        word: 'ship',
        meaning: 'A large boat used for travelling or carrying things on water.',
        emoji: '🚢',
        family: 'sh',
        pattern: 'digraph',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'vocabulary-building',
        ],
        prerequisiteSkillIds: DIGRAPH_PREREQUISITES,
        exampleSentence: 'The ship is on the sea.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['transport', 'sea', 'sh'],
      },

      {
        id: 'v52',
        word: 'shop',
        meaning: 'A place where people buy things.',
        emoji: '🏪',
        family: 'sh',
        pattern: 'digraph',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'oral-vocabulary',
        ],
        prerequisiteSkillIds: DIGRAPH_PREREQUISITES,
        exampleSentence: 'We went to the shop.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['community', 'shopping', 'sh'],
      },

      {
        id: 'v53',
        word: 'shut',
        meaning: 'To close something.',
        emoji: '🚪',
        family: 'sh',
        pattern: 'digraph',
        wordType: 'verb',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'sentence-use',
        ],
        prerequisiteSkillIds: DIGRAPH_PREREQUISITES,
        exampleSentence: 'Please shut the door.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['action', 'home', 'sh'],
      },

      {
        id: 'v54',
        word: 'fish',
        meaning: 'An animal that lives in water and uses fins to swim.',
        emoji: '🐟',
        family: 'sh',
        pattern: 'digraph',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'oral-vocabulary',
        ],
        prerequisiteSkillIds: DIGRAPH_PREREQUISITES,
        exampleSentence: 'The fish swims in the water.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['animal', 'water', 'sh'],
      },

      {
        id: 'v55',
        word: 'dish',
        meaning: 'A plate or container used for serving or eating food.',
        emoji: '🍽️',
        family: 'sh',
        pattern: 'digraph',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
        ],
        prerequisiteSkillIds: DIGRAPH_PREREQUISITES,
        exampleSentence: 'The food is on the dish.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['food', 'home', 'sh'],
      },

      {
        id: 'v56',
        word: 'chip',
        meaning: 'A small, thin piece of something.',
        emoji: '🥔',
        family: 'ch',
        pattern: 'digraph',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
        ],
        prerequisiteSkillIds: DIGRAPH_PREREQUISITES,
        exampleSentence: 'I ate a chip.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['food', 'ch'],
      },

      {
        id: 'v57',
        word: 'chin',
        meaning: 'The part of your face below your mouth.',
        emoji: '👤',
        family: 'ch',
        pattern: 'digraph',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
        ],
        prerequisiteSkillIds: DIGRAPH_PREREQUISITES,
        exampleSentence: 'Touch your chin.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['body', 'health', 'ch'],
      },

      {
        id: 'v58',
        word: 'chat',
        meaning: 'To talk with someone in a friendly way.',
        emoji: '💬',
        family: 'ch',
        pattern: 'digraph',
        wordType: 'verb',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'oral-vocabulary',
          'sentence-use',
        ],
        prerequisiteSkillIds: DIGRAPH_PREREQUISITES,
        exampleSentence: 'I like to chat with my friends.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['communication', 'friends', 'ch'],
      },

      {
        id: 'v59',
        word: 'much',
        meaning: 'A large amount of something.',
        emoji: '💯',
        family: 'ch',
        pattern: 'digraph',
        wordType: 'high-frequency',
        difficulty: 'advanced',
        skillIds: [
          'word-recognition',
          'word-reading',
          'meaning-identification',
          'contextual-meaning',
          'sentence-use',
        ],
        prerequisiteSkillIds: DIGRAPH_PREREQUISITES,
        exampleSentence: 'How much water do you need?',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['quantity', 'question', 'high-frequency', 'ch'],
      },

      {
        id: 'v60',
        word: 'rich',
        meaning: 'Having a lot of money or valuable resources.',
        emoji: '💰',
        family: 'ch',
        pattern: 'digraph',
        wordType: 'adjective',
        difficulty: 'advanced',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'contextual-meaning',
        ],
        prerequisiteSkillIds: DIGRAPH_PREREQUISITES,
        exampleSentence: 'The rich man helped the poor.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['description', 'society', 'ch'],
      },
    ],
  },

  // ============================================================
  // LEVEL 7 — TH / CK
  // ============================================================

  {
    id: 7,

    title: 'Level 7: Advanced Digraphs',

    shortTitle: 'TH & CK',

    syllabusFocus:
      'Common th and final ck spelling patterns in familiar vocabulary.',

    description:
      'Strengthens recognition of consonant patterns while introducing more descriptive, body, movement, and everyday vocabulary.',

    patternFocus: ['digraph'],

    skillIds: [
      'word-recognition',
      'word-reading',
      'phonics-application',
      'meaning-identification',
      'vocabulary-building',
      'oral-vocabulary',
      'spelling',
      'sentence-use',
    ],

    prerequisiteLevelIds: [6],

    masteryThreshold: 80,

    reviewThreshold: 60,

    isFoundational: false,

    words: [
      {
        id: 'v61',
        word: 'thin',
        meaning: 'Not thick; having a small distance from one side to the other.',
        emoji: '📏',
        family: 'th',
        pattern: 'digraph',
        wordType: 'adjective',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'antonym-awareness',
        ],
        prerequisiteSkillIds: DIGRAPH_PREREQUISITES,
        exampleSentence: 'The book is thin.',
        alternateMeanings: ['Having little body fat.'],
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['description', 'size', 'th'],
      },

      {
        id: 'v62',
        word: 'thick',
        meaning: 'Having a large distance from one side to the other.',
        emoji: '🧱',
        family: 'th',
        pattern: 'digraph',
        wordType: 'adjective',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'antonym-awareness',
        ],
        prerequisiteSkillIds: DIGRAPH_PREREQUISITES,
        exampleSentence: 'The wall is thick.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['description', 'size', 'opposite-of-thin'],
      },

      {
        id: 'v63',
        word: 'bath',
        meaning: 'Washing your body in a tub of water.',
        emoji: '🛁',
        family: 'th',
        pattern: 'digraph',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
        ],
        prerequisiteSkillIds: DIGRAPH_PREREQUISITES,
        exampleSentence: 'I had a warm bath.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['health', 'home', 'hygiene', 'th'],
      },

      {
        id: 'v64',
        word: 'moth',
        meaning: 'A flying insect related to butterflies.',
        emoji: '🦋',
        family: 'th',
        pattern: 'digraph',
        wordType: 'noun',
        difficulty: 'advanced',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
        ],
        prerequisiteSkillIds: DIGRAPH_PREREQUISITES,
        exampleSentence: 'A moth flew near the light.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['animal', 'insect', 'nature', 'th'],
      },

      {
        id: 'v65',
        word: 'path',
        meaning: 'A way or track for walking along.',
        emoji: '🛤️',
        family: 'th',
        pattern: 'digraph',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'oral-vocabulary',
        ],
        prerequisiteSkillIds: DIGRAPH_PREREQUISITES,
        exampleSentence: 'We walked along the path.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['place', 'movement', 'nature', 'th'],
      },

      {
        id: 'v66',
        word: 'back',
        meaning: 'The rear part of something; the part opposite the front.',
        emoji: '🔙',
        family: 'ck',
        pattern: 'digraph',
        wordType: 'noun',
        difficulty: 'advanced',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'contextual-meaning',
        ],
        prerequisiteSkillIds: DIGRAPH_PREREQUISITES,
        exampleSentence: 'The bag is on my back.',
        alternateMeanings: [
          'To support someone or something.',
          'To move in the opposite direction.',
        ],
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['body', 'position', 'ck'],
      },

      {
        id: 'v67',
        word: 'pack',
        meaning: 'A bag or container used for carrying things.',
        emoji: '🎒',
        family: 'ck',
        pattern: 'digraph',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
        ],
        prerequisiteSkillIds: DIGRAPH_PREREQUISITES,
        exampleSentence: 'My books are in my pack.',
        alternateMeanings: ['A group of animals or people.'],
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['school', 'travel', 'object', 'ck'],
      },

      {
        id: 'v68',
        word: 'sick',
        meaning: 'Feeling unwell or ill.',
        emoji: '🤒',
        family: 'ck',
        pattern: 'digraph',
        wordType: 'adjective',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'sentence-use',
        ],
        prerequisiteSkillIds: DIGRAPH_PREREQUISITES,
        exampleSentence: 'I stayed home because I was sick.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['health', 'description', 'ck'],
      },

      {
        id: 'v69',
        word: 'kick',
        meaning: 'To hit something with your foot.',
        emoji: '🦵',
        family: 'ck',
        pattern: 'digraph',
        wordType: 'verb',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'sentence-use',
        ],
        prerequisiteSkillIds: DIGRAPH_PREREQUISITES,
        exampleSentence: 'Kick the ball gently.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['movement', 'sports', 'action', 'ck'],
      },

      {
        id: 'v70',
        word: 'lock',
        meaning: 'A device used to keep a door or container closed and secure.',
        emoji: '🔒',
        family: 'ck',
        pattern: 'digraph',
        wordType: 'noun',
        difficulty: 'advanced',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'oral-vocabulary',
        ],
        prerequisiteSkillIds: DIGRAPH_PREREQUISITES,
        exampleSentence: 'The door has a lock.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['home', 'security', 'object', 'ck'],
      },
    ],
  },

  // ============================================================
  // LEVEL 8 — MAGIC E
  // ============================================================

  {
    id: 8,

    title: 'Level 8: Silent-E Patterns',

    shortTitle: 'Magic E',

    syllabusFocus:
      'Common long-vowel patterns using silent e, including -ake, -ike, -ome, and -ame.',

    description:
      'Introduces long-vowel spelling patterns and helps learners connect spelling changes with changes in pronunciation and meaning.',

    patternFocus: ['magic-e'],

    skillIds: [
      'word-recognition',
      'word-reading',
      'phonics-application',
      'word-family',
      'meaning-identification',
      'vocabulary-building',
      'spelling',
      'sentence-use',
    ],

    prerequisiteLevelIds: [1, 2, 3, 4, 5, 6, 7],

    masteryThreshold: 80,

    reviewThreshold: 60,

    isFoundational: false,

    words: [
      {
        id: 'v71',
        word: 'cake',
        meaning: 'A sweet baked food often eaten for celebrations.',
        emoji: '🎂',
        family: 'ake',
        pattern: 'magic-e',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'word-family',
          'meaning-identification',
        ],
        prerequisiteSkillIds: MAGIC_E_PREREQUISITES,
        exampleSentence: 'We ate cake at the party.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['food', 'celebration', 'long-a', 'magic-e'],
      },

      {
        id: 'v72',
        word: 'lake',
        meaning: 'A large area of water surrounded by land.',
        emoji: '🌊',
        family: 'ake',
        pattern: 'magic-e',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
        ],
        prerequisiteSkillIds: MAGIC_E_PREREQUISITES,
        exampleSentence: 'We saw a boat on the lake.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['nature', 'water', 'place', 'long-a'],
      },

      {
        id: 'v73',
        word: 'make',
        meaning: 'To create, build, or prepare something.',
        emoji: '🛠️',
        family: 'ake',
        pattern: 'magic-e',
        wordType: 'verb',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'sentence-use',
        ],
        prerequisiteSkillIds: MAGIC_E_PREREQUISITES,
        exampleSentence: 'Let us make a card.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['action', 'creating', 'verb', 'long-a'],
      },

      {
        id: 'v74',
        word: 'take',
        meaning: 'To carry or move something from one place to another.',
        emoji: '✋',
        family: 'ake',
        pattern: 'magic-e',
        wordType: 'verb',
        difficulty: 'advanced',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'sentence-use',
        ],
        prerequisiteSkillIds: MAGIC_E_PREREQUISITES,
        exampleSentence: 'Please take your book.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['action', 'high-utility', 'verb', 'long-a'],
      },

      {
        id: 'v75',
        word: 'bike',
        meaning: 'A vehicle with two wheels that you can ride.',
        emoji: '🚲',
        family: 'ike',
        pattern: 'magic-e',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
        ],
        prerequisiteSkillIds: MAGIC_E_PREREQUISITES,
        exampleSentence: 'I ride my bike.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['transport', 'movement', 'long-i'],
      },

      {
        id: 'v76',
        word: 'like',
        meaning: 'To enjoy or have a positive feeling about something.',
        emoji: '❤️',
        family: 'ike',
        pattern: 'magic-e',
        wordType: 'verb',
        difficulty: 'advanced',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'sentence-use',
          'oral-vocabulary',
        ],
        prerequisiteSkillIds: MAGIC_E_PREREQUISITES,
        exampleSentence: 'I like reading books.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['emotion', 'preference', 'verb', 'long-i'],
      },

      {
        id: 'v77',
        word: 'hike',
        meaning: 'A long walk, especially in the countryside or nature.',
        emoji: '🥾',
        family: 'ike',
        pattern: 'magic-e',
        wordType: 'noun',
        difficulty: 'advanced',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'vocabulary-building',
        ],
        prerequisiteSkillIds: MAGIC_E_PREREQUISITES,
        exampleSentence: 'We went on a hike.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['nature', 'movement', 'outdoors', 'long-i'],
      },

      {
        id: 'v78',
        word: 'mike',
        meaning: 'An informal short form of microphone.',
        emoji: '🎤',
        family: 'ike',
        pattern: 'magic-e',
        wordType: 'noun',
        difficulty: 'challenge',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
        ],
        prerequisiteSkillIds: MAGIC_E_PREREQUISITES,
        exampleSentence: 'She spoke into the mike.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['communication', 'technology', 'informal-word'],
      },

      {
        id: 'v79',
        word: 'home',
        meaning: 'The place where a person or family lives.',
        emoji: '🏠',
        family: 'ome',
        pattern: 'magic-e',
        wordType: 'noun',
        difficulty: 'advanced',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'oral-vocabulary',
        ],
        prerequisiteSkillIds: MAGIC_E_PREREQUISITES,
        exampleSentence: 'I am going home.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['family', 'place', 'home', 'long-o'],
      },

      {
        id: 'v80',
        word: 'game',
        meaning: 'Something played for fun, practice, or competition.',
        emoji: '🎮',
        family: 'ame',
        pattern: 'magic-e',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'sentence-use',
        ],
        prerequisiteSkillIds: MAGIC_E_PREREQUISITES,
        exampleSentence: 'We played a fun game.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['play', 'sports', 'games', 'long-a'],
      },
    ],
  },

  // ============================================================
  // LEVEL 9 — CONSONANT BLENDS
  // ============================================================

  {
    id: 9,

    title: 'Level 9: Consonant Blends',

    shortTitle: 'Blends',

    syllabusFocus:
      'Initial consonant blends including st, tr, bl, and fl.',

    description:
      'Builds fluency with consonant clusters while expanding vocabulary into nature, transport, movement, description, and everyday concepts.',

    patternFocus: ['blend'],

    skillIds: [
      'word-recognition',
      'word-reading',
      'phonics-application',
      'word-family',
      'meaning-identification',
      'vocabulary-building',
      'spelling',
      'sentence-use',
    ],

    prerequisiteLevelIds: [6, 7, 8],

    masteryThreshold: 80,

    reviewThreshold: 60,

    isFoundational: false,

    words: [
      {
        id: 'v81',
        word: 'stop',
        meaning: 'To stop moving or to come to a halt.',
        emoji: '🛑',
        family: 'st',
        pattern: 'blend',
        wordType: 'verb',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'sentence-use',
        ],
        prerequisiteSkillIds: BLEND_PREREQUISITES,
        exampleSentence: 'Please stop at the door.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['action', 'movement', 'st'],
      },

      {
        id: 'v82',
        word: 'star',
        meaning: 'A huge, hot object in space that produces its own light.',
        emoji: '⭐',
        family: 'st',
        pattern: 'blend',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'vocabulary-building',
        ],
        prerequisiteSkillIds: BLEND_PREREQUISITES,
        exampleSentence: 'I can see a star in the sky.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['space', 'science', 'st'],
      },

      {
        id: 'v83',
        word: 'step',
        meaning: 'A movement made by lifting one foot and putting it down.',
        emoji: '👣',
        family: 'st',
        pattern: 'blend',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
        ],
        prerequisiteSkillIds: BLEND_PREREQUISITES,
        exampleSentence: 'Take one step forward.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['movement', 'body', 'st'],
      },

      {
        id: 'v84',
        word: 'tree',
        meaning: 'A large plant with a trunk, branches, and leaves.',
        emoji: '🌳',
        family: 'tr',
        pattern: 'blend',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'vocabulary-building',
        ],
        prerequisiteSkillIds: BLEND_PREREQUISITES,
        exampleSentence: 'The bird is in the tree.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['nature', 'plants', 'tr'],
      },

      {
        id: 'v85',
        word: 'trip',
        meaning: 'A journey from one place to another.',
        emoji: '✈️',
        family: 'tr',
        pattern: 'blend',
        wordType: 'noun',
        difficulty: 'advanced',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'oral-vocabulary',
        ],
        prerequisiteSkillIds: BLEND_PREREQUISITES,
        exampleSentence: 'We went on a trip.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['travel', 'journey', 'tr'],
      },

      {
        id: 'v86',
        word: 'truck',
        meaning: 'A large road vehicle used for carrying things.',
        emoji: '🚛',
        family: 'tr',
        pattern: 'blend',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
        ],
        prerequisiteSkillIds: BLEND_PREREQUISITES,
        exampleSentence: 'The truck carries boxes.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['transport', 'vehicle', 'tr'],
      },

      {
        id: 'v87',
        word: 'blue',
        meaning: 'A color like the clear daytime sky.',
        emoji: '💙',
        family: 'bl',
        pattern: 'blend',
        wordType: 'adjective',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'sentence-use',
        ],
        prerequisiteSkillIds: BLEND_PREREQUISITES,
        exampleSentence: 'The sky is blue.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['color', 'description', 'bl'],
      },

      {
        id: 'v88',
        word: 'black',
        meaning: 'A very dark color.',
        emoji: '⬛',
        family: 'bl',
        pattern: 'blend',
        wordType: 'adjective',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
        ],
        prerequisiteSkillIds: BLEND_PREREQUISITES,
        exampleSentence: 'The cat is black.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['color', 'description', 'bl'],
      },

      {
        id: 'v89',
        word: 'block',
        meaning: 'A solid piece of material used for building or playing.',
        emoji: '🧱',
        family: 'bl',
        pattern: 'blend',
        wordType: 'noun',
        difficulty: 'developing',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'sentence-use',
        ],
        prerequisiteSkillIds: BLEND_PREREQUISITES,
        exampleSentence: 'I built a tower with a block.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['play', 'building', 'object', 'bl'],
      },

      {
        id: 'v90',
        word: 'flat',
        meaning: 'Level and without a raised or curved surface.',
        emoji: '🟫',
        family: 'fl',
        pattern: 'blend',
        wordType: 'adjective',
        difficulty: 'advanced',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'antonym-awareness',
        ],
        prerequisiteSkillIds: BLEND_PREREQUISITES,
        exampleSentence: 'The ground is flat.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['description', 'shape', 'fl'],
      },
    ],
  },

  // ============================================================
  // LEVEL 10 — EXTENSION & CHALLENGE
  // ============================================================

  {
    id: 10,

    title: 'Level 10: Vocabulary Extension & Challenge',

    shortTitle: 'Extension',

    syllabusFocus:
      'More complex words, consonant blends, common spelling patterns, and selected tricky or less predictable words.',

    description:
      'Extends independent word reading and vocabulary through more complex words, richer meanings, and carefully identified extension vocabulary.',

    patternFocus: [
      'blend',
      'magic-e',
      'multisyllabic',
      'irregular',
      'challenge',
    ],

    skillIds: [
      'word-recognition',
      'word-reading',
      'phonics-application',
      'meaning-identification',
      'vocabulary-building',
      'oral-vocabulary',
      'spelling',
      'sentence-use',
      'contextual-meaning',
    ],

    prerequisiteLevelIds: [8, 9],

    masteryThreshold: 80,

    reviewThreshold: 60,

    isFoundational: false,

    words: [
      {
        id: 'v91',
        word: 'grand',
        meaning: 'Very large, impressive, or important.',
        emoji: '🏰',
        family: 'gr',
        pattern: 'blend',
        wordType: 'adjective',
        difficulty: 'advanced',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'vocabulary-building',
          'contextual-meaning',
        ],
        prerequisiteSkillIds: BLEND_PREREQUISITES,
        exampleSentence: 'They visited a grand building.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['description', 'size', 'gr'],
      },

      {
        id: 'v92',
        word: 'green',
        meaning: 'A color like fresh grass or many leaves.',
        emoji: '💚',
        family: 'gr',
        pattern: 'blend',
        wordType: 'adjective',
        difficulty: 'advanced',
        skillIds: [
          'word-recognition',
          'word-reading',
          'meaning-identification',
          'vocabulary-building',
        ],
        prerequisiteSkillIds: BLEND_PREREQUISITES,
        exampleSentence: 'The leaves are green.',
        supportsOralLanguage: true,
        decodability: 'extension',
        tags: ['color', 'nature', 'gr'],
      },

      {
        id: 'v93',
        word: 'ground',
        meaning: 'The surface of the Earth that we walk on.',
        emoji: '🌍',
        family: 'gr',
        pattern: 'blend',
        wordType: 'noun',
        difficulty: 'advanced',
        skillIds: [
          'word-recognition',
          'word-reading',
          'meaning-identification',
          'vocabulary-building',
          'contextual-meaning',
        ],
        prerequisiteSkillIds: BLEND_PREREQUISITES,
        exampleSentence: 'The ball fell on the ground.',
        supportsOralLanguage: true,
        decodability: 'extension',
        tags: ['earth', 'nature', 'place', 'gr'],
      },

      {
        id: 'v94',
        word: 'shine',
        meaning: 'To give off or reflect light.',
        emoji: '✨',
        family: 'sh',
        pattern: 'magic-e',
        wordType: 'verb',
        difficulty: 'advanced',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'sentence-use',
        ],
        prerequisiteSkillIds: MAGIC_E_PREREQUISITES,
        exampleSentence: 'The stars shine at night.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['light', 'science', 'action', 'sh'],
      },

      {
        id: 'v95',
        word: 'stone',
        meaning: 'A small piece of hard natural rock.',
        emoji: '🪨',
        family: 'st',
        pattern: 'magic-e',
        wordType: 'noun',
        difficulty: 'advanced',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'vocabulary-building',
        ],
        prerequisiteSkillIds: MAGIC_E_PREREQUISITES,
        exampleSentence: 'I found a smooth stone.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['nature', 'earth', 'object', 'st'],
      },

      {
        id: 'v96',
        word: 'brave',
        meaning: 'Willing to face something difficult or frightening.',
        emoji: '🦁',
        family: 'br',
        pattern: 'magic-e',
        wordType: 'adjective',
        difficulty: 'advanced',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'vocabulary-building',
          'contextual-meaning',
        ],
        prerequisiteSkillIds: BLEND_PREREQUISITES,
        exampleSentence: 'The brave girl helped her friend.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['character', 'emotion', 'values', 'br'],
      },

      {
        id: 'v97',
        word: 'branch',
        meaning: 'A part of a tree that grows from the trunk or another branch.',
        emoji: '🌿',
        family: 'br',
        pattern: 'blend',
        wordType: 'noun',
        difficulty: 'advanced',
        skillIds: [
          'word-recognition',
          'word-reading',
          'phonics-application',
          'meaning-identification',
          'vocabulary-building',
        ],
        prerequisiteSkillIds: BLEND_PREREQUISITES,
        exampleSentence: 'A bird sat on the branch.',
        supportsOralLanguage: true,
        decodability: 'decodable',
        tags: ['nature', 'plants', 'tree', 'br'],
      },

      {
        id: 'v98',
        word: 'water',
        meaning: 'A clear liquid that people, animals, and plants need to live.',
        emoji: '💧',
        family: 'wa',
        pattern: 'irregular',
        wordType: 'noun',
        difficulty: 'challenge',
        skillIds: [
          'word-recognition',
          'word-reading',
          'meaning-identification',
          'vocabulary-building',
          'oral-vocabulary',
          'contextual-meaning',
        ],
        prerequisiteSkillIds: [
          'phonics:common-vowel-patterns',
        ],
        exampleSentence: 'Plants need water to grow.',
        supportsOralLanguage: true,
        decodability: 'tricky',
        tags: ['nature', 'science', 'needs', 'life'],
      },

      {
        id: 'v99',
        word: 'flower',
        meaning: 'The colorful part of many plants that can produce seeds.',
        emoji: '🌸',
        family: 'fl',
        pattern: 'irregular',
        wordType: 'noun',
        difficulty: 'challenge',
        skillIds: [
          'word-recognition',
          'word-reading',
          'meaning-identification',
          'vocabulary-building',
          'contextual-meaning',
        ],
        prerequisiteSkillIds: [
          'phonics:common-vowel-patterns',
          'phonics:consonant-blends',
        ],
        exampleSentence: 'The flower is growing in the garden.',
        supportsOralLanguage: true,
        decodability: 'tricky',
        tags: ['nature', 'plants', 'garden', 'fl'],
      },

      {
        id: 'v100',
        word: 'animal',
        meaning: 'A living creature that is not a plant.',
        emoji: '🐾',
        family: 'an',
        pattern: 'multisyllabic',
        wordType: 'noun',
        difficulty: 'challenge',
        skillIds: [
          'word-recognition',
          'word-reading',
          'meaning-identification',
          'vocabulary-building',
          'oral-vocabulary',
          'contextual-meaning',
        ],
        prerequisiteSkillIds: [
          'phonics:multisyllabic-word-reading',
        ],
        exampleSentence: 'A dog is an animal.',
        supportsOralLanguage: true,
        decodability: 'tricky',
        tags: ['animals', 'science', 'living-things', 'multisyllabic'],
      },
    ],
  },
];

// ============================================================
// INDEXES & LOOKUP HELPERS
// ============================================================

export const VOCABULARY_BY_ID = new Map(
  VOCABULARY_CURRICULUM.flatMap((level) =>
    level.words.map((word) => [word.id, word] as const),
  ),
);

export function getVocabularyWord(
  id: string,
): VocabWord | undefined {
  return VOCABULARY_BY_ID.get(id);
}

export function getVocabularyLevel(
  level: VocabularyLevel,
): VocabLevel | undefined {
  return VOCABULARY_CURRICULUM.find(
    (item) => item.id === level,
  );
}

export function getVocabularyByPattern(
  pattern: VocabularyPattern,
): readonly VocabWord[] {
  return VOCABULARY_CURRICULUM
    .flatMap((level) => level.words)
    .filter((word) => word.pattern === pattern);
}

export function getVocabularyByFamily(
  family: string,
): readonly VocabWord[] {
  return VOCABULARY_CURRICULUM
    .flatMap((level) => level.words)
    .filter((word) => word.family === family);
}

export function getVocabularyBySkill(
  skillId: VocabularySkill,
): readonly VocabWord[] {
  return VOCABULARY_CURRICULUM
    .flatMap((level) => level.words)
    .filter((word) => word.skillIds.includes(skillId));
}

export function getVocabularyByDifficulty(
  difficulty: VocabularyDifficulty,
): readonly VocabWord[] {
  return VOCABULARY_CURRICULUM
    .flatMap((level) => level.words)
    .filter((word) => word.difficulty === difficulty);
}

export function getFoundationalVocabulary(): readonly VocabWord[] {
  return VOCABULARY_CURRICULUM
    .filter((level) => level.isFoundational)
    .flatMap((level) => level.words);
}

export function getDecodableVocabulary(): readonly VocabWord[] {
  return VOCABULARY_CURRICULUM
    .flatMap((level) => level.words)
    .filter((word) => word.decodability === 'decodable');
}

export function getExtensionVocabulary(): readonly VocabWord[] {
  return VOCABULARY_CURRICULUM
    .flatMap((level) => level.words)
    .filter((word) => word.decodability === 'extension');
}

export function getTrickyVocabulary(): readonly VocabWord[] {
  return VOCABULARY_CURRICULUM
    .flatMap((level) => level.words)
    .filter((word) => word.decodability === 'tricky');
}

export function getVocabularyForOralLanguage(): readonly VocabWord[] {
  return VOCABULARY_CURRICULUM
    .flatMap((level) => level.words)
    .filter((word) => word.supportsOralLanguage);
}

export function getVocabularyForSentenceBuilding(): readonly VocabWord[] {
  return VOCABULARY_CURRICULUM
    .flatMap((level) => level.words)
    .filter((word) => word.skillIds.includes('sentence-use'));
}

export function getVocabularyForSpelling(): readonly VocabWord[] {
  return VOCABULARY_CURRICULUM
    .flatMap((level) => level.words)
    .filter((word) => word.skillIds.includes('spelling'));
}

export const VOCABULARY_TOTAL_WORDS =
  VOCABULARY_CURRICULUM.reduce(
    (total, level) => total + level.words.length,
    0,
  );

export const VOCABULARY_TOTAL_LEVELS =
  VOCABULARY_CURRICULUM.length;

// ============================================================
// CURRICULUM VALIDATION
// ============================================================

export interface VocabularyValidationResult {
  valid: boolean;
  duplicateIds: readonly string[];
  duplicateWords: readonly string[];
  invalidLevelPrerequisites: readonly string[];
  invalidWordReferences: readonly string[];
}

export function validateVocabularyCurriculum(): VocabularyValidationResult {
  const ids = new Set<string>();
  const words = new Set<string>();

  const duplicateIds: string[] = [];
  const duplicateWords: string[] = [];
  const invalidLevelPrerequisites: string[] = [];
  const invalidWordReferences: string[] = [];

  for (const level of VOCABULARY_CURRICULUM) {
    for (const prerequisiteLevel of level.prerequisiteLevelIds) {
      if (
        prerequisiteLevel >= level.id ||
        !VOCABULARY_CURRICULUM.some(
          (item) => item.id === prerequisiteLevel,
        )
      ) {
        invalidLevelPrerequisites.push(
          `Level ${level.id} -> Level ${prerequisiteLevel}`,
        );
      }
    }

    for (const word of level.words) {
      if (ids.has(word.id)) {
        duplicateIds.push(word.id);
      }

      if (words.has(word.word)) {
        duplicateWords.push(word.word);
      }

      ids.add(word.id);
      words.add(word.word);

      if (word.word.trim().length === 0) {
        invalidWordReferences.push(
          `${word.id}: empty word`,
        );
      }

      if (word.meaning.trim().length === 0) {
        invalidWordReferences.push(
          `${word.id}: empty meaning`,
        );
      }
    }
  }

  return {
    valid:
      duplicateIds.length === 0 &&
      duplicateWords.length === 0 &&
      invalidLevelPrerequisites.length === 0 &&
      invalidWordReferences.length === 0,

    duplicateIds,

    duplicateWords,

    invalidLevelPrerequisites,

    invalidWordReferences,
  };
}