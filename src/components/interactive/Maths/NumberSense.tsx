import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Lightbulb,
  RotateCcw,
  Volume2,
  XCircle,
} from 'lucide-react';

import { useProfileStore } from '../../../store/useProfileStore';
import { useProgressStore } from '../../../store/useProgressStore';

type ChallengeType =
  | 'count'
  | 'recognise'
  | 'more'
  | 'less'
  | 'equal'
  | 'ordering';

type Challenge = {
  type: ChallengeType;
  count: number;
  secondCount?: number;
  emoji: string;
  prompt: string;
  explanation: string;
};

const SESSION_LENGTH = 6;

const OBJECTS = ['🍎', '🍓', '⭐', '🐟', '🧸', '🌸', '🚗', '🦋'];

const LEVEL_RANGES: Record<number, { min: number; max: number }> = {
  1: { min: 1, max: 5 },
  2: { min: 1, max: 10 },
  3: { min: 5, max: 20 },
  4: { min: 10, max: 50 },
  5: { min: 20, max: 100 },
};

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const buildNumberOptions = (
  answer: number,
  min: number,
  max: number,
): number[] => {
  const candidates = new Set<number>();

  const offsets = shuffle([-3, -2, -1, 1, 2, 3, 4]);

  offsets.forEach((offset) => {
    const value = answer + offset;

    if (value >= min && value <= max && value !== answer) {
      candidates.add(value);
    }
  });

  let distance = 4;

  while (candidates.size < 2) {
    const lower = answer - distance;
    const upper = answer + distance;

    if (lower >= min && lower !== answer) {
      candidates.add(lower);
    }

    if (upper <= max && upper !== answer) {
      candidates.add(upper);
    }

    distance += 1;

    if (distance > 20) break;
  }

  return shuffle([answer, ...Array.from(candidates).slice(0, 2)]);
};

const createChallenge = (learnerLevel: number): Challenge => {
  const range = LEVEL_RANGES[learnerLevel] ?? LEVEL_RANGES[1];

  const availableTypes: ChallengeType[] =
    learnerLevel === 1
      ? ['count', 'recognise', 'more', 'less']
      : learnerLevel === 2
        ? ['count', 'recognise', 'more', 'less', 'equal']
        : learnerLevel === 3
          ? ['count', 'recognise', 'more', 'less', 'equal', 'ordering']
          : ['recognise', 'more', 'less', 'equal', 'ordering'];

  const type =
    availableTypes[Math.floor(Math.random() * availableTypes.length)];

  const emoji = OBJECTS[Math.floor(Math.random() * OBJECTS.length)];

  const count = Math.floor(
    Math.random() * (range.max - range.min + 1),
  ) + range.min;

  if (type === 'count') {
    return {
      type,
      count,
      emoji,
      prompt: 'How many do you see?',
      explanation: `There are ${count} ${emoji} altogether.`,
    };
  }

  if (type === 'recognise') {
    return {
      type,
      count,
      emoji,
      prompt: 'Which number shows this quantity?',
      explanation: `The quantity is ${count}, so the correct number is ${count}.`,
    };
  }

  const secondCount = clamp(
    count + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1),
    range.min,
    range.max,
  );

  if (type === 'equal') {
    return {
      type,
      count,
      secondCount: count,
      emoji,
      prompt: 'Are the two groups equal?',
      explanation: `Yes. Both groups have ${count} objects.`,
    };
  }

  if (type === 'more') {
    const other = secondCount === count ? clamp(count + 1, range.min, range.max) : secondCount;

    return {
      type,
      count,
      secondCount: other,
      emoji,
      prompt: 'Which group has MORE?',
      explanation:
        count > other
          ? `${count} is more than ${other}.`
          : `${other} is more than ${count}.`,
    };
  }

  if (type === 'less') {
    const other = secondCount === count ? clamp(count + 1, range.min, range.max) : secondCount;

    return {
      type,
      count,
      secondCount: other,
      emoji,
      prompt: 'Which group has LESS?',
      explanation:
        count < other
          ? `${count} is less than ${other}.`
          : `${other} is less than ${count}.`,
    };
  }

  const middle = clamp(
    count + (Math.random() > 0.5 ? 2 : -2),
    range.min,
    range.max,
  );

  const last = clamp(
    middle + (Math.random() > 0.5 ? 2 : -2),
    range.min,
    range.max,
  );

  return {
    type: 'ordering',
    count,
    secondCount: middle,
    emoji,
    prompt: 'Which number should come FIRST?',
    explanation: `Ordering numbers helps us understand which number comes before another.`,
  };
};

export const NumberSense: React.FC = () => {
  const profile = useProfileStore(
    (state) => state.profiles[state.currentProfileId],
  );

  const currentLevel = profile?.currentLevel ?? 1;

  const completeActivity = useProgressStore(
    (state) => state.completeActivity,
  );

  const [challenge, setChallenge] = useState<Challenge>(() =>
    createChallenge(currentLevel),
  );

  const [questionNumber, setQuestionNumber] = useState(1);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selected, setSelected] = useState<string | number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completed, setCompleted] = useState(false);

  const range = LEVEL_RANGES[currentLevel] ?? LEVEL_RANGES[1];

  useEffect(() => {
    setChallenge(createChallenge(currentLevel));
    setQuestionNumber(1);
    setCorrectAnswers(0);
    setSelected(null);
    setShowHint(false);
    setShowExplanation(false);
    setCompleted(false);
  }, [currentLevel]);

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  }, []);

  const options = useMemo(() => {
    const answer =
      challenge.type === 'count' || challenge.type === 'recognise'
        ? challenge.count
        : challenge.type === 'equal'
          ? 'Yes'
          : challenge.type === 'ordering'
            ? challenge.count
            : challenge.type === 'more'
              ? Math.max(challenge.count, challenge.secondCount ?? challenge.count)
              : Math.min(challenge.count, challenge.secondCount ?? challenge.count);

    if (challenge.type === 'equal') {
      return ['Yes', 'No'];
    }

    if (challenge.type === 'ordering') {
      const values = [
        challenge.count,
        challenge.secondCount ?? challenge.count,
        clamp(
          (challenge.secondCount ?? challenge.count) +
            (challenge.count > (challenge.secondCount ?? challenge.count) ? 2 : -2),
          range.min,
          range.max,
        ),
      ];

      return shuffle(Array.from(new Set(values)));
    }

    return buildNumberOptions(
      answer as number,
      range.min,
      range.max,
    );
  }, [challenge, range.max, range.min]);

  const getCorrectAnswer = (): string | number => {
    if (challenge.type === 'count' || challenge.type === 'recognise') {
      return challenge.count;
    }

    if (challenge.type === 'equal') {
      return 'Yes';
    }

    if (challenge.type === 'more') {
      return Math.max(
        challenge.count,
        challenge.secondCount ?? challenge.count,
      );
    }

    if (challenge.type === 'less') {
      return Math.min(
        challenge.count,
        challenge.secondCount ?? challenge.count,
      );
    }

    return Math.min(
      challenge.count,
      challenge.secondCount ?? challenge.count,
    );
  };

  const isCorrect = (answer: string | number) =>
    String(answer) === String(getCorrectAnswer());

  const handleAnswer = (answer: string | number) => {
    if (selected !== null || completed) return;

    const correct = isCorrect(answer);

    setSelected(answer);

    if (correct) {
      setCorrectAnswers((previous) => previous + 1);
    }

    setShowExplanation(true);

    window.setTimeout(() => {
      if (questionNumber >= SESSION_LENGTH) {
        const finalCorrect =
          correctAnswers + (correct ? 1 : 0);

        const finalScore = Math.round(
          (finalCorrect / SESSION_LENGTH) * 100,
        );

        completeActivity({
          id: 'maths-number-sense-lab',
          score: finalScore,
          academyId: 'maths',
          domain: 'numeracy',
          skillIds: [
            'number-sense',
            'counting',
            'number-recognition',
            'one-to-one-correspondence',
            'more-less-equal',
            'number-ordering',
            'mathematical-reasoning',
          ],
        });

        setCompleted(true);
        return;
      }

      setChallenge(createChallenge(currentLevel));
      setQuestionNumber((previous) => previous + 1);
      setSelected(null);
      setShowHint(false);
      setShowExplanation(false);
    }, 1400);
  };

  const restart = () => {
    setChallenge(createChallenge(currentLevel));
    setQuestionNumber(1);
    setCorrectAnswers(0);
    setSelected(null);
    setShowHint(false);
    setShowExplanation(false);
    setCompleted(false);
  };

  const renderObjects = (count: number, emoji: string) => (
    <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto min-h-[96px]">
      {Array.from({ length: count }).map((_, index) => (
        <motion.span
          key={`${emoji}-${index}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: Math.min(index * 0.025, 0.4),
            type: 'spring',
            stiffness: 350,
            damping: 18,
          }}
          className="text-3xl sm:text-4xl select-none"
          aria-hidden="true"
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );

  const renderGroups = () => {
    if (
      challenge.type !== 'more' &&
      challenge.type !== 'less' &&
      challenge.type !== 'equal'
    ) {
      return null;
    }

    const secondCount = challenge.secondCount ?? challenge.count;

    return (
      <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
        {[challenge.count, secondCount].map((count, groupIndex) => (
          <div
            key={groupIndex}
            className="rounded-2xl border border-app-border bg-gray-900/60 p-4"
          >
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-3">
              Group {groupIndex + 1}
            </div>

            {renderObjects(count, challenge.emoji)}

            <div className="mt-3 text-2xl font-bold text-white">
              {count}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderOrdering = () => {
    if (challenge.type !== 'ordering') return null;

    const values = [
      challenge.count,
      challenge.secondCount ?? challenge.count,
      clamp(
        (challenge.secondCount ?? challenge.count) +
          (challenge.count > (challenge.secondCount ?? challenge.count)
            ? 2
            : -2),
        range.min,
        range.max,
      ),
    ];

    return (
      <div className="flex justify-center gap-3 flex-wrap mb-6">
        {shuffle(values).map((value, index) => (
          <motion.div
            key={`${value}-${index}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="rounded-xl bg-gray-900 border border-app-border px-4 py-3"
          >
            <div className="text-2xl mb-1">{challenge.emoji}</div>
            <div className="font-bold text-white">{value}</div>
          </motion.div>
        ))}
      </div>
    );
  };

  if (completed) {
    const finalAccuracy = Math.round(
      (correctAnswers / SESSION_LENGTH) * 100,
    );

    const mastered = finalAccuracy >= 80;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto bg-app-card p-6 sm:p-8 rounded-2xl border border-app-border shadow-xl text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/15 flex items-center justify-center">
          <CheckCircle className="w-9 h-9 text-green-400" />
        </div>

        <h3 className="text-2xl font-bold text-white">
          Number Sense Session Complete
        </h3>

        <p className="text-gray-400 mt-2">
          You answered {correctAnswers} of {SESSION_LENGTH} correctly.
        </p>

        <div className="my-6 rounded-2xl bg-gray-900/70 border border-app-border p-5">
          <div className="text-4xl font-black text-white">
            {finalAccuracy}%
          </div>

          <div className="text-sm text-gray-400 mt-1">
            Session accuracy
          </div>

          <div className="mt-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                mastered
                  ? 'bg-green-500/15 text-green-400'
                  : 'bg-amber-500/15 text-amber-400'
              }`}
            >
              {mastered
                ? 'Number sense is developing strongly'
                : 'Keep practising number sense'}
            </span>
          </div>
        </div>

        <div className="text-left rounded-xl bg-gray-900/40 border border-app-border p-4 mb-6">
          <div className="text-sm font-semibold text-white mb-2">
            Skills practised
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              'Counting',
              'Number recognition',
              'More / less / equal',
              'Number ordering',
              'Mathematical reasoning',
            ].map((skill) => (
              <span
                key={skill}
                className="text-xs px-2.5 py-1 rounded-lg bg-gray-800 text-gray-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={restart}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-white text-gray-900 font-bold py-3 hover:bg-gray-100 transition"
        >
          <RotateCcw className="w-4 h-4" />
          Practise Again
        </button>
      </motion.div>
    );
  }

  const progress = ((questionNumber - 1) / SESSION_LENGTH) * 100;
  const correctAnswer = getCorrectAnswer();

  return (
    <div className="max-w-2xl mx-auto bg-app-card p-5 sm:p-7 rounded-2xl border border-app-border shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔢</span>
            <h3 className="text-2xl font-bold text-white">
              Number Sense Lab
            </h3>
          </div>

          <p className="text-gray-400 text-sm mt-1">
            Build strong understanding of numbers through quantity,
            comparison and reasoning.
          </p>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-xs uppercase tracking-wider text-gray-500">
            Level
          </div>
          <div className="text-xl font-bold text-white">
            {currentLevel}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>
            Challenge {questionNumber} of {SESSION_LENGTH}
          </span>

          <span>
            {correctAnswers} correct
          </span>
        </div>

        <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Learning stage */}
      <div className="flex items-center justify-center gap-2 mb-5 text-xs">
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
          Concrete
        </span>
        <ArrowRight className="w-3 h-3 text-gray-600" />
        <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400">
          Visual
        </span>
        <ArrowRight className="w-3 h-3 text-gray-600" />
        <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400">
          Abstract
        </span>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${questionNumber}-${challenge.type}-${challenge.count}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          <div className="text-center mb-5">
            <h4 className="text-xl sm:text-2xl font-bold text-white">
              {challenge.prompt}
            </h4>

            <button
              type="button"
              onClick={() => speak(challenge.prompt)}
              className="mt-2 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
            >
              <Volume2 className="w-4 h-4" />
              Hear question
            </button>
          </div>

          {/* Concrete representation */}
          {challenge.type === 'count' ||
          challenge.type === 'recognise' ? (
            <div className="rounded-2xl bg-gray-900/60 border border-app-border p-5 mb-6">
              {renderObjects(challenge.count, challenge.emoji)}
            </div>
          ) : challenge.type === 'ordering' ? (
            renderOrdering()
          ) : (
            <div className="mb-6">{renderGroups()}</div>
          )}

          {/* Answer choices */}
          <div
            className={`grid gap-3 ${
              options.length <= 3
                ? 'grid-cols-3'
                : 'grid-cols-2 sm:grid-cols-3'
            }`}
          >
            {options.map((option, index) => {
              const correct = isCorrect(option);
              const isSelected =
                String(selected) === String(option);

              let buttonClass =
                'bg-gray-900 border-gray-700 text-white hover:border-gray-500';

              if (selected !== null && isSelected) {
                buttonClass = correct
                  ? 'bg-green-500/15 border-green-400 text-green-300'
                  : 'bg-red-500/15 border-red-400 text-red-300';
              }

              return (
                <motion.button
                  key={`${option}-${index}`}
                  type="button"
                  whileHover={selected === null ? { scale: 1.03 } : undefined}
                  whileTap={selected === null ? { scale: 0.97 } : undefined}
                  disabled={selected !== null}
                  onClick={() => handleAnswer(option)}
                  className={`min-h-16 rounded-xl border-2 font-bold text-xl transition ${buttonClass}`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {isSelected && correct && (
                      <CheckCircle className="w-5 h-5" />
                    )}

                    {isSelected && !correct && (
                      <XCircle className="w-5 h-5" />
                    )}

                    {option}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Hint */}
          {!showExplanation && (
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setShowHint((previous) => !previous)}
                className="mx-auto flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition"
              >
                <Lightbulb className="w-4 h-4" />
                {showHint ? 'Hide hint' : 'Need a hint?'}
              </button>

              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-sm text-amber-200 text-center"
                >
                  {challenge.type === 'count' &&
                    'Touch or count each object once. The last number you say tells you how many there are.'}

                  {challenge.type === 'recognise' &&
                    `Look carefully at the quantity. Count the objects, then find ${challenge.count}.`}

                  {challenge.type === 'more' &&
                    'Count both groups. The group with the larger number has more.'}

                  {challenge.type === 'less' &&
                    'Count both groups. The group with the smaller number has less.'}

                  {challenge.type === 'equal' &&
                    'Compare the two groups. Equal means they have the same number.'}

                  {challenge.type === 'ordering' &&
                    'Look for the smallest number. The smallest number comes first.'}
                </motion.div>
              )}
            </div>
          )}

          {/* Feedback */}
          {showExplanation && selected !== null && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-5 rounded-xl p-4 border ${
                isCorrect(selected)
                  ? 'bg-green-500/10 border-green-500/20'
                  : 'bg-red-500/10 border-red-500/20'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {isCorrect(selected) ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-300">Excellent!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-300">
                      Good try — keep learning!
                    </span>
                  </>
                )}
              </div>

              <p className="text-sm text-gray-300 mt-2">
                {challenge.explanation}
              </p>

              {!isCorrect(selected) && (
                <p className="text-xs text-gray-500 mt-2">
                  Correct answer: {correctAnswer}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};