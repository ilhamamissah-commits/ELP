import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  RotateCcw,
  Star,
  Volume2,
  Heart,
  Target,
} from 'lucide-react';

type LearningMode = 'guided' | 'practice' | 'mastery';

interface DuaQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface Dua {
  id: number;
  title: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  occasion: string;
  emoji: string;
  category: string;
  lesson: string;
  keyPoints: string[];
  question: DuaQuestion;
}

interface DuaProgress {
  id: number;
  attempts: number;
  mastered: boolean;
}

interface DuasProps {
  onComplete?: (score: number) => void;
}

const DUAS: Dua[] = [
  {
    id: 1,
    title: 'Before Eating',
    arabic: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillāh',
    meaning: 'In the name of Allah.',
    occasion: 'Say this before beginning to eat or drink.',
    emoji: '🍎',
    category: 'Daily Life',
    lesson:
      'Muslims begin eating by remembering Allah and seeking blessing in what they eat.',
    keyPoints: [
      'Say Bismillāh before eating.',
      'Eat with the right hand.',
      'Be thankful to Allah for the food.',
    ],
    question: {
      question: 'When should you say Bismillāh?',
      options: ['Before eating', 'After sleeping', 'When leaving school'],
      answer: 'Before eating',
      explanation:
        'Bismillāh is said before eating to remember Allah and seek blessing in the meal.',
    },
  },
  {
    id: 2,
    title: 'After Eating',
    arabic:
      'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    transliteration:
      'Al-ḥamdu lillāhilladhī aṭʿamanī hādhā wa razaqanīhi min ghayri ḥawlin minnī wa lā quwwah',
    meaning:
      'All praise is for Allah who fed me this and provided it for me without any power or strength from me.',
    occasion: 'Say this after finishing a meal.',
    emoji: '🥛',
    category: 'Daily Life',
    lesson:
      'After eating, we thank Allah because He is the One who provides our food and blessings.',
    keyPoints: [
      'Thank Allah after eating.',
      'Recognize that blessings come from Allah.',
      'Avoid wasting food.',
    ],
    question: {
      question: 'What should we do after eating?',
      options: [
        'Thank Allah',
        'Throw food away',
        'Forget about the blessing',
      ],
      answer: 'Thank Allah',
      explanation:
        'A Muslim thanks Allah for providing food and other blessings.',
    },
  },
  {
    id: 3,
    title: 'Before Sleeping',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismikallāhumma amūtu wa aḥyā',
    meaning: 'In Your name, O Allah, I die and I live.',
    occasion: 'Say this when going to sleep.',
    emoji: '🌙',
    category: 'Sleep & Rest',
    lesson:
      'Before sleeping, a Muslim remembers Allah and places their trust in Him.',
    keyPoints: [
      'Remember Allah before sleeping.',
      'Sleep peacefully while trusting Allah.',
      'Make bedtime a time of remembrance.',
    ],
    question: {
      question: 'When is this dua recited?',
      options: ['Before sleeping', 'Before eating', 'When studying'],
      answer: 'Before sleeping',
      explanation:
        'This is a supplication taught for bedtime.',
    },
  },
  {
    id: 4,
    title: 'Upon Waking',
    arabic:
      'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration:
      'Al-ḥamdu lillāhilladhī aḥyānā baʿda mā amātanā wa ilayhin-nushūr',
    meaning:
      'All praise is for Allah who gave us life after causing us to die, and to Him is the resurrection.',
    occasion: 'Say this when waking from sleep.',
    emoji: '☀️',
    category: 'Sleep & Rest',
    lesson:
      'When we wake up, we thank Allah for giving us another day and remember that we will return to Him.',
    keyPoints: [
      'Thank Allah for waking you.',
      'Begin the day with remembrance.',
      'Remember that life is a blessing.',
    ],
    question: {
      question: 'What should we remember when we wake up?',
      options: [
        'Allah gave us another day',
        'Only our breakfast',
        'Nothing important',
      ],
      answer: 'Allah gave us another day',
      explanation:
        'The waking dua teaches gratitude for the blessing of life.',
    },
  },
  {
    id: 5,
    title: 'Entering the Bathroom',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    transliteration:
      'Allāhumma innī aʿūdhu bika minal-khubuthi wal-khabāʾith',
    meaning:
      'O Allah, I seek refuge in You from the male and female evil beings.',
    occasion: 'Say this before entering the bathroom.',
    emoji: '🚪',
    category: 'Daily Life',
    lesson:
      'Islam teaches us manners and remembrance of Allah even during everyday activities.',
    keyPoints: [
      'Remember Allah before entering.',
      'Enter with the left foot.',
      'Observe cleanliness and privacy.',
    ],
    question: {
      question: 'Which dua is connected with entering the bathroom?',
      options: [
        'Seeking refuge in Allah',
        'A dua for rain',
        'A dua before studying',
      ],
      answer: 'Seeking refuge in Allah',
      explanation:
        'The dua asks Allah for protection before entering the bathroom.',
    },
  },
  {
    id: 6,
    title: 'Leaving the Bathroom',
    arabic: 'غُفْرَانَكَ',
    transliteration: 'Ghufrānak',
    meaning: 'I seek Your forgiveness.',
    occasion: 'Say this after leaving the bathroom.',
    emoji: '🚶',
    category: 'Daily Life',
    lesson:
      'After leaving the bathroom, a Muslim asks Allah for forgiveness and continues with the day.',
    keyPoints: [
      'Say Ghufrānak after leaving.',
      'Remember Allah throughout the day.',
      'Keep good personal hygiene.',
    ],
    question: {
      question: 'What does Ghufrānak mean?',
      options: [
        'I seek Your forgiveness',
        'Good morning',
        'Thank you for my food',
      ],
      answer: 'I seek Your forgiveness',
      explanation:
        'Ghufrānak means that we ask Allah for His forgiveness.',
    },
  },
  {
    id: 7,
    title: 'Before Studying',
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    transliteration: 'Rabbi zidnī ʿilmā',
    meaning: 'My Lord, increase me in knowledge.',
    occasion: 'Say this when beginning to learn or study.',
    emoji: '📚',
    category: 'Knowledge',
    lesson:
      'Islam encourages beneficial knowledge. We ask Allah to increase us in knowledge and understanding.',
    keyPoints: [
      'Ask Allah for beneficial knowledge.',
      'Study with a good intention.',
      'Use knowledge in a good way.',
    ],
    question: {
      question: 'What are we asking Allah for in this dua?',
      options: ['More knowledge', 'More toys', 'More sleep'],
      answer: 'More knowledge',
      explanation:
        'Rabbi zidnī ʿilmā means: My Lord, increase me in knowledge.',
    },
  },
  {
    id: 8,
    title: 'For Parents',
    arabic:
      'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliteration:
      'Rabbirḥamhumā kamā rabbayānī ṣaghīrā',
    meaning:
      'My Lord, have mercy upon them as they raised me when I was small.',
    occasion: 'A dua for asking Allah to have mercy upon our parents.',
    emoji: '❤️',
    category: 'Family',
    lesson:
      'Allah teaches us to be kind to our parents and to ask Him to have mercy upon them.',
    keyPoints: [
      'Show kindness to parents.',
      'Speak respectfully to them.',
      'Make dua for them.',
    ],
    question: {
      question: 'Who do we ask Allah to have mercy upon?',
      options: ['Our parents', 'Our toys', 'Our books'],
      answer: 'Our parents',
      explanation:
        'This dua asks Allah to have mercy upon our parents.',
    },
  },
  {
    id: 9,
    title: 'Entering the Home',
    arabic:
      'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا',
    transliteration:
      'Bismillāhi walajnā, wa bismillāhi kharajnā, wa ʿalā rabbinā tawakkalnā',
    meaning:
      'In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we rely.',
    occasion: 'A supplication connected with entering and leaving the home.',
    emoji: '🏠',
    category: 'Home',
    lesson:
      'A Muslim remembers Allah when entering and leaving home and places their trust in Him.',
    keyPoints: [
      'Remember Allah when entering.',
      'Remember Allah when leaving.',
      'Place your trust in Allah.',
    ],
    question: {
      question: 'What does tawakkalnā teach us?',
      options: [
        'To rely upon Allah',
        'To stop learning',
        'To waste food',
      ],
      answer: 'To rely upon Allah',
      explanation:
        'Tawakkul means placing our trust and reliance upon Allah.',
    },
  },
  {
    id: 10,
    title: 'When Feeling Afraid',
    arabic: 'حَسْبِيَ اللَّهُ',
    transliteration: 'Ḥasbiyallāh',
    meaning: 'Allah is sufficient for me.',
    occasion: 'A short remembrance that can help us remember to rely upon Allah.',
    emoji: '🛡️',
    category: 'Trust in Allah',
    lesson:
      'When we feel afraid or worried, we remember that Allah is greater than every difficulty.',
    keyPoints: [
      'Remember Allah when worried.',
      'Place your trust in Allah.',
      'Ask Allah for help and protection.',
    ],
    question: {
      question: 'What does Ḥasbiyallāh remind us?',
      options: [
        'Allah is sufficient for me',
        'I do not need anyone',
        'I should give up',
      ],
      answer: 'Allah is sufficient for me',
      explanation:
        'This remembrance helps us place our trust in Allah.',
    },
  },
];

const speakArabic = (text: string) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-SA';
  utterance.rate = 0.72;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
};

const getInitialProgress = (): DuaProgress[] =>
  DUAS.map((dua) => ({
    id: dua.id,
    attempts: 0,
    mastered: false,
  }));

export const Duas: React.FC<DuasProps> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<LearningMode>('guided');
  const [progress, setProgress] = useState<DuaProgress[]>(
    getInitialProgress
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [reflectionShown, setReflectionShown] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const currentDua = DUAS[index];

  const currentProgress = useMemo(
    () =>
      progress.find((item) => item.id === currentDua?.id) ?? {
        id: currentDua?.id ?? 0,
        attempts: 0,
        mastered: false,
      },
    [progress, currentDua]
  );

  const masteredCount = useMemo(
    () => progress.filter((item) => item.mastered).length,
    [progress]
  );

  const masteryPercentage = Math.round(
    (masteredCount / DUAS.length) * 100
  );

  useEffect(() => {
    if (!currentDua) return;

    setSelectedAnswer(null);
    setAnswerChecked(false);
    setReflectionShown(false);

    if (mode !== 'mastery') {
      const timer = window.setTimeout(() => {
        speakArabic(currentDua.arabic);
      }, 400);

      return () => window.clearTimeout(timer);
    }
  }, [index, mode, currentDua]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const updateProgress = (
    duaId: number,
    updates: Partial<DuaProgress>
  ) => {
    setProgress((previous) =>
      previous.map((item) =>
        item.id === duaId ? { ...item, ...updates } : item
      )
    );
  };

  const checkAnswer = () => {
    if (!selectedAnswer || answerChecked) return;

    const isCorrect = selectedAnswer === currentDua.question.answer;

    setAnswerChecked(true);

    updateProgress(currentDua.id, {
      attempts: currentProgress.attempts + 1,
    });

    if (isCorrect) {
      const alreadyMastered = currentProgress.mastered;

      if (!alreadyMastered) {
        const bonus = streak >= 1 ? 5 : 0;

        setScore((previous) => previous + 10 + bonus);
        setStreak((previous) => previous + 1);

        updateProgress(currentDua.id, {
          attempts: currentProgress.attempts + 1,
          mastered: true,
        });
      } else {
        setStreak((previous) => previous + 1);
      }
    } else {
      setStreak(0);
    }
  };

  const showReflection = () => {
    setReflectionShown(true);
  };

  const markPracticed = () => {
    setReflectionShown(true);
    setStreak((previous) => Math.max(0, previous));
  };

  const nextDua = () => {
    if (index < DUAS.length - 1) {
      setIndex((previous) => previous + 1);
      return;
    }

    setIsComplete(true);
  };

  const previousDua = () => {
    if (index > 0) {
      setIndex((previous) => previous - 1);
    }
  };

  const finishAndMoveUp = () => {
    if (hasFinished) return;

    setHasFinished(true);
    onComplete?.(score);
  };

  const reset = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setIndex(0);
    setMode('guided');
    setProgress(getInitialProgress());
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setReflectionShown(false);
    setScore(0);
    setStreak(0);
    setIsComplete(false);
    setHasFinished(false);
  };

  if (!currentDua) {
    return (
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <BookOpen className="mx-auto mb-4 h-10 w-10 text-emerald-600" />
        <h2 className="text-2xl font-bold text-slate-900">
          Duas are being prepared
        </h2>
        <p className="mt-2 text-slate-600">
          Please check the curriculum data and try again.
        </p>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-sm"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
            <Star className="h-10 w-10 text-emerald-600" />
          </div>

          <h2 className="mt-5 text-3xl font-bold text-slate-900">
            Dua Learning Complete
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            You explored the daily duas and practiced understanding when and
            why Muslims use them.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="text-3xl font-bold text-slate-900">
                {masteredCount}
              </div>
              <div className="mt-1 text-sm text-slate-500">
                Duas mastered
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="text-3xl font-bold text-slate-900">
                {score}
              </div>
              <div className="mt-1 text-sm text-slate-500">Points earned</div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="text-3xl font-bold text-slate-900">
                {masteryPercentage}%
              </div>
              <div className="mt-1 text-sm text-slate-500">Mastery</div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left">
            <h3 className="flex items-center gap-2 font-semibold text-slate-900">
              <Target className="h-5 w-5 text-emerald-600" />
              Learning outcomes
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                Recognize common daily duas.
              </li>
              <li className="flex gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                Understand when different duas are used.
              </li>
              <li className="flex gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                Connect remembrance with everyday activities.
              </li>
              <li className="flex gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                Build confidence in memorising and recalling duas.
              </li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" />
              Learn Again
            </button>

            <button
              type="button"
              onClick={finishAndMoveUp}
              disabled={hasFinished}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Star className="h-4 w-4" />
              {hasFinished ? 'Progress Saved' : 'Finish & Move Up'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const isCorrect =
    answerChecked &&
    selectedAnswer === currentDua.question.answer;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
            <BookOpen className="h-4 w-4" />
            Islamic Studies • Duas & Dhikr
          </div>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Daily Duas
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Learn the words, meaning, occasion, and practice of each dua.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm">
            <span className="text-slate-500">Score:</span>{' '}
            <span className="font-bold text-slate-900">{score}</span>
          </div>

          <div className="rounded-xl bg-emerald-50 px-4 py-2 text-sm">
            <span className="text-emerald-600">Mastered:</span>{' '}
            <span className="font-bold text-emerald-700">
              {masteredCount}/{DUAS.length}
            </span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
          <span>
            Dua {index + 1} of {DUAS.length}
          </span>
          <span>{masteryPercentage}% mastery</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{
              width: `${((index + 1) / DUAS.length) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Mode Selector */}
      <div className="mb-6 grid gap-2 sm:grid-cols-3">
        {[
          {
            id: 'guided' as LearningMode,
            title: 'Guided',
            description: 'Listen and learn',
          },
          {
            id: 'practice' as LearningMode,
            title: 'Practice',
            description: 'Test your understanding',
          },
          {
            id: 'mastery' as LearningMode,
            title: 'Mastery',
            description: 'Recall independently',
          },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setMode(item.id)}
            className={`rounded-2xl border p-4 text-left transition ${
              mode === item.id
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-slate-200 bg-white hover:border-emerald-200'
            }`}
          >
            <div className="font-semibold text-slate-900">
              {item.title}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {item.description}
            </div>
          </button>
        ))}
      </div>

      {/* Main Lesson */}
      <motion.div
        key={`${currentDua.id}-${mode}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="border-b border-slate-100 bg-slate-50 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-4xl">{currentDua.emoji}</span>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                {currentDua.category}
              </div>

              <h2 className="text-2xl font-bold text-slate-900">
                {currentDua.title}
              </h2>
            </div>

            {currentProgress.mastered && (
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                <CheckCircle className="h-3.5 w-3.5" />
                Mastered
              </span>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {/* Arabic */}
          <div
            dir="rtl"
            lang="ar"
            className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6 text-center"
          >
            <p className="text-3xl font-medium leading-[2] text-slate-900 sm:text-4xl">
              {currentDua.arabic}
            </p>

            <button
              type="button"
              onClick={() => speakArabic(currentDua.arabic)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Volume2 className="h-4 w-4" />
              Listen
            </button>
          </div>

          {/* Transliteration + Meaning */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Transliteration
              </div>

              <p className="mt-2 text-lg font-medium italic text-slate-800">
                {currentDua.transliteration}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Meaning
              </div>

              <p className="mt-2 text-slate-700">
                {currentDua.meaning}
              </p>
            </div>
          </div>

          {/* Occasion */}
          <div className="mt-6 rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-emerald-600" />
              <h3 className="font-semibold text-slate-900">
                When do we use it?
              </h3>
            </div>

            <p className="mt-2 text-slate-600">
              {currentDua.occasion}
            </p>
          </div>

          {/* Lesson */}
          <div className="mt-6">
            <h3 className="font-semibold text-slate-900">
              What we are learning
            </h3>

            <p className="mt-2 leading-7 text-slate-600">
              {currentDua.lesson}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {currentDua.keyPoints.map((point) => (
                <div
                  key={point}
                  className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600"
                >
                  <CheckCircle className="mb-2 h-4 w-4 text-emerald-600" />
                  {point}
                </div>
              ))}
            </div>
          </div>

          {/* Practice / Mastery */}
          {mode !== 'guided' && (
            <div className="mt-8 rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {mode === 'mastery'
                      ? 'Mastery Check'
                      : 'Practice Check'}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose the answer that best shows your understanding.
                  </p>
                </div>

                <Target className="h-6 w-6 text-emerald-600" />
              </div>

              <p className="mt-5 font-medium text-slate-900">
                {currentDua.question.question}
              </p>

              <div className="mt-4 space-y-2">
                {currentDua.question.options.map((option) => {
                  const selected = selectedAnswer === option;
                  const correct =
                    answerChecked &&
                    option === currentDua.question.answer;
                  const incorrect = answerChecked && selected && !correct;

                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={answerChecked}
                      onClick={() => setSelectedAnswer(option)}
                      className={`w-full rounded-xl border p-4 text-left text-sm transition ${
                        correct
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : incorrect
                            ? 'border-red-300 bg-red-50 text-red-700'
                            : selected
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-slate-200 hover:border-emerald-300'
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
                  onClick={checkAnswer}
                  disabled={!selectedAnswer}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Check Answer
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}

              {answerChecked && (
                <div
                  className={`mt-4 rounded-xl p-4 ${
                    isCorrect
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle className="h-4 w-4" />
                    {isCorrect ? 'Excellent!' : 'Keep practicing'}
                  </div>

                  <p className="mt-2 text-sm">
                    {currentDua.question.explanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Reflection */}
          {(mode === 'guided' || answerChecked) && (
            <div className="mt-6">
              {!reflectionShown ? (
                <button
                  type="button"
                  onClick={
                    mode === 'guided'
                      ? showReflection
                      : markPracticed
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <Heart className="h-4 w-4" />
                  Reflect on this Dua
                </button>
              ) : (
                <div className="rounded-2xl bg-slate-50 p-5">
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <Heart className="h-5 w-5 text-emerald-600" />
                    Think about it
                  </div>

                  <p className="mt-3 text-slate-600">
                    How could remembering Allah during this part of your day
                    help you become more thankful and mindful?
                  </p>

                  <div className="mt-4 rounded-xl bg-white p-4 text-sm text-slate-600">
                    <strong className="text-slate-900">
                      Remember:
                    </strong>{' '}
                    Learning a dua is not only about memorising its words.
                    Try to understand its meaning and use it at the right
                    time.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={previousDua}
          disabled={index === 0}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="text-center">
          {streak > 0 && (
            <div className="text-sm font-semibold text-emerald-600">
              🔥 {streak} correct in a row
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={nextDua}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
        >
          {index === DUAS.length - 1 ? 'Complete' : 'Next Dua'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}