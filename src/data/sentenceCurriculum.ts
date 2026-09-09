export type SentenceLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type SentenceType =
  | 'statement'
  | 'question'
  | 'command'
  | 'exclamation'
  | 'description'
  | 'narrative'
  | 'reasoning';

export type GrammarFocus =
  | 'subject-predicate'
  | 'adjectives'
  | 'modal-verbs'
  | 'simple-present'
  | 'articles'
  | 'prepositions'
  | 'possessives'
  | 'adverbs'
  | 'present-progressive'
  | 'past-tense'
  | 'infinitives'
  | 'conjunctions'
  | 'compound-sentences'
  | 'complex-sentences'
  | 'reflexive-pronouns'
  | 'future-intention'
  | 'sequencing'
  | 'reason-cause'
  | 'description'
  | 'independent-expression';

export type SentenceSkill =
  | 'sentence-building'
  | 'word-order'
  | 'subject-identification'
  | 'verb-identification'
  | 'adjective-use'
  | 'adverb-use'
  | 'article-use'
  | 'preposition-use'
  | 'possessive-use'
  | 'pronoun-use'
  | 'reflexive-pronoun-use'
  | 'question-formation'
  | 'negation'
  | 'verb-tense'
  | 'modal-verb-use'
  | 'conjunction-use'
  | 'compound-sentences'
  | 'complex-sentences'
  | 'infinitive-use'
  | 'reading-comprehension'
  | 'oral-expression'
  | 'written-expression'
  | 'sentence-expansion'
  | 'sentence-description'
  | 'narrative-expression'
  | 'reasoning-expression';
  
export type SentenceDifficulty =
  | 'emerging'
  | 'developing'
  | 'secure'
  | 'advanced'
  | 'challenge';

export interface SentenceData {
  id: string;

  /**
   * Canonical sentence used by the curriculum.
   * Stored in lowercase so it can be compared consistently
   * during sentence-building activities.
   */
  text: string;

  /**
   * Sentence-complexity level.
   * This is NOT the learner's overall ELP level.
   */
  level: SentenceLevel;

  /**
   * Human-readable grammatical structure.
   */
  pattern: string;

  /**
   * Optional teacher/learner prompt.
   */
  prompt?: string;

  /**
   * Educational classification.
   */
  sentenceType: SentenceType;

  /**
   * Main grammatical concepts taught.
   */
  grammarFocus: readonly GrammarFocus[];

  /**
   * Competencies practiced by this sentence.
   */
  skillIds: readonly SentenceSkill[];

  /**
   * Concepts that should normally be established first.
   */
  prerequisiteIds: readonly string[];

  /**
   * Relative difficulty within the sentence curriculum.
   */
  difficulty: SentenceDifficulty;

  /**
   * Whether this sentence is suitable for foundational review.
   */
  isFoundational: boolean;

  /**
   * Whether the learner can personalize the sentence.
   */
  isPersonalizable: boolean;

  /**
   * Whether the sentence is suitable for oral practice.
   */
  supportsSpeech: boolean;

  /**
   * Whether the sentence is suitable for sentence-building activities.
   */
  supportsWordBuilding: boolean;

  /**
   * Whether the sentence is suitable for writing/copying activities.
   */
  supportsWriting: boolean;

  /**
   * Optional tags for filtering and adaptive lesson generation.
   */
  tags: readonly string[];
}

/**
 * Sentence curriculum configuration.
 *
 * This belongs to the Language & Literacy academy.
 * Sentence complexity is independent of the learner's overall ELP level.
 */
export const SENTENCE_CURRICULUM_CONFIG = {
  academyId: 'language',
  subjectId: 'english',
  domain: 'language',
  language: 'en-US',
  minimumMasteryForProgression: 80,
  reviewThreshold: 60,
} as const;

const BASE_SKILLS: readonly SentenceSkill[] = [
  'sentence-building',
  'word-order',
];

const FOUNDATIONAL_REQUISITES: readonly string[] = [];

/**
 * 100 progressive sentences.
 *
 * Progression moves from:
 *
 * Level 1 → simple subject + predicate
 * Level 2 → basic actions and objects
 * Level 3 → descriptions and simple location
 * Level 4 → expanded sentences
 * Level 5 → progressive forms and richer descriptions
 * Level 6 → compound/expanded structures
 * Level 7 → advanced independent sentence structures
 *
 * The Learning Engine should use demonstrated mastery and prerequisites
 * rather than simply advancing because a learner completed a sentence.
 */
export const SENTENCE_CURRICULUM: readonly SentenceData[] = [
  // ---------------------------------------------------------------------------
  // LEVEL 1 — FOUNDATIONAL SENTENCE BUILDING
  // ---------------------------------------------------------------------------

  {
    id: 's1',
    text: 'i am happy',
    level: 1,
    pattern: 'Subject + Linking Verb + Adjective',
    prompt: 'Make a sentence about how you feel.',
    sentenceType: 'statement',
    grammarFocus: ['subject-predicate', 'adjectives'],
    skillIds: [...BASE_SKILLS, 'subject-identification', 'adjective-use', 'oral-expression'],
    prerequisiteIds: FOUNDATIONAL_REQUISITES,
    difficulty: 'emerging',
    isFoundational: true,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['feelings', 'self', 'foundations'],
  },

  {
    id: 's2',
    text: 'i am sad',
    level: 1,
    pattern: 'Subject + Linking Verb + Adjective',
    prompt: 'Make a sentence about how you feel.',
    sentenceType: 'statement',
    grammarFocus: ['subject-predicate', 'adjectives'],
    skillIds: [...BASE_SKILLS, 'adjective-use', 'oral-expression'],
    prerequisiteIds: ['s1'],
    difficulty: 'emerging',
    isFoundational: true,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['feelings', 'self'],
  },

  {
    id: 's3',
    text: 'it is hot',
    level: 1,
    pattern: 'Subject + Linking Verb + Adjective',
    prompt: 'Describe the weather.',
    sentenceType: 'description',
    grammarFocus: ['subject-predicate', 'adjectives'],
    skillIds: [...BASE_SKILLS, 'adjective-use'],
    prerequisiteIds: ['s1'],
    difficulty: 'emerging',
    isFoundational: true,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['weather', 'description'],
  },

  {
    id: 's4',
    text: 'it is cold',
    level: 1,
    pattern: 'Subject + Linking Verb + Adjective',
    prompt: 'Describe the weather.',
    sentenceType: 'description',
    grammarFocus: ['subject-predicate', 'adjectives'],
    skillIds: [...BASE_SKILLS, 'adjective-use'],
    prerequisiteIds: ['s3'],
    difficulty: 'emerging',
    isFoundational: true,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['weather', 'description'],
  },

  {
    id: 's5',
    text: 'i am big',
    level: 1,
    pattern: 'Subject + Linking Verb + Adjective',
    prompt: 'Describe yourself.',
    sentenceType: 'description',
    grammarFocus: ['subject-predicate', 'adjectives'],
    skillIds: [...BASE_SKILLS, 'adjective-use'],
    prerequisiteIds: ['s1'],
    difficulty: 'emerging',
    isFoundational: true,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['size', 'self'],
  },

  {
    id: 's6',
    text: 'i am small',
    level: 1,
    pattern: 'Subject + Linking Verb + Adjective',
    prompt: 'Describe yourself.',
    sentenceType: 'description',
    grammarFocus: ['subject-predicate', 'adjectives'],
    skillIds: [...BASE_SKILLS, 'adjective-use'],
    prerequisiteIds: ['s5'],
    difficulty: 'emerging',
    isFoundational: true,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['size', 'self'],
  },

  // ---------------------------------------------------------------------------
  // LEVEL 2 — ACTIONS AND OBJECTS
  // ---------------------------------------------------------------------------

  {
    id: 's7',
    text: 'i can run',
    level: 2,
    pattern: 'Subject + Modal Verb + Base Verb',
    prompt: 'What can you do?',
    sentenceType: 'statement',
    grammarFocus: ['modal-verbs'],
    skillIds: [...BASE_SKILLS, 'verb-identification', 'oral-expression'],
    prerequisiteIds: ['s1'],
    difficulty: 'developing',
    isFoundational: true,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['actions', 'abilities'],
  },

  {
    id: 's8',
    text: 'i can jump',
    level: 2,
    pattern: 'Subject + Modal Verb + Base Verb',
    prompt: 'What can you do?',
    sentenceType: 'statement',
    grammarFocus: ['modal-verbs'],
    skillIds: [...BASE_SKILLS, 'verb-identification', 'oral-expression'],
    prerequisiteIds: ['s7'],
    difficulty: 'developing',
    isFoundational: true,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['actions', 'abilities'],
  },

  {
    id: 's9',
    text: 'i can eat',
    level: 2,
    pattern: 'Subject + Modal Verb + Base Verb',
    prompt: 'What can you do?',
    sentenceType: 'statement',
    grammarFocus: ['modal-verbs'],
    skillIds: [...BASE_SKILLS, 'verb-identification'],
    prerequisiteIds: ['s7'],
    difficulty: 'developing',
    isFoundational: true,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['actions', 'food'],
  },

  {
    id: 's10',
    text: 'i like cake',
    level: 2,
    pattern: 'Subject + Verb + Object',
    prompt: 'What food do you like?',
    sentenceType: 'statement',
    grammarFocus: ['simple-present'],
    skillIds: [...BASE_SKILLS, 'verb-identification', 'oral-expression'],
    prerequisiteIds: ['s7'],
    difficulty: 'developing',
    isFoundational: true,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['food', 'preferences'],
  },

  {
    id: 's11',
    text: 'i like dogs',
    level: 2,
    pattern: 'Subject + Verb + Object',
    prompt: 'What animals do you like?',
    sentenceType: 'statement',
    grammarFocus: ['simple-present'],
    skillIds: [...BASE_SKILLS, 'verb-identification'],
    prerequisiteIds: ['s10'],
    difficulty: 'developing',
    isFoundational: true,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['animals', 'preferences'],
  },

  {
    id: 's12',
    text: 'i see a cat',
    level: 2,
    pattern: 'Subject + Verb + Article + Noun',
    prompt: 'What do you see?',
    sentenceType: 'statement',
    grammarFocus: ['articles', 'simple-present'],
    skillIds: [...BASE_SKILLS, 'article-use'],
    prerequisiteIds: ['s10'],
    difficulty: 'developing',
    isFoundational: true,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['animals', 'observation'],
  },

  {
    id: 's13',
    text: 'i see a bus',
    level: 2,
    pattern: 'Subject + Verb + Article + Noun',
    prompt: 'What do you see?',
    sentenceType: 'statement',
    grammarFocus: ['articles', 'simple-present'],
    skillIds: [...BASE_SKILLS, 'article-use'],
    prerequisiteIds: ['s12'],
    difficulty: 'developing',
    isFoundational: true,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['transport', 'observation'],
  },

  {
    id: 's14',
    text: 'i see a star',
    level: 2,
    pattern: 'Subject + Verb + Article + Noun',
    prompt: 'What do you see?',
    sentenceType: 'statement',
    grammarFocus: ['articles', 'simple-present'],
    skillIds: [...BASE_SKILLS, 'article-use'],
    prerequisiteIds: ['s12'],
    difficulty: 'developing',
    isFoundational: true,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['nature', 'observation'],
  },

  {
    id: 's15',
    text: 'i have a dog',
    level: 2,
    pattern: 'Subject + Verb + Article + Noun',
    prompt: 'What do you have?',
    sentenceType: 'statement',
    grammarFocus: ['simple-present', 'articles'],
    skillIds: [...BASE_SKILLS, 'verb-identification', 'article-use'],
    prerequisiteIds: ['s12'],
    difficulty: 'developing',
    isFoundational: true,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['possession', 'animals'],
  },

  {
    id: 's16',
    text: 'i have a hat',
    level: 2,
    pattern: 'Subject + Verb + Article + Noun',
    prompt: 'What do you have?',
    sentenceType: 'statement',
    grammarFocus: ['simple-present', 'articles'],
    skillIds: [...BASE_SKILLS, 'article-use'],
    prerequisiteIds: ['s15'],
    difficulty: 'developing',
    isFoundational: true,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['possession', 'objects'],
  },

  {
    id: 's17',
    text: 'he can swim',
    level: 2,
    pattern: 'Subject + Modal Verb + Base Verb',
    prompt: 'What can he do?',
    sentenceType: 'statement',
    grammarFocus: ['modal-verbs'],
    skillIds: [...BASE_SKILLS, 'verb-identification'],
    prerequisiteIds: ['s7'],
    difficulty: 'developing',
    isFoundational: true,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['actions', 'abilities'],
  },

  {
    id: 's18',
    text: 'she can sing',
    level: 2,
    pattern: 'Subject + Modal Verb + Base Verb',
    prompt: 'What can she do?',
    sentenceType: 'statement',
    grammarFocus: ['modal-verbs'],
    skillIds: [...BASE_SKILLS, 'verb-identification'],
    prerequisiteIds: ['s17'],
    difficulty: 'developing',
    isFoundational: true,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['actions', 'abilities'],
  },

  {
    id: 's19',
    text: 'we can play',
    level: 2,
    pattern: 'Subject + Modal Verb + Base Verb',
    prompt: 'What can we do?',
    sentenceType: 'statement',
    grammarFocus: ['modal-verbs'],
    skillIds: [...BASE_SKILLS, 'verb-identification'],
    prerequisiteIds: ['s17'],
    difficulty: 'developing',
    isFoundational: true,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['actions', 'abilities'],
  },

  {
    id: 's20',
    text: 'they can dance',
    level: 2,
    pattern: 'Subject + Modal Verb + Base Verb',
    prompt: 'What can they do?',
    sentenceType: 'statement',
    grammarFocus: ['modal-verbs'],
    skillIds: [...BASE_SKILLS, 'verb-identification'],
    prerequisiteIds: ['s19'],
    difficulty: 'developing',
    isFoundational: true,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['actions', 'abilities'],
  },

  // ---------------------------------------------------------------------------
  // LEVEL 3 — DESCRIPTION AND LOCATION
  // ---------------------------------------------------------------------------

  {
    id: 's21',
    text: 'the cat runs fast',
    level: 3,
    pattern: 'Article + Noun + Verb + Adverb',
    prompt: 'Describe an animal.',
    sentenceType: 'description',
    grammarFocus: ['simple-present', 'adverbs'],
    skillIds: [...BASE_SKILLS, 'verb-identification', 'adjective-use'],
    prerequisiteIds: ['s12', 's17'],
    difficulty: 'developing',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['animals', 'movement', 'description'],
  },

  {
    id: 's22',
    text: 'the dog is big',
    level: 3,
    pattern: 'Article + Noun + Linking Verb + Adjective',
    prompt: 'Describe an animal.',
    sentenceType: 'description',
    grammarFocus: ['adjectives'],
    skillIds: [...BASE_SKILLS, 'adjective-use'],
    prerequisiteIds: ['s1', 's12'],
    difficulty: 'developing',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['animals', 'size', 'description'],
  },

  {
    id: 's23',
    text: 'the sun is hot',
    level: 3,
    pattern: 'Article + Noun + Linking Verb + Adjective',
    prompt: 'Describe the weather.',
    sentenceType: 'description',
    grammarFocus: ['adjectives'],
    skillIds: [...BASE_SKILLS, 'adjective-use'],
    prerequisiteIds: ['s22'],
    difficulty: 'developing',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['nature', 'weather'],
  },

  {
    id: 's24',
    text: 'the bird can fly',
    level: 3,
    pattern: 'Article + Noun + Modal Verb + Base Verb',
    prompt: 'What can a bird do?',
    sentenceType: 'statement',
    grammarFocus: ['modal-verbs'],
    skillIds: [...BASE_SKILLS, 'verb-identification'],
    prerequisiteIds: ['s17'],
    difficulty: 'developing',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['animals', 'movement'],
  },

  {
    id: 's25',
    text: 'the fish can swim',
    level: 3,
    pattern: 'Article + Noun + Modal Verb + Base Verb',
    prompt: 'What can a fish do?',
    sentenceType: 'statement',
    grammarFocus: ['modal-verbs'],
    skillIds: [...BASE_SKILLS, 'verb-identification'],
    prerequisiteIds: ['s24'],
    difficulty: 'developing',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['animals', 'movement'],
  },

  {
    id: 's26',
    text: 'i like red apples',
    level: 3,
    pattern: 'Subject + Verb + Adjective + Noun',
    prompt: 'What fruit do you like?',
    sentenceType: 'statement',
    grammarFocus: ['simple-present', 'adjectives'],
    skillIds: [...BASE_SKILLS, 'adjective-use'],
    prerequisiteIds: ['s10'],
    difficulty: 'developing',
    isFoundational: false,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['food', 'fruit', 'preferences'],
  },

  {
    id: 's27',
    text: 'she has a blue bag',
    level: 3,
    pattern: 'Subject + Verb + Article + Adjective + Noun',
    prompt: 'What color is the bag?',
    sentenceType: 'description',
    grammarFocus: ['simple-present', 'articles', 'adjectives'],
    skillIds: [...BASE_SKILLS, 'article-use', 'adjective-use'],
    prerequisiteIds: ['s15', 's26'],
    difficulty: 'developing',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['colors', 'objects', 'description'],
  },

  {
    id: 's28',
    text: 'he has a red car',
    level: 3,
    pattern: 'Subject + Verb + Article + Adjective + Noun',
    prompt: 'What color is the car?',
    sentenceType: 'description',
    grammarFocus: ['simple-present', 'articles', 'adjectives'],
    skillIds: [...BASE_SKILLS, 'article-use', 'adjective-use'],
    prerequisiteIds: ['s27'],
    difficulty: 'developing',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['colors', 'transport', 'description'],
  },

  {
    id: 's29',
    text: 'we go to school',
    level: 3,
    pattern: 'Subject + Verb + Preposition + Noun',
    prompt: 'Where do you go?',
    sentenceType: 'statement',
    grammarFocus: ['simple-present', 'prepositions'],
    skillIds: [...BASE_SKILLS, 'preposition-use'],
    prerequisiteIds: ['s10'],
    difficulty: 'developing',
    isFoundational: false,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['school', 'places'],
  },

  {
    id: 's30',
    text: 'they live in a house',
    level: 3,
    pattern: 'Subject + Verb + Preposition + Article + Noun',
    prompt: 'Where do they live?',
    sentenceType: 'statement',
    grammarFocus: ['simple-present', 'prepositions', 'articles'],
    skillIds: [...BASE_SKILLS, 'preposition-use', 'article-use'],
    prerequisiteIds: ['s29'],
    difficulty: 'developing',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['home', 'places'],
  },

  {
    id: 's31',
    text: 'i can see the moon',
    level: 3,
    pattern: 'Subject + Modal + Verb + Article + Noun',
    prompt: 'What do you see at night?',
    sentenceType: 'statement',
    grammarFocus: ['modal-verbs', 'articles'],
    skillIds: [...BASE_SKILLS, 'article-use'],
    prerequisiteIds: ['s12', 's17'],
    difficulty: 'developing',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['nature', 'night'],
  },

  {
    id: 's32',
    text: 'i can see the stars',
    level: 3,
    pattern: 'Subject + Modal + Verb + Article + Noun',
    prompt: 'What do you see at night?',
    sentenceType: 'statement',
    grammarFocus: ['modal-verbs', 'articles'],
    skillIds: [...BASE_SKILLS, 'article-use'],
    prerequisiteIds: ['s31'],
    difficulty: 'developing',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['nature', 'night'],
  },

  {
    id: 's33',
    text: 'the pig is pink',
    level: 3,
    pattern: 'Article + Noun + Linking Verb + Adjective',
    prompt: 'What color is the pig?',
    sentenceType: 'description',
    grammarFocus: ['adjectives'],
    skillIds: [...BASE_SKILLS, 'adjective-use'],
    prerequisiteIds: ['s22'],
    difficulty: 'developing',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['animals', 'colors'],
  },

  {
    id: 's34',
    text: 'the frog is green',
    level: 3,
    pattern: 'Article + Noun + Linking Verb + Adjective',
    prompt: 'What color is the frog?',
    sentenceType: 'description',
    grammarFocus: ['adjectives'],
    skillIds: [...BASE_SKILLS, 'adjective-use'],
    prerequisiteIds: ['s33'],
    difficulty: 'developing',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['animals', 'colors'],
  },

  {
    id: 's35',
    text: 'the banana is yellow',
    level: 3,
    pattern: 'Article + Noun + Linking Verb + Adjective',
    prompt: 'What color is the banana?',
    sentenceType: 'description',
    grammarFocus: ['adjectives'],
    skillIds: [...BASE_SKILLS, 'adjective-use'],
    prerequisiteIds: ['s33'],
    difficulty: 'developing',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['food', 'colors'],
  },

  {
    id: 's36',
    text: 'the sky is blue',
    level: 3,
    pattern: 'Article + Noun + Linking Verb + Adjective',
    prompt: 'What color is the sky?',
    sentenceType: 'description',
    grammarFocus: ['adjectives'],
    skillIds: [...BASE_SKILLS, 'adjective-use'],
    prerequisiteIds: ['s34'],
    difficulty: 'developing',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['nature', 'colors'],
  },

  // ---------------------------------------------------------------------------
  // LEVEL 4 — EXPANDED SENTENCES
  // ---------------------------------------------------------------------------

  {
    id: 's37',
    text: 'the cat sat on the mat',
    level: 4,
    pattern: 'Article + Noun + Verb + Preposition + Article + Noun',
    prompt: 'Where did the cat sit?',
    sentenceType: 'statement',
    grammarFocus: ['past-tense', 'prepositions', 'articles'],
    skillIds: [...BASE_SKILLS, 'preposition-use', 'verb-tense'],
    prerequisiteIds: ['s29', 's30'],
    difficulty: 'secure',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['animals', 'location', 'past'],
  },

  {
    id: 's38',
    text: 'the dog ran in the park',
    level: 4,
    pattern: 'Article + Noun + Verb + Preposition + Article + Noun',
    prompt: 'Where did the dog run?',
    sentenceType: 'statement',
    grammarFocus: ['past-tense', 'prepositions'],
    skillIds: [...BASE_SKILLS, 'preposition-use', 'verb-tense'],
    prerequisiteIds: ['s37'],
    difficulty: 'secure',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['animals', 'location', 'past'],
  },

  {
    id: 's39',
    text: 'the bird sat on the tree',
    level: 4,
    pattern: 'Article + Noun + Verb + Preposition + Article + Noun',
    prompt: 'Where did the bird sit?',
    sentenceType: 'statement',
    grammarFocus: ['past-tense', 'prepositions'],
    skillIds: [...BASE_SKILLS, 'preposition-use', 'verb-tense'],
    prerequisiteIds: ['s37'],
    difficulty: 'secure',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['animals', 'nature', 'location'],
  },

  {
    id: 's40',
    text: 'my dad cooks good food',
    level: 4,
    pattern: 'Possessive + Noun + Verb + Adjective + Noun',
    prompt: 'Who cooks good food?',
    sentenceType: 'statement',
    grammarFocus: ['simple-present', 'possessives', 'adjectives'],
    skillIds: [...BASE_SKILLS, 'possessive-use', 'adjective-use'],
    prerequisiteIds: ['s26', 's27'],
    difficulty: 'secure',
    isFoundational: false,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['family', 'food'],
  },

  {
    id: 's41',
    text: 'my mom reads a book',
    level: 4,
    pattern: 'Possessive + Noun + Verb + Article + Noun',
    prompt: 'What does mom do?',
    sentenceType: 'statement',
    grammarFocus: ['simple-present', 'possessives', 'articles'],
    skillIds: [...BASE_SKILLS, 'possessive-use', 'article-use'],
    prerequisiteIds: ['s40'],
    difficulty: 'secure',
    isFoundational: false,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['family', 'reading'],
  },

  {
    id: 's42',
    text: 'the fish swims in water',
    level: 4,
    pattern: 'Article + Noun + Verb + Preposition + Noun',
    prompt: 'Where does the fish swim?',
    sentenceType: 'statement',
    grammarFocus: ['simple-present', 'prepositions'],
    skillIds: [...BASE_SKILLS, 'preposition-use', 'verb-tense'],
    prerequisiteIds: ['s29', 's24'],
    difficulty: 'secure',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['animals', 'water', 'location'],
  },

  {
    id: 's43',
    text: 'the kids play in the sand',
    level: 4,
    pattern: 'Article + Noun + Verb + Preposition + Article + Noun',
    prompt: 'Where do the kids play?',
    sentenceType: 'statement',
    grammarFocus: ['simple-present', 'prepositions'],
    skillIds: [...BASE_SKILLS, 'preposition-use'],
    prerequisiteIds: ['s29'],
    difficulty: 'secure',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['play', 'location'],
  },

  {
    id: 's44',
    text: 'i go to the market',
    level: 4,
    pattern: 'Subject + Verb + Preposition + Article + Noun',
    prompt: 'Where do you go?',
    sentenceType: 'statement',
    grammarFocus: ['simple-present', 'prepositions', 'articles'],
    skillIds: [...BASE_SKILLS, 'preposition-use', 'article-use'],
    prerequisiteIds: ['s29'],
    difficulty: 'secure',
    isFoundational: false,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['places', 'community'],
  },

  {
    id: 's45',
    text: 'he rides his bike',
    level: 4,
    pattern: 'Subject + Verb + Possessive + Noun',
    prompt: 'What does he ride?',
    sentenceType: 'statement',
    grammarFocus: ['simple-present', 'possessives'],
    skillIds: [...BASE_SKILLS, 'possessive-use'],
    prerequisiteIds: ['s40'],
    difficulty: 'secure',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['transport', 'actions'],
  },

  {
    id: 's46',
    text: 'she wears a red dress',
    level: 4,
    pattern: 'Subject + Verb + Article + Adjective + Noun',
    prompt: 'What does she wear?',
    sentenceType: 'description',
    grammarFocus: ['simple-present', 'articles', 'adjectives'],
    skillIds: [...BASE_SKILLS, 'article-use', 'adjective-use'],
    prerequisiteIds: ['s27'],
    difficulty: 'secure',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['clothing', 'colors'],
  },

  {
    id: 's47',
    text: 'i like to read books',
    level: 4,
    pattern: 'Subject + Verb + Infinitive + Verb + Noun',
    prompt: 'What do you like to do?',
    sentenceType: 'statement',
    grammarFocus: ['infinitives'],
    skillIds: [...BASE_SKILLS, 'oral-expression', 'written-expression'],
    prerequisiteIds: ['s10'],
    difficulty: 'secure',
    isFoundational: false,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['reading', 'preferences'],
  },

  {
    id: 's48',
    text: 'we love to play outside',
    level: 4,
    pattern: 'Subject + Verb + Infinitive + Verb + Adverb',
    prompt: 'What do you love to do?',
    sentenceType: 'statement',
    grammarFocus: ['infinitives', 'adverbs'],
    skillIds: [...BASE_SKILLS, 'oral-expression'],
    prerequisiteIds: ['s47'],
    difficulty: 'secure',
    isFoundational: false,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['play', 'preferences'],
  },

  {
    id: 's49',
    text: 'the little cat is small',
    level: 4,
    pattern: 'Article + Adjective + Noun + Linking Verb + Adjective',
    prompt: 'Describe the cat.',
    sentenceType: 'description',
    grammarFocus: ['adjectives'],
    skillIds: [...BASE_SKILLS, 'adjective-use', 'sentence-expansion'],
    prerequisiteIds: ['s22', 's26'],
    difficulty: 'secure',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['animals', 'description'],
  },

  {
    id: 's50',
    text: 'the big dog is brown',
    level: 4,
    pattern: 'Article + Adjective + Noun + Linking Verb + Adjective',
    prompt: 'Describe the dog.',
    sentenceType: 'description',
    grammarFocus: ['adjectives'],
    skillIds: [...BASE_SKILLS, 'adjective-use', 'sentence-expansion'],
    prerequisiteIds: ['s49'],
    difficulty: 'secure',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['animals', 'colors', 'description'],
  },

  // ---------------------------------------------------------------------------
  // LEVEL 5 — PROGRESSIVE ACTIONS AND RICHER DESCRIPTION
  // ---------------------------------------------------------------------------

  {
    id: 's51',
    text: 'i am reading a funny book',
    level: 5,
    pattern: 'Subject + Auxiliary + Present Participle + Article + Adjective + Noun',
    prompt: 'What are you doing?',
    sentenceType: 'statement',
    grammarFocus: ['present-progressive', 'articles', 'adjectives'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'adjective-use', 'sentence-expansion'],
    prerequisiteIds: ['s47'],
    difficulty: 'advanced',
    isFoundational: false,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['reading', 'present-progressive'],
  },

  {
    id: 's52',
    text: 'she is eating a red apple',
    level: 5,
    pattern: 'Subject + Auxiliary + Present Participle + Article + Adjective + Noun',
    prompt: 'What is she doing?',
    sentenceType: 'statement',
    grammarFocus: ['present-progressive', 'articles', 'adjectives'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'adjective-use'],
    prerequisiteIds: ['s51'],
    difficulty: 'advanced',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['food', 'present-progressive'],
  },

  {
    id: 's53',
    text: 'he is playing with his toys',
    level: 5,
    pattern: 'Subject + Auxiliary + Present Participle + Preposition + Possessive + Noun',
    prompt: 'What is he doing?',
    sentenceType: 'statement',
    grammarFocus: ['present-progressive', 'prepositions', 'possessives'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'preposition-use', 'possessive-use'],
    prerequisiteIds: ['s51', 's45'],
    difficulty: 'advanced',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['play', 'present-progressive'],
  },

  {
    id: 's54',
    text: 'we are going to the zoo',
    level: 5,
    pattern: 'Subject + Auxiliary + Present Participle + Preposition + Article + Noun',
    prompt: 'Where are you going?',
    sentenceType: 'statement',
    grammarFocus: ['present-progressive', 'prepositions'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'preposition-use'],
    prerequisiteIds: ['s51', 's44'],
    difficulty: 'advanced',
    isFoundational: false,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['places', 'animals', 'movement'],
  },

  {
    id: 's55',
    text: 'they are riding a yellow bus',
    level: 5,
    pattern: 'Subject + Auxiliary + Present Participle + Article + Adjective + Noun',
    prompt: 'What are they riding?',
    sentenceType: 'statement',
    grammarFocus: ['present-progressive', 'articles', 'adjectives'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'article-use', 'adjective-use'],
    prerequisiteIds: ['s52'],
    difficulty: 'advanced',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['transport', 'colors'],
  },

  {
    id: 's56',
    text: 'the sun is shining very brightly',
    level: 5,
    pattern: 'Article + Noun + Auxiliary + Present Participle + Adverb',
    prompt: 'Describe the sun.',
    sentenceType: 'description',
    grammarFocus: ['present-progressive', 'adverbs'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'sentence-expansion'],
    prerequisiteIds: ['s51'],
    difficulty: 'advanced',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['nature', 'weather', 'description'],
  },

  {
    id: 's57',
    text: 'i have a very big dog',
    level: 5,
    pattern: 'Subject + Verb + Article + Adverb + Adjective + Noun',
    prompt: 'Describe your dog.',
    sentenceType: 'description',
    grammarFocus: ['simple-present', 'adjectives', 'adverbs'],
    skillIds: [...BASE_SKILLS, 'adjective-use', 'sentence-expansion'],
    prerequisiteIds: ['s15', 's49'],
    difficulty: 'advanced',
    isFoundational: false,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['animals', 'description'],
  },

  {
    id: 's58',
    text: 'she has a beautiful doll',
    level: 5,
    pattern: 'Subject + Verb + Article + Adjective + Noun',
    prompt: 'What does she have?',
    sentenceType: 'description',
    grammarFocus: ['simple-present', 'adjectives'],
    skillIds: [...BASE_SKILLS, 'adjective-use'],
    prerequisiteIds: ['s27'],
    difficulty: 'advanced',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['toys', 'description'],
  },

  {
    id: 's59',
    text: 'the little boy is very happy',
    level: 5,
    pattern: 'Article + Adjective + Noun + Linking Verb + Adverb + Adjective',
    prompt: 'How is the boy?',
    sentenceType: 'description',
    grammarFocus: ['adjectives', 'adverbs'],
    skillIds: [...BASE_SKILLS, 'adjective-use', 'sentence-expansion'],
    prerequisiteIds: ['s49', 's57'],
    difficulty: 'advanced',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['feelings', 'description'],
  },

  {
    id: 's60',
    text: 'my sister can sing very well',
    level: 5,
    pattern: 'Possessive + Noun + Modal + Verb + Adverb + Adverb',
    prompt: 'What can your sister do?',
    sentenceType: 'statement',
    grammarFocus: ['modal-verbs', 'possessives', 'adverbs'],
    skillIds: [...BASE_SKILLS, 'possessive-use', 'sentence-expansion'],
    prerequisiteIds: ['s17', 's40'],
    difficulty: 'advanced',
    isFoundational: false,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['family', 'abilities'],
  },

  {
    id: 's61',
    text: 'the man is walking to the shop',
    level: 5,
    pattern: 'Article + Noun + Auxiliary + Present Participle + Preposition + Article + Noun',
    prompt: 'Where is the man going?',
    sentenceType: 'statement',
    grammarFocus: ['present-progressive', 'prepositions'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'preposition-use'],
    prerequisiteIds: ['s54'],
    difficulty: 'advanced',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['movement', 'places'],
  },

  {
    id: 's62',
    text: 'the lady is cooking some rice',
    level: 5,
    pattern: 'Article + Noun + Auxiliary + Present Participle + Quantifier + Noun',
    prompt: 'What is the lady doing?',
    sentenceType: 'statement',
    grammarFocus: ['present-progressive'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'sentence-expansion'],
    prerequisiteIds: ['s51'],
    difficulty: 'advanced',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['food', 'actions'],
  },

  {
    id: 's63',
    text: 'i want to go to the beach',
    level: 5,
    pattern: 'Subject + Verb + Infinitive + Verb + Preposition + Article + Noun',
    prompt: 'Where do you want to go?',
    sentenceType: 'statement',
    grammarFocus: ['infinitives', 'prepositions'],
    skillIds: [...BASE_SKILLS, 'oral-expression', 'written-expression'],
    prerequisiteIds: ['s47', 's44'],
    difficulty: 'advanced',
    isFoundational: false,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['preferences', 'places'],
  },

  {
    id: 's64',
    text: 'he likes to play with his friends',
    level: 5,
    pattern: 'Subject + Verb + Infinitive + Verb + Preposition + Possessive + Noun',
    prompt: 'What does he like to do?',
    sentenceType: 'statement',
    grammarFocus: ['infinitives', 'prepositions', 'possessives'],
    skillIds: [...BASE_SKILLS, 'possessive-use', 'oral-expression'],
    prerequisiteIds: ['s53', 's63'],
    difficulty: 'advanced',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['play', 'friendship'],
  },

  // ---------------------------------------------------------------------------
  // LEVEL 6 — COMPLEX EXPANSION
  // ---------------------------------------------------------------------------

  {
    id: 's65',
    text: 'the little girl is playing in the garden',
    level: 6,
    pattern: 'Article + Adjective + Noun + Auxiliary + Verb + Preposition + Article + Noun',
    prompt: 'What is the girl doing?',
    sentenceType: 'statement',
    grammarFocus: ['present-progressive', 'prepositions', 'adjectives'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'sentence-expansion'],
    prerequisiteIds: ['s53', 's49'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['play', 'garden', 'description'],
  },

  {
    id: 's66',
    text: 'my father drives to work every morning',
    level: 6,
    pattern: 'Possessive + Noun + Verb + Preposition + Noun + Adverbial Phrase',
    prompt: 'What does dad do?',
    sentenceType: 'statement',
    grammarFocus: ['simple-present', 'possessives', 'sequencing'],
    skillIds: [...BASE_SKILLS, 'possessive-use', 'sentence-expansion'],
    prerequisiteIds: ['s40', 's44'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['family', 'routine'],
  },

  {
    id: 's67',
    text: 'we went to the market to buy fruits',
    level: 6,
    pattern: 'Subject + Past Verb + Preposition + Article + Noun + Infinitive Phrase',
    prompt: 'Why did you go to the market?',
    sentenceType: 'reasoning',
    grammarFocus: ['past-tense', 'infinitives', 'prepositions'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'sentence-expansion', 'oral-expression'],
    prerequisiteIds: ['s63', 's44'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['community', 'shopping', 'purpose'],
  },

  {
    id: 's68',
    text: 'the big brown dog barked at the cat',
    level: 6,
    pattern: 'Article + Adjective + Adjective + Noun + Verb + Preposition + Article + Noun',
    prompt: 'What did the dog do?',
    sentenceType: 'narrative',
    grammarFocus: ['past-tense', 'adjectives', 'prepositions'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'adjective-use', 'preposition-use'],
    prerequisiteIds: ['s37', 's50'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['animals', 'past', 'description'],
  },

  {
    id: 's69',
    text: 'i can see the moon and the stars',
    level: 6,
    pattern: 'Subject + Modal + Verb + Object + Conjunction + Object',
    prompt: 'What do you see in the sky?',
    sentenceType: 'statement',
    grammarFocus: ['modal-verbs', 'conjunctions'],
    skillIds: [...BASE_SKILLS, 'conjunction-use', 'compound-sentences'],
    prerequisiteIds: ['s31', 's32'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['nature', 'night', 'compound'],
  },

  {
    id: 's70',
    text: 'she is wearing a very pretty red dress',
    level: 6,
    pattern: 'Subject + Auxiliary + Verb + Article + Adverb + Adjective + Adjective + Noun',
    prompt: 'What is she wearing?',
    sentenceType: 'description',
    grammarFocus: ['present-progressive', 'adjectives', 'adverbs'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'adjective-use', 'sentence-expansion'],
    prerequisiteIds: ['s46', 's51'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['clothing', 'colors', 'description'],
  },

  {
    id: 's71',
    text: 'the children are laughing at the funny clown',
    level: 6,
    pattern: 'Article + Noun + Auxiliary + Verb + Preposition + Article + Adjective + Noun',
    prompt: 'Why are the children laughing?',
    sentenceType: 'statement',
    grammarFocus: ['present-progressive', 'prepositions', 'adjectives'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'preposition-use', 'adjective-use'],
    prerequisiteIds: ['s65', 's59'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['feelings', 'actions'],
  },

  {
    id: 's72',
    text: 'my mom is making a delicious chocolate cake',
    level: 6,
    pattern: 'Possessive + Noun + Auxiliary + Verb + Article + Adjective + Adjective + Noun',
    prompt: 'What is mom making?',
    sentenceType: 'statement',
    grammarFocus: ['present-progressive', 'possessives', 'adjectives'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'possessive-use', 'adjective-use'],
    prerequisiteIds: ['s51', 's40'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['family', 'food'],
  },

  {
    id: 's73',
    text: 'the little bird flew over the tall tree',
    level: 6,
    pattern: 'Article + Adjective + Noun + Past Verb + Preposition + Article + Adjective + Noun',
    prompt: 'Where did the bird fly?',
    sentenceType: 'narrative',
    grammarFocus: ['past-tense', 'prepositions', 'adjectives'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'preposition-use', 'adjective-use'],
    prerequisiteIds: ['s68', 's49'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['animals', 'nature', 'movement'],
  },

  {
    id: 's74',
    text: 'i put my toys in the big red box',
    level: 6,
    pattern: 'Subject + Verb + Possessive + Noun + Preposition + Article + Adjective + Adjective + Noun',
    prompt: 'Where did you put your toys?',
    sentenceType: 'statement',
    grammarFocus: ['past-tense', 'possessives', 'prepositions', 'adjectives'],
    skillIds: [...BASE_SKILLS, 'possessive-use', 'preposition-use', 'sentence-expansion'],
    prerequisiteIds: ['s45', 's50'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['toys', 'location', 'colors'],
  },

  {
    id: 's75',
    text: 'they are running to the park very fast',
    level: 6,
    pattern: 'Subject + Auxiliary + Verb + Preposition + Article + Noun + Adverb',
    prompt: 'How fast are they running?',
    sentenceType: 'statement',
    grammarFocus: ['present-progressive', 'prepositions', 'adverbs'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'preposition-use', 'sentence-expansion'],
    prerequisiteIds: ['s61', 's21'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['movement', 'speed'],
  },

  {
    id: 's76',
    text: 'the students listen to the teacher in class',
    level: 6,
    pattern: 'Article + Noun + Verb + Preposition + Article + Noun + Preposition + Noun',
    prompt: 'What do students do in class?',
    sentenceType: 'statement',
    grammarFocus: ['simple-present', 'prepositions'],
    skillIds: [...BASE_SKILLS, 'preposition-use', 'oral-expression'],
    prerequisiteIds: ['s42', 's29'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['school', 'classroom'],
  },

  // ---------------------------------------------------------------------------
  // LEVEL 7 — ADVANCED LANGUAGE PRODUCTION
  // ---------------------------------------------------------------------------

  {
    id: 's77',
    text: 'the red car drives down the busy street',
    level: 7,
    pattern: 'Article + Adjective + Noun + Verb + Preposition + Article + Adjective + Noun',
    prompt: 'What is happening?',
    sentenceType: 'description',
    grammarFocus: ['simple-present', 'adjectives', 'prepositions'],
    skillIds: [...BASE_SKILLS, 'adjective-use', 'preposition-use', 'sentence-expansion'],
    prerequisiteIds: ['s68', 's50'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['transport', 'community', 'description'],
  },

  {
    id: 's78',
    text: 'i have a very big and fluffy dog',
    level: 7,
    pattern: 'Subject + Verb + Article + Adverb + Adjective + Conjunction + Adjective + Noun',
    prompt: 'Describe your dog.',
    sentenceType: 'description',
    grammarFocus: ['adjectives', 'adverbs', 'conjunctions'],
    skillIds: [...BASE_SKILLS, 'adjective-use', 'conjunction-use', 'sentence-expansion'],
    prerequisiteIds: ['s57', 's69'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['animals', 'description', 'compound'],
  },

  {
    id: 's79',
    text: 'the beautiful flowers bloom in the spring',
    level: 7,
    pattern: 'Article + Adjective + Noun + Verb + Preposition + Article + Noun',
    prompt: 'When do flowers bloom?',
    sentenceType: 'description',
    grammarFocus: ['simple-present', 'adjectives', 'prepositions'],
    skillIds: [...BASE_SKILLS, 'adjective-use', 'preposition-use'],
    prerequisiteIds: ['s77'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['nature', 'seasons'],
  },

  {
    id: 's80',
    text: 'we take a bus to school every day',
    level: 7,
    pattern: 'Subject + Verb + Article + Noun + Preposition + Noun + Adverbial Phrase',
    prompt: 'How do you go to school?',
    sentenceType: 'statement',
    grammarFocus: ['simple-present', 'prepositions', 'sequencing'],
    skillIds: [...BASE_SKILLS, 'preposition-use', 'sentence-expansion'],
    prerequisiteIds: ['s66', 's29'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['school', 'transport', 'routine'],
  },

  {
    id: 's81',
    text: 'the moon shines brightly in the night sky',
    level: 7,
    pattern: 'Article + Noun + Verb + Adverb + Preposition + Article + Adjective + Noun',
    prompt: 'What happens at night?',
    sentenceType: 'description',
    grammarFocus: ['simple-present', 'adverbs', 'prepositions'],
    skillIds: [...BASE_SKILLS, 'sentence-expansion', 'adverb-use'],
    prerequisiteIds: ['s56', 's77'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['nature', 'night'],
  },

  {
    id: 's82',
    text: 'my brother and i love to play video games',
    level: 7,
    pattern: 'Possessive + Noun + Conjunction + Subject + Verb + Infinitive + Verb + Noun',
    prompt: 'What do you love to do?',
    sentenceType: 'statement',
    grammarFocus: ['conjunctions', 'infinitives', 'possessives'],
    skillIds: [...BASE_SKILLS, 'conjunction-use', 'possessive-use', 'sentence-expansion'],
    prerequisiteIds: ['s64', 's69'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['family', 'preferences', 'compound'],
  },

  {
    id: 's83',
    text: 'the little boy was playing in the sandbox',
    level: 7,
    pattern: 'Article + Adjective + Noun + Past Auxiliary + Present Participle + Preposition + Article + Noun',
    prompt: 'What was the boy doing?',
    sentenceType: 'narrative',
    grammarFocus: ['past-tense', 'present-progressive', 'prepositions'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'preposition-use'],
    prerequisiteIds: ['s65', 's73'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['play', 'past', 'narrative'],
  },

  {
    id: 's84',
    text: 'i want to be a doctor when i grow up',
    level: 7,
    pattern: 'Subject + Verb + Infinitive + Verb + Article + Noun + Time Clause',
    prompt: 'What do you want to be?',
    sentenceType: 'reasoning',
    grammarFocus: ['infinitives', 'future-intention', 'complex-sentences'],
    skillIds: [...BASE_SKILLS, 'complex-sentences', 'oral-expression', 'written-expression'],
    prerequisiteIds: ['s63', 's80'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['future', 'careers', 'aspiration'],
  },

  {
    id: 's85',
    text: 'the cat was sleeping on the warm soft blanket',
    level: 7,
    pattern: 'Article + Noun + Past Auxiliary + Present Participle + Preposition + Article + Adjective + Adjective + Noun',
    prompt: 'Where was the cat?',
    sentenceType: 'narrative',
    grammarFocus: ['past-tense', 'adjectives', 'prepositions'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'adjective-use', 'sentence-expansion'],
    prerequisiteIds: ['s83', 's50'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['animals', 'narrative'],
  },

  {
    id: 's86',
    text: 'she gave her friend a beautiful gift',
    level: 7,
    pattern: 'Subject + Verb + Possessive + Noun + Article + Adjective + Noun',
    prompt: 'What did she give?',
    sentenceType: 'narrative',
    grammarFocus: ['past-tense', 'possessives', 'adjectives'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'possessive-use', 'adjective-use'],
    prerequisiteIds: ['s68', 's58'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['friendship', 'gifts', 'past'],
  },

  {
    id: 's87',
    text: 'the heavy rain fell on the dry dusty ground',
    level: 7,
    pattern: 'Article + Adjective + Noun + Verb + Preposition + Article + Adjective + Adjective + Noun',
    prompt: 'What happened after the rain?',
    sentenceType: 'narrative',
    grammarFocus: ['past-tense', 'adjectives', 'prepositions'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'adjective-use', 'sentence-expansion'],
    prerequisiteIds: ['s68', 's79'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['weather', 'nature', 'narrative'],
  },

  {
    id: 's88',
    text: 'we are going to see a movie at the cinema',
    level: 7,
    pattern: 'Subject + Auxiliary + Verb + Infinitive + Verb + Article + Noun + Preposition + Article + Noun',
    prompt: 'What are you going to do?',
    sentenceType: 'statement',
    grammarFocus: ['present-progressive', 'infinitives', 'prepositions'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'preposition-use', 'sentence-expansion'],
    prerequisiteIds: ['s54', 's63'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['plans', 'entertainment', 'places'],
  },

  {
    id: 's89',
    text: 'the kind teacher helped the students with their work',
    level: 7,
    pattern: 'Article + Adjective + Noun + Verb + Article + Noun + Preposition + Possessive + Noun',
    prompt: 'What did the teacher do?',
    sentenceType: 'statement',
    grammarFocus: ['past-tense', 'adjectives', 'possessives', 'prepositions'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'adjective-use', 'possessive-use'],
    prerequisiteIds: ['s86', 's76'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['school', 'helping'],
  },

  {
    id: 's90',
    text: 'my grandma tells us stories about the old days',
    level: 7,
    pattern: 'Possessive + Noun + Verb + Pronoun + Noun + Preposition + Article + Adjective + Noun',
    prompt: 'What does grandma do?',
    sentenceType: 'narrative',
    grammarFocus: ['simple-present', 'possessives', 'prepositions'],
    skillIds: [...BASE_SKILLS, 'possessive-use', 'sentence-expansion'],
    prerequisiteIds: ['s76', 's86'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['family', 'stories', 'memory'],
  },

  {
    id: 's91',
    text: 'the little boy cleaned his room all by himself',
    level: 7,
    pattern: 'Article + Adjective + Noun + Verb + Possessive + Noun + Adverbial Phrase + Reflexive',
    prompt: 'Who cleaned the room?',
    sentenceType: 'statement',
    grammarFocus: ['past-tense', 'possessives', 'reflexive-pronouns'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'possessive-use'],
    prerequisiteIds: ['s83', 's86'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['independence', 'home'],
  },

  {
    id: 's92',
    text: 'i am very excited about the school trip tomorrow',
    level: 7,
    pattern: 'Subject + Auxiliary + Adverb + Adjective + Preposition + Article + Noun + Noun',
    prompt: 'How do you feel?',
    sentenceType: 'statement',
    grammarFocus: ['adjectives', 'adverbs', 'prepositions'],
    skillIds: [...BASE_SKILLS, 'adjective-use', 'sentence-expansion', 'oral-expression'],
    prerequisiteIds: ['s59', 's80'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['feelings', 'school', 'future'],
  },

  {
    id: 's93',
    text: 'she is learning to play the piano very well',
    level: 7,
    pattern: 'Subject + Auxiliary + Verb + Infinitive + Verb + Article + Noun + Adverb',
    prompt: 'What is she learning?',
    sentenceType: 'statement',
    grammarFocus: ['present-progressive', 'infinitives', 'adverbs'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'sentence-expansion'],
    prerequisiteIds: ['s51', 's64'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['learning', 'music'],
  },

  {
    id: 's94',
    text: 'we should always say please and thank you',
    level: 7,
    pattern: 'Subject + Modal + Adverb + Verb + Object + Conjunction + Object',
    prompt: 'What should we always do?',
    sentenceType: 'command',
    grammarFocus: ['modal-verbs', 'adverbs', 'conjunctions'],
    skillIds: [...BASE_SKILLS, 'conjunction-use', 'oral-expression'],
    prerequisiteIds: ['s69', 's78'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['manners', 'values', 'compound'],
  },

  {
    id: 's95',
    text: 'the hungry baby cried for his milk bottle',
    level: 7,
    pattern: 'Article + Adjective + Noun + Verb + Preposition + Possessive + Noun + Noun',
    prompt: 'Why did the baby cry?',
    sentenceType: 'narrative',
    grammarFocus: ['past-tense', 'adjectives', 'possessives', 'prepositions'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'adjective-use', 'possessive-use'],
    prerequisiteIds: ['s86', 's57'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['family', 'food', 'feelings'],
  },

  {
    id: 's96',
    text: 'my dad is fixing the old car in the garage',
    level: 7,
    pattern: 'Possessive + Noun + Auxiliary + Verb + Article + Adjective + Noun + Preposition + Article + Noun',
    prompt: 'What is dad doing?',
    sentenceType: 'statement',
    grammarFocus: ['present-progressive', 'possessives', 'adjectives', 'prepositions'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'possessive-use', 'sentence-expansion'],
    prerequisiteIds: ['s61', 's40'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['family', 'transport', 'home'],
  },

  {
    id: 's97',
    text: 'the children are building a tall sandcastle on the beach',
    level: 7,
    pattern: 'Article + Noun + Auxiliary + Verb + Article + Adjective + Noun + Preposition + Article + Noun',
    prompt: 'What are the children building?',
    sentenceType: 'statement',
    grammarFocus: ['present-progressive', 'adjectives', 'prepositions'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'adjective-use', 'preposition-use'],
    prerequisiteIds: ['s65', 's73'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['beach', 'building', 'creativity'],
  },

  {
    id: 's98',
    text: 'i like to read books about animals and nature',
    level: 7,
    pattern: 'Subject + Verb + Infinitive + Verb + Noun + Preposition + Noun + Conjunction + Noun',
    prompt: 'What do you like to read?',
    sentenceType: 'statement',
    grammarFocus: ['infinitives', 'prepositions', 'conjunctions'],
    skillIds: [...BASE_SKILLS, 'conjunction-use', 'oral-expression', 'written-expression'],
    prerequisiteIds: ['s47', 's69'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['reading', 'animals', 'nature', 'compound'],
  },

  {
    id: 's99',
    text: 'the little girl is drawing a colorful picture',
    level: 7,
    pattern: 'Article + Adjective + Noun + Auxiliary + Verb + Article + Adjective + Noun',
    prompt: 'What is the girl doing?',
    sentenceType: 'statement',
    grammarFocus: ['present-progressive', 'adjectives'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'adjective-use', 'sentence-expansion'],
    prerequisiteIds: ['s65', 's70'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: false,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['art', 'creativity'],
  },

  {
    id: 's100',
    text: 'we are having a wonderful time at the party',
    level: 7,
    pattern: 'Subject + Auxiliary + Verb + Article + Adjective + Noun + Preposition + Article + Noun',
    prompt: 'How are you feeling?',
    sentenceType: 'statement',
    grammarFocus: ['present-progressive', 'adjectives', 'prepositions'],
    skillIds: [...BASE_SKILLS, 'verb-tense', 'adjective-use', 'oral-expression'],
    prerequisiteIds: ['s92', 's97'],
    difficulty: 'challenge',
    isFoundational: false,
    isPersonalizable: true,
    supportsSpeech: true,
    supportsWordBuilding: true,
    supportsWriting: true,
    tags: ['feelings', 'social', 'celebration'],
  },
] as const;

/**
 * Fast lookup map for curriculum/engine use.
 */
export const SENTENCE_BY_ID = new Map(
  SENTENCE_CURRICULUM.map((sentence) => [sentence.id, sentence]),
);

/**
 * Retrieve a sentence safely.
 */
export function getSentenceById(id: string): SentenceData | undefined {
  return SENTENCE_BY_ID.get(id);
}

/**
 * Get all sentences for a particular sentence-complexity level.
 */
export function getSentencesByLevel(level: SentenceLevel): readonly SentenceData[] {
  return SENTENCE_CURRICULUM.filter((sentence) => sentence.level === level);
}

/**
 * Get sentences belonging to a specific skill.
 */
export function getSentencesBySkill(
  skillId: SentenceSkill,
): readonly SentenceData[] {
  return SENTENCE_CURRICULUM.filter((sentence) =>
    sentence.skillIds.includes(skillId),
  );
}

/**
 * Get sentences that are appropriate for foundational review.
 */
export function getFoundationalSentences(): readonly SentenceData[] {
  return SENTENCE_CURRICULUM.filter((sentence) => sentence.isFoundational);
}

/**
 * Get sentences that support a particular learning activity.
 */
export function getActivitySentences(
  activity: 'speech' | 'word-building' | 'writing',
): readonly SentenceData[] {
  return SENTENCE_CURRICULUM.filter((sentence) => {
    switch (activity) {
      case 'speech':
        return sentence.supportsSpeech;

      case 'word-building':
        return sentence.supportsWordBuilding;

      case 'writing':
        return sentence.supportsWriting;
    }
  });
}