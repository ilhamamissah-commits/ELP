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

type DivisionProblem = {
  id: string;
  total: number;
  groups: number;
  emoji: string;
  strategy: 'sharing' | 'grouping' | 'multiplication';
  hint: string;
  explanation: string;
};

const PROBLEMS: DivisionProblem[] = [
  {
    id: 'division-1',
    total: 6,
    groups: 3,
    emoji: '🍎',
    strategy: 'sharing',
    hint: 'Share the 6 apples equally between 3 groups.',
    explanation: '6 shared equally between 3 groups gives 2 in each group.',
  },
  {
    id: 'division-2',
    total: 8,
    groups: 2,
    emoji: '⭐',
    strategy: 'sharing',
    hint: 'Split 8 stars into 2 equal groups.',
    explanation: '8 shared equally between 2 groups gives 4 in each group.',
  },
  {
    id: 'division-3',
    total: 10,
    groups: 5,
    emoji: '🍓',
    strategy: 'sharing',
    hint: 'Think: 5 groups with the same number in each.',
    explanation: '10 shared equally between 5 groups gives 2 in each group.',
  },
  {
    id: 'division-4',
    total: 9,
    groups: 3,
    emoji: '🐟',
    strategy: 'grouping',
    hint: 'Count how many fish each group needs to have equally.',
    explanation: '9 divided into 3 equal groups gives 3 fish in each group.',
  },
  {
    id: 'division-5',
    total: 12,
    groups: 3,
    emoji: '🧸',
    strategy: 'multiplication',
    hint: 'What number multiplied by 3 makes 12?',
    explanation: '3 × 4 = 12, so 12 ÷ 3 = 4.',
  },
  {
    id: 'division-6',
    total: 12,
    groups: 4,
    emoji: '🌟',
    strategy: 'multiplication',
    hint: 'Think of a multiplication fact: 4 × ? = 12.',
    explanation: '4 × 3 = 12, so 12 ÷ 4 = 3.',
  },
  {
    id: 'division-7',
    total: 15,
    groups: 5,
    emoji: '🍊',
    strategy: 'grouping',
    hint: 'Make 5 equal groups from 15 oranges.',
    explanation: '15 divided into 5 equal groups gives 3 in each group.',
  },
  {
    id: 'division-8',
    total: 16,
    groups: 4,
    emoji: '🟦',
    strategy: 'multiplication',
    hint: 'What number times 4 equals 16?',
    explanation: '4 × 4 = 16, so 16 ÷ 4 = 4.',
  },
];

type DivisionSkill =
  | 'division'
  | 'equal-sharing'
  | 'equal-grouping'
  | 'multiplication-division-facts'
  | 'number-sense'
  | 'calculation'
  | 'mathematical-reasoning';

const SKILLS: DivisionSkill[] = [
  'division',
  'equal-sharing',
  'equal-grouping',
  'multiplication-division-facts',
  'number-sense',
  'calculation',
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

const buildOptions = (answer: number): number[] => {
  const possibleDistractors = [
    answer - 2,
    answer - 1,
    answer + 1,
    answer + 2,
  ].filter((value) => value >= 0 && value !== answer);

  const uniqueDistractors = Array.from(
    new Set(possibleDistractors),
  );

  return shuffle([
    answer,
    ...shuffle(uniqueDistractors).slice(0, 2),
  ]);
};

const getStage = (level: number) => {
  if (level <= 1) {
    return {
      title: 'Sharing Explorer',
      description: 'Discover division by sharing objects equally.',
    };
  }

  if (level === 2) {
    return {
      title: 'Grouping Mathematician',
      description: 'Build equal groups and find how many are in each.',
    };
  }

  if (level === 3) {
    return {
      title: 'Division Investigator',
      description: 'Connect division with multiplication facts.',
    };
  }

  return {
    title: 'Division Strategist',
    description: 'Solve division problems and explain your method.',
  };
};

const getStrategyLabel = (strategy: DivisionProblem['strategy']) => {
  switch (strategy) {
    case 'sharing':
      return 'Equal Sharing';
    case 'grouping':
      return 'Equal Groups';
    case 'multiplication':
      return 'Use Multiplication';
  }
};

export const DivisionGame: React.FC = () => {
  const profile = useProfileStore(
    (state) => state.profiles[state.currentProfileId],
  );

  const currentLevel = profile?.currentLevel ?? 1;

  const completeActivity = useProgressStore(
    (state) => state.completeActivity,
  );

  const stage = getStage(currentLevel);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);

  const sessionProblems = useMemo(() => {
    let eligible = PROBLEMS;

    if (currentLevel <= 1) {
      eligible = PROBLEMS.filter(
        (problem) => problem.total <= 10,
      );
    } else if (currentLevel === 2) {
      eligible = PROBLEMS.filter(
        (problem) => problem.total <= 15,
      );
    }

    return shuffle(
      eligible.length >= 5 ? eligible : PROBLEMS,
    ).slice(0, 5);
  }, [currentLevel]);

  const current = sessionProblems[index];

  const options = useMemo(() => {
    if (!current) return [];

    return buildOptions(
      current.total / current.groups,
    );
  }, [current]);

  const accuracy =
    attempts > 0
      ? Math.round((correctCount / attempts) * 100)
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
      id: 'maths-division-lab',
      score: finalAccuracy,
      academyId: 'maths',
      domain: 'numeracy',
      skillIds: SKILLS,
    });

    setCompleted(true);
  };

  const handleAnswer = (answer: number) => {
    if (!current || selected !== null || completed) {
      return;
    }

    const correctAnswer =
      current.total / current.groups;

    const isCorrect = answer === correctAnswer;

    const nextAttempts = attempts + 1;
    const nextCorrect =
      correctCount + (isCorrect ? 1 : 0);

    setAttempts(nextAttempts);
    setSelected(answer);

    if (isCorrect) {
      setCorrectCount(nextCorrect);

      speakWord(
        `Correct. ${current.total} divided by ${current.groups} equals ${correctAnswer}.`,
      );

      if (index === sessionProblems.length - 1) {
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
      speakWord('Not quite. Try sharing the objects equally.');
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
      'Division means sharing or grouping equally. Look at the objects and find how many belong in each group.',
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
          Division Lab Complete
        </h3>

        <p className="text-gray-400 text-sm mt-2">
          You practised sharing, grouping and division
          reasoning.
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
            Mathematical connection
          </p>

          <p className="text-sm text-gray-300 mt-2">
            Division and multiplication are connected.
            For example, if 3 × 4 = 12, then 12 ÷ 3 = 4
            and 12 ÷ 4 = 3.
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

  const correctAnswer =
    current.total / current.groups;

  return (
    <div className="max-w-xl mx-auto bg-app-card p-6 md:p-7 rounded-2xl border border-app-border shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h3 className="text-2xl font-bold text-white">
            ➗ Division Lab
          </h3>

          <p className="text-gray-400 text-sm mt-1">
            {stage.title} · {stage.description}
          </p>
        </div>

        <button
          type="button"
          onClick={readInstructions}
          aria-label="Read instructions"
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

      {/* Strategy */}
      <div className="mb-5 flex justify-center">
        <span className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
          {getStrategyLabel(current.strategy)}
        </span>
      </div>

      {/* Division equation */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="text-4xl font-bold text-white">
            {current.total}
          </span>

          <span className="text-3xl text-gray-500">
            ÷
          </span>

          <span className="text-4xl font-bold text-white">
            {current.groups}
          </span>

          <span className="text-3xl text-gray-500">
            =
          </span>

          <span className="text-4xl font-bold text-cyan-400">
            ?
          </span>
        </div>

        <p className="text-gray-400 text-sm mt-3">
          Share {current.total} {current.emoji} equally
          between {current.groups} groups.
        </p>
      </div>

      {/* Equal groups visual */}
      <div className="flex justify-center gap-3 mb-7 flex-wrap">
        {Array.from({
          length: current.groups,
        }).map((_, groupIndex) => (
          <motion.div
            key={groupIndex}
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: groupIndex * 0.05,
            }}
            className="min-w-[64px] min-h-[74px] flex flex-col items-center justify-center p-2 bg-gray-900/70 border border-gray-700 rounded-xl"
          >
            <div className="flex flex-wrap justify-center gap-0.5">
              {Array.from({
                length: correctAnswer,
              }).map((_, itemIndex) => (
                <span
                  key={itemIndex}
                  className="text-xl"
                  aria-hidden="true"
                >
                  {current.emoji}
                </span>
              ))}
            </div>

            <span className="text-[10px] text-gray-500 mt-1">
              Group {groupIndex + 1}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Question */}
      <div className="text-center mb-4">
        <p className="text-white font-semibold">
          How many are in each group?
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
          } else if (isSelected && !isCorrect) {
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
              onClick={() => handleAnswer(option)}
              className={`min-h-14 rounded-xl border-2 text-2xl font-bold transition-colors ${classes}`}
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
                {current.total} ÷ {current.groups} ={' '}
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
                Try sharing the objects equally. Each
                group must have the same number.
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

      {/* Session statistics */}
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
          Can you solve the problem another way? Try using
          multiplication to check your division answer.
        </p>

        <p className="text-xs text-cyan-400 mt-2">
          Example: 12 ÷ 3 = 4 because 3 × 4 = 12.
        </p>
      </div>
    </div>
  );
};