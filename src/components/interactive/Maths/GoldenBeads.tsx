import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus,
  Minus,
  Zap,
  Lightbulb,
  Volume2,
  Trophy,
  ArrowRight,
} from 'lucide-react';

import { speakWord } from '../../../services/audioEngine';
import { useProfileStore } from '../../../store/useProfileStore';
import { useProgressStore } from '../../../store/useProgressStore';

type BeadType = 'unit' | 'ten' | 'hundred' | 'thousand';

type ActivityMode =
  | 'explore'
  | 'build'
  | 'exchange'
  | 'decompose';

type FeedbackState = 'idle' | 'correct' | 'incorrect';

interface GoldenBeadsProps {
  onComplete?: (score: number) => void;
}

interface BuildProblem {
  id: string;
  target: number;
  hint: string;
  explanation: string;
}

const BUILD_PROBLEMS: BuildProblem[] = [
  {
    id: 'gb-101',
    target: 7,
    hint: 'You need 7 units.',
    explanation: '7 has 7 ones and no tens, hundreds or thousands.',
  },
  {
    id: 'gb-102',
    target: 24,
    hint: 'Think about 2 tens and 4 units.',
    explanation: '24 is made from 2 tens and 4 units.',
  },
  {
    id: 'gb-103',
    target: 135,
    hint: 'Break the number into hundreds, tens and units.',
    explanation: '135 = 1 hundred + 3 tens + 5 units.',
  },
  {
    id: 'gb-104',
    target: 408,
    hint: 'There are 4 hundreds, no tens and 8 units.',
    explanation: '408 = 4 hundreds + 0 tens + 8 units.',
  },
  {
    id: 'gb-105',
    target: 572,
    hint: 'Look at each digit from left to right.',
    explanation: '572 = 5 hundreds + 7 tens + 2 units.',
  },
  {
    id: 'gb-106',
    target: 1204,
    hint: 'Think: 1 thousand, 2 hundreds, 0 tens and 4 units.',
    explanation: '1204 = 1 thousand + 2 hundreds + 0 tens + 4 units.',
  },
  {
    id: 'gb-107',
    target: 3045,
    hint: 'There are 3 thousands, 0 hundreds, 4 tens and 5 units.',
    explanation: '3045 = 3 thousands + 0 hundreds + 4 tens + 5 units.',
  },
  {
    id: 'gb-108',
    target: 4218,
    hint: 'Separate thousands, hundreds, tens and units.',
    explanation: '4218 = 4 thousands + 2 hundreds + 1 ten + 8 units.',
  },
];

const MAX_PER_PLACE = 9;

const PLACE_VALUES = [
  {
    type: 'thousand' as const,
    label: 'Thousands',
    shortLabel: 'T',
    value: 1000,
  },
  {
    type: 'hundred' as const,
    label: 'Hundreds',
    shortLabel: 'H',
    value: 100,
  },
  {
    type: 'ten' as const,
    label: 'Tens',
    shortLabel: 'T',
    value: 10,
  },
  {
    type: 'unit' as const,
    label: 'Units',
    shortLabel: 'U',
    value: 1,
  },
];

const shuffle = <T,>(items: T[]): T[] => {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

const getStage = (level: number) => {
  if (level <= 1) {
    return {
      title: 'Quantity Explorer',
      description: 'Explore ones and groups of ten.',
      maxNumber: 99,
    };
  }

  if (level === 2) {
    return {
      title: 'Place Value Builder',
      description: 'Build numbers using hundreds, tens and units.',
      maxNumber: 999,
    };
  }

  if (level === 3) {
    return {
      title: 'Decimal System Investigator',
      description: 'Explore thousands and decomposition.',
      maxNumber: 9999,
    };
  }

  return {
    title: 'Place Value Mathematician',
    description: 'Reason about numbers, exchanges and expanded form.',
    maxNumber: 9999,
  };
};

const createBlankState = () => ({
  units: 0,
  tens: 0,
  hundreds: 0,
  thousands: 0,
});

const getNumberParts = (number: number) => ({
  thousands: Math.floor(number / 1000) % 10,
  hundreds: Math.floor(number / 100) % 10,
  tens: Math.floor(number / 10) % 10,
  units: number % 10,
});

const formatExpanded = (
  units: number,
  tens: number,
  hundreds: number,
  thousands: number,
) => {
  const parts: string[] = [];

  if (thousands > 0) parts.push(`${thousands} × 1000`);
  if (hundreds > 0) parts.push(`${hundreds} × 100`);
  if (tens > 0) parts.push(`${tens} × 10`);
  if (units > 0 || parts.length === 0) {
    parts.push(`${units} × 1`);
  }

  return parts.join(' + ');
};

export const GoldenBeads: React.FC<GoldenBeadsProps> = ({
  onComplete,
}) => {
  const profile = useProfileStore(
    (state) => state.profiles[state.currentProfileId],
  );

  const currentLevel = profile?.currentLevel ?? 1;

  const completeActivity = useProgressStore(
    (state) => state.completeActivity,
  );

  const stage = getStage(currentLevel);

  const [mode, setMode] =
    useState<ActivityMode>('explore');

  const [units, setUnits] = useState(0);
  const [tens, setTens] = useState(0);
  const [hundreds, setHundreds] = useState(0);
  const [thousands, setThousands] = useState(0);

  const [targetNumber, setTargetNumber] = useState(0);

  const [feedback, setFeedback] =
    useState<FeedbackState>('idle');

  const [score, setScore] = useState(0);
  const [roundsCompleted, setRoundsCompleted] =
    useState(0);

  const [buildProblems, setBuildProblems] =
    useState<BuildProblem[]>([]);

  const [problemIndex, setProblemIndex] = useState(0);

  const [showHint, setShowHint] = useState(false);

  const [completed, setCompleted] =
    useState(false);

  const currentValue =
    units +
    tens * 10 +
    hundreds * 100 +
    thousands * 1000;

  const currentProblem =
    buildProblems[problemIndex];

  const accuracy =
    roundsCompleted > 0
      ? Math.round(
          (score / (roundsCompleted * 10)) * 100,
        )
      : 0;

  const progress =
    buildProblems.length > 0
      ? (problemIndex / buildProblems.length) * 100
      : 0;

  const expandedForm = formatExpanded(
    units,
    tens,
    hundreds,
    thousands,
  );

  const stageProblems = useMemo(() => {
    const eligible = BUILD_PROBLEMS.filter(
      (problem) => problem.target <= stage.maxNumber,
    );

    return shuffle(
      eligible.length >= 5
        ? eligible
        : BUILD_PROBLEMS,
    ).slice(0, 5);
  }, [stage.maxNumber]);

  useEffect(() => {
    setBuildProblems(stageProblems);
    setProblemIndex(0);
  }, [stageProblems]);

  const resetBeads = () => {
    setUnits(0);
    setTens(0);
    setHundreds(0);
    setThousands(0);
    setFeedback('idle');
    setShowHint(false);
  };

  const addBead = (type: BeadType) => {
    if (feedback === 'correct') return;

    switch (type) {
      case 'unit':
        if (units < MAX_PER_PLACE) {
          setUnits((value) => value + 1);
        }
        break;

      case 'ten':
        if (tens < MAX_PER_PLACE) {
          setTens((value) => value + 1);
        }
        break;

      case 'hundred':
        if (hundreds < MAX_PER_PLACE) {
          setHundreds((value) => value + 1);
        }
        break;

      case 'thousand':
        if (thousands < MAX_PER_PLACE) {
          setThousands((value) => value + 1);
        }
        break;
    }

    setFeedback('idle');
  };

  const removeBead = (type: BeadType) => {
    if (feedback === 'correct') return;

    switch (type) {
      case 'unit':
        if (units > 0) {
          setUnits((value) => value - 1);
        }
        break;

      case 'ten':
        if (tens > 0) {
          setTens((value) => value - 1);
        }
        break;

      case 'hundred':
        if (hundreds > 0) {
          setHundreds((value) => value - 1);
        }
        break;

      case 'thousand':
        if (thousands > 0) {
          setThousands((value) => value - 1);
        }
        break;
    }

    setFeedback('idle');
  };

  const startBuildMode = () => {
    const firstProblem = stageProblems[0];

    resetBeads();

    setBuildProblems(stageProblems);
    setProblemIndex(0);
    setTargetNumber(
      firstProblem?.target ?? 1,
    );

    setMode('build');
    setCompleted(false);
  };

  const startExchangeMode = () => {
    resetBeads();

    setMode('exchange');
    setCompleted(false);
  };

  const startExploreMode = () => {
    resetBeads();

    setMode('explore');
    setCompleted(false);
  };

  const startDecomposeMode = () => {
    resetBeads();

    const randomProblem =
      stageProblems[
        Math.floor(
          Math.random() * stageProblems.length,
        )
      ];

    setTargetNumber(
      randomProblem?.target ?? 24,
    );

    setMode('decompose');
    setCompleted(false);
  };

  const handleExchange = () => {
    let nextUnits = units;
    let nextTens = tens;
    let nextHundreds = hundreds;
    let nextThousands = thousands;

    let exchanged = false;

    if (nextUnits >= 10) {
      nextUnits -= 10;
      nextTens += 1;
      exchanged = true;

      speakWord(
        'Ten units can be exchanged for one ten.',
      );
    } else if (nextTens >= 10) {
      nextTens -= 10;
      nextHundreds += 1;
      exchanged = true;

      speakWord(
        'Ten tens can be exchanged for one hundred.',
      );
    } else if (nextHundreds >= 10) {
      nextHundreds -= 10;
      nextThousands += 1;
      exchanged = true;

      speakWord(
        'Ten hundreds can be exchanged for one thousand.',
      );
    }

    if (
      nextThousands > MAX_PER_PLACE ||
      nextHundreds > MAX_PER_PLACE ||
      nextTens > MAX_PER_PLACE ||
      nextUnits > MAX_PER_PLACE
    ) {
      return;
    }

    setUnits(nextUnits);
    setTens(nextTens);
    setHundreds(nextHundreds);
    setThousands(nextThousands);
    setFeedback('idle');

    if (!exchanged) {
      speakWord(
        'There are not yet ten beads to exchange.',
      );
    }
  };

  const handleCheckBuild = () => {
    if (!currentProblem) return;

    if (currentValue === currentProblem.target) {
      setFeedback('correct');
      setScore((value) => value + 10);
      setRoundsCompleted((value) => value + 1);

      speakWord(
        `Excellent. You built ${currentProblem.target}.`,
      );

      const nextIndex = problemIndex + 1;

      if (nextIndex >= buildProblems.length) {
        setTimeout(() => {
          setCompleted(true);
        }, 1200);
      } else {
        setTimeout(() => {
          resetBeads();
          setProblemIndex(nextIndex);
          setTargetNumber(
            buildProblems[nextIndex].target,
          );
        }, 1200);
      }
    } else {
      setFeedback('incorrect');

      speakWord(
        'Not quite. Look at each place value again.',
      );
    }
  };

  const handleCheckDecompose = () => {
    if (currentValue === targetNumber) {
      setFeedback('correct');
      setScore((value) => value + 10);
      setRoundsCompleted((value) => value + 1);

      speakWord(
        `Correct. ${targetNumber} can be decomposed into its place values.`,
      );
    } else {
      setFeedback('incorrect');
    }
  };

  const finishActivity = () => {
    const finalScore =
      roundsCompleted > 0
        ? Math.min(
            100,
            Math.round(
              (roundsCompleted /
                Math.max(
                  buildProblems.length,
                  5,
                )) *
                100,
            ),
          )
        : 0;

    completeActivity({
      id: 'maths-golden-beads-place-value',
      score: finalScore,
      academyId: 'maths',
      domain: 'numeracy',
      skillIds: [
        'place-value',
        'number-sense',
        'base-ten-system',
        'expanded-form',
        'composition-and-decomposition',
        'regrouping',
        'mathematical-reasoning',
      ],
    });

    onComplete?.(score);
  };

  const readInstructions = () => {
    speakWord(
      'Golden Beads help us understand the base ten system. One unit is one. Ten units make one ten. Ten tens make one hundred. Ten hundreds make one thousand.',
    );
  };

  const renderUnitBeads = () => (
    <div className="flex flex-wrap gap-1 justify-center">
      {Array.from({ length: units }).map(
        (_, index) => (
          <motion.div
            key={index}
            initial={{
              scale: 0,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)]"
          />
        ),
      )}
    </div>
  );

  const renderTenBeads = () => (
    <div className="flex flex-wrap gap-1 justify-center">
      {Array.from({ length: tens }).map(
        (_, index) => (
          <motion.div
            key={index}
            initial={{
              scale: 0,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            className="flex flex-col gap-0.5 p-1 rounded bg-amber-500/10 border border-amber-500/30"
          >
            {Array.from({ length: 10 }).map(
              (_, beadIndex) => (
                <div
                  key={beadIndex}
                  className="w-1.5 h-1.5 rounded-full bg-amber-400"
                />
              ),
            )}
          </motion.div>
        ),
      )}
    </div>
  );

  const renderHundredBeads = () => (
    <div className="flex flex-wrap gap-1 justify-center">
      {Array.from({
        length: hundreds,
      }).map((_, index) => (
        <motion.div
          key={index}
          initial={{
            scale: 0,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          className="w-9 h-9 border-2 border-amber-400 bg-amber-500/10 rounded grid grid-cols-5 grid-rows-5 gap-0.5 p-0.5"
        >
          {Array.from({
            length: 25,
          }).map((_, beadIndex) => (
            <div
              key={beadIndex}
              className="bg-amber-400/70 rounded-[1px]"
            />
          ))}
        </motion.div>
      ))}
    </div>
  );

  const renderThousandBeads = () => (
    <div className="flex flex-wrap gap-1 justify-center">
      {Array.from({
        length: thousands,
      }).map((_, index) => (
        <motion.div
          key={index}
          initial={{
            scale: 0,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          className="w-10 h-10 border-2 border-amber-400 bg-amber-500/15 rounded relative"
        >
          <div className="absolute inset-1 grid grid-cols-5 grid-rows-5 gap-0.5">
            {Array.from({
              length: 25,
            }).map((_, beadIndex) => (
              <div
                key={beadIndex}
                className="bg-amber-400 rounded-[1px]"
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderBeadBlock = (
    type: BeadType,
    count: number,
    label: string,
    value: number,
    visual: React.ReactNode,
  ) => (
    <motion.div
      layout
      className="flex flex-col items-center gap-3 p-4 bg-gray-950/60 rounded-xl border border-gray-800"
    >
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => addBead(type)}
          disabled={count >= MAX_PER_PLACE}
          aria-label={`Add ${label}`}
          className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 text-white flex items-center justify-center"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => removeBead(type)}
          disabled={count <= 0}
          aria-label={`Remove ${label}`}
          className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 text-white flex items-center justify-center"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      <div className="h-24 w-full rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-center justify-center overflow-hidden">
        {visual}
      </div>

      <div className="text-center">
        <div className="text-2xl font-mono font-bold text-white">
          {count}
        </div>

        <div className="text-[10px] text-gray-500 uppercase tracking-wider">
          {label}
        </div>

        <div className="text-[10px] text-amber-500/70 mt-1">
          × {value}
        </div>
      </div>
    </motion.div>
  );

  if (completed) {
    const finalAccuracy =
      buildProblems.length > 0
        ? Math.round(
            (roundsCompleted /
              buildProblems.length) *
              100,
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
        className="max-w-xl mx-auto p-7 bg-app-card rounded-2xl border border-app-border shadow-xl text-center"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <Trophy className="w-8 h-8 text-amber-400" />
        </div>

        <h3 className="text-2xl font-bold text-white mt-5">
          Golden Beads Complete
        </h3>

        <p className="text-gray-400 text-sm mt-2">
          You practised building numbers using the
          base-ten system.
        </p>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="p-3 rounded-xl bg-gray-900/70">
            <div className="text-xl font-bold text-white">
              {roundsCompleted}
            </div>
            <div className="text-xs text-gray-500">
              Built
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gray-900/70">
            <div className="text-xl font-bold text-white">
              {finalAccuracy}%
            </div>
            <div className="text-xs text-gray-500">
              Mastery
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gray-900/70">
            <div className="text-xl font-bold text-white">
              {score}
            </div>
            <div className="text-xs text-gray-500">
              Points
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-gray-900/50 border border-app-border text-left">
          <p className="text-xs uppercase tracking-wider text-gray-500">
            Montessori principle
          </p>

          <p className="text-sm text-gray-300 mt-2">
            Concrete materials help learners understand
            that our number system is organised in groups
            of ten.
          </p>

          <div className="flex items-center gap-2 mt-3 text-sm text-amber-400">
            10 units
            <ArrowRight className="w-4 h-4" />
            1 ten
            <ArrowRight className="w-4 h-4" />
            1 hundred
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={() => {
              setCompleted(false);
              startBuildMode();
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            Practise Again
          </button>

          <button
            type="button"
            onClick={finishActivity}
            className="px-5 py-3 rounded-xl bg-amber-500 text-gray-950 font-bold hover:bg-amber-400"
          >
            Finish
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-app-card rounded-2xl border border-app-border shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🟡</span>

            <h3 className="text-2xl font-bold text-white">
              Golden Beads Lab
            </h3>
          </div>

          <p className="text-gray-400 text-sm mt-1">
            {stage.title} · {stage.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {mode === 'build' && (
            <span className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-bold">
              ⭐ {score}
            </span>
          )}

          <button
            type="button"
            onClick={readInstructions}
            aria-label="Read instructions"
            className="p-2.5 bg-gray-800 rounded-xl text-cyan-400 hover:bg-gray-700"
          >
            <Volume2 className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={resetBeads}
            aria-label="Reset beads"
            className="p-2.5 bg-gray-800 rounded-xl text-gray-300 hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stage */}
      <div className="mb-5 flex flex-wrap gap-2">
        <span className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
          Level {currentLevel}
        </span>

        <span className="px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800 text-gray-400 text-xs">
          Base Ten System
        </span>

        <span className="px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800 text-gray-400 text-xs">
          Concrete Learning
        </span>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        <button
          type="button"
          onClick={startExploreMode}
          className={`px-3 py-3 rounded-xl text-sm font-bold transition-colors ${
            mode === 'explore'
              ? 'bg-cyan-600 text-white'
              : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
          }`}
        >
          Explore
        </button>

        <button
          type="button"
          onClick={startBuildMode}
          className={`px-3 py-3 rounded-xl text-sm font-bold transition-colors ${
            mode === 'build'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
          }`}
        >
          Build
        </button>

        <button
          type="button"
          onClick={startExchangeMode}
          className={`px-3 py-3 rounded-xl text-sm font-bold transition-colors ${
            mode === 'exchange'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
          }`}
        >
          Exchange
        </button>

        <button
          type="button"
          onClick={startDecomposeMode}
          className={`px-3 py-3 rounded-xl text-sm font-bold transition-colors ${
            mode === 'decompose'
              ? 'bg-amber-600 text-gray-950'
              : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
          }`}
        >
          Decompose
        </button>
      </div>

      {/* Build Target */}
      {mode === 'build' && currentProblem && (
        <motion.div
          key={currentProblem.id}
          initial={{
            opacity: 0,
            y: -8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-5 p-5 rounded-xl bg-gray-950/70 border border-gray-800 text-center"
        >
          <p className="text-xs uppercase tracking-wider text-gray-500">
            Build this number
          </p>

          <p className="text-5xl font-mono font-bold text-white mt-2">
            {currentProblem.target}
          </p>

          <div className="flex justify-center gap-2 mt-3">
            {getNumberParts(
              currentProblem.target,
            ).thousands > 0 && (
              <span className="text-xs text-amber-400">
                {getNumberParts(
                  currentProblem.target,
                ).thousands}{' '}
                thousands
              </span>
            )}

            {getNumberParts(
              currentProblem.target,
            ).hundreds > 0 && (
              <span className="text-xs text-amber-400">
                {getNumberParts(
                  currentProblem.target,
                ).hundreds}{' '}
                hundreds
              </span>
            )}

            {getNumberParts(
              currentProblem.target,
            ).tens > 0 && (
              <span className="text-xs text-amber-400">
                {getNumberParts(
                  currentProblem.target,
                ).tens}{' '}
                tens
              </span>
            )}

            {getNumberParts(
              currentProblem.target,
            ).units > 0 && (
              <span className="text-xs text-amber-400">
                {getNumberParts(
                  currentProblem.target,
                ).units}{' '}
                units
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* Decomposition Target */}
      {mode === 'decompose' && (
        <div className="mb-5 p-5 rounded-xl bg-gray-950/70 border border-gray-800 text-center">
          <p className="text-xs uppercase tracking-wider text-gray-500">
            Decompose this number
          </p>

          <p className="text-5xl font-mono font-bold text-white mt-2">
            {targetNumber}
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Build it, then express it using place values.
          </p>
        </div>
      )}

      {/* Place Value Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {renderBeadBlock(
          'thousand',
          thousands,
          'Thousands',
          1000,
          renderThousandBeads(),
        )}

        {renderBeadBlock(
          'hundred',
          hundreds,
          'Hundreds',
          100,
          renderHundredBeads(),
        )}

        {renderBeadBlock(
          'ten',
          tens,
          'Tens',
          10,
          renderTenBeads(),
        )}

        {renderBeadBlock(
          'unit',
          units,
          'Units',
          1,
          renderUnitBeads(),
        )}
      </div>

      {/* Number Representation */}
      <div className="grid md:grid-cols-3 gap-3 mb-6">
        <div className="p-4 rounded-xl bg-gray-950/60 border border-gray-800">
          <p className="text-xs uppercase tracking-wider text-gray-500">
            Number
          </p>

          <p className="text-3xl font-mono font-bold text-amber-400 mt-1">
            {currentValue}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-gray-950/60 border border-gray-800">
          <p className="text-xs uppercase tracking-wider text-gray-500">
            Place Value
          </p>

          <div className="flex gap-3 mt-2">
            <span className="text-xs text-gray-400">
              T: {thousands}
            </span>
            <span className="text-xs text-gray-400">
              H: {hundreds}
            </span>
            <span className="text-xs text-gray-400">
              T: {tens}
            </span>
            <span className="text-xs text-gray-400">
              U: {units}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gray-950/60 border border-gray-800">
          <p className="text-xs uppercase tracking-wider text-gray-500">
            Expanded Form
          </p>

          <p className="text-sm font-mono text-cyan-300 mt-2 break-words">
            {expandedForm}
          </p>
        </div>
      </div>

      {/* Mode Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-gray-950/60 border border-gray-800">
        <div>
          {mode === 'explore' && (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Zap className="w-4 h-4 text-cyan-400" />
              Experiment with the place-value columns.
            </div>
          )}

          {mode === 'exchange' && (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <ArrowRight className="w-4 h-4 text-purple-400" />
              Make 10 of one place value and exchange them
              for 1 of the next.
            </div>
          )}

          {mode === 'build' && (
            <div className="text-gray-400 text-sm">
              Build the target number, then check your work.
            </div>
          )}

          {mode === 'decompose' && (
            <div className="text-gray-400 text-sm">
              Build the number using its place values.
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {mode === 'exchange' && (
            <button
              type="button"
              onClick={handleExchange}
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
            >
              Exchange
            </button>
          )}

          {mode === 'build' && (
            <button
              type="button"
              onClick={handleCheckBuild}
              disabled={feedback === 'correct'}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold disabled:opacity-40"
            >
              Check Number
            </button>
          )}

          {mode === 'decompose' && (
            <button
              type="button"
              onClick={handleCheckDecompose}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold"
            >
              Check
            </button>
          )}
        </div>
      </div>

      {/* Hint */}
      {(mode === 'build' ||
        mode === 'decompose') &&
        !feedback && (
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

      {showHint && currentProblem && (
        <motion.div
          initial={{
            opacity: 0,
            y: 5,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mt-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-200 text-center"
        >
          {currentProblem.hint}
        </motion.div>
      )}

      {/* Feedback */}
      <div className="mt-5 min-h-12 flex justify-center">
        <AnimatePresence mode="wait">
          {feedback === 'correct' && (
            <motion.div
              key="correct"
              initial={{
                scale: 0.85,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              className="flex items-center gap-2 px-5 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-bold"
            >
              <CheckCircle className="w-5 h-5" />

              {mode === 'build'
                ? 'Excellent! You built the number.'
                : 'Correct!'}
            </motion.div>
          )}

          {feedback === 'incorrect' && (
            <motion.div
              key="incorrect"
              initial={{
                scale: 0.85,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              className="flex items-center gap-2 px-5 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-bold"
            >
              <XCircle className="w-5 h-5" />
              Check each place-value column.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress */}
      {mode === 'build' && (
        <div className="mt-5">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>
              Challenge {Math.min(
                problemIndex + 1,
                buildProblems.length,
              )}{' '}
              of {buildProblems.length}
            </span>

            <span>{accuracy}%</span>
          </div>

          <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500"
              animate={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Educational Footer */}
      <div className="mt-6 p-4 rounded-xl bg-gray-950/40 border border-app-border">
        <p className="text-xs uppercase tracking-wider text-gray-500">
          Think like a mathematician
        </p>

        <p className="text-sm text-gray-300 mt-2">
          What happens when you have 10 units? Can you
          exchange them for 1 ten? What happens when you
          have 10 tens?
        </p>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-300 text-xs">
            10 units = 1 ten
          </span>

          <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-300 text-xs">
            10 tens = 1 hundred
          </span>

          <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-300 text-xs">
            10 hundreds = 1 thousand
          </span>
        </div>
      </div>
    </div>
  );
};