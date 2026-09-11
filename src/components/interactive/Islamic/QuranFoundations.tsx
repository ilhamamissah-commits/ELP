import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Heart,
  Lightbulb,
  RotateCcw,
  Star,
  Target,
  Volume2,
} from 'lucide-react';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

type LearningMode = 'guided' | 'practice' | 'mastery';

interface QuranQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface QuranLesson {
  id: string;
  title: string;
  arabicTitle: string;
  emoji: string;
  category: string;
  introduction: string;
  explanation: string;
  keyPoints: string[];
  reflection: string;
  question: QuranQuestion;
}

interface QuranProgress {
  id: string;
  attempts: number;
  mastered: boolean;
}

interface QuranFoundationsProps {
  onComplete?: (score: number) => void;
}

const LESSONS: QuranLesson[] = [
  {
    id: 'what-is-quran',
    title: "What Is the Qur'an?",
    arabicTitle: 'الْقُرْآنُ',
    emoji: '📖',
    category: "Qur'an Foundations",
    introduction:
      "The Qur'an is the Book revealed by Allah to Prophet Muhammad ﷺ.",
    explanation:
      "Muslims believe that the Qur'an is the speech of Allah and His final revealed Book. It was revealed to Prophet Muhammad ﷺ through Jibril عليه السلام. Muslims read it, listen to it, learn from it, and try to live according to its guidance.",
    keyPoints: [
      "The Qur'an is the Book of Allah.",
      'It was revealed to Prophet Muhammad ﷺ.',
      "The Qur'an gives guidance to people.",
    ],
    reflection:
      "Why should Muslims treat the Qur'an with love and respect?",
    question: {
      question: "What is the Qur'an?",
      options: [
        'The Book revealed by Allah',
        'A history book written by people',
        'A storybook about animals',
        'A book of mathematics',
      ],
      answer: 'The Book revealed by Allah',
      explanation:
        "The Qur'an is the Book revealed by Allah to Prophet Muhammad ﷺ.",
    },
  },
  {
    id: 'revelation',
    title: "How the Qur'an Was Revealed",
    arabicTitle: 'وَحْيٌ',
    emoji: '🌙',
    category: 'Revelation',
    introduction:
      "Allah revealed the Qur'an to Prophet Muhammad ﷺ over a period of years.",
    explanation:
      "The Qur'an was revealed to Prophet Muhammad ﷺ through the angel Jibril عليه السلام. The revelation began in Makkah and continued through the Prophet's mission until shortly before his death.",
    keyPoints: [
      'Jibril عليه السلام brought revelation.',
      'The revelation began in Makkah.',
      "The Qur'an was revealed gradually.",
    ],
    reflection:
      'What can gradual learning teach us about patience?',
    question: {
      question: "Who brought the Qur'anic revelation to the Prophet ﷺ?",
      options: [
        'Jibril عليه السلام',
        'Abu Bakr رضي الله عنه',
        'Umar رضي الله عنه',
        'Bilal رضي الله عنه',
      ],
      answer: 'Jibril عليه السلام',
      explanation:
        "Jibril عليه السلام brought Allah's revelation to Prophet Muhammad ﷺ.",
    },
  },
  {
    id: 'respect-quran',
    title: "Respecting the Qur'an",
    arabicTitle: 'أَدَبُ الْقُرْآنِ',
    emoji: '🤲',
    category: 'Adab',
    introduction:
      "Muslims learn to approach the Qur'an with respect, cleanliness, attention, and care.",
    explanation:
      "The Qur'an deserves special respect. Children can learn to handle a physical mushaf carefully, listen attentively, keep their learning space clean, and approach Qur'an learning with good manners.",
    keyPoints: [
      "Treat the Qur'an respectfully.",
      'Listen carefully during recitation.',
      'Keep your learning space clean.',
    ],
    reflection:
      "What can you do to show respect when learning Qur'an?",
    question: {
      question: "Which is a good Qur'an learning habit?",
      options: [
        'Listening carefully',
        'Talking while someone recites',
        'Throwing the mushaf',
        'Using it as a toy',
      ],
      answer: 'Listening carefully',
      explanation:
        "Listening attentively and treating the Qur'an with respect are good learning habits.",
    },
  },
  {
    id: 'arabic-letters',
    title: 'Arabic Letters',
    arabicTitle: 'الْحُرُوفُ الْعَرَبِيَّةُ',
    emoji: '🔤',
    category: 'Arabic Foundations',
    introduction:
      "Learning the Arabic letters is an important foundation for reading the Qur'an.",
    explanation:
      "The Qur'an is written in Arabic. Before children can read Qur'anic words confidently, they need to recognize Arabic letters and understand their sounds and shapes.",
    keyPoints: [
      "The Qur'an is written in Arabic.",
      'Arabic has 28 basic letters.',
      "Letter recognition supports Qur'an reading.",
    ],
    reflection:
      'Which Arabic letter do you enjoy practising?',
    question: {
      question: 'How many basic Arabic letters are there?',
      options: ['28', '10', '15', '50'],
      answer: '28',
      explanation: 'Arabic has 28 basic letters.',
    },
  },
  {
    id: 'harakat',
    title: 'Short Vowels',
    arabicTitle: 'الْحَرَكَاتُ',
    emoji: '🔤',
    category: 'Recitation Foundations',
    introduction:
      'Harakat help us know how an Arabic letter should be pronounced.',
    explanation:
      "The three basic short vowels taught at foundation level are Fathah, Kasrah, and Dammah. Children learn to connect the letter with its vowel sound, such as بَ, بِ, and بُ.",
    keyPoints: [
      "Fathah gives an 'a' sound.",
      "Kasrah gives an 'i' sound.",
      "Dammah gives a 'u' sound.",
    ],
    reflection:
      'Can you say the three short vowel sounds slowly?',
    question: {
      question: 'Which harakah gives بَ its short vowel sound?',
      options: ['Fathah', 'Kasrah', 'Dammah', 'Sukoon'],
      answer: 'Fathah',
      explanation:
        "Fathah is the short vowel mark that gives بَ its 'ba' sound.",
    },
  },
  {
    id: 'sukoon',
    title: 'Sukoon',
    arabicTitle: 'السُّكُونُ',
    emoji: '⏸️',
    category: 'Recitation Foundations',
    introduction:
      'Sukoon tells us that a letter has no short vowel after it.',
    explanation:
      'Sukoon is written as ْ above a letter. Children learn to recognize it and practise joining letters with sukoon carefully.',
    keyPoints: [
      'Sukoon is written as ْ.',
      'A letter with sukoon has no short vowel.',
      'Sukoon helps children read connected sounds.',
    ],
    reflection:
      'What happens to a letter when it has sukoon?',
    question: {
      question: 'Which mark represents Sukoon?',
      options: ['ْ', 'َ', 'ِ', 'ُ'],
      answer: 'ْ',
      explanation:
        'The small circle-like mark ْ represents Sukoon.',
    },
  },
  {
    id: 'shaddah',
    title: 'Shaddah',
    arabicTitle: 'الشَّدَّةُ',
    emoji: '🔁',
    category: 'Recitation Foundations',
    introduction:
      'Shaddah tells us that a letter is strengthened or doubled in pronunciation.',
    explanation:
      'Shaddah is written as ّ above a letter. At foundation level, children learn to recognize the symbol and hear the stronger, doubled consonant sound.',
    keyPoints: [
      'Shaddah is written as ّ.',
      'It indicates a doubled consonant sound.',
      'Careful listening helps children recognize it.',
    ],
    reflection:
      'Can you spot the Shaddah mark when you see it?',
    question: {
      question: 'Which mark represents Shaddah?',
      options: ['ّ', 'ْ', 'َ', 'ً'],
      answer: 'ّ',
      explanation: 'The mark ّ is called Shaddah.',
    },
  },
  {
    id: 'madd',
    title: 'Long Vowels',
    arabicTitle: 'الْمَدُّ',
    emoji: '〰️',
    category: 'Recitation Foundations',
    introduction:
      'Madd means extending a sound for a longer duration.',
    explanation:
      'Children begin learning the basic long vowel patterns: Fathah with Alif, Kasrah with Ya, and Dammah with Waw. For example, بَا, بِي, and بُو.',
    keyPoints: [
      'Madd means extending a sound.',
      'Alif can follow Fathah.',
      'Ya can follow Kasrah.',
      'Waw can follow Dammah.',
    ],
    reflection:
      'Can you hear the difference between a short and a long vowel?',
    question: {
      question: "Which sound shows a long 'aa' sound?",
      options: ['بَا', 'بَ', 'بِ', 'بُ'],
      answer: 'بَا',
      explanation:
        "بَا contains Fathah followed by Alif and produces a long 'aa' sound.",
    },
  },
  {
    id: 'tanween',
    title: 'Tanween',
    arabicTitle: 'التَّنْوِينُ',
    emoji: '🔤',
    category: 'Recitation Foundations',
    introduction:
      'Tanween is a special ending sound represented by two vowel marks.',
    explanation:
      'Children can begin by recognizing the three basic tanween forms: ـً, ـٍ, and ـٌ. More advanced pronunciation rules can be introduced gradually.',
    keyPoints: [
      'Tanween uses two vowel marks.',
      'There are three basic tanween forms.',
      'Correct pronunciation develops through practice.',
    ],
    reflection:
      'Can you find the three tanween marks?',
    question: {
      question: 'Which one is a tanween mark?',
      options: ['ٌ', 'َ', 'ِ', 'ُ'],
      answer: 'ٌ',
      explanation:
        'Dammatayn ٌ is one of the three basic tanween forms.',
    },
  },
  {
    id: 'surah',
    title: 'What Is a Surah?',
    arabicTitle: 'سُورَةٌ',
    emoji: '📚',
    category: "Qur'an Structure",
    introduction: "A Surah is a chapter of the Qur'an.",
    explanation:
      'The Qur’an is made up of 114 Surahs. Surahs vary in length. Some are very short and some are much longer. Children can begin by becoming familiar with short Surahs that they hear and recite regularly.',
    keyPoints: [
      "A Surah is a chapter of the Qur'an.",
      "The Qur'an contains 114 Surahs.",
      'Surahs have different lengths.',
    ],
    reflection:
      'Which short Surah do you enjoy listening to?',
    question: {
      question: 'What is a Surah?',
      options: [
        "A chapter of the Qur'an",
        'A type of prayer',
        'An Arabic letter',
        'A type of charity',
      ],
      answer: "A chapter of the Qur'an",
      explanation: "A Surah is a chapter of the Qur'an.",
    },
  },
  {
    id: 'ayah',
    title: 'What Is an Ayah?',
    arabicTitle: 'آيَةٌ',
    emoji: '✨',
    category: "Qur'an Structure",
    introduction: "An Ayah is a verse of the Qur'an.",
    explanation:
      'Surahs are made up of individual verses called Ayat. Children can learn to recognize verse endings and understand that each Ayah is part of the revealed Qur’an.',
    keyPoints: [
      "An Ayah is a verse of the Qur'an.",
      'Surahs contain Ayat.',
      'Every Ayah should be treated with respect.',
    ],
    reflection:
      'Why is it useful to learn one Ayah at a time?',
    question: {
      question: 'What is an Ayah?',
      options: [
        "A verse of the Qur'an",
        'A mosque',
        'An Arabic vowel',
        'A prayer position',
      ],
      answer: "A verse of the Qur'an",
      explanation: "An Ayah is a verse of the Qur'an.",
    },
  },
  {
    id: 'bismillah',
    title: 'Bismillah',
    arabicTitle: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    emoji: '🤲',
    category: "Qur'an & Daily Life",
    introduction:
      'Muslims often begin good actions by saying Bismillah.',
    explanation:
      "Bismillah means 'In the name of Allah, the Most Merciful, the Especially Merciful.' Children can learn its meaning and practise saying it before appropriate everyday actions such as eating and beginning beneficial activities.",
    keyPoints: [
      'Bismillah begins with the name of Allah.',
      "It reminds us to seek Allah's blessing.",
      'Children can learn its meaning and use.',
    ],
    reflection:
      'When can you remember to say Bismillah?',
    question: {
      question: 'What does Bismillah begin with?',
      options: [
        'The name of Allah',
        'The name of a place',
        'The name of a person',
        'The name of an animal',
      ],
      answer: 'The name of Allah',
      explanation:
        'Bismillah begins with the name of Allah.',
    },
  },
  {
    id: 'short-surahs',
    title: 'Learning Short Surahs',
    arabicTitle: 'السُّوَرُ الْقِصَارُ',
    emoji: '🌟',
    category: 'Memorisation Foundations',
    introduction:
      "Short Surahs can provide an accessible beginning for Qur'an memorisation.",
    explanation:
      'Children can gradually learn short Surahs through listening, repetition, careful recitation, and understanding simple meanings. Memorisation should be encouraging and should not become a source of unnecessary pressure.',
    keyPoints: [
      'Listen before trying to memorise.',
      'Practise small portions repeatedly.',
      'Understand simple meanings alongside memorisation.',
    ],
    reflection:
      'What helps you remember something you have learned?',
    question: {
      question: 'What is a helpful way to learn a short Surah?',
      options: [
        'Practise small portions repeatedly',
        'Try to memorise everything at once',
        'Never listen to the recitation',
        'Rush through the words',
      ],
      answer: 'Practise small portions repeatedly',
      explanation:
        'Small portions, repetition, listening, and understanding can support healthy memorisation.',
    },
  },
  {
    id: 'listening',
    title: 'Listening to Recitation',
    arabicTitle: 'الاسْتِمَاعُ',
    emoji: '👂',
    category: 'Recitation',
    introduction:
      "Careful listening helps children develop accurate Qur'an reading and pronunciation.",
    explanation:
      'Children can listen to a reliable reciter, follow the text, notice individual sounds, and repeat short portions. Listening should be calm and focused.',
    keyPoints: [
      'Listen carefully.',
      'Follow the written text.',
      'Repeat short portions.',
      'Ask a qualified teacher when unsure.',
    ],
    reflection:
      'What sounds do you notice when you listen carefully?',
    question: {
      question: "Why is listening useful when learning Qur'an?",
      options: [
        'It helps us hear pronunciation',
        'It makes reading unnecessary',
        'It means we never need practice',
        'It replaces learning Arabic letters',
      ],
      answer: 'It helps us hear pronunciation',
      explanation:
        'Listening helps children hear sounds and pronunciation clearly.',
    },
  },
  {
    id: 'meaning',
    title: 'Learning the Meaning',
    arabicTitle: 'مَعْنَى',
    emoji: '💡',
    category: 'Understanding',
    introduction:
      "Qur'an learning includes understanding what Allah teaches us.",
    explanation:
      'Reciting the Qur’an is important, but children should also begin to understand age-appropriate meanings. Simple explanations can help children connect Qur’anic guidance with their daily lives.',
    keyPoints: [
      'Recitation and understanding can grow together.',
      'Use age-appropriate explanations.',
      'Look for lessons that can guide daily behaviour.',
    ],
    reflection:
      "How can learning Qur'an change the way you behave?",
    question: {
      question: "Why should children learn Qur'an meanings?",
      options: [
        'To understand its guidance',
        'Only to win points',
        'So they can avoid reading it',
        'Because meanings are more important than worship',
      ],
      answer: 'To understand its guidance',
      explanation:
        "Understanding Qur'anic guidance helps children connect learning with their lives.",
    },
  },
];

const createInitialProgress = (): QuranProgress[] =>
  LESSONS.map((lesson) => ({
    id: lesson.id,
    attempts: 0,
    mastered: false,
  }));

export const QuranFoundations: React.FC<QuranFoundationsProps> = ({
  onComplete,
}) => {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<LearningMode>('guided');
  const [progress, setProgress] = useState<QuranProgress[]>(
    createInitialProgress
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [reflectionShown, setReflectionShown] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak } = useReadAloud();

  const current = LESSONS[index];

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
    (masteredCount / LESSONS.length) * 100
  );

  // Reset per-lesson state + auto-read the intro and prompt
  useEffect(() => {
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setReflectionShown(false);

    if (!autoReadEnabled) return;

    const readOut =
      mode === 'guided'
        ? `${current.title}. ${current.introduction}. ${current.explanation}`
        : `${current.title}. ${current.question.question}`;

    const timer = window.setTimeout(() => speak(readOut), 400);
    return () => window.clearTimeout(timer);
  }, [index, mode, current, speak, autoReadEnabled]);

  // Read reflection when it opens
  useEffect(() => {
    if (reflectionShown && current) {
      speak(current.reflection);
    }
  }, [reflectionShown, current, speak]);

  const updateCurrentProgress = (
    updater: (item: QuranProgress) => QuranProgress
  ) => {
    setProgress((previous) =>
      previous.map((item) =>
        item.id === current.id ? updater(item) : item
      )
    );
  };

  const completeGuided = () => {
    if (!currentProgress.mastered) {
      updateCurrentProgress((item) => ({
        ...item,
        attempts: item.attempts + 1,
        mastered: true,
      }));

      if (soundEnabled) playSoundFeedback('correct');

      setScore((previous) => previous + 10);
      setStreak((previous) => previous + 1);

      speak('Well done. You understood this foundation.');
    }

    setReflectionShown(true);
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
        `Let's review this foundation. The best answer is: ${current.question.answer}. ${current.question.explanation}`,
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

  const next = () => {
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setReflectionShown(false);

    if (index < LESSONS.length - 1) {
      setIndex((previous) => previous + 1);
    } else {
      setIsComplete(true);
    }
  };

  const previous = () => {
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setReflectionShown(false);

    if (index > 0) {
      setIndex((previous) => previous - 1);
    }
  };

  const reset = () => {
    setIndex(0);
    setMode('guided');
    setProgress(createInitialProgress());
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setReflectionShown(false);
    setScore(0);
    setStreak(0);
    setIsComplete(false);
    setHasFinished(false);

    speak("Let's explore the Qur'an foundations again!");
  };

  const finish = () => {
    if (hasFinished) return;

    setHasFinished(true);
    onComplete?.(score);

    speak(
      `Masha'Allah! You mastered ${masteredCount} of ${LESSONS.length} foundations and earned ${score} points.`,
    );
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-app-card p-8 rounded-3xl border border-app-border shadow-xl text-center"
      >
        <div className="text-7xl mb-5">📖</div>

        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Islamic Studies
        </p>

        <h3 className="text-3xl font-bold text-emerald-400 mt-2">
          Masha&apos;Allah!
        </h3>

        <p className="text-gray-300 mt-3">
          You completed the Qur&apos;an Foundations journey.
        </p>

        <div className="grid grid-cols-3 gap-3 mt-8">
          <div className="bg-gray-900 rounded-2xl p-4">
            <Target className="w-5 h-5 mx-auto mb-2 text-emerald-400" />
            <p className="text-2xl font-bold text-white">{masteredCount}</p>
            <p className="text-xs text-gray-500">Topics mastered</p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-4">
            <Star className="w-5 h-5 mx-auto mb-2 text-yellow-400" />
            <p className="text-2xl font-bold text-white">{score}</p>
            <p className="text-xs text-gray-500">Points</p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-4">
            <CheckCircle className="w-5 h-5 mx-auto mb-2 text-emerald-400" />
            <p className="text-2xl font-bold text-white">
              {masteryPercentage}%
            </p>
            <p className="text-xs text-gray-500">Mastery</p>
          </div>
        </div>

        <div className="text-left bg-gray-900 rounded-2xl p-5 mt-6">
          <h4 className="text-white font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            Learning outcomes
          </h4>

          <ul className="mt-4 space-y-2 text-sm text-gray-300 leading-6">
            <li>
              • Understand what the Qur&apos;an is and why Muslims value it.
            </li>
            <li>
              • Recognize important foundations of Qur&apos;an learning.
            </li>
            <li>• Identify basic Arabic letters and harakat.</li>
            <li>
              • Understand basic Qur&apos;an structure such as Surah and Ayah.
            </li>
            <li>
              • Develop respectful and focused Qur&apos;an learning habits.
            </li>
            <li>• Begin connecting recitation with understanding.</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3 mt-8">
          <button
            type="button"
            onClick={reset}
            className="w-full py-3 bg-emerald-600 rounded-xl text-white font-bold hover:bg-emerald-700 transition"
          >
            <RotateCcw className="w-4 h-4 inline mr-2" />
            Learn Again
          </button>

          <button
            type="button"
            onClick={finish}
            disabled={hasFinished}
            className="w-full py-3 bg-indigo-600 rounded-xl text-white font-bold disabled:opacity-50"
          >
            {hasFinished ? 'Completed' : 'Finish & Move Up'}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto space-y-4"
    >
      {/* Header */}
      <div className="bg-app-card p-6 rounded-3xl border border-app-border shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
              Islamic Studies
            </p>

            <h3 className="text-2xl font-bold text-white mt-1">
              Qur&apos;an Foundations
            </h3>

            <p className="text-sm text-gray-400 mt-1">
              Building the foundations for Qur&apos;an learning
            </p>
          </div>

          <div className="flex gap-4 text-right">
            <div>
              <p className="text-xs text-gray-500">Score</p>
              <p className="font-bold text-white">{score}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Streak</p>
              <p className="font-bold text-white">{streak}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Mastery</p>
              <p className="font-bold text-white">
                {masteredCount}/{LESSONS.length}
              </p>
            </div>

            <button
              type="button"
              onClick={toggleSound}
              aria-label="Toggle sound"
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <Volume2
                className={`w-4 h-4 ${
                  soundEnabled ? 'text-amber-300' : 'text-gray-500'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-5 h-2 rounded-full bg-gray-800 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((index + 1) / LESSONS.length) * 100}%` }}
            className="h-full bg-emerald-500 rounded-full"
          />
        </div>
      </div>

      {/* Learning Modes */}
      <div className="grid grid-cols-3 gap-2">
        {[
          {
            id: 'guided' as const,
            title: 'Guided',
            description: 'Learn the foundation',
          },
          {
            id: 'practice' as const,
            title: 'Practice',
            description: 'Check understanding',
          },
          {
            id: 'mastery' as const,
            title: 'Mastery',
            description: 'Show what you know',
          },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setMode(item.id);
              setSelectedAnswer(null);
              setAnswerChecked(false);
              setReflectionShown(false);

              speak(
                item.id === 'guided'
                  ? 'Guided mode. Learn the foundation.'
                  : item.id === 'practice'
                    ? 'Practice mode. Check understanding.'
                    : 'Mastery mode. Show what you know.',
              );
            }}
            className={`rounded-xl p-3 text-left border transition ${
              mode === item.id
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-app-card border-app-border text-gray-400 hover:border-gray-600'
            }`}
          >
            <p className="text-sm font-bold">{item.title}</p>
            <p className="text-xs mt-1 opacity-80">{item.description}</p>
          </button>
        ))}
      </div>

      {/* Lesson */}
      <motion.div
        key={`${current.id}-${mode}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-app-card border border-app-border rounded-3xl p-6 shadow-xl"
      >
        <div className="text-center">
          <div className="text-6xl mb-4">{current.emoji}</div>

          <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">
            {current.category}
          </p>

          <p
            dir="rtl"
            lang="ar"
            className="text-2xl text-white font-semibold mt-3"
          >
            {current.arabicTitle}
          </p>

          <p className="text-xs text-gray-500 mt-2">
            Foundation {index + 1} of {LESSONS.length}
          </p>

          <h4 className="text-2xl font-bold text-white mt-2">
            {current.title}
          </h4>

          <p className="text-gray-300 text-sm leading-7 mt-5">
            {current.introduction}
          </p>
        </div>

        {/* Guided */}
        {mode === 'guided' && (
          <>
            <div className="bg-gray-900 rounded-2xl p-5 mt-6">
              <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                Learn
              </p>

              <p className="text-sm text-gray-300 leading-7 mt-2">
                {current.explanation}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 mt-5">
              {current.keyPoints.map((point) => (
                <div key={point} className="bg-gray-900 rounded-xl p-4">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mb-2" />

                  <p className="text-sm text-gray-300 leading-6">{point}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={completeGuided}
              className="w-full py-3 bg-emerald-600 rounded-xl text-white font-bold mt-5"
            >
              <CheckCircle className="w-4 h-4 inline mr-2" />
              {currentProgress.mastered
                ? 'Review Complete'
                : 'I Understand This'}
            </button>

            {reflectionShown && (
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5 mt-4">
                <div className="flex gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-400 shrink-0" />

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Think About It
                    </p>

                    <p className="text-sm text-gray-300 leading-6 mt-2">
                      {current.reflection}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Practice / Mastery */}
        {mode !== 'guided' && (
          <div className="mt-6 bg-gray-900 rounded-2xl p-5">
            <div className="flex gap-3">
              <Target className="w-5 h-5 text-emerald-400 shrink-0" />

              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  Check Your Understanding
                </p>

                <p className="text-sm text-gray-300 leading-6 mt-2">
                  {current.question.question}
                </p>

                <div className="space-y-2 mt-4">
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
                        className={`w-full p-4 rounded-xl border text-left text-sm transition ${
                          correct
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                            : selected
                              ? 'border-indigo-500 bg-indigo-500/10 text-white'
                              : 'border-gray-800 bg-gray-950 text-gray-300 hover:border-gray-600'
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
                    className="w-full mt-4 py-3 bg-indigo-600 rounded-xl text-white font-bold disabled:opacity-40"
                  >
                    Check Answer
                  </button>
                )}

                {answerChecked && (
                  <div
                    className={`mt-4 p-4 rounded-xl ${
                      selectedAnswer === current.question.answer
                        ? 'bg-emerald-500/10 text-emerald-300'
                        : 'bg-red-500/10 text-red-300'
                    }`}
                  >
                    <p className="font-semibold">
                      {selectedAnswer === current.question.answer
                        ? 'Correct!'
                        : "Let's review this foundation."}
                    </p>

                    <p className="text-sm leading-6 mt-2">
                      {selectedAnswer === current.question.answer
                        ? current.question.explanation
                        : `The best answer is "${current.question.answer}". ${current.question.explanation}`}
                    </p>
                  </div>
                )}

                {answerChecked && !reflectionShown && (
                  <button
                    type="button"
                    onClick={() => setReflectionShown(true)}
                    className="w-full mt-4 py-3 border border-gray-700 rounded-xl text-gray-200 font-semibold hover:bg-gray-800 transition"
                  >
                    Reflect on This
                  </button>
                )}

                {reflectionShown && (
                  <div className="mt-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                    <div className="flex gap-3">
                      <Lightbulb className="w-5 h-5 text-yellow-400 shrink-0" />

                      <div>
                        <p className="font-semibold text-white">Reflection</p>

                        <p className="text-sm text-gray-300 leading-6 mt-2">
                          {current.reflection}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-7 pt-6 border-t border-gray-800">
          <button
            type="button"
            onClick={previous}
            disabled={index === 0}
            className="px-4 py-3 bg-gray-800 rounded-xl text-gray-300 disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={next}
            className="flex-1 py-3 bg-indigo-600 rounded-xl text-white font-bold"
          >
            {index === LESSONS.length - 1
              ? 'Complete'
              : 'Next Foundation'}
            <ArrowRight className="w-4 h-4 inline ml-2" />
          </button>
        </div>
      </motion.div>

      {/* Progress */}
      <div className="bg-app-card border border-app-border rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">
              Foundation Progress
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Build strong foundations before moving into advanced
              Qur&apos;an study.
            </p>
          </div>

          <p className="text-sm font-bold text-emerald-400">
            {masteredCount}/{LESSONS.length}
          </p>
        </div>

        <div className="grid grid-cols-8 gap-2 mt-4">
          {progress.map((item) => (
            <div
              key={item.id}
              className={`h-2 rounded-full ${
                item.mastered
                  ? 'bg-emerald-500'
                  : item.attempts > 0
                    ? 'bg-yellow-400'
                    : 'bg-gray-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Source / Curriculum Note */}
      <div className="bg-app-card border border-app-border rounded-2xl p-4">
        <div className="flex gap-3">
          <Heart className="w-5 h-5 text-emerald-400 shrink-0" />

          <p className="text-xs text-gray-500 leading-5">
            This module is an introductory Qur&apos;an foundation course for
            children. Detailed Tajweed rules, recitation standards,
            memorisation sequences, and Qur&apos;anic interpretations should
            be expanded using carefully reviewed Qur&apos;an, Hadith, and
            qualified teacher-approved learning materials.
          </p>
        </div>
      </div>
    </motion.div>
  );
};