import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  RotateCcw,
  Star,
  Target,
  Volume2,
  XCircle,
} from 'lucide-react';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

type LearningMode = 'guided' | 'practice' | 'mastery';

interface AqeedahQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

interface AqeedahLesson {
  id: string;
  title: string;
  arabic: string;
  emoji: string;
  pillar: string;
  introduction: string;
  explanation: string;
  keyPoints: string[];
  reflection: string;
  question: AqeedahQuestion;
}

interface AqeedahProgress {
  id: string;
  attempts: number;
  mastered: boolean;
}

interface AqeedahProps {
  onComplete?: (score: number) => void;
}

const LESSONS: AqeedahLesson[] = [
  {
    id: 'allah',
    title: 'Belief in Allah',
    arabic: 'الإيمان بالله',
    emoji: '🌙',
    pillar: 'Pillar 1 of Iman',
    introduction:
      'Muslims believe in Allah, the One true God and Creator of everything.',
    explanation:
      'Allah created the heavens and the earth, the people, the animals, the plants and everything that exists. Allah is One, has no partner, and nothing is like Him. We worship Allah alone.',
    keyPoints: [
      'Allah is our Creator.',
      'Allah is One.',
      'Allah has no partner.',
      'Nothing is like Allah.',
      'We worship Allah alone.',
    ],
    reflection:
      'Think of something beautiful in creation. How does it remind you of the Creator?',
    question: {
      question: 'Who do Muslims worship?',
      options: ['The sun', 'Allah alone', 'The stars', 'People'],
      answer: 1,
      explanation:
        'Muslims worship Allah alone because He is the One true God and Creator.',
    },
  },
  {
    id: 'angels',
    title: 'Belief in the Angels',
    arabic: 'الإيمان بالملائكة',
    emoji: '✨',
    pillar: 'Pillar 2 of Iman',
    introduction: 'Muslims believe in the angels created by Allah.',
    explanation:
      'Angels are a creation of Allah. They obey Allah and carry out the commands He gives them. We believe in them even though we cannot normally see them.',
    keyPoints: [
      'Angels are created by Allah.',
      'They obey Allah.',
      'They carry out Allah’s commands.',
      'Belief in angels is part of Iman.',
    ],
    reflection:
      'How can believing that Allah knows what we do encourage us to make good choices?',
    question: {
      question: 'Who created the angels?',
      options: ['People', 'The prophets', 'Allah', 'Animals'],
      answer: 2,
      explanation:
        'Allah created the angels, and they obey His commands.',
    },
  },
  {
    id: 'books',
    title: 'Belief in Allah’s Books',
    arabic: 'الإيمان بالكتب',
    emoji: '📖',
    pillar: 'Pillar 3 of Iman',
    introduction: 'Allah sent revelation to guide humanity.',
    explanation:
      'Muslims believe that Allah revealed guidance to His messengers. The Quran is the final revealed book and was revealed to Prophet Muhammad ﷺ.',
    keyPoints: [
      'Allah sent revelation.',
      'Allah revealed guidance through His messengers.',
      'The Quran is the final revealed book.',
      'The Quran guides people toward what is right.',
    ],
    reflection: 'What is one way you can show respect for the Quran?',
    question: {
      question: 'Which is the final revealed book?',
      options: [
        'The Quran',
        'A history book',
        'A storybook',
        'A dictionary',
      ],
      answer: 0,
      explanation:
        'The Quran is the final revealed book of Allah, revealed to Prophet Muhammad ﷺ.',
    },
  },
  {
    id: 'messengers',
    title: 'Belief in the Messengers',
    arabic: 'الإيمان بالرسل',
    emoji: '🕌',
    pillar: 'Pillar 4 of Iman',
    introduction: 'Allah sent prophets and messengers to guide people.',
    explanation:
      'Allah chose messengers to teach people His guidance and call them to worship Him. Muslims believe in all the prophets and messengers mentioned in revelation. Muhammad ﷺ is the final prophet.',
    keyPoints: [
      'Allah sent messengers to guide people.',
      'The messengers called people to worship Allah.',
      'Muslims believe in all of Allah’s prophets.',
      'Muhammad ﷺ is the final prophet.',
    ],
    reflection:
      'What important message did Allah’s prophets teach people?',
    question: {
      question: 'Who is the final prophet?',
      options: [
        'Adam (AS)',
        'Nuh (AS)',
        'Musa (AS)',
        'Muhammad ﷺ',
      ],
      answer: 3,
      explanation:
        'Prophet Muhammad ﷺ is the final prophet and messenger of Allah.',
    },
  },
  {
    id: 'hereafter',
    title: 'Belief in the Last Day',
    arabic: 'الإيمان باليوم الآخر',
    emoji: '🌅',
    pillar: 'Pillar 5 of Iman',
    introduction: 'Muslims believe that there is life after this world.',
    explanation:
      'Islam teaches that this worldly life is temporary and that there will be a Last Day. Allah will resurrect people and judge them with complete justice.',
    keyPoints: [
      'This worldly life is temporary.',
      'There is life after death.',
      'There will be a Last Day.',
      'Allah is perfectly just.',
      'Our actions matter.',
    ],
    reflection: 'What good action would you like to do today?',
    question: {
      question: 'What do Muslims believe about life after death?',
      options: [
        'There is no life after death',
        'There is a Last Day and resurrection',
        'Everyone becomes an angel',
        'People return as animals',
      ],
      answer: 1,
      explanation:
        'Muslims believe in resurrection and the Last Day when people will be judged by Allah.',
    },
  },
  {
    id: 'qadr',
    title: 'Belief in Allah’s Decree',
    arabic: 'الإيمان بالقدر',
    emoji: '⭐',
    pillar: 'Pillar 6 of Iman',
    introduction: 'Muslims believe in Allah’s knowledge and decree.',
    explanation:
      'Allah has complete knowledge of everything. Muslims trust Allah while still making responsible choices, working hard and taking responsibility for their actions.',
    keyPoints: [
      'Allah knows everything.',
      'Allah has complete knowledge.',
      'We trust Allah.',
      'We make responsible choices.',
      'We remain patient when things are difficult.',
    ],
    reflection:
      'What can you do when something does not happen the way you hoped?',
    question: {
      question: 'What should a Muslim do when something difficult happens?',
      options: [
        'Give up immediately',
        'Blame everyone',
        'Trust Allah and respond responsibly',
        'Stop trying',
      ],
      answer: 2,
      explanation:
        'A Muslim trusts Allah while taking responsible action and remaining patient.',
    },
  },
];

export const Aqeedah: React.FC<AqeedahProps> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<LearningMode>('guided');

  const [progress, setProgress] = useState<AqeedahProgress[]>([]);

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

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

  const masteredCount = progress.filter((item) => item.mastered).length;

  const progressPercentage = useMemo(() => {
    if (LESSONS.length === 0) return 0;

    return Math.round((masteredCount / LESSONS.length) * 100);
  }, [masteredCount]);

  const lessonProgress = useMemo(() => {
    if (LESSONS.length === 0) return 0;

    return Math.round(((index + 1) / LESSONS.length) * 100);
  }, [index]);

  const currentProgress = progress.find((item) => item.id === current.id);

  const isMastered = currentProgress?.mastered ?? false;

  // Auto-read the lesson introduction and explanation when the lesson or mode changes
  useEffect(() => {
    if (!autoReadEnabled || !current) return;

    const readOut =
      mode === 'guided'
        ? `${current.title}. ${current.introduction}. ${current.explanation}`
        : `${current.title}. ${current.question.question}`;

    const timer = window.setTimeout(() => speak(readOut), 350);
    return () => window.clearTimeout(timer);
  }, [index, mode, current, speak, autoReadEnabled]);

  // Read the reflection when it opens
  useEffect(() => {
    if (reflectionShown && current) {
      speak(current.reflection);
    }
  }, [reflectionShown, current, speak]);

  const selectAnswer = (answerIndex: number) => {
    if (answerChecked) return;

    setSelectedAnswer(answerIndex);
  };

  const checkAnswer = () => {
    if (selectedAnswer === null || answerChecked) {
      return;
    }

    const correct = selectedAnswer === current.question.answer;

    setAnswerChecked(true);

    setProgress((previous) => {
      const existing = previous.find((item) => item.id === current.id);

      if (existing) {
        return previous.map((item) =>
          item.id === current.id
            ? {
                ...item,
                attempts: item.attempts + 1,
                mastered: item.mastered || correct,
              }
            : item,
        );
      }

      return [
        ...previous,
        {
          id: current.id,
          attempts: 1,
          mastered: correct,
        },
      ];
    });

    if (correct) {
      if (soundEnabled) playSoundFeedback('correct');

      setScore((previous) => {
        const alreadyMastered = currentProgress?.mastered;

        if (alreadyMastered) {
          return previous;
        }

        const bonus = streak >= 1 ? 5 : 0;

        return previous + 10 + bonus;
      });

      setStreak((previous) => previous + 1);

      speak(`Correct! ${current.question.explanation}`);
    } else {
      if (soundEnabled) playSoundFeedback('try-again');

      setStreak(0);

      speak(
        `Not quite. ${current.question.explanation} Try again when you are ready.`,
      );
    }
  };

  const showReflection = () => {
    setReflectionShown(true);
  };

  const resetQuestion = () => {
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setReflectionShown(false);
  };

  const next = () => {
    if (index < LESSONS.length - 1) {
      setIndex((previous) => previous + 1);
      resetQuestion();
      return;
    }

    setIsComplete(true);
  };

  const previous = () => {
    if (index === 0) return;

    setIndex((previous) => previous - 1);
    resetQuestion();
  };

  const finish = () => {
    if (hasFinished) return;

    setHasFinished(true);
    onComplete?.(score);

    speak(
      `Masha'Allah! You earned ${score} points and mastered ${masteredCount} of the six pillars.`,
    );
  };

  const reset = () => {
    setIndex(0);
    setMode('guided');
    setProgress([]);
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setReflectionShown(false);
    setScore(0);
    setStreak(0);
    setIsComplete(false);
    setHasFinished(false);

    speak("Let's learn the foundations of Islamic belief again!");
  };

  const getModeDescription = () => {
    if (mode === 'guided') {
      return 'Learn the belief, understand the meaning, then reflect.';
    }

    if (mode === 'practice') {
      return 'Check what you remember and strengthen your understanding.';
    }

    return 'Show that you can answer independently.';
  };

  if (isComplete) {
    return (
      <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl">
        <div className="text-center">
          <div className="text-7xl mb-4">🌙</div>

          <h3 className="text-2xl font-bold text-emerald-400">
            Masha&apos;Allah!
          </h3>

          <p className="text-gray-300 mt-2 mb-6">
            You completed the Aqeedah foundation.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-900 rounded-xl p-4">
              <BookOpen className="w-5 h-5 mx-auto mb-2 text-emerald-400" />

              <div className="text-2xl font-bold text-white">
                {masteredCount}
              </div>

              <div className="text-xs text-gray-500">Mastered</div>
            </div>

            <div className="bg-gray-900 rounded-xl p-4">
              <Star className="w-5 h-5 mx-auto mb-2 text-yellow-400" />

              <div className="text-2xl font-bold text-white">{score}</div>

              <div className="text-xs text-gray-500">Score</div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-4 mb-6">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Mastery</span>
              <span>{progressPercentage}%</span>
            </div>

            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-emerald-500"
                animate={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-left mb-6">
            <p className="text-xs text-emerald-400 font-semibold mb-2">
              FOUNDATION OUTCOMES
            </p>

            <ul className="space-y-2 text-xs text-gray-300">
              <li>• Know the six pillars of Iman.</li>
              <li>• Understand basic Islamic beliefs.</li>
              <li>• Connect belief with everyday choices.</li>
              <li>• Begin reflecting on faith and character.</li>
            </ul>
          </div>

          <button
            onClick={reset}
            className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold mb-3"
          >
            <RotateCcw className="w-4 h-4 inline mr-2" />
            Learn Again
          </button>

          <button
            onClick={finish}
            disabled={hasFinished}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold disabled:opacity-50"
          >
            {hasFinished ? 'Completed' : 'Finish & Move Up'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex-1 text-center">
          <h3 className="text-2xl font-bold text-white">Aqeedah</h3>

          <p className="text-xs text-gray-500 mt-1">
            Foundations of Islamic Belief
          </p>
        </div>

        <button
          type="button"
          onClick={toggleSound}
          aria-label="Toggle sound"
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <Volume2
            className={`w-5 h-5 ${
              soundEnabled ? 'text-amber-300' : 'text-gray-500'
            }`}
          />
        </button>
      </div>

      {/* Learning Mode */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {(['guided', 'practice', 'mastery'] as LearningMode[]).map(
          (learningMode) => (
            <button
              key={learningMode}
              onClick={() => {
                setMode(learningMode);
                resetQuestion();

                speak(
                  learningMode === 'guided'
                    ? 'Guided mode. Learn the belief, understand the meaning, then reflect.'
                    : learningMode === 'practice'
                      ? 'Practice mode. Check what you remember.'
                      : 'Mastery mode. Show that you can answer independently.',
                );
              }}
              className={`py-2 rounded-lg text-xs font-semibold transition ${
                mode === learningMode
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              {learningMode === 'guided'
                ? 'Guided'
                : learningMode === 'practice'
                  ? 'Practice'
                  : 'Mastery'}
            </button>
          ),
        )}
      </div>

      <div className="text-center text-xs text-gray-500 mb-4">
        {getModeDescription()}
      </div>

      {/* Progress */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>
            Pillar {index + 1} / {LESSONS.length}
          </span>

          <span>{masteredCount} mastered</span>
        </div>

        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500"
            animate={{ width: `${lessonProgress}%` }}
          />
        </div>
      </div>

      {/* Lesson */}
      <motion.div
        key={`${current.id}-${mode}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 mb-5"
      >
        <div className="text-center">
          <div className="text-6xl mb-3">{current.emoji}</div>

          <div className="text-xs text-emerald-400 font-semibold mb-2">
            {current.pillar}
          </div>

          <h4 className="text-xl font-bold text-white">{current.title}</h4>

          <div
            dir="rtl"
            lang="ar"
            className="text-emerald-400 text-xl mt-2"
          >
            {current.arabic}
          </div>

          <p className="text-gray-400 text-sm mt-4">
            {current.introduction}
          </p>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 mt-5">
          <p className="text-gray-300 text-sm leading-7">
            {current.explanation}
          </p>
        </div>
      </motion.div>

      {/* Key Points */}
      <div className="bg-gray-900 rounded-xl p-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-emerald-400" />

          <p className="text-white text-sm font-semibold">Remember</p>
        </div>

        <ul className="space-y-2">
          {current.keyPoints.map((point) => (
            <li key={point} className="flex gap-2 text-xs text-gray-400">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />

              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Question */}
      {(mode === 'practice' || mode === 'mastery') && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-indigo-400" />

            <p className="text-white text-sm font-semibold">
              Check Your Understanding
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-gray-200 text-sm font-semibold mb-4">
              {current.question.question}
            </p>

            <div className="space-y-2">
              {current.question.options.map((option, optionIndex) => {
                const isSelected = selectedAnswer === optionIndex;

                const isCorrect =
                  answerChecked && optionIndex === current.question.answer;

                const isWrong =
                  answerChecked &&
                  isSelected &&
                  optionIndex !== current.question.answer;

                let buttonClass =
                  'border-gray-800 bg-gray-800 text-gray-300';

                if (isCorrect) {
                  buttonClass =
                    'border-emerald-500 bg-emerald-500/10 text-emerald-300';
                } else if (isWrong) {
                  buttonClass =
                    'border-red-500 bg-red-500/10 text-red-300';
                } else if (isSelected) {
                  buttonClass =
                    'border-indigo-500 bg-indigo-500/10 text-white';
                }

                return (
                  <button
                    key={option}
                    onClick={() => selectAnswer(optionIndex)}
                    disabled={answerChecked}
                    className={`w-full text-left p-3 rounded-lg border text-sm transition ${buttonClass}`}
                  >
                    <span className="mr-2 font-bold">
                      {String.fromCharCode(65 + optionIndex)}.
                    </span>

                    {option}

                    {isCorrect && (
                      <CheckCircle className="w-4 h-4 inline ml-2" />
                    )}

                    {isWrong && <XCircle className="w-4 h-4 inline ml-2" />}
                  </button>
                );
              })}
            </div>

            {!answerChecked && (
              <button
                onClick={checkAnswer}
                disabled={selectedAnswer === null}
                className="w-full mt-4 py-3 rounded-xl bg-indigo-600 text-white font-bold disabled:opacity-40"
              >
                Check Answer
              </button>
            )}

            {answerChecked && (
              <div
                className={`mt-4 p-4 rounded-xl ${
                  selectedAnswer === current.question.answer
                    ? 'bg-emerald-500/10 border border-emerald-500/20'
                    : 'bg-red-500/10 border border-red-500/20'
                }`}
              >
                <p className="text-sm font-semibold text-white mb-2">
                  {selectedAnswer === current.question.answer
                    ? 'Correct! Masha’Allah.'
                    : 'Keep learning and try again.'}
                </p>

                <p className="text-xs text-gray-400 leading-6">
                  {current.question.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Guided reflection */}
      {mode === 'guided' && (
        <>
          {!reflectionShown ? (
            <button
              onClick={showReflection}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold mb-4"
            >
              <CheckCircle className="w-4 h-4 inline mr-2" />
              I Understand
            </button>
          ) : (
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-5">
              <p className="text-xs text-indigo-400 font-semibold mb-2">
                REFLECT
              </p>

              <p className="text-sm text-gray-200 leading-6">
                {current.reflection}
              </p>
            </div>
          )}
        </>
      )}

      {/* Reflection after practice/mastery */}
      {answerChecked && !reflectionShown && (
        <button
          onClick={showReflection}
          className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold mb-4"
        >
          Reflect on This
        </button>
      )}

      {reflectionShown && mode !== 'guided' && (
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-5">
          <p className="text-xs text-indigo-400 font-semibold mb-2">
            REFLECTION
          </p>

          <p className="text-sm text-gray-200 leading-6">
            {current.reflection}
          </p>
        </div>
      )}

      {/* Current mastery */}
      {isMastered && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-4">
          <CheckCircle className="w-5 h-5 text-emerald-400" />

          <div>
            <p className="text-sm font-semibold text-emerald-300">
              Mastered
            </p>

            <p className="text-xs text-gray-500">
              You have demonstrated understanding of this pillar.
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={previous}
          disabled={index === 0}
          className="px-4 py-3 bg-gray-800 rounded-xl text-gray-300 disabled:opacity-30"
          aria-label="Previous lesson"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <button
          onClick={next}
          className="flex-1 py-3 bg-indigo-600 rounded-xl text-white font-bold"
        >
          {index === LESSONS.length - 1
            ? 'Complete Foundation'
            : 'Next Pillar'}

          <ArrowRight className="w-4 h-4 inline ml-2" />
        </button>
      </div>
    </div>
  );
};