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
  Target,
  Heart,
} from 'lucide-react';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

type LearningMode = 'guided' | 'practice' | 'mastery';

interface IbadahQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface IbadahLesson {
  id: number;
  title: string;
  arabic?: string;
  emoji: string;
  category: string;
  introduction: string;
  explanation: string;
  steps: string[];
  keyPoints: string[];
  question: IbadahQuestion;
}

interface IbadahProgress {
  id: number;
  attempts: number;
  mastered: boolean;
}

interface IbadahProps {
  onComplete?: (score: number) => void;
}

const LESSONS: IbadahLesson[] = [
  {
    id: 1,
    title: 'What Is Ibadah?',
    arabic: 'عِبَادَة',
    emoji: '🤲',
    category: 'Foundations',
    introduction:
      'Ibadah means worshipping and obeying Allah in the ways He has taught us.',
    explanation:
      'Worship includes acts such as Salah, fasting, giving charity, making dua, remembering Allah, and doing good deeds with a sincere intention.',
    steps: [
      'Remember that Allah created us.',
      'Worship Allah sincerely.',
      'Follow the guidance He has given us.',
      'Do good deeds with a good intention.',
    ],
    keyPoints: [
      'Ibadah is for Allah.',
      'Worship includes actions and intentions.',
      'Sincerity is important.',
    ],
    question: {
      question: 'Who do Muslims worship?',
      options: ['Allah', 'The sun', 'People'],
      answer: 'Allah',
      explanation:
        'Muslims worship Allah alone and try to obey Him according to His guidance.',
    },
  },
  {
    id: 2,
    title: 'Cleanliness in Islam',
    arabic: 'الطَّهَارَة',
    emoji: '🧼',
    category: 'Purification',
    introduction:
      'Islam teaches Muslims to care for cleanliness and purification.',
    explanation:
      'Cleanliness is important in daily life and is connected with acts of worship. Muslims learn how to keep their bodies, clothes, and places clean.',
    steps: [
      'Keep the body clean.',
      'Keep clothes clean.',
      'Keep the place of prayer clean.',
      'Learn the rules of purification.',
    ],
    keyPoints: [
      'Cleanliness is important.',
      'Purification prepares us for worship.',
      'Good hygiene is part of good Muslim manners.',
    ],
    question: {
      question: 'Why is cleanliness important?',
      options: [
        'It helps us care for ourselves and prepare for worship.',
        'It is only important at school.',
        'It does not matter.',
      ],
      answer: 'It helps us care for ourselves and prepare for worship.',
      explanation:
        'Islam teaches cleanliness and purification as important parts of a Muslim’s life.',
    },
  },
  {
    id: 3,
    title: 'Wudu',
    arabic: 'وُضُوء',
    emoji: '💧',
    category: 'Purification',
    introduction:
      'Wudu is a purification performed before certain acts of worship, including Salah.',
    explanation:
      'Children can learn the sequence of wudu gradually, understanding both the actions and the purpose of purification.',
    steps: [
      'Make the intention for purification.',
      'Wash the hands.',
      'Rinse the mouth and nose.',
      'Wash the face.',
      'Wash the arms.',
      'Wipe the head and ears.',
      'Wash the feet.',
    ],
    keyPoints: [
      'Wudu is a form of purification.',
      'Learn the correct sequence.',
      'Perform each action carefully.',
    ],
    question: {
      question: 'What is wudu?',
      options: [
        'A purification performed before certain acts of worship',
        'A type of food',
        'A type of clothing',
      ],
      answer: 'A purification performed before certain acts of worship',
      explanation:
        'Wudu is a prescribed purification that Muslims perform before Salah and other acts of worship where it is required.',
    },
  },
  {
    id: 4,
    title: 'Why We Pray',
    arabic: 'الصَّلَاة',
    emoji: '🕌',
    category: 'Salah',
    introduction:
      'Salah is one of the most important acts of worship in Islam.',
    explanation:
      'Through Salah, Muslims remember Allah, worship Him, and follow the way taught by the Prophet Muhammad ﷺ.',
    steps: [
      'Prepare for prayer.',
      'Make sure you are purified.',
      'Face the Qiblah.',
      'Pray according to the prescribed prayer.',
      'Remember Allah with humility.',
    ],
    keyPoints: [
      'Salah is worship.',
      'Salah helps us remember Allah.',
      'Prayer should be performed with care and humility.',
    ],
    question: {
      question: 'What is one purpose of Salah?',
      options: [
        'To worship and remember Allah',
        'To compete with others',
        'To play a game',
      ],
      answer: 'To worship and remember Allah',
      explanation:
        'Salah is an act of worship through which Muslims remember and worship Allah.',
    },
  },
  {
    id: 5,
    title: 'The Five Daily Prayers',
    arabic: 'الصَّلَوَات الخَمْس',
    emoji: '🌅',
    category: 'Salah',
    introduction:
      'Muslims perform five obligatory prayers throughout the day and night.',
    explanation:
      'The five prayers are Fajr, Dhuhr, Asr, Maghrib, and Isha. Each has its own prescribed time.',
    steps: [
      'Fajr — dawn prayer.',
      'Dhuhr — midday prayer.',
      'Asr — afternoon prayer.',
      'Maghrib — prayer after sunset.',
      'Isha — night prayer.',
    ],
    keyPoints: [
      'There are five obligatory daily prayers.',
      'Each prayer has a prescribed time.',
      'Prayer helps organize the day around remembrance of Allah.',
    ],
    question: {
      question: 'How many obligatory daily prayers are there?',
      options: ['Five', 'Two', 'Ten'],
      answer: 'Five',
      explanation:
        'Muslims have five obligatory daily prayers: Fajr, Dhuhr, Asr, Maghrib, and Isha.',
    },
  },
  {
    id: 6,
    title: 'Prayer Positions',
    arabic: 'أَرْكَانُ الصَّلَاة',
    emoji: '🧎',
    category: 'Salah',
    introduction:
      'Salah includes different positions and movements performed in a prescribed order.',
    explanation:
      'Children can gradually learn the names and meanings of the major prayer positions while practising correct movement and respect for Salah.',
    steps: [
      'Standing — Qiyam.',
      'Bowing — Ruku.',
      'Standing after bowing.',
      'Prostration — Sujood.',
      'Sitting between prostrations.',
      'Sitting for the prescribed parts of prayer.',
    ],
    keyPoints: [
      'Prayer has an ordered structure.',
      'Movements should be performed calmly.',
      'Sujood is an important position of worship.',
    ],
    question: {
      question: 'What is Ruku?',
      options: ['Bowing', 'Running', 'Sleeping'],
      answer: 'Bowing',
      explanation: 'Ruku is the bowing position performed during Salah.',
    },
  },
  {
    id: 7,
    title: 'The Adhan',
    arabic: 'الأَذَان',
    emoji: '📣',
    category: 'Salah',
    introduction:
      'The Adhan is the call announcing the time of an obligatory prayer.',
    explanation:
      'The Adhan reminds Muslims that it is time to prepare for Salah and contains words affirming the greatness of Allah and the message of Islam.',
    steps: [
      'Listen respectfully.',
      'Recognize that prayer time has begun.',
      'Prepare for Salah.',
      'Respond according to the Sunnah.',
    ],
    keyPoints: [
      'The Adhan calls Muslims to prayer.',
      'It is a reminder of Allah.',
      'Prayer preparation follows the call.',
    ],
    question: {
      question: 'What is the purpose of the Adhan?',
      options: [
        'To announce the time for prayer',
        'To announce lunchtime',
        'To begin a race',
      ],
      answer: 'To announce the time for prayer',
      explanation: 'The Adhan is the call to prayer.',
    },
  },
  {
    id: 8,
    title: 'Fasting',
    arabic: 'الصِّيَام',
    emoji: '🌙',
    category: 'Ramadan',
    introduction:
      'Fasting is an important act of worship, especially during Ramadan.',
    explanation:
      'Fasting teaches self-control, patience, gratitude, and awareness of Allah. Children can learn about fasting in an age-appropriate way without being pressured beyond their capacity.',
    steps: [
      'Learn the purpose of fasting.',
      'Understand the time of fasting.',
      'Learn about good behaviour during Ramadan.',
      'Practise patience and self-control.',
      'Thank Allah for food and blessings.',
    ],
    keyPoints: [
      'Fasting develops self-control.',
      'Ramadan is a special month.',
      'Good character is important while fasting.',
    ],
    question: {
      question: 'What can fasting teach us?',
      options: ['Patience and self-control', 'Carelessness', 'Wastefulness'],
      answer: 'Patience and self-control',
      explanation:
        'Fasting teaches patience, self-control, gratitude, and awareness of Allah.',
    },
  },
  {
    id: 9,
    title: 'Zakah and Charity',
    arabic: 'الزَّكَاة',
    emoji: '🤝',
    category: 'Giving',
    introduction:
      'Zakah is an important act of worship involving giving from qualifying wealth according to Islamic rules.',
    explanation:
      'Children can begin by learning the values behind zakah and sadaqah: generosity, helping others, gratitude, and caring for people in need.',
    steps: [
      'Learn that Allah gives us blessings.',
      'Be thankful for what we have.',
      'Learn the difference between zakah and voluntary charity.',
      'Practise generosity.',
    ],
    keyPoints: [
      'Zakah has specific Islamic rules.',
      'Charity teaches generosity.',
      'Helping others is encouraged.',
    ],
    question: {
      question: 'What value can children learn through charity?',
      options: ['Generosity', 'Greed', 'Waste'],
      answer: 'Generosity',
      explanation:
        'Giving to others teaches generosity and care for people who need help.',
    },
  },
  {
    id: 10,
    title: 'Hajj',
    arabic: 'الحَجّ',
    emoji: '🕋',
    category: 'Pilgrimage',
    introduction:
      'Hajj is the pilgrimage to Makkah and is an obligation for Muslims who are able to perform it.',
    explanation:
      "Children can learn the major ideas of Hajj, including the Ka'bah, Ihram, Tawaf, Sa'i, Arafah, and the meaning of worshipping Allah together.",
    steps: [
      "Learn about the Ka'bah.",
      'Learn what Ihram means.',
      'Learn about Tawaf.',
      "Learn about Sa'i.",
      'Learn about standing at Arafah.',
    ],
    keyPoints: [
      'Hajj takes place in Makkah.',
      'Hajj is one of the pillars of Islam.',
      'Hajj teaches worship, obedience, patience, and unity.',
    ],
    question: {
      question: 'Where is Hajj performed?',
      options: ['Makkah', 'London', 'Tokyo'],
      answer: 'Makkah',
      explanation:
        'Hajj is the pilgrimage to Makkah and its sacred sites.',
    },
  },
  {
    id: 11,
    title: 'Dua and Dhikr',
    arabic: 'الدُّعَاء وَالذِّكْر',
    emoji: '📿',
    category: 'Remembrance',
    introduction:
      'Dua is calling upon Allah, while dhikr includes remembering and mentioning Allah.',
    explanation:
      'Children can develop a daily habit of remembering Allah through authentic supplications and simple forms of dhikr.',
    steps: [
      'Learn short authentic duas.',
      'Understand what the words mean.',
      'Remember Allah during everyday activities.',
      'Ask Allah for good things.',
      'Thank Allah for His blessings.',
    ],
    keyPoints: [
      'Dua is directed to Allah.',
      'Dhikr means remembering Allah.',
      'Understanding meaning is important.',
    ],
    question: {
      question: 'Who do Muslims call upon in dua?',
      options: ['Allah', 'The stars', 'Animals'],
      answer: 'Allah',
      explanation:
        'Dua is an act of calling upon and asking Allah.',
    },
  },
  {
    id: 12,
    title: 'Worship and Good Character',
    emoji: '🌱',
    category: 'Character',
    introduction: 'Worship should help us become better people.',
    explanation:
      'A Muslim learns to connect worship with good character: honesty, kindness, patience, respect, forgiveness, and helping others.',
    steps: [
      'Be truthful.',
      'Be kind to others.',
      'Respect parents and teachers.',
      'Help people when you can.',
      'Practise patience.',
    ],
    keyPoints: [
      'Worship should influence our behaviour.',
      'Good character is important.',
      'Islam teaches kindness and responsibility.',
    ],
    question: {
      question: 'Which is an example of good Muslim character?',
      options: ['Being honest', 'Being cruel', 'Being dishonest'],
      answer: 'Being honest',
      explanation:
        'Honesty is an important part of good character in Islam.',
    },
  },
];

const getInitialProgress = (): IbadahProgress[] =>
  LESSONS.map((lesson) => ({
    id: lesson.id,
    attempts: 0,
    mastered: false,
  }));

export const Ibadah: React.FC<IbadahProps> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<LearningMode>('guided');
  const [progress, setProgress] = useState<IbadahProgress[]>(
    getInitialProgress
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

  // English narration uses the shared pipeline
  const { speak } = useReadAloud();

  const currentLesson = LESSONS[index];

  const currentProgress = useMemo(
    () =>
      progress.find((item) => item.id === currentLesson?.id) ?? {
        id: currentLesson?.id ?? 0,
        attempts: 0,
        mastered: false,
      },
    [progress, currentLesson]
  );

  const masteredCount = useMemo(
    () => progress.filter((item) => item.mastered).length,
    [progress]
  );

  const masteryPercentage = Math.round(
    (masteredCount / LESSONS.length) * 100
  );

  // Arabic still uses its own voice, but gated on soundEnabled
  const speakArabic = (text: string) => {
    if (!soundEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.72;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  // Reset per-lesson state + auto-read Arabic or English prompt
  useEffect(() => {
    if (!currentLesson) return;

    setSelectedAnswer(null);
    setAnswerChecked(false);
    setReflectionShown(false);

    if (!autoReadEnabled) return;

    const timer = window.setTimeout(() => {
      if (mode === 'mastery') {
        speak(`${currentLesson.title}. ${currentLesson.question.question}`);
      } else if (currentLesson.arabic) {
        speakArabic(currentLesson.arabic);
      }
    }, 400);

    return () => window.clearTimeout(timer);
  }, [index, mode, currentLesson, speak, autoReadEnabled, soundEnabled]);

  // Read the reflection when it opens
  useEffect(() => {
    if (!reflectionShown) return;

    speak(
      'How could this lesson help you become a better Muslim in your everyday life?',
    );
  }, [reflectionShown, speak]);

  const updateProgress = (
    lessonId: number,
    updates: Partial<IbadahProgress>
  ) => {
    setProgress((previous) =>
      previous.map((item) =>
        item.id === lessonId ? { ...item, ...updates } : item
      )
    );
  };

  const checkAnswer = () => {
    if (!selectedAnswer || answerChecked) return;

    const isCorrect = selectedAnswer === currentLesson.question.answer;

    const alreadyMastered = currentProgress.mastered;
    const nextAttempts = currentProgress.attempts + 1;

    setAnswerChecked(true);

    updateProgress(currentLesson.id, {
      attempts: nextAttempts,
      mastered: alreadyMastered || isCorrect,
    });

    if (isCorrect) {
      if (soundEnabled) playSoundFeedback('correct');

      speak(`Correct! ${currentLesson.question.explanation}`);

      if (!alreadyMastered) {
        const bonus = streak >= 1 ? 5 : 0;
        setScore((previous) => previous + 10 + bonus);
      }

      setStreak((previous) => previous + 1);
    } else {
      if (soundEnabled) playSoundFeedback('try-again');

      setStreak(0);

      speak(
        `Keep practising. The correct answer is: ${currentLesson.question.answer}. ${currentLesson.question.explanation}`,
      );
    }
  };

  const nextLesson = () => {
    if (index < LESSONS.length - 1) {
      setIndex((previous) => previous + 1);
      return;
    }

    setIsComplete(true);
  };

  const previousLesson = () => {
    if (index > 0) {
      setIndex((previous) => previous - 1);
    }
  };

  const finishAndMoveUp = () => {
    if (hasFinished) return;

    setHasFinished(true);
    onComplete?.(score);

    speak(
      `Masha'Allah! You mastered ${masteredCount} of ${LESSONS.length} lessons and earned ${score} points.`,
    );
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

    speak("Let's learn about worship and Ibadah again!");
  };

  if (!currentLesson) {
    return (
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <BookOpen className="mx-auto mb-4 h-10 w-10 text-emerald-600" />

        <h2 className="text-2xl font-bold text-slate-900">
          Ibadah lessons are being prepared
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
            Ibadah Learning Complete
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            You explored the foundations of worship, purification, Salah,
            fasting, charity, Hajj, dua, dhikr, and good character.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="text-3xl font-bold text-slate-900">
                {masteredCount}
              </div>
              <div className="mt-1 text-sm text-slate-500">
                Lessons mastered
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="text-3xl font-bold text-slate-900">{score}</div>
              <div className="mt-1 text-sm text-slate-500">
                Points earned
              </div>
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
                Understand the meaning of ibadah.
              </li>

              <li className="flex gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                Understand the purpose of purification and wudu.
              </li>

              <li className="flex gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                Recognize the five daily prayers.
              </li>

              <li className="flex gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                Understand foundational ideas about fasting, zakah, and Hajj.
              </li>

              <li className="flex gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                Connect worship with good character and daily life.
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
    answerChecked && selectedAnswer === currentLesson.question.answer;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
            <BookOpen className="h-4 w-4" />
            Islamic Studies • Ibadah
          </div>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Worship &amp; Ibadah
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Learn how Muslims worship Allah and practise good habits of
            worship.
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
              {masteredCount}/{LESSONS.length}
            </span>
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

      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
          <span>
            Lesson {index + 1} of {LESSONS.length}
          </span>

          <span>{masteryPercentage}% mastery</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${((index + 1) / LESSONS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Learning modes */}
      <div className="mb-6 grid gap-2 sm:grid-cols-3">
        {[
          {
            id: 'guided' as LearningMode,
            title: 'Guided',
            description: 'Learn with support',
          },
          {
            id: 'practice' as LearningMode,
            title: 'Practice',
            description: 'Check understanding',
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
            onClick={() => {
              setMode(item.id);

              speak(
                item.id === 'guided'
                  ? 'Guided mode. Learn with support.'
                  : item.id === 'practice'
                    ? 'Practice mode. Check understanding.'
                    : 'Mastery mode. Recall independently.',
              );
            }}
            className={`rounded-2xl border p-4 text-left transition ${
              mode === item.id
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-slate-200 bg-white hover:border-emerald-200'
            }`}
          >
            <div className="font-semibold text-slate-900">{item.title}</div>

            <div className="mt-1 text-xs text-slate-500">
              {item.description}
            </div>
          </button>
        ))}
      </div>

      {/* Lesson */}
      <motion.div
        key={`${currentLesson.id}-${mode}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="border-b border-slate-100 bg-slate-50 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-4xl">{currentLesson.emoji}</span>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                {currentLesson.category}
              </div>

              <h2 className="text-2xl font-bold text-slate-900">
                {currentLesson.title}
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
          {/* Arabic term */}
          {currentLesson.arabic && (
            <div
              dir="rtl"
              lang="ar"
              className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6 text-center"
            >
              <p className="text-4xl font-medium leading-[2] text-slate-900">
                {currentLesson.arabic}
              </p>

              <button
                type="button"
                onClick={() => speakArabic(currentLesson.arabic!)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <Volume2 className="h-4 w-4" />
                Listen
              </button>
            </div>
          )}

          {/* Introduction */}
          <div className="mt-6 rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900">Introduction</h3>

            <p className="mt-2 leading-7 text-slate-600">
              {currentLesson.introduction}
            </p>
          </div>

          {/* Explanation */}
          <div className="mt-6">
            <h3 className="font-semibold text-slate-900">
              What we are learning
            </h3>

            <p className="mt-2 leading-7 text-slate-600">
              {currentLesson.explanation}
            </p>
          </div>

          {/* Steps */}
          <div className="mt-6">
            <h3 className="font-semibold text-slate-900">Learning steps</h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {currentLesson.steps.map((step, stepIndex) => (
                <div
                  key={step}
                  className="flex gap-3 rounded-2xl bg-slate-50 p-4"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                    {stepIndex + 1}
                  </div>

                  <p className="text-sm leading-6 text-slate-600">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key points */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {currentLesson.keyPoints.map((point) => (
              <div
                key={point}
                className="rounded-xl border border-slate-200 p-4"
              >
                <CheckCircle className="mb-2 h-4 w-4 text-emerald-600" />

                <p className="text-sm text-slate-600">{point}</p>
              </div>
            ))}
          </div>

          {/* Practice / Mastery */}
          {mode !== 'guided' && (
            <div className="mt-8 rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {mode === 'mastery' ? 'Mastery Check' : 'Practice Check'}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose the answer that best shows your understanding.
                  </p>
                </div>

                <Target className="h-6 w-6 text-emerald-600" />
              </div>

              <p className="mt-5 font-medium text-slate-900">
                {currentLesson.question.question}
              </p>

              <div className="mt-4 space-y-2">
                {currentLesson.question.options.map((option) => {
                  const selected = selectedAnswer === option;
                  const correct =
                    answerChecked && option === currentLesson.question.answer;
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
                    {currentLesson.question.explanation}
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
                  onClick={() => setReflectionShown(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <Heart className="h-4 w-4" />
                  Reflect on this lesson
                </button>
              ) : (
                <div className="rounded-2xl bg-slate-50 p-5">
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <Heart className="h-5 w-5 text-emerald-600" />
                    Think about it
                  </div>

                  <p className="mt-3 text-slate-600">
                    How could this lesson help you become a better Muslim in
                    your everyday life?
                  </p>

                  <div className="mt-4 rounded-xl bg-white p-4 text-sm text-slate-600">
                    <strong className="text-slate-900">Remember:</strong>{' '}
                    Ibadah is not only about knowing information. We learn so
                    that knowledge can guide our actions, intentions, and
                    character.
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
          onClick={previousLesson}
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
          onClick={nextLesson}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
        >
          {index === LESSONS.length - 1 ? 'Complete' : 'Next Lesson'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};