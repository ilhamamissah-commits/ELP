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
  Shield,
  Users,
  MessageCircle,
  Target,
  Lightbulb,
} from 'lucide-react';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

type LearningMode = 'guided' | 'practice' | 'mastery';

interface HadithQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface HadithLesson {
  id: number;
  title: string;
  arabicTitle: string;
  emoji: string;
  category: string;
  arabicHadith: string;
  transliteration?: string;
  meaning: string;
  explanation: string;
  lesson: string;
  keyPoints: string[];
  reflection: string;
  question: HadithQuestion;
}

interface HadithProgress {
  id: number;
  attempts: number;
  mastered: boolean;
}

interface HadithSunnahProps {
  onComplete?: (score: number) => void;
}

const LESSONS: HadithLesson[] = [
  {
    id: 1,
    title: 'Actions and Intentions',
    arabicTitle: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
    emoji: '❤️',
    category: 'Sincerity',
    arabicHadith:
      'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    transliteration:
      "Innamal-a'malu bin-niyyat, wa innama likulli imri'in ma nawa.",
    meaning:
      'Actions are judged by intentions, and every person will have what they intended.',
    explanation:
      'The Prophet Muhammad ﷺ taught that what is inside our hearts matters. Before doing something good, we should try to have a good intention for Allah.',
    lesson:
      'Do good things sincerely and try to make your intention good.',
    keyPoints: [
      'Intentions are important.',
      'Allah knows what is in our hearts.',
      'Good actions should be done sincerely.',
    ],
    reflection:
      'What good thing could you do today with a sincere intention?',
    question: {
      question: 'What does this hadith teach us about intentions?',
      options: [
        'Intentions do not matter.',
        'Intentions are important in our actions.',
        'Only adults need good intentions.',
        'We should never help anyone.',
      ],
      answer: 'Intentions are important in our actions.',
      explanation:
        'The hadith teaches that intentions are an important part of our actions.',
    },
  },
  {
    id: 2,
    title: 'Kindness',
    arabicTitle: 'الرَّحْمَةُ',
    emoji: '🤍',
    category: 'Character',
    arabicHadith: 'مَنْ لَا يَرْحَمْ لَا يُرْحَمْ',
    transliteration: 'Man la yarham la yurham.',
    meaning: 'Whoever does not show mercy will not be shown mercy.',
    explanation:
      'Islam teaches children to treat people, animals, and other living things with mercy and care.',
    lesson: 'Be gentle, caring, and merciful toward others.',
    keyPoints: [
      'Mercy is an important Islamic quality.',
      'Be gentle with younger children.',
      'Treat animals kindly.',
    ],
    reflection: 'Who could you show kindness and mercy to today?',
    question: {
      question: 'Which action shows mercy?',
      options: [
        'Hurting an animal',
        'Laughing when someone is sad',
        'Helping someone who needs you',
        "Taking someone's belongings",
      ],
      answer: 'Helping someone who needs you',
      explanation:
        'Helping someone who needs you is an example of mercy and kindness.',
    },
  },
  {
    id: 3,
    title: 'Speaking Good Words',
    arabicTitle: 'الْكَلِمَةُ الطَّيِّبَةُ',
    emoji: '💬',
    category: 'Speech',
    arabicHadith:
      'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    transliteration:
      "Man kana yu'minu billahi wal-yawmil-akhir falyaqul khayran aw liyasmut.",
    meaning:
      'Whoever believes in Allah and the Last Day should speak good or remain silent.',
    explanation:
      'Our words can help people or hurt them. Islam teaches us to think before we speak and choose words that are truthful, kind, and useful.',
    lesson: 'Think before you speak and choose good words.',
    keyPoints: [
      'Words have consequences.',
      'Speak kindly.',
      'Do not say hurtful things.',
      'Silence can be better than harmful speech.',
    ],
    reflection: 'What kind words could you say to someone today?',
    question: {
      question: 'What should we do when we have nothing good to say?',
      options: [
        'Say something hurtful.',
        'Shout loudly.',
        'Remain silent.',
        'Make fun of someone.',
      ],
      answer: 'Remain silent.',
      explanation: 'The hadith teaches us to speak good or remain silent.',
    },
  },
  {
    id: 4,
    title: 'Love for Others',
    arabicTitle: 'حُبُّ الْخَيْرِ لِلْآخَرِينَ',
    emoji: '🤝',
    category: 'Brotherhood',
    arabicHadith:
      'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    transliteration:
      "La yu'minu ahadukum hatta yuhibba li-akhihi ma yuhibbu linafsihi.",
    meaning:
      'None of you truly believes until he loves for his brother what he loves for himself.',
    explanation:
      'This teaches us to care about other people and wish good things for them just as we wish good things for ourselves.',
    lesson:
      'Want good for others just as you want good for yourself.',
    keyPoints: [
      'Care about other people.',
      'Share good things.',
      'Do not be selfish.',
      'Celebrate the good of others.',
    ],
    reflection: 'What is one good thing you could share with someone?',
    question: {
      question: 'What does loving good for others mean?',
      options: [
        'Wanting everyone to fail',
        'Wanting good things for others',
        'Never helping anyone',
        'Only thinking about yourself',
      ],
      answer: 'Wanting good things for others',
      explanation:
        'A believer should want good for others as they want good for themselves.',
    },
  },
  {
    id: 5,
    title: 'Cleanliness',
    arabicTitle: 'الطَّهَارَةُ',
    emoji: '🧼',
    category: 'Purity',
    arabicHadith: 'الطُّهُورُ شَطْرُ الإِيمَانِ',
    transliteration: 'At-tuhuru shatrul-iman.',
    meaning: 'Purity is half of faith.',
    explanation:
      'Islam places great importance on cleanliness and purity. We learn to keep our bodies, clothes, homes, and places of worship clean.',
    lesson: 'Keep yourself and your surroundings clean.',
    keyPoints: [
      'Cleanliness is important in Islam.',
      'Keep your body clean.',
      'Keep your clothes clean.',
      'Respect clean places.',
    ],
    reflection: 'What can you clean or organize today?',
    question: {
      question: 'Why should Muslims care about cleanliness?',
      options: [
        'Because cleanliness is encouraged in Islam.',
        'Because dirt is always better.',
        'Because cleanliness does not matter.',
        'Only because adults say so.',
      ],
      answer: 'Because cleanliness is encouraged in Islam.',
      explanation:
        'The hadith teaches the importance of purity and cleanliness.',
    },
  },
  {
    id: 6,
    title: 'Helping Others',
    arabicTitle: 'مَعُونَةُ النَّاسِ',
    emoji: '👐',
    category: 'Good Deeds',
    arabicHadith:
      'وَاللَّهُ فِي عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِي عَوْنِ أَخِيهِ',
    transliteration:
      'Wallahu fi awnil-abdi ma kanal-abdu fi awni akhihi.',
    meaning:
      'Allah continues to help a servant as long as the servant helps his brother.',
    explanation:
      'Helping people is a beautiful form of goodness. We can help family members, friends, classmates, neighbors, and people who need assistance.',
    lesson: 'Look for safe and useful ways to help others.',
    keyPoints: [
      'Helping others is a good deed.',
      'Small acts of help matter.',
      'Help without expecting praise.',
    ],
    reflection: 'Who can you safely help today?',
    question: {
      question: 'Which is an example of helping someone?',
      options: [
        'Ignoring someone who needs help',
        'Helping a younger child pick up their books',
        "Breaking someone's things",
        'Taking something without permission',
      ],
      answer: 'Helping a younger child pick up their books',
      explanation:
        'Helping someone with a useful task is a good example of service.',
    },
  },
  {
    id: 7,
    title: 'Honesty',
    arabicTitle: 'الصِّدْقُ',
    emoji: '🛡️',
    category: 'Character',
    arabicHadith: 'عَلَيْكُمْ بِالصِّدْقِ',
    transliteration: 'Alaykum bis-sidq.',
    meaning: 'You should be truthful.',
    explanation:
      'The Prophet ﷺ encouraged truthfulness. Being honest means telling the truth and not deliberately deceiving people.',
    lesson: 'Tell the truth even when it is difficult.',
    keyPoints: [
      'Tell the truth.',
      'Do not deliberately deceive others.',
      'Admit mistakes.',
      'Build trust through honesty.',
    ],
    reflection: 'Why is it important for people to trust you?',
    question: {
      question: 'What does honesty mean?',
      options: [
        'Telling the truth',
        'Hiding every mistake',
        'Blaming other people',
        'Taking things secretly',
      ],
      answer: 'Telling the truth',
      explanation: 'Honesty means being truthful and trustworthy.',
    },
  },
  {
    id: 8,
    title: 'Smiling and Kindness',
    arabicTitle: 'التَّبَسُّمُ',
    emoji: '😊',
    category: 'Character',
    arabicHadith: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
    transliteration: 'Tabassumuka fi wajhi akhika laka sadaqah.',
    meaning: 'Your smile for your brother is charity.',
    explanation:
      'A kind smile can make someone feel welcome and valued. Islam teaches that even simple acts of kindness can be rewarded.',
    lesson: 'Small acts of kindness can have great value.',
    keyPoints: [
      'A smile can encourage someone.',
      'Kindness does not have to cost money.',
      'Good manners are valuable.',
    ],
    reflection: 'Who could you greet with a warm smile today?',
    question: {
      question: 'What can a kind smile do?',
      options: [
        'Make someone feel welcome',
        'Always make people angry',
        'Replace every good action',
        'Make kindness unnecessary',
      ],
      answer: 'Make someone feel welcome',
      explanation:
        'A friendly smile is a simple way to show kindness.',
    },
  },
  {
    id: 9,
    title: 'Good Character',
    arabicTitle: 'حُسْنُ الْخُلُقِ',
    emoji: '⭐',
    category: 'Akhlaq',
    arabicHadith: 'إِنَّ مِنْ خِيَارِكُمْ أَحْسَنَكُمْ أَخْلَاقًا',
    transliteration: 'Inna min khiyarikum ahsanakum akhlaqan.',
    meaning:
      'Among the best of you are those who have the best character.',
    explanation:
      'Good character includes kindness, patience, honesty, respect, forgiveness, and good manners.',
    lesson: 'Work on becoming a person with beautiful character.',
    keyPoints: [
      'Be respectful.',
      'Be patient.',
      'Be honest.',
      'Be kind.',
      'Try to forgive.',
    ],
    reflection:
      'Which good character quality would you like to practise more?',
    question: {
      question: 'Which is part of good character?',
      options: [
        'Being rude',
        'Being dishonest',
        'Being respectful',
        'Hurting others',
      ],
      answer: 'Being respectful',
      explanation: 'Respect is one part of good character.',
    },
  },
  {
    id: 10,
    title: 'The Best People',
    arabicTitle: 'خَيْرُ النَّاسِ',
    emoji: '🌟',
    category: 'Service',
    arabicHadith: 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ',
    transliteration: "Khayrun-nasi anfa'uhum lin-nas.",
    meaning:
      'The best of people are those who are most beneficial to people.',
    explanation:
      'Islam encourages us to become people who bring useful goodness to others. This can happen through learning, helping, teaching, sharing, building, caring, and serving.',
    lesson: 'Use what you have learned to benefit others.',
    keyPoints: [
      'Learning can help you serve others.',
      'Useful work is valuable.',
      'Help people in safe and appropriate ways.',
      'Goodness can be shown through actions.',
    ],
    reflection:
      'What useful thing could you do for someone this week?',
    question: {
      question: 'What does it mean to benefit people?',
      options: [
        'To make life harder for everyone',
        'To use your abilities to help others',
        'To ignore everyone',
        'To keep every useful skill secret',
      ],
      answer: 'To use your abilities to help others',
      explanation:
        'Benefiting people means using your abilities and actions to bring useful good.',
    },
  },
];

const createInitialProgress = (): HadithProgress[] =>
  LESSONS.map((lesson) => ({
    id: lesson.id,
    attempts: 0,
    mastered: false,
  }));

export const HadithSunnah: React.FC<HadithSunnahProps> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<LearningMode>('guided');
  const [progress, setProgress] =
    useState<HadithProgress[]>(createInitialProgress);
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

  // English narration uses the shared pipeline (respects mute + accent)
  const { speak } = useReadAloud();

  const currentLesson = LESSONS[index];

  const currentProgress = useMemo(
    () =>
      progress.find((item) => item.id === currentLesson.id) ?? {
        id: currentLesson.id,
        attempts: 0,
        mastered: false,
      },
    [progress, currentLesson.id]
  );

  const masteredCount = progress.filter((item) => item.mastered).length;

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
    utterance.rate = 0.82;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  // Reset per-lesson state
  useEffect(() => {
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setReflectionShown(false);
  }, [index, mode]);

  // Auto-read Arabic (or English question in mastery mode)
  useEffect(() => {
    if (!currentLesson || !autoReadEnabled) return;

    const timer = window.setTimeout(() => {
      if (mode === 'mastery') {
        speak(
          `${currentLesson.title}. ${currentLesson.question.question}`,
        );
      } else {
        speakArabic(currentLesson.arabicHadith);
      }
    }, 450);

    return () => window.clearTimeout(timer);
  }, [currentLesson, mode, speak, autoReadEnabled, soundEnabled]);

  // Read reflection when it opens
  useEffect(() => {
    if (reflectionShown && currentLesson) {
      speak(currentLesson.reflection);
    }
  }, [reflectionShown, currentLesson, speak]);

  const updateCurrentProgress = (
    updater: (item: HadithProgress) => HadithProgress
  ) => {
    setProgress((previous) =>
      previous.map((item) =>
        item.id === currentLesson.id ? updater(item) : item
      )
    );
  };

  const checkAnswer = () => {
    if (!selectedAnswer || answerChecked) {
      return;
    }

    const isCorrect =
      selectedAnswer === currentLesson.question.answer;

    setAnswerChecked(true);

    if (isCorrect) {
      if (soundEnabled) playSoundFeedback('correct');

      speak(`Correct! ${currentLesson.question.explanation}`);

      setStreak((previous) => previous + 1);

      updateCurrentProgress((item) => ({
        ...item,
        attempts: item.attempts + 1,
      }));

      if (mode === 'mastery' && !currentProgress.mastered) {
        setScore((previous) => previous + 10);

        if (streak >= 1) {
          setScore((previous) => previous + 5);
        }

        updateCurrentProgress((item) => ({
          ...item,
          attempts: item.attempts + 1,
          mastered: true,
        }));
      }
    } else {
      if (soundEnabled) playSoundFeedback('try-again');

      setStreak(0);

      speak(
        `Keep practising. The correct answer is: ${currentLesson.question.answer}. ${currentLesson.question.explanation}`,
      );

      updateCurrentProgress((item) => ({
        ...item,
        attempts: item.attempts + 1,
      }));
    }
  };

  const showReflection = () => {
    setReflectionShown(true);
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
    if (hasFinished) {
      return;
    }

    setHasFinished(true);
    onComplete?.(score);

    speak(
      `Masha'Allah! You mastered ${masteredCount} of ${LESSONS.length} hadiths and earned ${score} points.`,
    );
  };

  const resetCourse = () => {
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

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    speak("Let's explore the Prophetic teachings again!");
  };

  if (!currentLesson) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <BookOpen className="mx-auto mb-4 h-10 w-10 text-slate-500" />
        <h2 className="text-xl font-semibold text-slate-900">
          Hadith &amp; Sunnah
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          No lessons are currently available.
        </p>
      </div>
    );
  }

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
            <Star className="h-10 w-10 text-amber-500" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Hadith &amp; Sunnah
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            Learning Journey Complete
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            You explored important Prophetic teachings about sincerity,
            kindness, honesty, cleanliness, service, and good character.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <Target className="mx-auto mb-2 h-6 w-6 text-slate-600" />
              <p className="text-2xl font-bold text-slate-900">
                {masteredCount}
              </p>
              <p className="text-sm text-slate-500">Hadiths mastered</p>
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
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Learning outcomes
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>• Understand that intentions matter.</li>
              <li>• Recognize kindness and mercy as important qualities.</li>
              <li>• Practise truthful and respectful speech.</li>
              <li>• Understand the importance of cleanliness.</li>
              <li>• Learn to help and benefit others.</li>
              <li>
                • Connect Prophetic teachings with everyday behaviour.
              </li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={resetCourse}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" />
              Learn Again
            </button>

            <button
              type="button"
              onClick={finishAndMoveUp}
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

  const isCorrect =
    answerChecked && selectedAnswer === currentLesson.question.answer;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Islamic Studies
            </p>

            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Hadith &amp; Sunnah
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Learn Prophetic teachings and connect them to everyday life.
            </p>
          </div>

          <div className="flex items-center gap-4">
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
                {masteredCount}/{LESSONS.length}
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
            animate={{ width: `${((index + 1) / LESSONS.length) * 100}%` }}
            className="h-full rounded-full bg-slate-900"
          />
        </div>
      </div>

      {/* Learning modes */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            id: 'guided' as const,
            title: 'Guided',
            description: 'Learn the hadith with support.',
          },
          {
            id: 'practice' as const,
            title: 'Practice',
            description: 'Check what you remember.',
          },
          {
            id: 'mastery' as const,
            title: 'Mastery',
            description: 'Answer independently.',
          },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setMode(item.id);

              speak(
                item.id === 'guided'
                  ? 'Guided mode. Learn the hadith with support.'
                  : item.id === 'practice'
                    ? 'Practice mode. Check what you remember.'
                    : 'Mastery mode. Answer independently.',
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

      {/* Lesson */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{currentLesson.emoji}</span>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Hadith {index + 1} of {LESSONS.length}
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  {currentLesson.title}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {currentLesson.category}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => speakArabic(currentLesson.arabicHadith)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Volume2 className="h-4 w-4" />
            Listen
          </button>
        </div>

        {/* Arabic */}
        <div className="mt-7 rounded-2xl bg-slate-50 p-6 text-center">
          <p
            dir="rtl"
            lang="ar"
            className="text-2xl leading-[2] text-slate-900 md:text-3xl"
          >
            {currentLesson.arabicHadith}
          </p>

          {currentLesson.transliteration && (
            <p className="mt-4 text-sm italic text-slate-500">
              {currentLesson.transliteration}
            </p>
          )}

          <p className="mt-4 text-lg font-medium text-slate-700">
            {currentLesson.arabicTitle}
          </p>
        </div>

        {/* Meaning */}
        <div className="mt-6">
          <h3 className="flex items-center gap-2 font-semibold text-slate-900">
            <BookOpen className="h-5 w-5" />
            Meaning
          </h3>

          <p className="mt-2 leading-7 text-slate-600">
            {currentLesson.meaning}
          </p>
        </div>

        {/* Explanation */}
        <div className="mt-6 rounded-2xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900">
            What does it teach us?
          </h3>

          <p className="mt-2 leading-7 text-slate-600">
            {currentLesson.explanation}
          </p>
        </div>

        {/* Key points */}
        <div className="mt-6">
          <h3 className="font-semibold text-slate-900">Key points</h3>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {currentLesson.keyPoints.map((point) => (
              <div
                key={point}
                className="flex gap-3 rounded-xl bg-slate-50 p-4"
              >
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <p className="text-sm leading-6 text-slate-600">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Practical lesson */}
        <div className="mt-6 rounded-2xl bg-amber-50 p-5">
          <h3 className="font-semibold text-slate-900">
            Put it into practice
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-700">
            {currentLesson.lesson}
          </p>
        </div>

        {/* Question */}
        {mode !== 'guided' && (
          <div className="mt-7 rounded-2xl border border-slate-200 p-5">
            <div className="flex items-start gap-3">
              <MessageCircle className="mt-0.5 h-5 w-5 text-slate-600" />

              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">
                  Check your understanding
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {currentLesson.question.question}
                </p>

                <div className="mt-4 space-y-2">
                  {currentLesson.question.options.map((option) => {
                    const selected = selectedAnswer === option;
                    const correct =
                      answerChecked &&
                      option === currentLesson.question.answer;

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
                      isCorrect
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-rose-50 text-rose-800'
                    }`}
                  >
                    <p className="font-semibold">
                      {isCorrect ? 'Correct!' : 'Keep practising.'}
                    </p>

                    <p className="mt-1 text-sm leading-6">
                      {isCorrect
                        ? currentLesson.question.explanation
                        : `The correct answer is "${currentLesson.question.answer}".`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reflection */}
        {mode !== 'guided' && answerChecked && (
          <div className="mt-6">
            {!reflectionShown ? (
              <button
                type="button"
                onClick={showReflection}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Heart className="h-4 w-4" />
                Think About It
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <h3 className="font-semibold text-slate-900">Reflection</h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {currentLesson.reflection}
                </p>
              </motion.div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={previousLesson}
            disabled={index === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>

          <div className="hidden items-center gap-2 sm:flex">
            {LESSONS.map((lesson, lessonIndex) => {
              const lessonProgress = progress.find(
                (item) => item.id === lesson.id
              );

              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => setIndex(lessonIndex)}
                  aria-label={`Go to hadith ${lessonIndex + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    lessonIndex === index
                      ? 'w-8 bg-slate-900'
                      : lessonProgress?.mastered
                        ? 'w-2.5 bg-emerald-500'
                        : 'w-2.5 bg-slate-200'
                  }`}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={nextLesson}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {index === LESSONS.length - 1 ? 'Complete' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress footer */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Your Hadith progress
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Mastery is based on correct independent answers.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Shield className="h-4 w-4" />
            {masteredCount} mastered
          </div>
        </div>

        <div className="mt-4 grid grid-cols-5 gap-2">
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

      {/* Mobile-friendly navigation */}
      <div className="flex justify-center sm:hidden">
        <button
          type="button"
          onClick={() => speakArabic(currentLesson.arabicHadith)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
        >
          <Volume2 className="h-4 w-4" />
          Hear Hadith
        </button>
      </div>

      {/* Keep React aware of imported educational icons */}
      <div className="hidden">
        <Users />
      </div>
    </motion.div>
  );
};