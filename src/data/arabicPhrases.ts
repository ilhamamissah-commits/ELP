export type ArabicPhraseDomain =
  | 'language'
  | 'literacy'
  | 'islamic'
  | 'general';

export type ArabicPhraseDifficulty =
  | 'foundational'
  | 'developing'
  | 'intermediate'
  | 'advanced';

export interface ArabicPhrase {
  id: string;

  /**
   * Full Arabic orthography with Harakat/Tashkeel.
   */
  arabic: string;

  /**
   * English meaning for parents/teachers.
   */
  meaning: string;

  /**
   * Optional visual cue.
   */
  emoji?: string;

  /**
   * Curriculum topic.
   */
  category: string;

  /**
   * ELP competency level, 1–5.
   */
  level: 1 | 2 | 3 | 4 | 5;

  domain: ArabicPhraseDomain;

  difficulty: ArabicPhraseDifficulty;

  /**
   * Skills demonstrated by the phrase.
   */
  skillIds: readonly string[];

  /**
   * Foundational content can be revisited at any level.
   */
  isFoundational: boolean;

  /**
   * Useful for adaptive selection.
   */
  isHighFrequency: boolean;
}

const createPhrase = (
  phrase: Omit<
    ArabicPhrase,
    | 'domain'
    | 'difficulty'
    | 'skillIds'
    | 'isFoundational'
    | 'isHighFrequency'
  > & {
    domain?: ArabicPhraseDomain;
    difficulty?: ArabicPhraseDifficulty;
    skillIds?: readonly string[];
    isFoundational?: boolean;
    isHighFrequency?: boolean;
  },
): ArabicPhrase => ({
  ...phrase,
  domain: phrase.domain ?? 'language',
  difficulty:
    phrase.difficulty ??
    (phrase.level === 1
      ? 'foundational'
      : phrase.level === 2
        ? 'developing'
        : phrase.level === 3
          ? 'intermediate'
          : 'advanced'),
  skillIds: phrase.skillIds ?? ['arabic-sentence-comprehension'],
  isFoundational:
    phrase.isFoundational ?? phrase.level <= 2,
  isHighFrequency:
    phrase.isHighFrequency ?? phrase.level <= 2,
});

export const ARABIC_PHRASES: readonly ArabicPhrase[] = [
  // ---------------------------------------------------------
  // GREETINGS & BASICS
  // ---------------------------------------------------------

  createPhrase({
    id: 'p1',
    arabic: 'السَّلَامُ عَلَيْكُمْ',
    meaning: 'Peace be upon you',
    emoji: '👋',
    category: 'Greetings',
    level: 1,
    domain: 'islamic',
    skillIds: ['greetings', 'islamic-expressions'],
  }),

  createPhrase({
    id: 'p2',
    arabic: 'وَعَلَيْكُمُ السَّلَامُ',
    meaning: 'And peace be upon you too',
    emoji: '🤝',
    category: 'Greetings',
    level: 1,
    domain: 'islamic',
    skillIds: ['greetings', 'islamic-expressions'],
  }),

  createPhrase({
    id: 'p3',
    arabic: 'مَرْحَبًا',
    meaning: 'Hello',
    emoji: '👋',
    category: 'Greetings',
    level: 1,
    skillIds: ['greetings'],
  }),

  createPhrase({
    id: 'p4',
    arabic: 'مَعَ السَّلَامَةِ',
    meaning: 'Goodbye',
    emoji: '🚪',
    category: 'Greetings',
    level: 1,
    skillIds: ['greetings', 'everyday-expressions'],
  }),

  createPhrase({
    id: 'p5',
    arabic: 'كَيْفَ حَالُكَ؟',
    meaning: 'How are you?',
    emoji: '🤔',
    category: 'Greetings',
    level: 1,
    skillIds: ['greetings', 'questions'],
  }),

  createPhrase({
    id: 'p6',
    arabic: 'أَنَا بِخَيْرٍ',
    meaning: 'I am fine',
    emoji: '😊',
    category: 'Greetings',
    level: 1,
    skillIds: ['self-expression', 'everyday-expressions'],
  }),

  createPhrase({
    id: 'p7',
    arabic: 'شُكْرًا',
    meaning: 'Thank you',
    emoji: '🙏',
    category: 'Polite',
    level: 1,
    skillIds: ['polite-language', 'everyday-expressions'],
  }),

  createPhrase({
    id: 'p8',
    arabic: 'عَفْوًا',
    meaning: 'You are welcome',
    emoji: '😊',
    category: 'Polite',
    level: 1,
    skillIds: ['polite-language', 'everyday-expressions'],
  }),

  createPhrase({
    id: 'p9',
    arabic: 'مِنْ فَضْلِكَ',
    meaning: 'Please',
    emoji: '🙏',
    category: 'Polite',
    level: 1,
    skillIds: ['polite-language', 'everyday-expressions'],
  }),

  createPhrase({
    id: 'p10',
    arabic: 'نَعَمْ',
    meaning: 'Yes',
    emoji: '👍',
    category: 'Basics',
    level: 1,
    skillIds: ['everyday-expressions'],
  }),

  // ---------------------------------------------------------
  // QUESTIONS & SIMPLE SENTENCES
  // ---------------------------------------------------------

  createPhrase({
    id: 'p11',
    arabic: 'لَا',
    meaning: 'No',
    emoji: '👎',
    category: 'Basics',
    level: 1,
    skillIds: ['everyday-expressions'],
  }),

  createPhrase({
    id: 'p12',
    arabic: 'مَاذَا؟',
    meaning: 'What?',
    emoji: '❓',
    category: 'Questions',
    level: 1,
    skillIds: ['question-words'],
  }),

  createPhrase({
    id: 'p13',
    arabic: 'مَنْ؟',
    meaning: 'Who?',
    emoji: '🤷',
    category: 'Questions',
    level: 1,
    skillIds: ['question-words'],
  }),

  createPhrase({
    id: 'p14',
    arabic: 'أَيْنَ؟',
    meaning: 'Where?',
    emoji: '📍',
    category: 'Questions',
    level: 1,
    skillIds: ['question-words'],
  }),

  createPhrase({
    id: 'p15',
    arabic: 'مَتَى؟',
    meaning: 'When?',
    emoji: '⏰',
    category: 'Questions',
    level: 1,
    skillIds: ['question-words'],
  }),

  createPhrase({
    id: 'p16',
    arabic: 'لِمَاذَا؟',
    meaning: 'Why?',
    emoji: '🤔',
    category: 'Questions',
    level: 2,
    skillIds: ['question-words', 'language-reasoning'],
  }),

  createPhrase({
    id: 'p17',
    arabic: 'هَذَا كِتَابٌ',
    meaning: 'This is a book',
    emoji: '📖',
    category: 'Simple Sentences',
    level: 2,
    skillIds: ['demonstratives', 'sentence-formation'],
  }),

  createPhrase({
    id: 'p18',
    arabic: 'هَذِهِ سَيَّارَةٌ',
    meaning: 'This is a car',
    emoji: '🚗',
    category: 'Simple Sentences',
    level: 2,
    skillIds: ['demonstratives', 'gender-agreement', 'sentence-formation'],
  }),

  createPhrase({
    id: 'p19',
    arabic: 'هَذَا بَيْتٌ',
    meaning: 'This is a house',
    emoji: '🏠',
    category: 'Simple Sentences',
    level: 2,
    skillIds: ['demonstratives', 'sentence-formation'],
  }),

  createPhrase({
    id: 'p20',
    arabic: 'هَذِهِ شَمْسٌ',
    meaning: 'This is a sun',
    emoji: '☀️',
    category: 'Simple Sentences',
    level: 2,
    skillIds: ['demonstratives', 'gender-agreement', 'sentence-formation'],
  }),

  // ---------------------------------------------------------
  // FAMILY & ME
  // ---------------------------------------------------------

  createPhrase({
    id: 'p21',
    arabic: 'هَذَا أَبِي',
    meaning: 'This is my father',
    emoji: '👨',
    category: 'Family',
    level: 2,
    skillIds: ['family-vocabulary', 'possessive-forms'],
  }),

  createPhrase({
    id: 'p22',
    arabic: 'هَذِهِ أُمِّي',
    meaning: 'This is my mother',
    emoji: '👩',
    category: 'Family',
    level: 2,
    skillIds: ['family-vocabulary', 'possessive-forms'],
  }),

  createPhrase({
    id: 'p23',
    arabic: 'هَذَا أَخِي',
    meaning: 'This is my brother',
    emoji: '👦',
    category: 'Family',
    level: 2,
    skillIds: ['family-vocabulary', 'possessive-forms'],
  }),

  createPhrase({
    id: 'p24',
    arabic: 'هَذِهِ أُخْتِي',
    meaning: 'This is my sister',
    emoji: '👧',
    category: 'Family',
    level: 2,
    skillIds: ['family-vocabulary', 'possessive-forms'],
  }),

  createPhrase({
    id: 'p25',
    arabic: 'أَنَا أُحِبُّ عَائِلَتِي',
    meaning: 'I love my family',
    emoji: '❤️',
    category: 'Family',
    level: 3,
    skillIds: ['family-vocabulary', 'sentence-formation', 'self-expression'],
  }),

  createPhrase({
    id: 'p26',
    arabic: 'أَنَا وَلَدٌ',
    meaning: 'I am a boy',
    emoji: '👦',
    category: 'About Me',
    level: 2,
    skillIds: ['self-expression', 'gender-agreement'],
  }),

  createPhrase({
    id: 'p27',
    arabic: 'أَنَا بِنْتٌ',
    meaning: 'I am a girl',
    emoji: '👧',
    category: 'About Me',
    level: 2,
    skillIds: ['self-expression', 'gender-agreement'],
  }),

  createPhrase({
    id: 'p28',
    arabic: 'اسْمِي مُحَمَّدٌ',
    meaning: 'My name is Muhammad',
    emoji: '📛',
    category: 'About Me',
    level: 2,
    skillIds: ['self-expression', 'personal-information'],
  }),

  createPhrase({
    id: 'p29',
    arabic: 'أَنَا عِنْدِي خَمْسُ سَنَوَاتٍ',
    meaning: 'I am five years old',
    emoji: '🎂',
    category: 'About Me',
    level: 3,
    skillIds: ['self-expression', 'age-expression', 'numbers'],
  }),

  createPhrase({
    id: 'p30',
    arabic: 'أَنَا مِنْ غَانَا',
    meaning: 'I am from Ghana',
    emoji: '🇬🇭',
    category: 'About Me',
    level: 3,
    skillIds: ['self-expression', 'places', 'personal-information'],
  }),

  // ---------------------------------------------------------
  // FOOD & DRINK
  // ---------------------------------------------------------

  createPhrase({
    id: 'p31',
    arabic: 'أَنَا جَائِعٌ',
    meaning: 'I am hungry',
    emoji: '🍽️',
    category: 'Food',
    level: 2,
    skillIds: ['food-vocabulary', 'self-expression'],
  }),

  createPhrase({
    id: 'p32',
    arabic: 'أَنَا عَطْشَانُ',
    meaning: 'I am thirsty',
    emoji: '🥤',
    category: 'Food',
    level: 2,
    skillIds: ['food-vocabulary', 'self-expression'],
  }),

  createPhrase({
    id: 'p33',
    arabic: 'أُرِيدُ مَاءً',
    meaning: 'I want water',
    emoji: '💧',
    category: 'Food',
    level: 2,
    skillIds: ['food-vocabulary', 'wants-and-needs'],
  }),

  createPhrase({
    id: 'p34',
    arabic: 'أُرِيدُ خُبْزًا',
    meaning: 'I want bread',
    emoji: '🍞',
    category: 'Food',
    level: 2,
    skillIds: ['food-vocabulary', 'wants-and-needs'],
  }),

  createPhrase({
    id: 'p35',
    arabic: 'أُرِيدُ تُفَّاحَةً',
    meaning: 'I want an apple',
    emoji: '🍎',
    category: 'Food',
    level: 2,
    skillIds: ['food-vocabulary', 'wants-and-needs'],
  }),

  createPhrase({
    id: 'p36',
    arabic: 'أَنَا آكُلُ الأَرُزَّ',
    meaning: 'I am eating rice',
    emoji: '🍚',
    category: 'Food',
    level: 3,
    skillIds: ['food-vocabulary', 'present-tense-verbs', 'sentence-formation'],
  }),

  createPhrase({
    id: 'p37',
    arabic: 'أَشْرَبُ الْحَلِيبَ',
    meaning: 'I am drinking milk',
    emoji: '🥛',
    category: 'Food',
    level: 3,
    skillIds: ['food-vocabulary', 'present-tense-verbs'],
  }),

  createPhrase({
    id: 'p38',
    arabic: 'الطَّعَامُ لَذِيذٌ',
    meaning: 'The food is delicious',
    emoji: '😋',
    category: 'Food',
    level: 3,
    skillIds: ['food-vocabulary', 'descriptive-language'],
  }),

  createPhrase({
    id: 'p39',
    arabic: 'أُحِبُّ الْفَوَاكِهَ',
    meaning: 'I love fruits',
    emoji: '🍓',
    category: 'Food',
    level: 3,
    skillIds: ['food-vocabulary', 'preferences'],
  }),

  createPhrase({
    id: 'p40',
    arabic: 'أُحِبُّ الْخُضْرَوَاتِ',
    meaning: 'I love vegetables',
    emoji: '🥦',
    category: 'Food',
    level: 3,
    skillIds: ['food-vocabulary', 'preferences'],
  }),

  // ---------------------------------------------------------
  // SCHOOL
  // ---------------------------------------------------------

  createPhrase({
    id: 'p41',
    arabic: 'أَنَا أَذْهَبُ إِلَى الْمَدْرَسَةِ',
    meaning: 'I go to school',
    emoji: '🏫',
    category: 'School',
    level: 3,
    skillIds: ['school-vocabulary', 'present-tense-verbs'],
  }),

  createPhrase({
    id: 'p42',
    arabic: 'هَذَا قَلَمٌ',
    meaning: 'This is a pen',
    emoji: '🖊️',
    category: 'School',
    level: 2,
    skillIds: ['school-vocabulary', 'demonstratives'],
  }),

  createPhrase({
    id: 'p43',
    arabic: 'هَذَا كِتَابٌ',
    meaning: 'This is a book',
    emoji: '📖',
    category: 'School',
    level: 2,
    skillIds: ['school-vocabulary', 'demonstratives'],
  }),

  createPhrase({
    id: 'p44',
    arabic: 'أَنَا أَقْرَأُ الْكِتَابَ',
    meaning: 'I am reading the book',
    emoji: '📖',
    category: 'School',
    level: 3,
    skillIds: ['school-vocabulary', 'reading', 'present-tense-verbs'],
  }),

  createPhrase({
    id: 'p45',
    arabic: 'أَنَا أَكْتُبُ بِالْقَلَمِ',
    meaning: 'I write with the pen',
    emoji: '✍️',
    category: 'School',
    level: 3,
    skillIds: ['school-vocabulary', 'writing', 'present-tense-verbs'],
  }),

  createPhrase({
    id: 'p46',
    arabic: 'الْمُعَلِّمُ طَيِّبٌ',
    meaning: 'The teacher is kind',
    emoji: '👨‍🏫',
    category: 'School',
    level: 3,
    skillIds: ['school-vocabulary', 'descriptive-language'],
  }),

  createPhrase({
    id: 'p47',
    arabic: 'أَنَا أَتَعَلَّمُ الْعَرَبِيَّةَ',
    meaning: 'I am learning Arabic',
    emoji: '📚',
    category: 'School',
    level: 3,
    skillIds: ['school-vocabulary', 'language-learning', 'present-tense-verbs'],
  }),

  createPhrase({
    id: 'p48',
    arabic: 'أَنَا أُحِبُّ الْمَدْرَسَةَ',
    meaning: 'I love school',
    emoji: '🏫',
    category: 'School',
    level: 3,
    skillIds: ['school-vocabulary', 'preferences'],
  }),

  createPhrase({
    id: 'p49',
    arabic: 'هَذَا دَرْسٌ سَهْلٌ',
    meaning: 'This lesson is easy',
    emoji: '📝',
    category: 'School',
    level: 3,
    skillIds: ['school-vocabulary', 'descriptive-language'],
  }),

  createPhrase({
    id: 'p50',
    arabic: 'أَنَا أَفْهَمُ الدَّرْسَ',
    meaning: 'I understand the lesson',
    emoji: '🧠',
    category: 'School',
    level: 4,
    skillIds: ['school-vocabulary', 'comprehension', 'present-tense-verbs'],
  }),

  // ---------------------------------------------------------
  // NATURE & ANIMALS
  // ---------------------------------------------------------

  createPhrase({
    id: 'p51',
    arabic: 'الشَّمْسُ مُشْرِقَةٌ',
    meaning: 'The sun is shining',
    emoji: '☀️',
    category: 'Nature',
    level: 3,
    skillIds: ['nature-vocabulary', 'descriptive-language'],
  }),

  createPhrase({
    id: 'p52',
    arabic: 'السَّمَاءُ زَرْقَاءُ',
    meaning: 'The sky is blue',
    emoji: '🌌',
    category: 'Nature',
    level: 3,
    skillIds: ['nature-vocabulary', 'colors', 'gender-agreement'],
  }),

  createPhrase({
    id: 'p53',
    arabic: 'الْمَطَرُ يَنْزِلُ',
    meaning: 'The rain is falling',
    emoji: '🌧️',
    category: 'Nature',
    level: 3,
    skillIds: ['nature-vocabulary', 'present-tense-verbs'],
  }),

  createPhrase({
    id: 'p54',
    arabic: 'أَنَا أَرَى شَجَرَةً',
    meaning: 'I see a tree',
    emoji: '🌳',
    category: 'Nature',
    level: 3,
    skillIds: ['nature-vocabulary', 'present-tense-verbs'],
  }),

  createPhrase({
    id: 'p55',
    arabic: 'أَنَا أَرَى زَهْرَةً',
    meaning: 'I see a flower',
    emoji: '🌸',
    category: 'Nature',
    level: 3,
    skillIds: ['nature-vocabulary', 'present-tense-verbs'],
  }),

  createPhrase({
    id: 'p56',
    arabic: 'هَذِهِ قِطَّةٌ جَمِيلَةٌ',
    meaning: 'This is a beautiful cat',
    emoji: '🐱',
    category: 'Animals',
    level: 3,
    skillIds: ['animal-vocabulary', 'descriptive-language', 'gender-agreement'],
  }),

  createPhrase({
    id: 'p57',
    arabic: 'الْكَلْبُ يَلْعَبُ',
    meaning: 'The dog is playing',
    emoji: '🐶',
    category: 'Animals',
    level: 3,
    skillIds: ['animal-vocabulary', 'present-tense-verbs'],
  }),

  createPhrase({
    id: 'p58',
    arabic: 'الْعُصْفُورُ يُغَرِّدُ',
    meaning: 'The bird is singing',
    emoji: '🐦',
    category: 'Animals',
    level: 3,
    skillIds: ['animal-vocabulary', 'present-tense-verbs'],
  }),

  createPhrase({
    id: 'p59',
    arabic: 'أَنَا أُحِبُّ الْحَيَوَانَاتِ',
    meaning: 'I love animals',
    emoji: '🐾',
    category: 'Animals',
    level: 3,
    skillIds: ['animal-vocabulary', 'preferences'],
  }),

  createPhrase({
    id: 'p60',
    arabic: 'الْأَسَدُ مَلِكُ الْغَابَةِ',
    meaning: 'The lion is the king of the jungle',
    emoji: '🦁',
    category: 'Animals',
    level: 4,
    skillIds: ['animal-vocabulary', 'descriptive-language', 'sentence-comprehension'],
  }),

  // ---------------------------------------------------------
  // COLOURS & SHAPES
  // ---------------------------------------------------------

  createPhrase({
    id: 'p61',
    arabic: 'هَذَا لَوْنٌ أَحْمَرُ',
    meaning: 'This is a red color',
    emoji: '🔴',
    category: 'Colors',
    level: 2,
    skillIds: ['colors', 'descriptive-language'],
  }),

  createPhrase({
    id: 'p62',
    arabic: 'هَذَا لَوْنٌ أَزْرَقُ',
    meaning: 'This is a blue color',
    emoji: '🔵',
    category: 'Colors',
    level: 2,
    skillIds: ['colors', 'descriptive-language'],
  }),

  createPhrase({
    id: 'p63',
    arabic: 'هَذَا لَوْنٌ أَصْفَرُ',
    meaning: 'This is a yellow color',
    emoji: '🟡',
    category: 'Colors',
    level: 2,
    skillIds: ['colors', 'descriptive-language'],
  }),

  createPhrase({
    id: 'p64',
    arabic: 'هَذَا لَوْنٌ أَخْضَرُ',
    meaning: 'This is a green color',
    emoji: '🟢',
    category: 'Colors',
    level: 2,
    skillIds: ['colors', 'descriptive-language'],
  }),

  createPhrase({
    id: 'p65',
    arabic: 'الْكُرَةُ حَمْرَاءُ',
    meaning: 'The ball is red',
    emoji: '🔴',
    category: 'Colors',
    level: 3,
    skillIds: ['colors', 'gender-agreement', 'descriptive-language'],
  }),

  createPhrase({
    id: 'p66',
    arabic: 'الشَّجَرَةُ خَضْرَاءُ',
    meaning: 'The tree is green',
    emoji: '🌳',
    category: 'Colors',
    level: 3,
    skillIds: ['colors', 'gender-agreement', 'descriptive-language'],
  }),

  createPhrase({
    id: 'p67',
    arabic: 'هَذَا مُرَبَّعٌ',
    meaning: 'This is a square',
    emoji: '⬛',
    category: 'Shapes',
    level: 3,
    skillIds: ['shapes', 'demonstratives'],
  }),

  createPhrase({
    id: 'p68',
    arabic: 'هَذِهِ دَائِرَةٌ',
    meaning: 'This is a circle',
    emoji: '⭕',
    category: 'Shapes',
    level: 3,
    skillIds: ['shapes', 'demonstratives', 'gender-agreement'],
  }),

  createPhrase({
    id: 'p69',
    arabic: 'هَذَا مُثَلَّثٌ',
    meaning: 'This is a triangle',
    emoji: '🔺',
    category: 'Shapes',
    level: 3,
    skillIds: ['shapes', 'demonstratives'],
  }),

  createPhrase({
    id: 'p70',
    arabic: 'أَنَا أُحِبُّ اللَّوْنَ الْأَزْرَقَ',
    meaning: 'I love the color blue',
    emoji: '💙',
    category: 'Colors',
    level: 3,
    skillIds: ['colors', 'preferences'],
  }),

  // ---------------------------------------------------------
  // DAILY LIFE & ACTIONS
  // ---------------------------------------------------------

  createPhrase({
    id: 'p71',
    arabic: 'أَنَا أَسْتَيْقِظُ صَبَاحًا',
    meaning: 'I wake up in the morning',
    emoji: '🌅',
    category: 'Daily Life',
    level: 3,
    skillIds: ['daily-routines', 'present-tense-verbs'],
  }),

  createPhrase({
    id: 'p72',
    arabic: 'أَنَا أَغْسِلُ يَدَيَّ',
    meaning: 'I wash my hands',
    emoji: '🧼',
    category: 'Daily Life',
    level: 3,
    skillIds: ['daily-routines', 'body-vocabulary', 'present-tense-verbs'],
  }),

  createPhrase({
    id: 'p73',
    arabic: 'أَنَا أَلْبَسُ مَلَابِسِي',
    meaning: 'I wear my clothes',
    emoji: '👕',
    category: 'Daily Life',
    level: 3,
    skillIds: ['daily-routines', 'present-tense-verbs'],
  }),

  createPhrase({
    id: 'p74',
    arabic: 'أَنَا أَلْعَبُ بِالْكُرَةِ',
    meaning: 'I play with the ball',
    emoji: '⚽',
    category: 'Daily Life',
    level: 3,
    skillIds: ['daily-routines', 'present-tense-verbs'],
  }),

  createPhrase({
    id: 'p75',
    arabic: 'أَنَا أَنَامُ فِي اللَّيْلِ',
    meaning: 'I sleep at night',
    emoji: '🌙',
    category: 'Daily Life',
    level: 3,
    skillIds: ['daily-routines', 'time-vocabulary'],
  }),

  createPhrase({
    id: 'p76',
    arabic: 'أَنَا أَقُومُ بِاللَّيْلِ',
    meaning: 'I stand at night',
    emoji: '🧍',
    category: 'Daily Life',
    level: 4,
    skillIds: ['daily-routines', 'present-tense-verbs'],
  }),

  createPhrase({
    id: 'p77',
    arabic: 'أَنَا أَرْكُضُ بِسُرْعَةٍ',
    meaning: 'I run fast',
    emoji: '🏃',
    category: 'Daily Life',
    level: 4,
    skillIds: ['actions', 'adverbs', 'present-tense-verbs'],
  }),

  createPhrase({
    id: 'p78',
    arabic: 'أَنَا أَقْفِزُ عَالِيًا',
    meaning: 'I jump high',
    emoji: '🤸',
    category: 'Daily Life',
    level: 4,
    skillIds: ['actions', 'adverbs', 'present-tense-verbs'],
  }),

  createPhrase({
    id: 'p79',
    arabic: 'أَنَا أَسْمَعُ الصَّوْتَ',
    meaning: 'I hear the sound',
    emoji: '🔊',
    category: 'Daily Life',
    level: 4,
    skillIds: ['senses', 'present-tense-verbs'],
  }),

  createPhrase({
    id: 'p80',
    arabic: 'أَنَا أَرَى النُّجُومَ',
    meaning: 'I see the stars',
    emoji: '⭐',
    category: 'Daily Life',
    level: 4,
    skillIds: ['senses', 'nature-vocabulary', 'present-tense-verbs'],
  }),

  // ---------------------------------------------------------
  // ISLAMIC EXPRESSIONS
  // ---------------------------------------------------------

  createPhrase({
    id: 'p81',
    arabic: 'بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ',
    meaning: 'In the name of Allah, the Most Gracious, the Most Merciful',
    emoji: '🌙',
    category: 'Islamic',
    level: 1,
    domain: 'islamic',
    skillIds: ['islamic-expressions', 'memorisation'],
  }),

  createPhrase({
    id: 'p82',
    arabic: 'الْحَمْدُ لِلهِ رَبِّ الْعَالَمِينَ',
    meaning: 'Praise be to Allah, Lord of the worlds',
    emoji: '🤲',
    category: 'Islamic',
    level: 2,
    domain: 'islamic',
    skillIds: ['islamic-expressions', 'memorisation'],
  }),

  createPhrase({
    id: 'p83',
    arabic: 'اللَّهُ أَكْبَرُ',
    meaning: 'Allah is the Greatest',
    emoji: '🕌',
    category: 'Islamic',
    level: 1,
    domain: 'islamic',
    skillIds: ['islamic-expressions', 'memorisation'],
  }),

  createPhrase({
    id: 'p84',
    arabic: 'سُبْحَانَ اللهِ',
    meaning: 'Glory be to Allah',
    emoji: '✨',
    category: 'Islamic',
    level: 1,
    domain: 'islamic',
    skillIds: ['islamic-expressions', 'memorisation'],
  }),

  createPhrase({
    id: 'p85',
    arabic: 'أَسْتَغْفِرُ اللهَ',
    meaning: 'I seek forgiveness from Allah',
    emoji: '🤲',
    category: 'Islamic',
    level: 2,
    domain: 'islamic',
    skillIds: ['islamic-expressions', 'memorisation'],
  }),

  createPhrase({
    id: 'p86',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
    meaning: 'O Allah, send blessings upon Muhammad',
    emoji: '💚',
    category: 'Islamic',
    level: 3,
    domain: 'islamic',
    skillIds: ['islamic-expressions', 'memorisation'],
  }),

  createPhrase({
    id: 'p87',
    arabic: 'إِنْ شَاءَ اللهُ',
    meaning: 'If Allah wills',
    emoji: '🌙',
    category: 'Islamic',
    level: 2,
    domain: 'islamic',
    skillIds: ['islamic-expressions', 'everyday-expressions'],
  }),

  createPhrase({
    id: 'p88',
    arabic: 'مَا شَاءَ اللهُ',
    meaning: 'What Allah has willed',
    emoji: '✨',
    category: 'Islamic',
    level: 2,
    domain: 'islamic',
    skillIds: ['islamic-expressions', 'everyday-expressions'],
  }),

  createPhrase({
    id: 'p89',
    arabic: 'جَزَاكَ اللهُ خَيْرًا',
    meaning: 'May Allah reward you with good',
    emoji: '🤝',
    category: 'Islamic',
    level: 3,
    domain: 'islamic',
    skillIds: ['islamic-expressions', 'polite-language'],
  }),

  createPhrase({
    id: 'p90',
    arabic: 'اللَّهُ يُحِبُّ الصَّابِرِينَ',
    meaning: 'Allah loves those who are patient',
    emoji: '💚',
    category: 'Islamic',
    level: 4,
    domain: 'islamic',
    skillIds: ['islamic-expressions', 'sentence-comprehension'],
  }),

  // ---------------------------------------------------------
  // ADVANCED / CONVERSATIONAL
  // ---------------------------------------------------------

  createPhrase({
    id: 'p91',
    arabic: 'أَنَا أُرِيدُ أَنْ أَتَعَلَّمَ الْعَرَبِيَّةَ',
    meaning: 'I want to learn Arabic',
    emoji: '📖',
    category: 'Advanced',
    level: 4,
    skillIds: ['sentence-formation', 'infinitive-construction'],
  }),

  createPhrase({
    id: 'p92',
    arabic: 'مَا اسْمُكَ؟',
    meaning: 'What is your name?',
    emoji: '📛',
    category: 'Conversation',
    level: 2,
    skillIds: ['questions', 'personal-information'],
  }),

  createPhrase({
    id: 'p93',
    arabic: 'اسْمِي أَحْمَدُ',
    meaning: 'My name is Ahmed',
    emoji: '📛',
    category: 'Conversation',
    level: 2,
    skillIds: ['self-expression', 'personal-information'],
  }),

  createPhrase({
    id: 'p94',
    arabic: 'مِنْ أَيْنَ أَنْتَ؟',
    meaning: 'Where are you from?',
    emoji: '🌍',
    category: 'Conversation',
    level: 3,
    skillIds: ['questions', 'places', 'personal-information'],
  }),

  createPhrase({
    id: 'p95',
    arabic: 'أَنَا مِنْ غَانَا',
    meaning: 'I am from Ghana',
    emoji: '🇬🇭',
    category: 'Conversation',
    level: 3,
    skillIds: ['self-expression', 'places', 'personal-information'],
  }),

  createPhrase({
    id: 'p96',
    arabic: 'هَلْ تَتَكَلَّمُ الْعَرَبِيَّةَ؟',
    meaning: 'Do you speak Arabic?',
    emoji: '🗣️',
    category: 'Conversation',
    level: 4,
    skillIds: ['questions', 'speaking', 'language-comprehension'],
  }),

  createPhrase({
    id: 'p97',
    arabic: 'نَعَمْ، أَتَكَلَّمُ قَلِيلًا',
    meaning: 'Yes, I speak a little',
    emoji: '🗣️',
    category: 'Conversation',
    level: 4,
    skillIds: ['speaking', 'conversation'],
  }),

  createPhrase({
    id: 'p98',
    arabic: 'أَنَا سَعِيدٌ جِدًّا',
    meaning: 'I am very happy',
    emoji: '😄',
    category: 'Emotions',
    level: 3,
    skillIds: ['emotions', 'descriptive-language'],
  }),

  createPhrase({
    id: 'p99',
    arabic: 'أَنَا أُحِبُّكَ فِي اللهِ',
    meaning: 'I love you for the sake of Allah',
    emoji: '❤️',
    category: 'Islamic',
    level: 4,
    domain: 'islamic',
    skillIds: ['islamic-expressions', 'relationships'],
  }),

  createPhrase({
    id: 'p100',
    arabic: 'اللَّهُمَّ اجْعَلْنِي مِنَ الصَّالِحِينَ',
    meaning: 'O Allah, make me among the righteous',
    emoji: '🤲',
    category: 'Islamic',
    level: 4,
    domain: 'islamic',
    skillIds: ['islamic-expressions', 'dua', 'memorisation'],
  }),
];

export const ARABIC_PHRASE_BY_ID: Readonly<
  Record<string, ArabicPhrase>
> = Object.fromEntries(
  ARABIC_PHRASES.map((phrase) => [phrase.id, phrase]),
);

export function getArabicPhraseById(
  id: string,
): ArabicPhrase | undefined {
  return ARABIC_PHRASE_BY_ID[id];
}

export function getArabicPhrasesByLevel(
  level: ArabicPhrase['level'],
): readonly ArabicPhrase[] {
  return ARABIC_PHRASES.filter(
    (phrase) => phrase.level === level,
  );
}

export function getArabicPhrasesByCategory(
  category: string,
): readonly ArabicPhrase[] {
  return ARABIC_PHRASES.filter(
    (phrase) => phrase.category === category,
  );
}

export function getArabicPhrasesBySkill(
  skillId: string,
): readonly ArabicPhrase[] {
  return ARABIC_PHRASES.filter(
    (phrase) => phrase.skillIds.includes(skillId),
  );
}

export function getArabicPhrasesByDomain(
  domain: ArabicPhraseDomain,
): readonly ArabicPhrase[] {
  return ARABIC_PHRASES.filter(
    (phrase) => phrase.domain === domain,
  );
}

export function getFoundationalArabicPhrases(): readonly ArabicPhrase[] {
  return ARABIC_PHRASES.filter(
    (phrase) => phrase.isFoundational,
  );
}