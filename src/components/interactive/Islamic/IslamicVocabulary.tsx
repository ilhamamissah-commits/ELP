import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  RotateCcw,
  Star,
  Volume2,
  BookOpen,
  Target,
  Lightbulb,
  Languages,
} from 'lucide-react';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

type LearningMode = 'guided' | 'practice' | 'mastery';

interface VocabularyQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface VocabularyWord {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  category: string;
  emoji: string;
  pronunciationHint: string;
  explanation: string;
  example: string;
  keyPoints: string[];
  question: VocabularyQuestion;
}

interface WordProgress {
  id: string;
  attempts: number;
  mastered: boolean;
}

interface IslamicVocabularyProps {
  onComplete?: (score: number) => void;
}

const WORDS: VocabularyWord[] = [
  {
    id: 'allah',
    arabic: 'اللَّه',
    transliteration: 'Allah',
    meaning: 'Allah — the One true God',
    category: 'Aqeedah',
    emoji: '🌙',
    pronunciationHint: 'Al-lah',
    explanation:
      'Allah is the proper name of the One true God. Muslims worship Allah alone.',
    example: 'A Muslim remembers Allah and worships Him alone.',
    keyPoints: [
      'Allah is the One true God.',
      'Muslims worship Allah alone.',
      'Allah created everything.',
    ],
    question: {
      question: 'Who do Muslims worship?',
      options: ['Allah alone', 'The sun', 'Animals', 'People'],
      answer: 'Allah alone',
      explanation:
        'Muslims believe that Allah alone deserves worship.',
    },
  },
  {
    id: 'islam',
    arabic: 'إِسْلَام',
    transliteration: 'Islam',
    meaning: 'Submission and obedience to Allah',
    category: 'Foundations',
    emoji: '☪️',
    pronunciationHint: 'Is-laam',
    explanation:
      "Islam is the religion of worshipping Allah and following His guidance through the Qur'an and the teachings of His Messenger.",
    example:
      'A Muslim learns about Islam and tries to live according to its guidance.',
    keyPoints: [
      'Islam teaches worship of Allah.',
      'Islam teaches obedience to Allah.',
      'Islam includes faith and righteous action.',
    ],
    question: {
      question: 'What does Islam teach Muslims to do?',
      options: [
        'Worship Allah and follow His guidance',
        'Worship many gods',
        'Ignore good behaviour',
        'Never learn',
      ],
      answer: 'Worship Allah and follow His guidance',
      explanation:
        'Islam teaches Muslims to worship Allah and follow His guidance.',
    },
  },
  {
    id: 'iman',
    arabic: 'إِيمَان',
    transliteration: 'Iman',
    meaning: 'Faith or belief',
    category: 'Aqeedah',
    emoji: '❤️',
    pronunciationHint: 'Ee-maan',
    explanation:
      "Iman means faith and belief. Islamic faith includes belief in Allah, His angels, His books, His messengers, the Last Day, and Allah's decree.",
    example:
      'A Muslim learns about the articles of Iman and believes in them.',
    keyPoints: [
      'Iman means faith.',
      'Faith includes important beliefs.',
      'Faith should influence how we live.',
    ],
    question: {
      question: 'What does Iman mean?',
      options: ['Faith', 'Food', 'Travel', 'Sleep'],
      answer: 'Faith',
      explanation: 'Iman means faith or belief.',
    },
  },
  {
    id: 'quran',
    arabic: 'الْقُرْآن',
    transliteration: "Al-Qur'an",
    meaning: "The Qur'an",
    category: "Qur'an",
    emoji: '📖',
    pronunciationHint: 'Al-Qur-aan',
    explanation:
      "The Qur'an is the revealed Book of Allah and is the central scripture of Islam.",
    example: "Muslims recite, study, respect, and learn from the Qur'an.",
    keyPoints: [
      "The Qur'an is the Book of Allah.",
      "Muslims recite the Qur'an.",
      "The Qur'an provides guidance.",
    ],
    question: {
      question: "What is the Qur'an?",
      options: [
        'The revealed Book of Allah',
        'A type of food',
        'A place',
        'A game',
      ],
      answer: 'The revealed Book of Allah',
      explanation:
        "The Qur'an is the revealed Book of Allah and provides guidance.",
    },
  },
  {
    id: 'sunnah',
    arabic: 'سُنَّة',
    transliteration: 'Sunnah',
    meaning: 'The way, teachings, and example of the Prophet ﷺ',
    category: 'Prophetic Guidance',
    emoji: '🌿',
    pronunciationHint: 'Sun-nah',
    explanation:
      'The Sunnah refers to the teachings, practices, guidance, and example of the Prophet Muhammad ﷺ.',
    example:
      'Muslims learn the Sunnah to understand how the Prophet ﷺ lived and taught.',
    keyPoints: [
      "The Sunnah teaches the Prophet's example.",
      'It helps Muslims understand how to practise Islam.',
      'Muslims learn from authentic Sunnah.',
    ],
    question: {
      question: 'What does Sunnah refer to?',
      options: [
        "The Prophet's teachings and example",
        'A type of building',
        'A school subject',
        'A meal',
      ],
      answer: "The Prophet's teachings and example",
      explanation:
        'The Sunnah refers to the teachings, practices, and example of the Prophet Muhammad ﷺ.',
    },
  },
  {
    id: 'hadith',
    arabic: 'حَدِيث',
    transliteration: 'Hadith',
    meaning: 'A narration about the Prophet ﷺ',
    category: 'Prophetic Guidance',
    emoji: '📜',
    pronunciationHint: 'Ha-deeth',
    explanation:
      'A Hadith is a report or narration about something the Prophet Muhammad ﷺ said, did, approved of, or was described as doing.',
    example:
      'Students can study carefully authenticated Hadith appropriate to their level.',
    keyPoints: [
      'Hadith are narrations.',
      'They help us learn about the Prophet ﷺ.',
      'Hadith should be taught from reliable sources.',
    ],
    question: {
      question: 'What is a Hadith?',
      options: [
        'A narration about the Prophet ﷺ',
        'A type of prayer mat',
        'A building',
        'A language',
      ],
      answer: 'A narration about the Prophet ﷺ',
      explanation:
        'Hadith are narrations that help Muslims learn about the Prophet ﷺ.',
    },
  },
  {
    id: 'salah',
    arabic: 'صَلَاة',
    transliteration: 'Salah',
    meaning: 'Prayer',
    category: 'Ibadah',
    emoji: '🕌',
    pronunciationHint: 'Sa-laah',
    explanation:
      'Salah is the formal prayer that Muslims perform as an important act of worship.',
    example: 'Muslims perform the five daily prayers.',
    keyPoints: [
      'Salah is an act of worship.',
      'There are five obligatory daily prayers.',
      'Prayer includes physical and verbal acts of worship.',
    ],
    question: {
      question: 'What does Salah mean?',
      options: ['Prayer', 'Charity', 'Travel', 'Food'],
      answer: 'Prayer',
      explanation:
        'Salah means the formal prayer performed by Muslims.',
    },
  },
  {
    id: 'wudu',
    arabic: 'وُضُوء',
    transliteration: 'Wudu',
    meaning: 'Ritual purification before certain acts of worship',
    category: 'Ibadah',
    emoji: '💧',
    pronunciationHint: 'Wu-doo',
    explanation:
      'Wudu is a form of ritual purification involving specific actions with water. It is commonly performed before Salah.',
    example:
      'A child learns the steps of Wudu before learning how to pray.',
    keyPoints: [
      'Wudu is a form of purification.',
      'Water is used in Wudu.',
      'Wudu is commonly performed before Salah.',
    ],
    question: {
      question: 'What is Wudu?',
      options: [
        'Ritual purification',
        'A type of food',
        'A greeting',
        'A story',
      ],
      answer: 'Ritual purification',
      explanation: 'Wudu is a form of ritual purification.',
    },
  },
  {
    id: 'dua',
    arabic: 'دُعَاء',
    transliteration: 'Dua',
    meaning: 'Supplication or calling upon Allah',
    category: 'Worship',
    emoji: '🤲',
    pronunciationHint: 'Doo-aa',
    explanation:
      'Dua means calling upon Allah and asking Him for help, guidance, forgiveness, blessings, or other good things.',
    example:
      'A child can make Dua asking Allah for help and guidance.',
    keyPoints: [
      'Dua is directed to Allah.',
      'A person can ask Allah for good things.',
      'Dua can be made at many appropriate times.',
    ],
    question: {
      question: 'What is Dua?',
      options: [
        'Supplication to Allah',
        'A type of clothing',
        'A building',
        'A game',
      ],
      answer: 'Supplication to Allah',
      explanation: 'Dua is supplication and calling upon Allah.',
    },
  },
  {
    id: 'dhikr',
    arabic: 'ذِكْر',
    transliteration: 'Dhikr',
    meaning: 'Remembering and mentioning Allah',
    category: 'Worship',
    emoji: '✨',
    pronunciationHint: 'Dhikr',
    explanation:
      'Dhikr means remembering Allah. It can include words and phrases used to praise and remember Allah.',
    example:
      'A Muslim can make Dhikr by remembering Allah with appropriate words of praise.',
    keyPoints: [
      'Dhikr means remembering Allah.',
      'Dhikr can be spoken.',
      'Dhikr helps a Muslim remember Allah.',
    ],
    question: {
      question: 'What does Dhikr mean?',
      options: [
        'Remembering Allah',
        'Eating',
        'Travelling',
        'Sleeping',
      ],
      answer: 'Remembering Allah',
      explanation: 'Dhikr means remembering and mentioning Allah.',
    },
  },
  {
    id: 'sabr',
    arabic: 'صَبْر',
    transliteration: 'Sabr',
    meaning: 'Patience and perseverance',
    category: 'Character',
    emoji: '🌱',
    pronunciationHint: 'Sabr',
    explanation:
      'Sabr means patience and perseverance. Muslims learn to remain patient while facing difficulties and while doing what is right.',
    example:
      'A child practises Sabr when learning something difficult instead of giving up.',
    keyPoints: [
      'Sabr means patience.',
      'Sabr includes perseverance.',
      'Patience can help us respond wisely.',
    ],
    question: {
      question: 'What does Sabr mean?',
      options: ['Patience', 'Anger', 'Food', 'Sleep'],
      answer: 'Patience',
      explanation: 'Sabr means patience and perseverance.',
    },
  },
  {
    id: 'shukr',
    arabic: 'شُكْر',
    transliteration: 'Shukr',
    meaning: 'Gratitude and thankfulness',
    category: 'Character',
    emoji: '🌟',
    pronunciationHint: 'Shukr',
    explanation:
      "Shukr means gratitude and thankfulness. Muslims learn to recognize Allah's blessings and be thankful.",
    example:
      'A child shows Shukr by thanking Allah for food, family, health, and other blessings.',
    keyPoints: [
      'Shukr means gratitude.',
      'Muslims thank Allah for His blessings.',
      'Gratitude can be shown through words and actions.',
    ],
    question: {
      question: 'What does Shukr mean?',
      options: ['Gratitude', 'Anger', 'Running', 'Silence'],
      answer: 'Gratitude',
      explanation: 'Shukr means gratitude and thankfulness.',
    },
  },
  {
    id: 'akhlaq',
    arabic: 'أَخْلَاق',
    transliteration: 'Akhlaq',
    meaning: 'Character and moral behaviour',
    category: 'Character',
    emoji: '❤️',
    pronunciationHint: 'Akh-laaq',
    explanation:
      'Akhlaq refers to character, manners, and moral behaviour. Islam teaches Muslims to develop good character.',
    example:
      'Kindness, honesty, patience, and respect are examples of good character.',
    keyPoints: [
      'Akhlaq relates to character.',
      'Good character affects how we treat others.',
      'Muslims are encouraged to develop good manners.',
    ],
    question: {
      question: 'What does Akhlaq refer to?',
      options: [
        'Character and moral behaviour',
        'A type of food',
        'A building',
        'A country',
      ],
      answer: 'Character and moral behaviour',
      explanation:
        'Akhlaq refers to character, manners, and moral behaviour.',
    },
  },
  {
    id: 'halal',
    arabic: 'حَلَال',
    transliteration: 'Halal',
    meaning: 'Permitted or lawful',
    category: 'Everyday Islam',
    emoji: '✅',
    pronunciationHint: 'Ha-laal',
    explanation:
      'Halal describes something that is permitted or lawful according to Islamic guidance.',
    example: 'Muslims learn which foods and actions are halal.',
    keyPoints: [
      'Halal means permitted.',
      'The word can apply to different areas of life.',
      'Muslims learn what is permitted from Islamic guidance.',
    ],
    question: {
      question: 'What does Halal mean?',
      options: ['Permitted', 'Forbidden', 'Difficult', 'Unknown'],
      answer: 'Permitted',
      explanation: 'Halal means permitted or lawful.',
    },
  },
  {
    id: 'haram',
    arabic: 'حَرَام',
    transliteration: 'Haram',
    meaning: 'Forbidden or prohibited',
    category: 'Everyday Islam',
    emoji: '🚫',
    pronunciationHint: 'Ha-raam',
    explanation:
      'Haram describes something that Islamic guidance prohibits. Children should learn examples appropriately and with guidance from trusted adults and qualified teachers.',
    example:
      'A child learns that Muslims should avoid things that Allah has prohibited.',
    keyPoints: [
      'Haram means prohibited.',
      'Islamic rulings should be learned from reliable sources.',
      'Children should ask trusted adults when unsure.',
    ],
    question: {
      question: 'What does Haram mean?',
      options: ['Forbidden', 'Permitted', 'Beautiful', 'Fast'],
      answer: 'Forbidden',
      explanation: 'Haram means forbidden or prohibited.',
    },
  },
  {
    id: 'masjid',
    arabic: 'مَسْجِد',
    transliteration: 'Masjid',
    meaning: 'Mosque',
    category: 'Places',
    emoji: '🕌',
    pronunciationHint: 'Mas-jid',
    explanation:
      'A Masjid is a place of worship for Muslims. Muslims may gather there for prayer, learning, and community activities.',
    example: 'The family visits the Masjid for prayer.',
    keyPoints: [
      'Masjid means mosque.',
      'It is a place of Muslim worship.',
      'Good manners should be observed in the Masjid.',
    ],
    question: {
      question: 'What is a Masjid?',
      options: ['A mosque', 'A type of food', 'A book', 'A person'],
      answer: 'A mosque',
      explanation:
        'Masjid means mosque, a place of worship for Muslims.',
    },
  },
  {
    id: 'ummah',
    arabic: 'أُمَّة',
    transliteration: 'Ummah',
    meaning: 'The worldwide Muslim community',
    category: 'Community',
    emoji: '🌍',
    pronunciationHint: 'Um-mah',
    explanation:
      'Ummah can refer to the worldwide Muslim community. Muslims in different countries and cultures are connected by their faith.',
    example:
      'Muslims around the world are part of the wider Ummah.',
    keyPoints: [
      'Ummah can refer to the Muslim community.',
      'Muslims live in many countries and cultures.',
      'Community includes care and responsibility toward others.',
    ],
    question: {
      question: 'What can Ummah refer to?',
      options: [
        'The Muslim community',
        'A type of prayer',
        'A food',
        'A school',
      ],
      answer: 'The Muslim community',
      explanation:
        'Ummah can refer to the worldwide Muslim community.',
    },
  },
  {
    id: 'rahmah',
    arabic: 'رَحْمَة',
    transliteration: 'Rahmah',
    meaning: 'Mercy and compassion',
    category: 'Character',
    emoji: '🤍',
    pronunciationHint: 'Rah-mah',
    explanation:
      'Rahmah means mercy and compassion. Muslims learn to show kindness and compassion toward people and living creatures.',
    example:
      'A child shows Rahmah by treating animals gently.',
    keyPoints: [
      'Rahmah means mercy.',
      'Mercy includes compassion.',
      'Kindness can be shown through actions.',
    ],
    question: {
      question: 'What does Rahmah mean?',
      options: [
        'Mercy and compassion',
        'Anger',
        'Food',
        'Travel',
      ],
      answer: 'Mercy and compassion',
      explanation: 'Rahmah means mercy and compassion.',
    },
  },
  {
    id: 'tawhid',
    arabic: 'تَوْحِيد',
    transliteration: 'Tawhid',
    meaning: 'Affirming the oneness of Allah',
    category: 'Aqeedah',
    emoji: '☝️',
    pronunciationHint: 'Taw-heed',
    explanation:
      'Tawhid refers to affirming the oneness of Allah and worshipping Him alone.',
    example:
      'Learning Tawhid helps a Muslim understand that Allah alone deserves worship.',
    keyPoints: [
      'Tawhid is connected to the oneness of Allah.',
      'Allah alone deserves worship.',
      'Tawhid is a central concept in Islamic belief.',
    ],
    question: {
      question: 'What is Tawhid about?',
      options: [
        'The oneness of Allah',
        'Cooking',
        'Geography',
        'Sports',
      ],
      answer: 'The oneness of Allah',
      explanation:
        'Tawhid refers to affirming the oneness of Allah.',
    },
  },
];

const createInitialProgress = (): WordProgress[] =>
  WORDS.map((word) => ({
    id: word.id,
    attempts: 0,
    mastered: false,
  }));

export const IslamicVocabulary: React.FC<IslamicVocabularyProps> = ({
  onComplete,
}) => {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<LearningMode>('guided');
  const [progress, setProgress] =
    useState<WordProgress[]>(createInitialProgress);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak } = useReadAloud();

  const current = WORDS[index];

  const currentProgress = useMemo(
    () =>
      progress.find((item) => item.id === current.id) ?? {
        id: current.id,
        attempts: 0,
        mastered: false,
      },
    [progress, current.id]
  );

  const masteredCount = progress.filter((item) => item.mastered).length;

  const masteryPercentage = Math.round(
    (masteredCount / WORDS.length) * 100
  );

  // Arabic still uses its own voice but gated on soundEnabled
  const speakArabic = () => {
    if (!soundEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(current.arabic);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.72;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  // Reset per-word state + auto-read the word and prompt
  useEffect(() => {
    setSelectedAnswer(null);
    setAnswerChecked(false);

    if (!autoReadEnabled) return;

    const readOut =
      mode === 'guided'
        ? `${current.transliteration}. ${current.meaning}. ${current.explanation}`
        : `${current.transliteration}. ${current.question.question}`;

    const timer = window.setTimeout(() => speak(readOut), 400);
    return () => window.clearTimeout(timer);
  }, [index, mode, current, speak, autoReadEnabled]);

  const updateCurrentProgress = (
    updater: (item: WordProgress) => WordProgress
  ) => {
    setProgress((previous) =>
      previous.map((item) =>
        item.id === current.id ? updater(item) : item
      )
    );
  };

  const checkAnswer = () => {
    if (!selectedAnswer || answerChecked) return;

    const correct = selectedAnswer === current.question.answer;

    setAnswerChecked(true);

    updateCurrentProgress((item) => ({
      ...item,
      attempts: item.attempts + 1,
    }));

    if (!correct) {
      if (soundEnabled) playSoundFeedback('try-again');

      setStreak(0);

      speak(
        `Let's review it. The correct answer is: ${current.question.answer}. ${current.question.explanation}`,
      );

      return;
    }

    if (soundEnabled) playSoundFeedback('correct');

    speak(`Correct! ${current.question.explanation}`);

    const nextStreak = streak + 1;
    setStreak(nextStreak);

    if (mode === 'mastery' && !currentProgress.mastered) {
      const bonus = nextStreak >= 2 ? 5 : 0;

      setScore((previous) => previous + 10 + bonus);

      updateCurrentProgress((item) => ({
        ...item,
        mastered: true,
      }));
    }
  };

  const markGuidedComplete = () => {
    if (currentProgress.mastered) return;

    updateCurrentProgress((item) => ({
      ...item,
      attempts: item.attempts + 1,
      mastered: true,
    }));

    if (soundEnabled) playSoundFeedback('correct');

    setScore((previous) => previous + 10);
    setStreak((previous) => previous + 1);

    speak(`Well done. You know the word ${current.transliteration}.`);
  };

  const next = () => {
    if (index < WORDS.length - 1) {
      setIndex((previous) => previous + 1);
    } else {
      setIsComplete(true);
    }
  };

  const previous = () => {
    if (index > 0) {
      setIndex((previous) => previous - 1);
    }
  };

  const reset = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setIndex(0);
    setMode('guided');
    setProgress(createInitialProgress());
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setScore(0);
    setStreak(0);
    setIsComplete(false);
    setHasFinished(false);

    speak("Let's practise Islamic vocabulary again!");
  };

  const finish = () => {
    if (hasFinished) return;

    setHasFinished(true);
    onComplete?.(score);

    speak(
      `Masha'Allah! You mastered ${masteredCount} of ${WORDS.length} words and earned ${score} points.`,
    );
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
      >
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
            <Languages className="h-10 w-10 text-amber-500" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Islamic Studies
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            Islamic Vocabulary Complete
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            You explored important Arabic vocabulary used throughout Islamic
            belief, worship, character, Qur&apos;an learning, and everyday
            Muslim life.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <Target className="mx-auto mb-2 h-6 w-6 text-slate-600" />
              <p className="text-2xl font-bold text-slate-900">
                {masteredCount}
              </p>
              <p className="text-sm text-slate-500">Words mastered</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <Star className="mx-auto mb-2 h-6 w-6 text-amber-500" />
              <p className="text-2xl font-bold text-slate-900">{score}</p>
              <p className="text-sm text-slate-500">Learning points</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <CheckCircle className="mx-auto mb-2 h-6 w-6 text-emerald-600" />
              <p className="text-2xl font-bold text-slate-900">
                {masteryPercentage}%
              </p>
              <p className="text-sm text-slate-500">Mastery</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 p-6 text-left">
            <h3 className="flex items-center gap-2 font-semibold text-slate-900">
              <BookOpen className="h-5 w-5 text-slate-600" />
              Learning outcomes
            </h3>

            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>• Recognize important Arabic Islamic vocabulary.</li>
              <li>• Connect Arabic terms with their meanings.</li>
              <li>• Understand vocabulary used in Aqeedah and Ibadah.</li>
              <li>
                • Recognize important character and manners vocabulary.
              </li>
              <li>• Build a foundation for reading Islamic texts.</li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" />
              Learn Again
            </button>

            <button
              type="button"
              onClick={finish}
              disabled={hasFinished}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowRight className="h-4 w-4" />
              {hasFinished ? 'Completed' : 'Finish & Move Up'}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Islamic Studies
            </p>

            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Islamic Vocabulary
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Build the Arabic vocabulary needed for Islamic learning.
            </p>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-xs text-slate-500">Score</p>
              <p className="font-bold text-slate-900">{score}</p>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-500">Streak</p>
              <p className="font-bold text-slate-900">{streak}</p>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-500">Mastery</p>
              <p className="font-bold text-slate-900">
                {masteredCount}/{WORDS.length}
              </p>
            </div>

            <button
              type="button"
              onClick={toggleSound}
              aria-label="Toggle sound"
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Volume2
                className={`w-5 h-5 ${
                  soundEnabled ? 'text-amber-500' : 'text-slate-400'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((index + 1) / WORDS.length) * 100}%` }}
            className="h-full rounded-full bg-slate-900"
          />
        </div>
      </div>

      {/* Learning Modes */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            id: 'guided' as const,
            title: 'Guided',
            description: 'Learn the word with support.',
          },
          {
            id: 'practice' as const,
            title: 'Practice',
            description: 'Test your understanding.',
          },
          {
            id: 'mastery' as const,
            title: 'Mastery',
            description: 'Demonstrate independent recall.',
          },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setMode(item.id);

              speak(
                item.id === 'guided'
                  ? 'Guided mode. Learn the word with support.'
                  : item.id === 'practice'
                    ? 'Practice mode. Test your understanding.'
                    : 'Mastery mode. Demonstrate independent recall.',
              );
            }}
            className={`rounded-2xl border p-4 text-left transition ${
              mode === item.id
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <p className="font-semibold">{item.title}</p>

            <p
              className={`mt-1 text-xs ${
                mode === item.id ? 'text-slate-300' : 'text-slate-500'
              }`}
            >
              {item.description}
            </p>
          </button>
        ))}
      </div>

      {/* Vocabulary Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <span className="text-5xl">{current.emoji}</span>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {current.category}
          </p>

          <div
            dir="rtl"
            lang="ar"
            className="mt-4 text-6xl font-semibold text-slate-900"
          >
            {current.arabic}
          </div>

          <p className="mt-4 text-xl font-semibold text-slate-800">
            {current.transliteration}
          </p>

          <p className="mt-2 text-lg text-slate-600">{current.meaning}</p>

          <button
            type="button"
            onClick={speakArabic}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Volume2 className="h-4 w-4" />
            Hear Arabic
          </button>

          <p className="mt-3 text-xs text-slate-500">
            Pronunciation: {current.pronunciationHint}
          </p>
        </div>

        {/* Guided explanation */}
        {mode === 'guided' && (
          <>
            <div className="mt-8 rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                Meaning &amp; Context
              </p>

              <p className="mt-2 leading-7 text-slate-700">
                {current.explanation}
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                Example
              </p>

              <p className="mt-2 leading-7 text-slate-700">
                {current.example}
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {current.keyPoints.map((point) => (
                <div key={point} className="rounded-xl bg-slate-50 p-4">
                  <CheckCircle className="mb-2 h-5 w-5 text-emerald-600" />

                  <p className="text-sm leading-6 text-slate-600">{point}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={markGuidedComplete}
              disabled={currentProgress.mastered}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircle className="h-4 w-4" />
              {currentProgress.mastered
                ? 'Word Learned'
                : 'I Know This Word'}
            </button>
          </>
        )}

        {/* Practice / Mastery */}
        {mode !== 'guided' && (
          <div className="mt-8 rounded-2xl border border-slate-200 p-5">
            <div className="flex items-start gap-3">
              <Target className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />

              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">
                  Vocabulary Check
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {current.question.question}
                </p>

                <div className="mt-4 space-y-2">
                  {current.question.options.map((option) => {
                    const selected = selectedAnswer === option;
                    const correct =
                      answerChecked && option === current.question.answer;

                    return (
                      <button
                        key={option}
                        type="button"
                        disabled={answerChecked}
                        onClick={() => setSelectedAnswer(option)}
                        className={`w-full rounded-xl border p-4 text-left text-sm transition ${
                          correct
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                            : selected
                              ? 'border-slate-900 bg-slate-900 text-white'
                              : 'border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {!answerChecked && (
                  <button
                    type="button"
                    disabled={!selectedAnswer}
                    onClick={checkAnswer}
                    className="mt-4 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Check Answer
                  </button>
                )}

                {answerChecked && (
                  <div
                    className={`mt-4 rounded-xl p-4 ${
                      selectedAnswer === current.question.answer
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-rose-50 text-rose-800'
                    }`}
                  >
                    <p className="font-semibold">
                      {selectedAnswer === current.question.answer
                        ? 'Correct!'
                        : "Let's review it."}
                    </p>

                    <p className="mt-1 text-sm leading-6">
                      {selectedAnswer === current.question.answer
                        ? current.question.explanation
                        : `The correct answer is "${current.question.answer}".`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {answerChecked && (
              <div className="mt-5 rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Remember
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {current.explanation}
                </p>

                <div className="mt-4 rounded-xl bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                    Example
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {current.example}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={previous}
            disabled={index === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>

          <div className="hidden items-center gap-2 sm:flex">
            {WORDS.map((word, wordIndex) => {
              const wordProgress = progress.find(
                (item) => item.id === word.id
              );

              return (
                <button
                  key={word.id}
                  type="button"
                  onClick={() => setIndex(wordIndex)}
                  aria-label={`Go to vocabulary word ${wordIndex + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    wordIndex === index
                      ? 'w-8 bg-slate-900'
                      : wordProgress?.mastered
                        ? 'w-2.5 bg-emerald-500'
                        : 'w-2.5 bg-slate-200'
                  }`}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {index === WORDS.length - 1 ? 'Complete' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Vocabulary Progress
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Learn, hear, practise, and master important Islamic terms.
            </p>
          </div>

          <p className="text-sm font-semibold text-slate-700">
            {masteredCount} of {WORDS.length} mastered
          </p>
        </div>

        <div className="mt-4 grid grid-cols-8 gap-2 sm:grid-cols-16">
          {progress.map((item) => (
            <div
              key={item.id}
              className={`h-2 rounded-full ${
                item.mastered
                  ? 'bg-emerald-500'
                  : item.attempts > 0
                    ? 'bg-amber-300'
                    : 'bg-slate-100'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Learning note */}
      <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />

        <div>
          <p className="text-sm font-semibold text-slate-900">
            Build vocabulary through use
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Children should encounter each word repeatedly across Islamic
            Studies, Arabic, Qur&apos;an, Hadith, Ibadah, and everyday
            learning. Vocabulary mastery should come from recognition,
            pronunciation, meaning, and practical context.
          </p>
        </div>
      </div>
    </motion.div>
  );
};