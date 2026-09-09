import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Brain,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  RotateCcw,
  Target,
  Trophy,
  Volume2,
  XCircle,
} from 'lucide-react';

import {
  ABACUS_LEVELS,
  AbacusLevelId,
  AbacusMode,
  createPrompt,
} from '../../../abacus/academy';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { speakWord } from '../../../services/audioEngine';
import { useAbacusAcademyStore } from '../../../store/useAbacusAcademyStore';
import { useProfileStore } from '../../../store/useProfileStore';
import { useProgressStore } from '../../../store/useProgressStore';

interface RodState {
  upper: 0 | 1;
  lower: 0 | 1 | 2 | 3 | 4;
}

interface AbacusWidgetProps {
  onComplete?: (score: number) => void;
}

type MathFocus =
  | 'number-sense'
  | 'place-value'
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'mental-maths';

interface MathFocusInfo {
  id: MathFocus;
  title: string;
  description: string;
  icon: string;
  skills: string[];
}

const MATH_FOCUSES: MathFocusInfo[] = [
  {
    id: 'number-sense',
    title: 'Number Sense',
    description: 'Recognise, build and compare numbers.',
    icon: '🔢',
    skills: ['counting', 'number-recognition', 'number-comparison'],
  },
  {
    id: 'place-value',
    title: 'Place Value',
    description: 'Understand ones, tens, hundreds and beyond.',
    icon: '🏛️',
    skills: ['place-value', 'partitioning', 'expanded-form'],
  },
  {
    id: 'addition',
    title: 'Addition',
    description: 'Combine quantities and calculate totals.',
    icon: '➕',
    skills: ['addition', 'number-bonds', 'calculation'],
  },
  {
    id: 'subtraction',
    title: 'Subtraction',
    description: 'Find differences and solve take-away problems.',
    icon: '➖',
    skills: ['subtraction', 'difference', 'calculation'],
  },
  {
    id: 'multiplication',
    title: 'Multiplication',
    description: 'Explore groups, repeated addition and products.',
    icon: '✖️',
    skills: ['multiplication', 'equal-groups', 'calculation'],
  },
  {
    id: 'division',
    title: 'Division',
    description: 'Share quantities equally and find quotients.',
    icon: '➗',
    skills: ['division', 'sharing', 'calculation'],
  },
  {
    id: 'mental-maths',
    title: 'Mental Maths',
    description: 'Calculate without physically moving the beads.',
    icon: '🧠',
    skills: ['mental-calculation', 'working-memory', 'reasoning'],
  },
];

const blankSoroban = (count: number): RodState[] =>
  Array.from({ length: count }, () => ({
    upper: 0,
    lower: 0,
  }));

const valueOf = (rods: RodState[]) =>
  rods.reduce(
    (total, rod, index) =>
      total +
      (rod.upper * 5 + rod.lower) *
        10 ** (rods.length - index - 1),
    0,
  );

const getPlaceName = (power: number) => {
  const places = ['Ones', 'Tens', 'Hundreds', 'Thousands', 'Ten Thousands'];

  return places[power] ?? `${10 ** power}s`;
};

const getMathStage = (level: number) => {
  if (level <= 1) {
    return {
      label: 'Foundation',
      description: 'Build confidence with numbers and quantities.',
    };
  }

  if (level === 2) {
    return {
      label: 'Developing',
      description: 'Strengthen calculation and place-value understanding.',
    };
  }

  if (level === 3) {
    return {
      label: 'Secure',
      description: 'Apply mathematical strategies with increasing independence.',
    };
  }

  if (level === 4) {
    return {
      label: 'Advanced',
      description: 'Reason, calculate and identify efficient strategies.',
    };
  }

  return {
    label: 'Mastery',
    description: 'Apply mathematical thinking to challenging problems.',
  };
};

interface SorobanProps {
  rods: RodState[];
  onChange: (rods: RodState[]) => void;
  disabled?: boolean;
  soundOn: boolean;
}

function Soroban({
  rods,
  onChange,
  disabled,
  soundOn,
}: SorobanProps) {
  const updateRod = (
    index: number,
    patch: Partial<RodState>,
  ) => {
    if (disabled) return;

    if (soundOn) {
      playSoundFeedback('move');
    }

    onChange(
      rods.map((rod, rodIndex) =>
        rodIndex === index
          ? { ...rod, ...patch }
          : rod,
      ),
    );
  };

  return (
    <div
      className="relative mx-auto w-full max-w-3xl overflow-x-auto rounded-3xl border border-amber-200/20 bg-gradient-to-b from-[#4a2512] to-[#1b0d08] p-3 shadow-2xl sm:p-5"
      style={{ touchAction: 'manipulation' }}
    >
      <div className="min-w-[340px] rounded-2xl border border-[#c8863c]/40 bg-[#2c160d] p-3 shadow-inner sm:p-5">
        <div className="relative flex min-h-[315px] justify-center gap-2 px-2 sm:gap-4">
          {/* Horizontal beam */}
          <div className="absolute left-0 right-0 top-[31%] z-20 h-4 rounded bg-gradient-to-b from-[#e6b45e] via-[#8d4c1b] to-[#4f240b] shadow-[0_4px_8px_rgba(0,0,0,.65)]" />

          {rods.map((rod, index) => {
            const placePower =
              rods.length - index - 1;

            const placeValue = 10 ** placePower;

            return (
              <div
                key={index}
                className="relative z-10 h-[290px] w-12 shrink-0 sm:w-14"
              >
                {/* Rod */}
                <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded bg-[#24130c]" />

                {/* Heaven bead */}
                <motion.button
                  type="button"
                  aria-label={`Move five bead on ${getPlaceName(placePower)} rod`}
                  disabled={disabled}
                  onPointerDown={(event) => {
                    event.preventDefault();

                    updateRod(index, {
                      upper: rod.upper ? 0 : 1,
                    });
                  }}
                  animate={{
                    y: rod.upper ? 48 : 0,
                    scale: rod.upper ? 1.04 : 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 520,
                    damping: 28,
                  }}
                  className={`absolute left-1/2 top-2 z-30 h-11 w-11 -translate-x-1/2 rounded-full border-2 shadow-lg sm:h-12 sm:w-12 ${
                    rod.upper
                      ? 'border-amber-100 bg-gradient-to-br from-[#ffd36c] to-[#b45b16]'
                      : 'border-amber-900 bg-gradient-to-br from-[#a84b11] to-[#5f240d]'
                  } ${disabled ? 'cursor-not-allowed opacity-60' : 'active:scale-95'}`}
                />

                {/* Earth beads */}
                <motion.div
                  animate={{
                    y: rod.lower ? -rod.lower * 9 : 0,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 26,
                  }}
                  className="absolute left-0 right-0 top-[126px] z-30 flex flex-col gap-2"
                >
                  {[0, 1, 2, 3].map((bead) => {
                    const active = rod.lower > bead;

                    return (
                      <button
                        key={bead}
                        type="button"
                        disabled={disabled}
                        aria-label={`Set ${
                          bead + 1
                        } earth beads on ${getPlaceName(
                          placePower,
                        )} rod`}
                        onPointerDown={(event) => {
                          event.preventDefault();

                          updateRod(index, {
                            lower:
                              rod.lower === bead + 1
                                ? 0
                                : ((bead + 1) as RodState['lower']),
                          });
                        }}
                        className={`mx-auto h-10 w-10 rounded-full border-2 shadow-lg transition-colors sm:h-11 sm:w-11 ${
                          active
                            ? 'border-amber-100 bg-gradient-to-br from-[#ffd36c] to-[#b45b16]'
                            : 'border-amber-900 bg-gradient-to-br from-[#a84b11] to-[#5f240d]'
                        } ${
                          disabled
                            ? 'cursor-not-allowed opacity-60'
                            : 'active:scale-95'
                        }`}
                      />
                    );
                  })}
                </motion.div>

                {/* Place-value label */}
                <div className="absolute -bottom-7 left-0 right-0 text-center">
                  <span className="block text-[10px] font-bold text-amber-200/80">
                    {getPlaceName(placePower)}
                  </span>

                  <span className="text-[9px] text-amber-200/40">
                    {placeValue}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const AbacusWidget: React.FC<AbacusWidgetProps> = ({
  onComplete,
}) => {
  const [mode, setMode] =
    useState<AbacusMode>('beginner');

  const [levelId, setLevelId] =
    useState<AbacusLevelId>('level-1');

  const level = ABACUS_LEVELS.find(
    (candidate) => candidate.id === levelId,
  )!;

  const [rods, setRods] = useState<RodState[]>(() =>
    blankSoroban(level.rodCount),
  );

  const [prompt, setPrompt] = useState(() =>
    createPrompt('level-1', 'beginner'),
  );

  const [feedback, setFeedback] =
    useState<'idle' | 'correct' | 'incorrect'>('idle');

  const [soundOn, setSoundOn] = useState(true);

  const [secondsLeft, setSecondsLeft] =
    useState(60);

  const [challengeScore, setChallengeScore] =
    useState(0);

  const [sessionCorrect, setSessionCorrect] =
    useState(0);

  const [sessionAttempts, setSessionAttempts] =
    useState(0);

  const [showMentalPrompt, setShowMentalPrompt] =
    useState(false);

  const [showHint, setShowHint] =
    useState(false);

  const [challengeFinished, setChallengeFinished] =
    useState(false);

  const [selectedFocus, setSelectedFocus] =
    useState<MathFocus>('number-sense');

  const { levels, certificates, recordAttempt } =
    useAbacusAcademyStore();

  const { profiles, currentProfileId } =
    useProfileStore();

  const { completeActivity } =
    useProgressStore();

  const profile = profiles[currentProfileId];

  const currentLevel = profile?.currentLevel ?? 1;

  const mathStage = getMathStage(currentLevel);

  const progress = levels[levelId];

  const currentValue = useMemo(
    () => valueOf(rods),
    [rods],
  );

  const accuracy = useMemo(() => {
    if (sessionAttempts === 0) return 0;

    return Math.round(
      (sessionCorrect / sessionAttempts) * 100,
    );
  }, [sessionAttempts, sessionCorrect]);

  const selectedFocusData =
    MATH_FOCUSES.find(
      (focus) => focus.id === selectedFocus,
    )!;

  const startRound = useCallback(
    (
      nextMode: AbacusMode = mode,
      nextLevelId: AbacusLevelId = levelId,
    ) => {
      const nextLevel = ABACUS_LEVELS.find(
        (candidate) => candidate.id === nextLevelId,
      )!;

      setRods(blankSoroban(nextLevel.rodCount));

      const nextPrompt = createPrompt(
        nextLevelId,
        nextMode,
      );

      setPrompt(nextPrompt);
      setFeedback('idle');
      setShowHint(false);

      const shouldFlash =
        nextMode === 'mental' ||
        nextLevelId === 'level-6' ||
        Boolean(nextPrompt.flash);

      setShowMentalPrompt(shouldFlash);

      if (shouldFlash) {
        window.setTimeout(() => {
          setShowMentalPrompt(false);
        }, 2200);
      }
    },
    [levelId, mode],
  );

  useEffect(() => {
    startRound(mode, levelId);
  }, [mode, levelId, startRound]);

  useEffect(() => {
    if (
      mode !== 'challenge' ||
      secondsLeft <= 0 ||
      challengeFinished
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSecondsLeft((seconds) => seconds - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [
    mode,
    secondsLeft,
    challengeFinished,
  ]);

  useEffect(() => {
    if (
      mode === 'challenge' &&
      secondsLeft === 0 &&
      !challengeFinished
    ) {
      setChallengeFinished(true);
      setFeedback('idle');
    }
  }, [
    mode,
    secondsLeft,
    challengeFinished,
  ]);

  const chooseMode = (
    nextMode: AbacusMode,
  ) => {
    setMode(nextMode);
    setSecondsLeft(60);
    setChallengeScore(0);
    setSessionCorrect(0);
    setSessionAttempts(0);
    setChallengeFinished(false);
    setFeedback('idle');
  };

  const chooseLevel = (
    nextLevelId: AbacusLevelId,
  ) => {
    setLevelId(nextLevelId);
    setSecondsLeft(60);
    setChallengeScore(0);
    setSessionCorrect(0);
    setSessionAttempts(0);
    setChallengeFinished(false);
  };

  const handleFocusChange = (
    focus: MathFocus,
  ) => {
    setSelectedFocus(focus);

    if (soundOn) {
      const focusData = MATH_FOCUSES.find(
        (item) => item.id === focus,
      );

      if (focusData) {
        speakWord(focusData.title);
      }
    }
  };

  const checkAnswer = () => {
    if (
      feedback === 'correct' ||
      (mode === 'challenge' &&
        (secondsLeft === 0 || challengeFinished))
    ) {
      return;
    }

    const correct =
      currentValue === prompt.answer;

    recordAttempt(levelId, correct);

    setSessionAttempts(
      (value) => value + 1,
    );

    setFeedback(
      correct ? 'correct' : 'incorrect',
    );

    if (soundOn) {
      playSoundFeedback(
        correct ? 'correct' : 'try-again',
      );
    }

    if (!correct) {
      setShowHint(true);
      return;
    }

    setSessionCorrect(
      (value) => value + 1,
    );

    if (mode === 'challenge') {
      setChallengeScore(
        (value) => value + 1,
      );
    }

    window.setTimeout(() => {
      if (
        mode === 'challenge' &&
        (secondsLeft <= 0 ||
          challengeFinished)
      ) {
        return;
      }

      startRound();
    }, 850);
  };

  const clearAbacus = () => {
    if (
      feedback === 'correct' ||
      challengeFinished
    ) {
      return;
    }

    setRods(
      blankSoroban(level.rodCount),
    );

    setFeedback('idle');
    setShowHint(false);
  };

  const speakPrompt = () => {
    speakWord(prompt.prompt);
  };

  const finishSession = () => {
    const score =
      sessionAttempts > 0
        ? Math.round(
            (sessionCorrect /
              sessionAttempts) *
              100,
          )
        : 0;

    const finalScore = Math.max(
      0,
      Math.min(100, score),
    );

    completeActivity({
      id: 'maths-abacus-academy',
      score: finalScore,
      academyId: 'maths',
      domain: 'numeracy',
      skillIds: [
        'number-sense',
        'place-value',
        'calculation',
        'mathematical-reasoning',
        ...selectedFocusData.skills,
      ],
    });

    onComplete?.(finalScore);
  };

  const certificateEarned =
    certificates.includes(levelId);

  return (
    <div className="mx-auto w-full max-w-5xl rounded-3xl border border-app-border bg-app-card p-3 shadow-xl sm:p-6">

      {/* HEADER */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-lg bg-indigo-500/15 p-2">
              <Brain className="h-5 w-5 text-indigo-300" />
            </span>

            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">
              Mathematics Academy
            </span>
          </div>

          <h3 className="text-2xl font-bold text-white sm:text-3xl">
            Abacus & Number Sense
          </h3>

          <p className="mt-1 max-w-2xl text-sm text-gray-400">
            Build numbers, understand place value and
            develop accurate mathematical thinking.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setSoundOn((enabled) => !enabled)
          }
          className="min-h-11 rounded-xl bg-gray-800 px-3 text-sm text-gray-200 transition hover:bg-gray-700"
          aria-label="Toggle sound"
        >
          <Volume2
            className={`mr-1 inline h-4 w-4 ${
              soundOn
                ? 'text-amber-300'
                : 'text-gray-500'
            }`}
          />

          {soundOn ? 'Sound On' : 'Sound Off'}
        </button>
      </div>

      {/* LEARNER STAGE */}
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
            Learning stage
          </span>

          <p className="mt-1 font-bold text-white">
            {mathStage.label}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {mathStage.description}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
            Current level
          </span>

          <p className="mt-1 font-bold text-white">
            Level {currentLevel}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Based on placement and demonstrated mastery.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
            Session accuracy
          </span>

          <p className="mt-1 font-bold text-white">
            {accuracy}%
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {sessionCorrect} correct of {sessionAttempts} attempts
          </p>
        </div>
      </div>

      {/* MATH FOCUS */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-white">
              Mathematics focus
            </h4>

            <p className="text-xs text-gray-400">
              Choose what you want to practise.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {MATH_FOCUSES.map((focus) => (
            <button
              key={focus.id}
              type="button"
              onClick={() =>
                handleFocusChange(focus.id)
              }
              className={`min-h-24 rounded-2xl border p-3 text-left transition ${
                selectedFocus === focus.id
                  ? 'border-indigo-400 bg-indigo-500/15'
                  : 'border-gray-700 bg-gray-900/40 hover:border-gray-600'
              }`}
            >
              <span className="text-2xl">
                {focus.icon}
              </span>

              <span className="mt-2 block text-xs font-bold text-white">
                {focus.title}
              </span>

              <span className="mt-1 hidden text-[10px] leading-relaxed text-gray-400 sm:block">
                {focus.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* MODES */}
      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2">
          <Target className="h-4 w-4 text-indigo-300" />
          <span className="text-sm font-bold text-white">
            Practice mode
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(
            [
              'beginner',
              'practice',
              'challenge',
              'mental',
            ] as AbacusMode[]
          ).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() =>
                chooseMode(option)
              }
              className={`min-h-12 rounded-xl px-2 text-xs font-bold capitalize transition ${
                mode === option
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {option === 'mental'
                ? '🧠 Mental Abacus'
                : option === 'challenge'
                  ? '⚡ Timed Challenge'
                  : option === 'practice'
                    ? '🎯 Practice'
                    : '🌱 Beginner'}
            </button>
          ))}
        </div>
      </div>

      {/* LEVELS */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-bold text-white">
            Abacus progression
          </span>

          <span className="text-xs text-gray-500">
            Mastery-driven
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {ABACUS_LEVELS.map((candidate) => (
            <button
              key={candidate.id}
              type="button"
              onClick={() =>
                chooseLevel(candidate.id)
              }
              className={`min-h-16 rounded-xl border p-3 text-left transition ${
                levelId === candidate.id
                  ? 'border-amber-400 bg-amber-500/10'
                  : 'border-gray-700 bg-gray-900/40 hover:border-gray-600'
              }`}
            >
              <span className="block text-xs font-bold text-white">
                {candidate.title}
              </span>

              <span className="mt-1 block text-[10px] text-gray-400">
                {levels[candidate.id]?.mastery || 0}% mastery
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* PROMPT */}
      <div className="mb-5 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-center sm:p-5">
        {mode === 'challenge' && (
          <div className="mb-2 flex items-center justify-center gap-3">
            <span
              className={`text-xs font-bold ${
                secondsLeft <= 10
                  ? 'text-red-300'
                  : 'text-amber-300'
              }`}
            >
              {challengeFinished
                ? 'Challenge complete'
                : `${secondsLeft}s left`}
            </span>

            <span className="text-xs font-bold text-emerald-300">
              {challengeScore} correct
            </span>
          </div>
        )}

        <p className="text-xs text-indigo-200">
          {level.subtitle}
        </p>

        <AnimatePresence mode="wait">
          <motion.p
            key={`${prompt.prompt}-${showMentalPrompt}`}
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="mt-2 text-3xl font-bold text-white sm:text-4xl"
          >
            {showMentalPrompt
              ? prompt.prompt
              : mode === 'mental' ||
                  levelId === 'level-6'
                ? 'Build the answer from memory'
                : prompt.prompt}
          </motion.p>
        </AnimatePresence>

        <button
          type="button"
          onClick={speakPrompt}
          className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl bg-gray-900/60 px-3 text-xs font-bold text-gray-300 hover:text-white"
        >
          <Volume2 className="h-4 w-4" />
          Hear the question
        </button>
      </div>

      {/* ABACUS */}
      <Soroban
        rods={rods}
        onChange={setRods}
        disabled={
          feedback === 'correct' ||
          challengeFinished
        }
        soundOn={soundOn}
      />

      {/* CURRENT VALUE */}
      <div className="mt-9 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-amber-500/20 bg-gray-900 px-4 py-3 text-center">
          <span className="block text-[10px] uppercase tracking-wider text-gray-400">
            Your number
          </span>

          <span className="text-3xl font-bold text-amber-300">
            {currentValue}
          </span>
        </div>

        <div className="rounded-2xl border border-gray-700 bg-gray-900 px-4 py-3 text-center">
          <span className="block text-[10px] uppercase tracking-wider text-gray-400">
            Target
          </span>

          <span className="text-3xl font-bold text-white">
            {showMentalPrompt
              ? '?'
              : prompt.answer}
          </span>
        </div>

        <div className="rounded-2xl border border-gray-700 bg-gray-900 px-4 py-3 text-center">
          <span className="block text-[10px] uppercase tracking-wider text-gray-400">
            Difference
          </span>

          <span className="text-3xl font-bold text-indigo-300">
            {Math.abs(
              prompt.answer - currentValue,
            )}
          </span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={clearAbacus}
          disabled={
            feedback === 'correct' ||
            challengeFinished
          }
          className="min-h-12 rounded-xl bg-gray-800 px-4 text-gray-200 transition hover:bg-gray-700 disabled:opacity-50"
        >
          <RotateCcw className="mr-1 inline h-4 w-4" />
          Clear
        </button>

        <button
          type="button"
          onClick={() =>
            setShowHint((value) => !value)
          }
          disabled={
            challengeFinished ||
            feedback === 'correct'
          }
          className="min-h-12 rounded-xl border border-indigo-400/30 bg-indigo-500/10 px-4 text-indigo-200 transition hover:bg-indigo-500/20 disabled:opacity-50"
        >
          <HelpCircle className="mr-1 inline h-4 w-4" />
          {showHint ? 'Hide hint' : 'Need a hint?'}
        </button>

        <button
          type="button"
          onClick={checkAnswer}
          disabled={
            feedback === 'correct' ||
            challengeFinished
          }
          className="min-h-12 rounded-xl bg-green-600 px-6 font-bold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Check beads
        </button>
      </div>

      {/* HINT */}
      <AnimatePresence>
        {showHint &&
          feedback !== 'correct' && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: 'auto',
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="mt-4 overflow-hidden"
            >
              <div className="flex gap-3 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4">
                <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />

                <div>
                  <p className="text-sm font-bold text-amber-200">
                    Mathematical hint
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-gray-300">
                    Start with the largest place-value
                    rod. Remember that the upper bead
                    represents 5 and each lower bead
                    represents 1.
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    Think carefully about the ones,
                    tens and hundreds before checking
                    your answer.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
      </AnimatePresence>

      {/* FEEDBACK */}
      <div className="mt-4 min-h-8 text-center">
        <AnimatePresence mode="wait">
          {feedback === 'correct' && (
            <motion.p
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="inline-flex items-center gap-2 text-sm font-bold text-green-300"
            >
              <CheckCircle2 className="h-5 w-5" />
              Excellent mathematical thinking!
            </motion.p>
          )}

          {feedback === 'incorrect' && (
            <motion.p
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="inline-flex items-center gap-2 text-sm font-bold text-red-300"
            >
              <XCircle className="h-5 w-5" />
              Not quite. Check the place values and try again.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* CHALLENGE RESULTS */}
      {challengeFinished && (
        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mt-5 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-5 text-center"
        >
          <Trophy className="mx-auto h-8 w-8 text-amber-300" />

          <h4 className="mt-2 text-xl font-bold text-white">
            Challenge Complete
          </h4>

          <p className="mt-1 text-sm text-gray-400">
            You solved {challengeScore} problem
            {challengeScore === 1 ? '' : 's'} correctly.
          </p>

          <div className="mt-4 flex justify-center gap-6">
            <div>
              <span className="block text-2xl font-bold text-amber-300">
                {challengeScore}
              </span>
              <span className="text-[10px] text-gray-500">
                Correct
              </span>
            </div>

            <div>
              <span className="block text-2xl font-bold text-indigo-300">
                60s
              </span>
              <span className="text-[10px] text-gray-500">
                Time limit
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSecondsLeft(60);
              setChallengeScore(0);
              setSessionCorrect(0);
              setSessionAttempts(0);
              setChallengeFinished(false);
              startRound('challenge', levelId);
            }}
            className="mt-5 min-h-11 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white hover:bg-indigo-500"
          >
            Try challenge again
          </button>
        </motion.div>
      )}

      {/* MASTERY */}
      <div className="mt-5 grid gap-3 rounded-2xl bg-gray-900/60 p-4 text-sm sm:grid-cols-4">
        <div>
          <span className="block text-xs text-gray-400">
            Level mastery
          </span>

          <strong className="text-white">
            {progress?.mastery || 0}%
          </strong>
        </div>

        <div>
          <span className="block text-xs text-gray-400">
            Best streak
          </span>

          <strong className="text-white">
            {progress?.bestStreak || 0}
          </strong>
        </div>

        <div>
          <span className="block text-xs text-gray-400">
            Correct
          </span>

          <strong className="text-white">
            {progress?.correct || 0}
          </strong>
        </div>

        <div>
          <span className="block text-xs text-gray-400">
            Certificate
          </span>

          <strong
            className={
              certificateEarned
                ? 'text-amber-300'
                : 'text-gray-400'
            }
          >
            {certificateEarned
              ? 'Earned!'
              : `${progress?.correct || 0}/${level.masteryTarget}`}
          </strong>
        </div>
      </div>

      {/* SESSION COMPLETION */}
      {sessionAttempts > 0 &&
        !challengeFinished && (
          <div className="mt-5 flex flex-col items-center justify-center gap-3">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Current session
              </p>

              <p className="text-sm font-bold text-white">
                {sessionCorrect}/{sessionAttempts} correct
              </p>
            </div>

            <button
              type="button"
              onClick={finishSession}
              className="flex min-h-11 items-center gap-2 rounded-xl border border-amber-400/60 px-5 text-sm font-bold text-amber-200 transition hover:bg-amber-500/10"
            >
              <Trophy className="h-4 w-4" />
              Finish Maths Session
            </button>
          </div>
        )}

      {/* MATHEMATICAL THINKING */}
      <div className="mt-5 rounded-2xl border border-gray-800 bg-gray-900/40 p-4">
        <div className="flex items-start gap-3">
          <Brain className="mt-0.5 h-5 w-5 text-indigo-300" />

          <div>
            <p className="text-sm font-bold text-white">
              Think like a mathematician
            </p>

            <p className="mt-1 text-xs leading-relaxed text-gray-400">
              Don't only look for the answer. Ask:
              <span className="text-gray-300">
                {' '}
                What do I know? What strategy can I use?
                Can I explain how I got the answer?
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};