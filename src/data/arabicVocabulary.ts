export type ArabicDomain =
  | 'language'
  | 'literacy'
  | 'numeracy'
  | 'islamic'
  | 'general';

export type ArabicDifficulty =
  | 'foundational'
  | 'developing'
  | 'intermediate'
  | 'advanced';

export interface ArabicWord {
  id: string;

  /**
   * Arabic orthography with full Harakat/Tashkeel.
   */
  arabic: string;

  /**
   * English meaning shown primarily to parents/teachers.
   */
  meaning: string;

  /**
   * Optional visual cue.
   * The UI should not depend on emoji.
   */
  emoji?: string;

  /**
   * Broad curriculum category.
   */
  category: string;

  /**
   * ELP competency level.
   *
   * This is a curriculum difficulty/readiness signal,
   * NOT an age mapping.
   */
  level: 1 | 2 | 3 | 4 | 5;

  domain: ArabicDomain;

  difficulty: ArabicDifficulty;

  /**
   * Shared skill IDs used by the Learning Engine.
   */
  skillIds: readonly string[];

  /**
   * Useful for adaptive review.
   */
  isFoundational: boolean;

  /**
   * Whether the learner should normally encounter
   * this item early in Arabic vocabulary development.
   */
  isHighFrequency: boolean;
}

const createWord = (
  word: Omit<ArabicWord, 'domain' | 'difficulty' | 'skillIds' | 'isFoundational' | 'isHighFrequency'> & {
    domain?: ArabicDomain;
    difficulty?: ArabicDifficulty;
    skillIds?: readonly string[];
    isFoundational?: boolean;
    isHighFrequency?: boolean;
  },
): ArabicWord => ({
  ...word,
  domain: word.domain ?? 'language',
  difficulty: word.difficulty ?? (
    word.level === 1
      ? 'foundational'
      : word.level === 2
        ? 'developing'
        : word.level === 3
          ? 'intermediate'
          : 'advanced'
  ),
  skillIds: word.skillIds ?? ['arabic-vocabulary'],
  isFoundational: word.isFoundational ?? word.level <= 2,
  isHighFrequency: word.isHighFrequency ?? word.level <= 2,
});

/**
 * Arabic vocabulary curriculum.
 *
 * Level indicates competency difficulty.
 * It does NOT correspond directly to learner age.
 */
export const ARABIC_WORDS: readonly ArabicWord[] = [
  // ---------------------------------------------------------
  // FAMILY & PEOPLE
  // ---------------------------------------------------------

  createWord({
    id: 'w1',
    arabic: 'أَبٌ',
    meaning: 'Father',
    emoji: '👨',
    category: 'Family',
    level: 1,
  }),
  createWord({
    id: 'w2',
    arabic: 'أُمٌّ',
    meaning: 'Mother',
    emoji: '👩',
    category: 'Family',
    level: 1,
  }),
  createWord({
    id: 'w3',
    arabic: 'أَخٌ',
    meaning: 'Brother',
    emoji: '👦',
    category: 'Family',
    level: 1,
  }),
  createWord({
    id: 'w4',
    arabic: 'أُخْتٌ',
    meaning: 'Sister',
    emoji: '👧',
    category: 'Family',
    level: 1,
  }),
  createWord({
    id: 'w5',
    arabic: 'جَدٌّ',
    meaning: 'Grandfather',
    emoji: '👴',
    category: 'Family',
    level: 1,
  }),
  createWord({
    id: 'w6',
    arabic: 'جَدَّةٌ',
    meaning: 'Grandmother',
    emoji: '👵',
    category: 'Family',
    level: 1,
  }),
  createWord({
    id: 'w7',
    arabic: 'طِفْلٌ',
    meaning: 'Child',
    emoji: '🧒',
    category: 'Family',
    level: 1,
  }),
  createWord({
    id: 'w8',
    arabic: 'رَجُلٌ',
    meaning: 'Man',
    emoji: '👨‍🦱',
    category: 'People',
    level: 1,
  }),
  createWord({
    id: 'w9',
    arabic: 'اِمْرَأَةٌ',
    meaning: 'Woman',
    emoji: '👩‍🦱',
    category: 'People',
    level: 1,
  }),
  createWord({
    id: 'w10',
    arabic: 'صَدِيقٌ',
    meaning: 'Friend',
    emoji: '🤝',
    category: 'People',
    level: 1,
  }),

  // ---------------------------------------------------------
  // ANIMALS
  // ---------------------------------------------------------

  createWord({
    id: 'w11',
    arabic: 'قِطَّةٌ',
    meaning: 'Cat',
    emoji: '🐱',
    category: 'Animals',
    level: 1,
  }),
  createWord({
    id: 'w12',
    arabic: 'كَلْبٌ',
    meaning: 'Dog',
    emoji: '🐶',
    category: 'Animals',
    level: 1,
  }),
  createWord({
    id: 'w13',
    arabic: 'أَسَدٌ',
    meaning: 'Lion',
    emoji: '🦁',
    category: 'Animals',
    level: 1,
  }),
  createWord({
    id: 'w14',
    arabic: 'فِيلٌ',
    meaning: 'Elephant',
    emoji: '🐘',
    category: 'Animals',
    level: 1,
  }),
  createWord({
    id: 'w15',
    arabic: 'حِصَانٌ',
    meaning: 'Horse',
    emoji: '🐴',
    category: 'Animals',
    level: 2,
  }),
  createWord({
    id: 'w16',
    arabic: 'بَقَرَةٌ',
    meaning: 'Cow',
    emoji: '🐄',
    category: 'Animals',
    level: 2,
  }),
  createWord({
    id: 'w17',
    arabic: 'خَرُوفٌ',
    meaning: 'Sheep',
    emoji: '🐑',
    category: 'Animals',
    level: 2,
  }),
  createWord({
    id: 'w18',
    arabic: 'دَجَاجَةٌ',
    meaning: 'Chicken',
    emoji: '🐔',
    category: 'Animals',
    level: 2,
  }),
  createWord({
    id: 'w19',
    arabic: 'سَمَكَةٌ',
    meaning: 'Fish',
    emoji: '🐟',
    category: 'Animals',
    level: 2,
  }),
  createWord({
    id: 'w20',
    arabic: 'عُصْفُورٌ',
    meaning: 'Bird',
    emoji: '🐦',
    category: 'Animals',
    level: 2,
  }),

  // ---------------------------------------------------------
  // FOOD & DRINK
  // ---------------------------------------------------------

  createWord({
    id: 'w21',
    arabic: 'مَاءٌ',
    meaning: 'Water',
    emoji: '💧',
    category: 'Food',
    level: 1,
  }),
  createWord({
    id: 'w22',
    arabic: 'حَلِيبٌ',
    meaning: 'Milk',
    emoji: '🥛',
    category: 'Food',
    level: 1,
  }),
  createWord({
    id: 'w23',
    arabic: 'خُبْزٌ',
    meaning: 'Bread',
    emoji: '🍞',
    category: 'Food',
    level: 1,
  }),
  createWord({
    id: 'w24',
    arabic: 'تُفَّاحَةٌ',
    meaning: 'Apple',
    emoji: '🍎',
    category: 'Food',
    level: 1,
  }),
  createWord({
    id: 'w25',
    arabic: 'مَوْزٌ',
    meaning: 'Banana',
    emoji: '🍌',
    category: 'Food',
    level: 1,
  }),
  createWord({
    id: 'w26',
    arabic: 'بُرْتُقَالٌ',
    meaning: 'Orange',
    emoji: '🍊',
    category: 'Food',
    level: 2,
  }),
  createWord({
    id: 'w27',
    arabic: 'عِنَبٌ',
    meaning: 'Grapes',
    emoji: '🍇',
    category: 'Food',
    level: 2,
  }),
  createWord({
    id: 'w28',
    arabic: 'أَرُزٌّ',
    meaning: 'Rice',
    emoji: '🍚',
    category: 'Food',
    level: 2,
  }),
  createWord({
    id: 'w29',
    arabic: 'لَحْمٌ',
    meaning: 'Meat',
    emoji: '🥩',
    category: 'Food',
    level: 2,
  }),
  createWord({
    id: 'w30',
    arabic: 'سُكَّرٌ',
    meaning: 'Sugar',
    emoji: '🍬',
    category: 'Food',
    level: 2,
  }),

  // ---------------------------------------------------------
  // NATURE & WEATHER
  // ---------------------------------------------------------

  createWord({
    id: 'w31',
    arabic: 'شَمْسٌ',
    meaning: 'Sun',
    emoji: '☀️',
    category: 'Nature',
    level: 1,
  }),
  createWord({
    id: 'w32',
    arabic: 'قَمَرٌ',
    meaning: 'Moon',
    emoji: '🌙',
    category: 'Nature',
    level: 1,
  }),
  createWord({
    id: 'w33',
    arabic: 'نَجْمَةٌ',
    meaning: 'Star',
    emoji: '⭐',
    category: 'Nature',
    level: 1,
  }),
  createWord({
    id: 'w34',
    arabic: 'سَمَاءٌ',
    meaning: 'Sky',
    emoji: '🌌',
    category: 'Nature',
    level: 1,
  }),
  createWord({
    id: 'w35',
    arabic: 'بَحْرٌ',
    meaning: 'Sea',
    emoji: '🌊',
    category: 'Nature',
    level: 2,
  }),
  createWord({
    id: 'w36',
    arabic: 'جَبَلٌ',
    meaning: 'Mountain',
    emoji: '⛰️',
    category: 'Nature',
    level: 2,
  }),
  createWord({
    id: 'w37',
    arabic: 'شَجَرَةٌ',
    meaning: 'Tree',
    emoji: '🌳',
    category: 'Nature',
    level: 2,
  }),
  createWord({
    id: 'w38',
    arabic: 'زَهْرَةٌ',
    meaning: 'Flower',
    emoji: '🌸',
    category: 'Nature',
    level: 2,
  }),
  createWord({
    id: 'w39',
    arabic: 'مَطَرٌ',
    meaning: 'Rain',
    emoji: '🌧️',
    category: 'Nature',
    level: 2,
  }),
  createWord({
    id: 'w40',
    arabic: 'رِيحٌ',
    meaning: 'Wind',
    emoji: '🌬️',
    category: 'Nature',
    level: 3,
  }),

  // ---------------------------------------------------------
  // COLOURS
  // ---------------------------------------------------------

  createWord({
    id: 'w41',
    arabic: 'أَحْمَرُ',
    meaning: 'Red',
    emoji: '🔴',
    category: 'Colors',
    level: 1,
  }),
  createWord({
    id: 'w42',
    arabic: 'أَزْرَقُ',
    meaning: 'Blue',
    emoji: '🔵',
    category: 'Colors',
    level: 1,
  }),
  createWord({
    id: 'w43',
    arabic: 'أَصْفَرُ',
    meaning: 'Yellow',
    emoji: '🟡',
    category: 'Colors',
    level: 1,
  }),
  createWord({
    id: 'w44',
    arabic: 'أَخْضَرُ',
    meaning: 'Green',
    emoji: '🟢',
    category: 'Colors',
    level: 1,
  }),
  createWord({
    id: 'w45',
    arabic: 'أَسْوَدُ',
    meaning: 'Black',
    emoji: '⚫',
    category: 'Colors',
    level: 1,
  }),
  createWord({
    id: 'w46',
    arabic: 'أَبْيَضُ',
    meaning: 'White',
    emoji: '⚪',
    category: 'Colors',
    level: 1,
  }),
  createWord({
    id: 'w47',
    arabic: 'بُرْتُقَالِيٌّ',
    meaning: 'Orange (color)',
    emoji: '🟠',
    category: 'Colors',
    level: 2,
  }),
  createWord({
    id: 'w48',
    arabic: 'وَرْدِيٌّ',
    meaning: 'Pink',
    emoji: '🩷',
    category: 'Colors',
    level: 2,
  }),
  createWord({
    id: 'w49',
    arabic: 'بُنِّيٌّ',
    meaning: 'Brown',
    emoji: '🟤',
    category: 'Colors',
    level: 2,
  }),
  createWord({
    id: 'w50',
    arabic: 'رَمَادِيٌّ',
    meaning: 'Gray',
    emoji: '🩶',
    category: 'Colors',
    level: 2,
  }),

  // ---------------------------------------------------------
  // NUMBERS
  // ---------------------------------------------------------

  createWord({
    id: 'w51',
    arabic: 'وَاحِدٌ',
    meaning: 'One',
    emoji: '1️⃣',
    category: 'Numbers',
    level: 1,
    domain: 'numeracy',
    skillIds: ['number-names', 'number-recognition'],
  }),
  createWord({
    id: 'w52',
    arabic: 'اِثْنَانِ',
    meaning: 'Two',
    emoji: '2️⃣',
    category: 'Numbers',
    level: 1,
    domain: 'numeracy',
    skillIds: ['number-names', 'number-recognition'],
  }),
  createWord({
    id: 'w53',
    arabic: 'ثَلَاثَةٌ',
    meaning: 'Three',
    emoji: '3️⃣',
    category: 'Numbers',
    level: 1,
    domain: 'numeracy',
    skillIds: ['number-names', 'number-recognition'],
  }),
  createWord({
    id: 'w54',
    arabic: 'أَرْبَعَةٌ',
    meaning: 'Four',
    emoji: '4️⃣',
    category: 'Numbers',
    level: 1,
    domain: 'numeracy',
    skillIds: ['number-names', 'number-recognition'],
  }),
  createWord({
    id: 'w55',
    arabic: 'خَمْسَةٌ',
    meaning: 'Five',
    emoji: '5️⃣',
    category: 'Numbers',
    level: 1,
    domain: 'numeracy',
    skillIds: ['number-names', 'number-recognition'],
  }),
  createWord({
    id: 'w56',
    arabic: 'سِتَّةٌ',
    meaning: 'Six',
    emoji: '6️⃣',
    category: 'Numbers',
    level: 1,
    domain: 'numeracy',
    skillIds: ['number-names', 'number-recognition'],
  }),
  createWord({
    id: 'w57',
    arabic: 'سَبْعَةٌ',
    meaning: 'Seven',
    emoji: '7️⃣',
    category: 'Numbers',
    level: 1,
    domain: 'numeracy',
    skillIds: ['number-names', 'number-recognition'],
  }),
  createWord({
    id: 'w58',
    arabic: 'ثَمَانِيَةٌ',
    meaning: 'Eight',
    emoji: '8️⃣',
    category: 'Numbers',
    level: 1,
    domain: 'numeracy',
    skillIds: ['number-names', 'number-recognition'],
  }),
  createWord({
    id: 'w59',
    arabic: 'تِسْعَةٌ',
    meaning: 'Nine',
    emoji: '9️⃣',
    category: 'Numbers',
    level: 1,
    domain: 'numeracy',
    skillIds: ['number-names', 'number-recognition'],
  }),
  createWord({
    id: 'w60',
    arabic: 'عَشَرَةٌ',
    meaning: 'Ten',
    emoji: '🔟',
    category: 'Numbers',
    level: 1,
    domain: 'numeracy',
    skillIds: ['number-names', 'number-recognition'],
  }),

  // ---------------------------------------------------------
  // BODY
  // ---------------------------------------------------------

  createWord({
    id: 'w61',
    arabic: 'رَأْسٌ',
    meaning: 'Head',
    emoji: '👤',
    category: 'Body',
    level: 2,
  }),
  createWord({
    id: 'w62',
    arabic: 'عَيْنٌ',
    meaning: 'Eye',
    emoji: '👁️',
    category: 'Body',
    level: 2,
  }),
  createWord({
    id: 'w63',
    arabic: 'أُذُنٌ',
    meaning: 'Ear',
    emoji: '👂',
    category: 'Body',
    level: 2,
  }),
  createWord({
    id: 'w64',
    arabic: 'أَنْفٌ',
    meaning: 'Nose',
    emoji: '👃',
    category: 'Body',
    level: 2,
  }),
  createWord({
    id: 'w65',
    arabic: 'فَمٌ',
    meaning: 'Mouth',
    emoji: '👄',
    category: 'Body',
    level: 2,
  }),
  createWord({
    id: 'w66',
    arabic: 'يَدٌ',
    meaning: 'Hand',
    emoji: '✋',
    category: 'Body',
    level: 2,
  }),
  createWord({
    id: 'w67',
    arabic: 'رِجْلٌ',
    meaning: 'Leg/Foot',
    emoji: '🦵',
    category: 'Body',
    level: 2,
  }),
  createWord({
    id: 'w68',
    arabic: 'قَلْبٌ',
    meaning: 'Heart',
    emoji: '❤️',
    category: 'Body',
    level: 2,
  }),
  createWord({
    id: 'w69',
    arabic: 'بَطْنٌ',
    meaning: 'Stomach',
    emoji: '🫃',
    category: 'Body',
    level: 2,
  }),
  createWord({
    id: 'w70',
    arabic: 'شَعْرٌ',
    meaning: 'Hair',
    emoji: '💇',
    category: 'Body',
    level: 2,
  }),

  // ---------------------------------------------------------
  // SCHOOL & OBJECTS
  // ---------------------------------------------------------

  createWord({
    id: 'w71',
    arabic: 'كِتَابٌ',
    meaning: 'Book',
    emoji: '📖',
    category: 'School',
    level: 1,
  }),
  createWord({
    id: 'w72',
    arabic: 'قَلَمٌ',
    meaning: 'Pen',
    emoji: '🖊️',
    category: 'School',
    level: 1,
  }),
  createWord({
    id: 'w73',
    arabic: 'مَدْرَسَةٌ',
    meaning: 'School',
    emoji: '🏫',
    category: 'School',
    level: 1,
  }),
  createWord({
    id: 'w74',
    arabic: 'مُعَلِّمٌ',
    meaning: 'Teacher',
    emoji: '👨‍🏫',
    category: 'School',
    level: 2,
  }),
  createWord({
    id: 'w75',
    arabic: 'تِلْمِيذٌ',
    meaning: 'Student',
    emoji: '🧑‍🎓',
    category: 'School',
    level: 2,
  }),
  createWord({
    id: 'w76',
    arabic: 'سَيَّارَةٌ',
    meaning: 'Car',
    emoji: '🚗',
    category: 'Objects',
    level: 2,
  }),
  createWord({
    id: 'w77',
    arabic: 'بَابٌ',
    meaning: 'Door',
    emoji: '🚪',
    category: 'Objects',
    level: 2,
  }),
  createWord({
    id: 'w78',
    arabic: 'نَافِذَةٌ',
    meaning: 'Window',
    emoji: '🪟',
    category: 'Objects',
    level: 2,
  }),
  createWord({
    id: 'w79',
    arabic: 'كُرْسِيٌّ',
    meaning: 'Chair',
    emoji: '🪑',
    category: 'Objects',
    level: 2,
  }),
  createWord({
    id: 'w80',
    arabic: 'طَاوِلَةٌ',
    meaning: 'Table',
    emoji: '🪵',
    category: 'Objects',
    level: 2,
  }),

  // ---------------------------------------------------------
  // PLACES & ACTIONS
  // ---------------------------------------------------------

  createWord({
    id: 'w81',
    arabic: 'بَيْتٌ',
    meaning: 'House',
    emoji: '🏠',
    category: 'Places',
    level: 1,
  }),
  createWord({
    id: 'w82',
    arabic: 'مَسْجِدٌ',
    meaning: 'Mosque',
    emoji: '🕌',
    category: 'Places',
    level: 1,
    domain: 'islamic',
    skillIds: ['islamic-vocabulary', 'arabic-vocabulary'],
  }),
  createWord({
    id: 'w83',
    arabic: 'سُوقٌ',
    meaning: 'Market',
    emoji: '🛒',
    category: 'Places',
    level: 2,
  }),
  createWord({
    id: 'w84',
    arabic: 'مُسْتَشْفًى',
    meaning: 'Hospital',
    emoji: '🏥',
    category: 'Places',
    level: 2,
  }),
  createWord({
    id: 'w85',
    arabic: 'حَدِيقَةٌ',
    meaning: 'Garden',
    emoji: '🌳',
    category: 'Places',
    level: 2,
  }),
  createWord({
    id: 'w86',
    arabic: 'أَكَلَ',
    meaning: 'He ate',
    emoji: '🍽️',
    category: 'Actions',
    level: 3,
  }),
  createWord({
    id: 'w87',
    arabic: 'شَرِبَ',
    meaning: 'He drank',
    emoji: '🥤',
    category: 'Actions',
    level: 3,
  }),
  createWord({
    id: 'w88',
    arabic: 'ذَهَبَ',
    meaning: 'He went',
    emoji: '🏃',
    category: 'Actions',
    level: 3,
  }),
  createWord({
    id: 'w89',
    arabic: 'جَاءَ',
    meaning: 'He came',
    emoji: '👋',
    category: 'Actions',
    level: 3,
  }),
  createWord({
    id: 'w90',
    arabic: 'قَرَأَ',
    meaning: 'He read',
    emoji: '📖',
    category: 'Actions',
    level: 3,
  }),

  // ---------------------------------------------------------
  // ISLAMIC & EVERYDAY EXPRESSIONS
  // ---------------------------------------------------------

  createWord({
    id: 'w91',
    arabic: 'بِسْمِ اللهِ',
    meaning: 'In the name of Allah',
    emoji: '🌙',
    category: 'Islamic',
    level: 1,
    domain: 'islamic',
    skillIds: ['islamic-vocabulary', 'everyday-expressions'],
  }),
  createWord({
    id: 'w92',
    arabic: 'الْحَمْدُ لِلهِ',
    meaning: 'Praise be to Allah',
    emoji: '🤲',
    category: 'Islamic',
    level: 1,
    domain: 'islamic',
    skillIds: ['islamic-vocabulary', 'everyday-expressions'],
  }),
  createWord({
    id: 'w93',
    arabic: 'اللَّهُ أَكْبَرُ',
    meaning: 'Allah is the Greatest',
    emoji: '🕌',
    category: 'Islamic',
    level: 1,
    domain: 'islamic',
    skillIds: ['islamic-vocabulary', 'everyday-expressions'],
  }),
  createWord({
    id: 'w94',
    arabic: 'سُبْحَانَ اللهِ',
    meaning: 'Glory be to Allah',
    emoji: '✨',
    category: 'Islamic',
    level: 1,
    domain: 'islamic',
    skillIds: ['islamic-vocabulary', 'everyday-expressions'],
  }),
  createWord({
    id: 'w95',
    arabic: 'شُكْرًا',
    meaning: 'Thank you',
    emoji: '🙏',
    category: 'Phrases',
    level: 1,
    skillIds: ['everyday-expressions'],
  }),
  createWord({
    id: 'w96',
    arabic: 'نَعَمْ',
    meaning: 'Yes',
    emoji: '👍',
    category: 'Phrases',
    level: 1,
    skillIds: ['everyday-expressions'],
  }),
  createWord({
    id: 'w97',
    arabic: 'لَا',
    meaning: 'No',
    emoji: '👎',
    category: 'Phrases',
    level: 1,
    skillIds: ['everyday-expressions'],
  }),
  createWord({
    id: 'w98',
    arabic: 'مِنْ فَضْلِكَ',
    meaning: 'Please',
    emoji: '🥺',
    category: 'Phrases',
    level: 2,
    skillIds: ['everyday-expressions', 'polite-language'],
  }),
  createWord({
    id: 'w99',
    arabic: 'مَرْحَبًا',
    meaning: 'Hello',
    emoji: '👋',
    category: 'Phrases',
    level: 1,
    skillIds: ['greetings', 'everyday-expressions'],
  }),
  createWord({
    id: 'w100',
    arabic: 'مَعَ السَّلَامَةِ',
    meaning: 'Goodbye',
    emoji: '🚪',
    category: 'Phrases',
    level: 1,
    skillIds: ['greetings', 'everyday-expressions'],
  }),
];

export const ARABIC_WORD_BY_ID: Readonly<Record<string, ArabicWord>> =
  Object.fromEntries(
    ARABIC_WORDS.map((word) => [word.id, word]),
  );

export function getArabicWordById(
  id: string,
): ArabicWord | undefined {
  return ARABIC_WORD_BY_ID[id];
}

export function getArabicWordsByLevel(
  level: ArabicWord['level'],
): readonly ArabicWord[] {
  return ARABIC_WORDS.filter((word) => word.level === level);
}

export function getArabicWordsByCategory(
  category: string,
): readonly ArabicWord[] {
  return ARABIC_WORDS.filter(
    (word) => word.category === category,
  );
}

export function getArabicWordsBySkill(
  skillId: string,
): readonly ArabicWord[] {
  return ARABIC_WORDS.filter(
    (word) => word.skillIds.includes(skillId),
  );
}

export function getFoundationalArabicWords(): readonly ArabicWord[] {
  return ARABIC_WORDS.filter((word) => word.isFoundational);
}