import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Lightbulb,
  RotateCcw,
  Trophy,
  Volume2,
} from 'lucide-react';

import { speakWord } from '../../../services/audioEngine';
import { useProfileStore } from '../../../store/useProfileStore';
import { useProgressStore } from '../../../store/useProgressStore';

type FractionProblem = {
  id: string;
  numerator: number;
  denominator: number;
  emoji: string;
  concept: 'part-whole' | 'equivalent' | 'comparison';
  hint: string;
  explanation: string;
};

const FRACTIONS: FractionProblem[] = [
  {
    id: 'fraction-1',
    numerator: 1,
    denominator: 2,
    emoji: '🍕',
    concept: 'part-whole',
    hint: 'The whole is divided into 2 equal parts. How many are shaded?',
    explanation:
      'There are 2 equal parts and 1 is shaded, so the fraction is 1/2.',
  },
  {
    id: 'fraction-2',
    numerator: 1,
    denominator: 3,
    emoji: '🍕',
    concept: 'part-whole',
    hint: 'Count all the equal parts first, then count the shaded parts.',
    explanation:
      'There are 3 equal parts and 1 is shaded, so the fraction is 1/3.',
  },
  {
    id: 'fraction-3',
    numerator: 2,
    denominator: 4,
    emoji: '🍕',
    concept: 'equivalent',
    hint: 'Two out of four equal parts are shaded.',
    explanation:
      '2/4 is equivalent to 1/2 because both represent half of the whole.',
  },
  {
    id: 'fraction-4',
    numerator: 3,
    denominator: 4,
    emoji: '🍕',
    concept: 'part-whole',
    hint: 'Three of the four equal parts are shaded.',
    explanation:
      'There are 4 equal parts and 3 are shaded, so the fraction is 3/4.',
  },
  {
    id: 'fraction-5',
    numerator: 2,
    denominator: 3,
    emoji: '🍉',
    concept: 'part-whole',
    hint: 'The denominator tells you how many equal parts make the whole.',
    explanation:
      'The whole is divided into 3 equal parts and 2 are selected, giving 2/3.',
  },
  {
    id: 'fraction-6',
    numerator: 3,
    denominator: 6,
    emoji: '🍊',
    concept: 'equivalent',
    hint: 'Can you see that 3 out of 6 is half?',
    explanation:
      '3/6 is equivalent to 1/2 because 3 is half of 6.',
  },
  {
    id: 'fraction-7',
    numerator: 4,
    denominator: 5,
    emoji: '🍎',
    concept: 'part-whole',
    hint: 'Almost the whole is shaded. One part is not shaded.',
    explanation:
      'There are 5 equal parts and 4 are shaded, so the fraction is 4/5.',
  },
  {
    id: 'fraction-8',
    numerator: 3,
    denominator: 8,
    emoji: '⭐',
    concept: 'part-whole',
    hint: 'Count the equal sections around the whole.',
    explanation:
      'There are 8 equal parts and 3 are selected, giving 3/8.',
  },
];

type FractionSkill =
  | 'fractions'
  | 'part-whole'
  | 'numerator'
  | 'denominator'
  | 'equal-parts'
  | 'equivalent-fractions'
  | 'fraction-representation'
  | 'mathematical-reasoning';

const SKILLS: FractionSkill[] = [
  'fractions',
  'part-whole',
  'numerator',
  'denominator',
  'equal-parts',
  'equivalent-fractions',
  'fraction-representation',
  'mathematical-reasoning',
];

const shuffle = <T,>(items: T[]): T[] => {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

const gcd = (a: number, b: number): number => {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    const remainder = x % y;
    x = y;
    y = remainder;
  }

  return x;
};

const simplifyFraction = (
  numerator: number,
  denominator: number,
): string => {
  const divisor = gcd(numerator, denominator);

  return `${numerator / divisor}/${denominator / divisor}`;
};

const buildOptions = (
  numerator: number,
  denominator: number,
): string[] => {
  const correct = `${numerator}/${denominator}`;

  const candidates = [
    `1/${denominator}`,
    `${denominator}/${numerator}`,
    `${Math.max(1, numerator - 1)}/${denominator}`,
    `${Math.min(denominator, numerator + 1)}/${denominator}`,
    simplifyFraction(numerator, denominator),
  ];

  const distractors = Array.from(
    new Set(
      candidates.filter(
        (value) => value !== correct,
      ),
    ),
  );

  return shuffle([
    correct,
    ...shuffle(distractors).slice(0, 2),
  ]);
};

const getStage = (level: number) => {
  if (level <= 1) {
    return {
      title: 'Fraction Explorer',
      description: 'Discover equal parts of a whole.',
    };
  }

  if (level === 2) {
    return {
      title: 'Fraction Reader',
      description: 'Read and represent simple fractions.',
    };
  }

  if (level === 3) {
    return {
      title: 'Fraction Investigator',
      description: 'Explore equivalent fractions and compare parts.',
    };
  }

  return {
    title: 'Fraction Mathematician',
    description: 'Reason about fractions and explain your thinking.',
  };
};

const getConceptLabel = (
  concept: FractionProblem['concept'],
) => {
  switch (concept) {
    case 'part-whole':
      return 'Part & Whole';
    case 'equivalent':
      return 'Equivalent Fractions';
    case 'comparison':
      return 'Compare Fractions';
  }
};

export const FractionsGame: React.FC = () => {
  const profile = useProfileStore(
    (state) => state.profiles[state.currentProfileId],
  );

  const currentLevel = profile?.currentLevel ?? 1;

  const completeActivity = useProgressStore(
    (state) => state.completeActivity,
  );

  const stage = getStage(currentLevel);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);

  const sessionProblems = useMemo(() => {
    let eligible = FRACTIONS;

    if (currentLevel <= 1) {
      eligible = FRACTIONS.filter(
        (fraction) =>
          fraction.denominator <= 2,
      );
    } else if (currentLevel === 2) {
      eligible = FRACTIONS.filter(
        (fraction) =>
          fraction.denominator <= 4,
      );
    }

    return shuffle(
      eligible.length >= 5
        ? eligible
        : FRACTIONS,
    ).slice(0, 5);
  }, [currentLevel]);

  const current = sessionProblems[index];

  const options = useMemo(() => {
    if (!current) return [];

    return buildOptions(
      current.numerator,
      current.denominator,
    );
  }, [current]);

  const accuracy =
    attempts > 0
      ? Math.round(
          (correctCount / attempts) * 100,
        )
      : 0;

  const progress =
    sessionProblems.length > 0
      ? (index / sessionProblems.length) * 100
      : 0;

  useEffect(() => {
    setSelected(null);
    setShowHint(false);
  }, [index]);

  const finishActivity = (
    finalCorrect: number,
    finalAttempts: number,
  ) => {
    const finalAccuracy =
      finalAttempts > 0
        ? Math.round(
            (finalCorrect / finalAttempts) * 100,
          )
        : 0;

    completeActivity({
      id: 'maths-fractions-lab',
      score: finalAccuracy,
      academyId: 'maths',
      domain: 'numeracy',
      skillIds: SKILLS,
    });

    setCompleted(true);
  };

  const handleAnswer = (answer: string) => {
    if (!current || selected !== null || completed) {
      return;
    }

    const correctAnswer = `${current.numerator}/${current.denominator}`;
    const isCorrect = answer === correctAnswer;

    const nextAttempts = attempts + 1;
    const nextCorrect =
      correctCount + (isCorrect ? 1 : 0);

    setAttempts(nextAttempts);
    setSelected(answer);

    if (isCorrect) {
      setCorrectCount(nextCorrect);

      speakWord(
        `Correct. The fraction is ${current.numerator} over ${current.denominator}.`,
      );

      if (
        index ===
        sessionProblems.length - 1
      ) {
        setTimeout(() => {
          finishActivity(
            nextCorrect,
            nextAttempts,
          );
        }, 1200);
      } else {
        setTimeout(() => {
          setIndex((value) => value + 1);
        }, 1200);
      }
    } else {
      speakWord(
        'Not quite. Count the equal parts and the shaded parts again.',
      );
    }
  };

  const resetActivity = () => {
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setAttempts(0);
    setShowHint(false);
    setCompleted(false);
  };

  const readInstructions = () => {
    speakWord(
      'A fraction shows part of a whole. The denominator tells us how many equal parts there are. The numerator tells us how many parts we have.',
    );
  };

  if (!current && !completed) {
    return null;
  }

  if (completed) {
    const finalAccuracy =
      attempts > 0
        ? Math.round(
            (correctCount / attempts) * 100,
          )
        : 0;

    return (
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="max-w-md mx-auto bg-app-card p-7 rounded-2xl border border-app-border shadow-xl text-center"
      >
        <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
          <Trophy className="w-8 h-8 text-emerald-400" />
        </div>

        <h3 className="text-2xl font-bold text-white">
          Fractions Lab Complete
        </h3>

        <p className="text-gray-400 text-sm mt-2">
          You practised representing and reasoning
          about fractions.
        </p>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="rounded-xl bg-gray-900/70 p-3">
            <div className="text-xl font-bold text-white">
              {correctCount}
            </div>
            <div className="text-xs text-gray-500">
              Correct
            </div>
          </div>

          <div className="rounded-xl bg-gray-900/70 p-3">
            <div className="text-xl font-bold text-white">
              {finalAccuracy}%
            </div>
            <div className="text-xs text-gray-500">
              Accuracy
            </div>
          </div>

          <div className="rounded-xl bg-gray-900/70 p-3">
            <div className="text-xl font-bold text-white">
              {sessionProblems.length}
            </div>
            <div className="text-xs text-gray-500">
              Problems
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-app-border bg-gray-900/40 p-4 text-left">
          <p className="text-xs uppercase tracking-wider text-gray-500">
            Fraction thinking
          </p>

          <p className="text-sm text-gray-300 mt-2">
            The denominator tells us how many equal
            parts make the whole. The numerator tells us
            how many of those parts we are describing.
          </p>
        </div>

        <button
          type="button"
          onClick={resetActivity}
          className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-400 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Practise Again
        </button>
      </motion.div>
    );
  }

  const correctAnswer = `${current.numerator}/${current.denominator}`;

  return (
    <div className="max-w-xl mx-auto bg-app-card p-6 md:p-7 rounded-2xl border border-app-border shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h3 className="text-2xl font-bold text-white">
            Fraction Lab
          </h3>

          <p className="text-gray-400 text-sm mt-1">
            {stage.title} · {stage.description}
          </p>
        </div>

        <button
          type="button"
          onClick={readInstructions}
          aria-label="Read fraction instructions"
          className="p-2.5 rounded-xl bg-gray-800 border border-gray-700 text-cyan-400 hover:bg-gray-700"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>
            Problem {index + 1} of {sessionProblems.length}
          </span>

          <span>{accuracy}% accuracy</span>
        </div>

        <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
          <motion.div
            className="h-full bg-cyan-500"
            animate={{
              width: `${progress}%`,
            }}
            transition={{
              duration: 0.3,
            }}
          />
        </div>
      </div>

      {/* Concept */}
      <div className="flex justify-center mb-5">
        <span className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
          {getConceptLabel(current.concept)}
        </span>
      </div>

      {/* Fraction visual */}
      <div className="flex justify-center mb-6">
        <motion.div
          key={current.id}
          initial={{
            opacity: 0,
            scale: 0.94,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="w-full max-w-sm rounded-2xl bg-gray-900/60 border border-gray-700 p-5"
        >
          <div className="flex justify-center items-center gap-2 mb-5">
            <span className="text-4xl">
              {current.emoji}
            </span>

            <span className="text-gray-500 text-2xl">
              =
            </span>

            <div className="flex flex-col items-center leading-none">
              <span className="text-3xl font-bold text-white">
                {current.numerator}
              </span>

              <div className="w-12 h-0.5 bg-gray-400 my-1" />

              <span className="text-3xl font-bold text-white">
                {current.denominator}
              </span>
            </div>
          </div>

          {/* Equal sections */}
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${current.denominator}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({
              length: current.denominator,
            }).map((_, partIndex) => {
              const shaded =
                partIndex < current.numerator;

              return (
                <motion.div
                  key={partIndex}
                  initial={{
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: partIndex * 0.05,
                  }}
                  className={`h-14 md:h-16 rounded-lg border-2 flex items-center justify-center ${
                    shaded
                      ? 'bg-cyan-500/30 border-cyan-400'
                      : 'bg-gray-800 border-gray-700'
                  }`}
                >
                  <span
                    className={`text-xl ${
                      shaded
                        ? 'opacity-100'
                        : 'opacity-20'
                    }`}
                  >
                    {current.emoji}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <div className="flex justify-between mt-3 text-xs text-gray-500">
            <span>
              {current.numerator} shaded
            </span>

            <span>
              {current.denominator} equal parts
            </span>
          </div>
        </motion.div>
      </div>

      {/* Question */}
      <div className="text-center mb-4">
        <p className="text-white font-semibold">
          What fraction is shaded?
        </p>

        <p className="text-gray-500 text-xs mt-1">
          Count the shaded parts and the total equal parts.
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-3 gap-3">
        {options.map((option) => {
          const isCorrect = option === correctAnswer;
          const isSelected = selected === option;

          let classes =
            'bg-gray-800 border-gray-700 text-white hover:bg-gray-700';

          if (isSelected && isCorrect) {
            classes =
              'bg-emerald-500/20 border-emerald-400 text-emerald-300';
          } else if (
            isSelected &&
            !isCorrect
          ) {
            classes =
              'bg-red-500/20 border-red-400 text-red-300';
          }

          return (
            <motion.button
              key={option}
              type="button"
              whileHover={{
                scale: selected === null ? 1.03 : 1,
              }}
              whileTap={{
                scale: selected === null ? 0.97 : 1,
              }}
              disabled={selected !== null}
              onClick={() =>
                handleAnswer(option)
              }
              className={`min-h-16 rounded-xl border-2 text-xl font-bold transition-colors ${classes}`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>

      {/* Hint */}
      {!selected && (
        <button
          type="button"
          onClick={() =>
            setShowHint((value) => !value)
          }
          className="mt-5 mx-auto flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300"
        >
          <Lightbulb className="w-4 h-4" />
          {showHint ? 'Hide hint' : 'Need a hint?'}
        </button>
      )}

      {showHint && !selected && (
        <motion.div
          initial={{
            opacity: 0,
            y: 5,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-200"
        >
          {current.hint}
        </motion.div>
      )}

      {/* Feedback */}
      {selected !== null && (
        <motion.div
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className={`mt-5 p-4 rounded-xl border ${
            selected === correctAnswer
              ? 'bg-emerald-500/10 border-emerald-500/20'
              : 'bg-red-500/10 border-red-500/20'
          }`}
        >
          {selected === correctAnswer ? (
            <>
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle className="w-5 h-5" />
                Correct!
              </div>

              <p className="text-sm text-gray-300 mt-2">
                {current.numerator} out of{' '}
                {current.denominator} equal parts =
                {' '}
                {correctAnswer}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {current.explanation}
              </p>
            </>
          ) : (
            <>
              <p className="text-red-300 font-semibold">
                Not quite.
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Count the shaded parts first, then count
                all the equal parts.
              </p>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="mt-3 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm font-semibold"
              >
                Try Again
              </button>
            </>
          )}
        </motion.div>
      )}

      {/* Session stats */}
      <div className="mt-6 pt-5 border-t border-app-border flex justify-between text-sm">
        <span className="text-gray-500">
          Score:{' '}
          <span className="text-white font-semibold">
            {correctCount * 10}
          </span>
        </span>

        <span className="text-gray-500">
          Correct:{' '}
          <span className="text-white font-semibold">
            {correctCount}/{attempts}
          </span>
        </span>
      </div>

      {/* Mathematical thinking */}
      <div className="mt-5 p-4 rounded-xl bg-gray-900/50 border border-app-border">
        <p className="text-xs uppercase tracking-wider text-gray-500">
          Think like a mathematician
        </p>

        <p className="text-sm text-gray-300 mt-2">
          Why must the parts of a fraction be equal?
        </p>

        <p className="text-xs text-cyan-400 mt-2">
          Remember: the denominator tells how many equal
          parts make the whole.
        </p>
      </div>
    </div>
  );
};