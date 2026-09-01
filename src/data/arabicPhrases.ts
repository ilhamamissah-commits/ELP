export interface ArabicPhrase {
  id: string;
  arabic: string; // Full Harakat
  meaning: string; // English meaning
  emoji: string;
  category: string;
  level: number;
}

// 100 Arabic Phrases & Sentences (No Transliteration)
export const ARABIC_PHRASES: ArabicPhrase[] = [
  // --- LEVEL 1: Greetings & Basics ---
  { id: 'p1', arabic: 'السَّلَامُ عَلَيْكُمْ', meaning: 'Peace be upon you', emoji: '👋', category: 'Greetings', level: 1 },
  { id: 'p2', arabic: 'وَعَلَيْكُمُ السَّلَامُ', meaning: 'And peace be upon you too', emoji: '🤝', category: 'Greetings', level: 1 },
  { id: 'p3', arabic: 'مَرْحَبًا', meaning: 'Hello', emoji: '👋', category: 'Greetings', level: 1 },
  { id: 'p4', arabic: 'مَعَ السَّلَامَةِ', meaning: 'Goodbye', emoji: '🚪', category: 'Greetings', level: 1 },
  { id: 'p5', arabic: 'كَيْفَ حَالُكَ؟', meaning: 'How are you?', emoji: '🤔', category: 'Greetings', level: 1 },
  { id: 'p6', arabic: 'أَنَا بِخَيْرٍ', meaning: 'I am fine', emoji: '😊', category: 'Greetings', level: 1 },
  { id: 'p7', arabic: 'شُكْرًا', meaning: 'Thank you', emoji: '🙏', category: 'Polite', level: 1 },
  { id: 'p8', arabic: 'عَفْوًا', meaning: 'You are welcome', emoji: '😊', category: 'Polite', level: 1 },
  { id: 'p9', arabic: 'مِنْ فَضْلِكَ', meaning: 'Please', emoji: '🥺', category: 'Polite', level: 1 },
  { id: 'p10', arabic: 'نَعَمْ', meaning: 'Yes', emoji: '👍', category: 'Basics', level: 1 },

  // --- LEVEL 2: Daily Expressions ---
  { id: 'p11', arabic: 'لَا', meaning: 'No', emoji: '👎', category: 'Basics', level: 1 },
  { id: 'p12', arabic: 'مَاذَا؟', meaning: 'What?', emoji: '❓', category: 'Questions', level: 1 },
  { id: 'p13', arabic: 'مَنْ؟', meaning: 'Who?', emoji: '🤷', category: 'Questions', level: 1 },
  { id: 'p14', arabic: 'أَيْنَ؟', meaning: 'Where?', emoji: '📍', category: 'Questions', level: 1 },
  { id: 'p15', arabic: 'مَتَى؟', meaning: 'When?', emoji: '⏰', category: 'Questions', level: 1 },
  { id: 'p16', arabic: 'لِمَاذَا؟', meaning: 'Why?', emoji: '🤔', category: 'Questions', level: 1 },
  { id: 'p17', arabic: 'هَذَا كِتَابٌ', meaning: 'This is a book', emoji: '📖', category: 'Simple Sentences', level: 2 },
  { id: 'p18', arabic: 'هَذِهِ سَيَّارَةٌ', meaning: 'This is a car', emoji: '🚗', category: 'Simple Sentences', level: 2 },
  { id: 'p19', arabic: 'هَذَا بَيْتٌ', meaning: 'This is a house', emoji: '🏠', category: 'Simple Sentences', level: 2 },
  { id: 'p20', arabic: 'هَذِهِ شَمْسٌ', meaning: 'This is a sun', emoji: '☀️', category: 'Simple Sentences', level: 2 },

  // --- LEVEL 3: My Family & Me ---
  { id: 'p21', arabic: 'هَذَا أَبِي', meaning: 'This is my father', emoji: '👨', category: 'Family', level: 2 },
  { id: 'p22', arabic: 'هَذِهِ أُمِّي', meaning: 'This is my mother', emoji: '👩', category: 'Family', level: 2 },
  { id: 'p23', arabic: 'هَذَا أَخِي', meaning: 'This is my brother', emoji: '👦', category: 'Family', level: 2 },
  { id: 'p24', arabic: 'هَذِهِ أُخْتِي', meaning: 'This is my sister', emoji: '👧', category: 'Family', level: 2 },
  { id: 'p25', arabic: 'أَنَا أُحِبُّ عَائِلَتِي', meaning: 'I love my family', emoji: '❤️', category: 'Family', level: 3 },
  { id: 'p26', arabic: 'أَنَا وَلَدٌ', meaning: 'I am a boy', emoji: '👦', category: 'About Me', level: 2 },
  { id: 'p27', arabic: 'أَنَا بِنْتٌ', meaning: 'I am a girl', emoji: '👧', category: 'About Me', level: 2 },
  { id: 'p28', arabic: 'اسْمِي مُحَمَّدٌ', meaning: 'My name is Muhammad', emoji: '📛', category: 'About Me', level: 2 },
  { id: 'p29', arabic: 'أَنَا عِنْدِي خَمْسُ سَنَوَاتٍ', meaning: 'I am five years old', emoji: '🎂', category: 'About Me', level: 2 },
  { id: 'p30', arabic: 'أَنَا مِنْ غَانَا', meaning: 'I am from Ghana', emoji: '🌍', category: 'About Me', level: 3 },

  // --- LEVEL 4: Food & Drink ---
  { id: 'p31', arabic: 'أَنَا جَائِعٌ', meaning: 'I am hungry', emoji: '🍽️', category: 'Food', level: 2 },
  { id: 'p32', arabic: 'أَنَا عَطْشَانُ', meaning: 'I am thirsty', emoji: '🥤', category: 'Food', level: 2 },
  { id: 'p33', arabic: 'أُرِيدُ مَاءً', meaning: 'I want water', emoji: '💧', category: 'Food', level: 2 },
  { id: 'p34', arabic: 'أُرِيدُ خُبْزًا', meaning: 'I want bread', emoji: '🍞', category: 'Food', level: 2 },
  { id: 'p35', arabic: 'أُرِيدُ تُفَّاحَةً', meaning: 'I want an apple', emoji: '🍎', category: 'Food', level: 2 },
  { id: 'p36', arabic: 'أَنَا آكُلُ الأَرُزَّ', meaning: 'I am eating rice', emoji: '🍚', category: 'Food', level: 3 },
  { id: 'p37', arabic: 'أَشْرَبُ الْحَلِيبَ', meaning: 'I am drinking milk', emoji: '🥛', category: 'Food', level: 3 },
  { id: 'p38', arabic: 'الطَّعَامُ لَذِيذٌ', meaning: 'The food is delicious', emoji: '😋', category: 'Food', level: 3 },
  { id: 'p39', arabic: 'أَحِبُّ الْفَوَاكِهَ', meaning: 'I love fruits', emoji: '🍓', category: 'Food', level: 3 },
  { id: 'p40', arabic: 'أَحِبُّ الْخُضْرَوَاتِ', meaning: 'I love vegetables', emoji: '🥦', category: 'Food', level: 3 },

  // --- LEVEL 5: School & Learning ---
  { id: 'p41', arabic: 'أَنَا أَذْهَبُ إِلَى الْمَدْرَسَةِ', meaning: 'I go to school', emoji: '🏫', category: 'School', level: 3 },
  { id: 'p42', arabic: 'هَذَا قَلَمٌ', meaning: 'This is a pen', emoji: '🖊️', category: 'School', level: 2 },
  { id: 'p43', arabic: 'هَذَا كِتَابٌ', meaning: 'This is a book', emoji: '📖', category: 'School', level: 2 },
  { id: 'p44', arabic: 'أَنَا أَقْرَأُ الْكِتَابَ', meaning: 'I am reading the book', emoji: '📖', category: 'School', level: 3 },
  { id: 'p45', arabic: 'أَنَا أَكْتُبُ بِالْقَلَمِ', meaning: 'I write with the pen', emoji: '✍️', category: 'School', level: 3 },
  { id: 'p46', arabic: 'الْمُعَلِّمُ طَيِّبٌ', meaning: 'The teacher is kind', emoji: '👨‍🏫', category: 'School', level: 3 },
  { id: 'p47', arabic: 'أَنَا أَتَعَلَّمُ الْعَرَبِيَّةَ', meaning: 'I am learning Arabic', emoji: '📚', category: 'School', level: 3 },
  { id: 'p48', arabic: 'أَنَا أُحِبُّ الْمَدْرَسَةَ', meaning: 'I love school', emoji: '🏫', category: 'School', level: 3 },
  { id: 'p49', arabic: 'هَذَا دَرْسٌ سَهْلٌ', meaning: 'This lesson is easy', emoji: '📝', category: 'School', level: 3 },
  { id: 'p50', arabic: 'أَنَا أَفْهَمُ الدَّرْسَ', meaning: 'I understand the lesson', emoji: '🧠', category: 'School', level: 4 },

  // --- LEVEL 6: Nature & Animals ---
  { id: 'p51', arabic: 'الشَّمْسُ مُشْرِقَةٌ', meaning: 'The sun is shining', emoji: '☀️', category: 'Nature', level: 3 },
  { id: 'p52', arabic: 'السَّمَاءُ زَرْقَاءُ', meaning: 'The sky is blue', emoji: '🌌', category: 'Nature', level: 3 },
  { id: 'p53', arabic: 'الْمَطَرُ يَنْزِلُ', meaning: 'The rain is falling', emoji: '🌧️', category: 'Nature', level: 3 },
  { id: 'p54', arabic: 'أَنَا أَرَى شَجَرَةً', meaning: 'I see a tree', emoji: '🌳', category: 'Nature', level: 3 },
  { id: 'p55', arabic: 'أَنَا أَرَى زَهْرَةً', meaning: 'I see a flower', emoji: '🌸', category: 'Nature', level: 3 },
  { id: 'p56', arabic: 'هَذِهِ قِطَّةٌ جَمِيلَةٌ', meaning: 'This is a beautiful cat', emoji: '🐱', category: 'Animals', level: 3 },
  { id: 'p57', arabic: 'الْكَلْبُ يَلْعَبُ', meaning: 'The dog is playing', emoji: '🐶', category: 'Animals', level: 3 },
  { id: 'p58', arabic: 'الْعُصْفُورُ يُغَرِّدُ', meaning: 'The bird is singing', emoji: '🐦', category: 'Animals', level: 3 },
  { id: 'p59', arabic: 'أَنَا أُحِبُّ الْحَيَوَانَاتِ', meaning: 'I love animals', emoji: '🐾', category: 'Animals', level: 3 },
  { id: 'p60', arabic: 'الْأَسَدُ مَلِكُ الْغَابَةِ', meaning: 'The lion is the king of the jungle', emoji: '🦁', category: 'Animals', level: 4 },

  // --- LEVEL 7: Colors & Shapes ---
  { id: 'p61', arabic: 'هَذَا لَوْنٌ أَحْمَرُ', meaning: 'This is a red color', emoji: '🔴', category: 'Colors', level: 2 },
  { id: 'p62', arabic: 'هَذَا لَوْنٌ أَزْرَقُ', meaning: 'This is a blue color', emoji: '🔵', category: 'Colors', level: 2 },
  { id: 'p63', arabic: 'هَذَا لَوْنٌ أَصْفَرُ', meaning: 'This is a yellow color', emoji: '🟡', category: 'Colors', level: 2 },
  { id: 'p64', arabic: 'هَذَا لَوْنٌ أَخْضَرُ', meaning: 'This is a green color', emoji: '🟢', category: 'Colors', level: 2 },
  { id: 'p65', arabic: 'الْكُرَةُ حَمْرَاءُ', meaning: 'The ball is red', emoji: '🔴', category: 'Colors', level: 3 },
  { id: 'p66', arabic: 'الشَّجَرَةُ خَضْرَاءُ', meaning: 'The tree is green', emoji: '🌳', category: 'Colors', level: 3 },
  { id: 'p67', arabic: 'هَذَا مُرَبَّعٌ', meaning: 'This is a square', emoji: '⬛', category: 'Shapes', level: 3 },
  { id: 'p68', arabic: 'هَذَا دَائِرَةٌ', meaning: 'This is a circle', emoji: '⭕', category: 'Shapes', level: 3 },
  { id: 'p69', arabic: 'هَذَا مُثَلَّثٌ', meaning: 'This is a triangle', emoji: '🔺', category: 'Shapes', level: 3 },
  { id: 'p70', arabic: 'أَنَا أُحِبُّ اللَّوْنَ الْأَزْرَقَ', meaning: 'I love the color blue', emoji: '💙', category: 'Colors', level: 3 },

  // --- LEVEL 8: My Day & Actions ---
  { id: 'p71', arabic: 'أَنَا أَسْتَيْقِظُ صَبَاحًا', meaning: 'I wake up in the morning', emoji: '🌅', category: 'Daily Life', level: 3 },
  { id: 'p72', arabic: 'أَنَا أَغْسِلُ يَدَيَّ', meaning: 'I wash my hands', emoji: '🧼', category: 'Daily Life', level: 3 },
  { id: 'p73', arabic: 'أَنَا أَلْبَسُ مَلَابِسِي', meaning: 'I wear my clothes', emoji: '👕', category: 'Daily Life', level: 3 },
  { id: 'p74', arabic: 'أَنَا أَلْعَبُ بِالْكُرَةِ', meaning: 'I play with the ball', emoji: '⚽', category: 'Daily Life', level: 3 },
  { id: 'p75', arabic: 'أَنَا أَنَامُ فِي اللَّيْلِ', meaning: 'I sleep at night', emoji: '🌙', category: 'Daily Life', level: 3 },
  { id: 'p76', arabic: 'أَنَا أَقُومُ بِاللَّيْلِ', meaning: 'I stand at night', emoji: '🧍', category: 'Daily Life', level: 4 },
  { id: 'p77', arabic: 'أَنَا أَرْكُضُ بِسُرْعَةٍ', meaning: 'I run fast', emoji: '🏃', category: 'Daily Life', level: 4 },
  { id: 'p78', arabic: 'أَنَا أَقْفِزُ عَالِيًا', meaning: 'I jump high', emoji: '🤸', category: 'Daily Life', level: 4 },
  { id: 'p79', arabic: 'أَنَا أَسْمَعُ الصَّوْتَ', meaning: 'I hear the sound', emoji: '🔊', category: 'Daily Life', level: 4 },
  { id: 'p80', arabic: 'أَنَا أَرَى النُّجُومَ', meaning: 'I see the stars', emoji: '⭐', category: 'Daily Life', level: 4 },

  // --- LEVEL 9: Islamic Phrases & Duas ---
  { id: 'p81', arabic: 'بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ', meaning: 'In the name of Allah, the Most Gracious, the Most Merciful', emoji: '🌙', category: 'Islamic', level: 1 },
  { id: 'p82', arabic: 'الْحَمْدُ لِلهِ رَبِّ الْعَالَمِينَ', meaning: 'Praise be to Allah, Lord of the worlds', emoji: '🤲', category: 'Islamic', level: 2 },
  { id: 'p83', arabic: 'اللَّهُ أَكْبَرُ', meaning: 'Allah is the Greatest', emoji: '🕌', category: 'Islamic', level: 1 },
  { id: 'p84', arabic: 'سُبْحَانَ اللهِ', meaning: 'Glory be to Allah', emoji: '✨', category: 'Islamic', level: 1 },
  { id: 'p85', arabic: 'أَسْتَغْفِرُ اللهَ', meaning: 'I seek forgiveness from Allah', emoji: '🤲', category: 'Islamic', level: 2 },
  { id: 'p86', arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', meaning: 'O Allah, send blessings upon Muhammad', emoji: '💚', category: 'Islamic', level: 3 },
  { id: 'p87', arabic: 'إِنْ شَاءَ اللهُ', meaning: 'If Allah wills', emoji: '🌙', category: 'Islamic', level: 2 },
  { id: 'p88', arabic: 'مَا شَاءَ اللهُ', meaning: 'What Allah has willed', emoji: '✨', category: 'Islamic', level: 2 },
  { id: 'p89', arabic: 'جَزَاكَ اللهُ خَيْرًا', meaning: 'May Allah reward you with good', emoji: '🤝', category: 'Islamic', level: 3 },
  { id: 'p90', arabic: 'اللَّهُ يُحِبُّ الصَّابِرِينَ', meaning: 'Allah loves the patient', emoji: '💚', category: 'Islamic', level: 4 },

  // --- LEVEL 10: Advanced Sentences ---
  { id: 'p91', arabic: 'أَنَا أُرِيدُ أَنْ أَتَعَلَّمَ الْعَرَبِيَّةَ', meaning: 'I want to learn Arabic', emoji: '📖', category: 'Advanced', level: 4 },
  { id: 'p92', arabic: 'مَا اسْمُكَ؟', meaning: 'What is your name?', emoji: '📛', category: 'Advanced', level: 2 },
  { id: 'p93', arabic: 'اسْمِي أَحْمَدُ', meaning: 'My name is Ahmed', emoji: '📛', category: 'Advanced', level: 2 },
  { id: 'p94', arabic: 'مِنْ أَيْنَ أَنْتَ؟', meaning: 'Where are you from?', emoji: '🌍', category: 'Advanced', level: 3 },
  { id: 'p95', arabic: 'أَنَا مِنْ غَانَا', meaning: 'I am from Ghana', emoji: '🇬🇭', category: 'Advanced', level: 3 },
  { id: 'p96', arabic: 'هَلْ تَتَكَلَّمُ الْعَرَبِيَّةَ؟', meaning: 'Do you speak Arabic?', emoji: '🗣️', category: 'Advanced', level: 4 },
  { id: 'p97', arabic: 'نَعَمْ، أَتَكَلَّمُ قَلِيلًا', meaning: 'Yes, I speak a little', emoji: '🗣️', category: 'Advanced', level: 4 },
  { id: 'p98', arabic: 'أَنَا سَعِيدٌ جِدًّا', meaning: 'I am very happy', emoji: '😄', category: 'Advanced', level: 3 },
  { id: 'p99', arabic: 'أَنَا أُحِبُّكَ فِي اللهِ', meaning: 'I love you for the sake of Allah', emoji: '❤️', category: 'Advanced', level: 4 },
  { id: 'p100', arabic: 'اللَّهُمَّ اجْعَلْنِي مِنَ الصَّالِحِينَ', meaning: 'O Allah, make me among the righteous', emoji: '🤲', category: 'Advanced', level: 4 },
];