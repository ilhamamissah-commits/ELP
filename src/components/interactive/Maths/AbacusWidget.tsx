import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  AnimatePresence,
  motion,
} from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock3,
  HelpCircle,
  Layers3,
  Lightbulb,
  Lock,
  Menu,
  RotateCcw,
  Target,
  Trophy,
  Volume2,
  X,
  XCircle,
} from 'lucide-react';

import {
  ABACUS_LEVELS,
  AbacusLevel,
  AbacusLevelId,
  AbacusMode,
  AbacusPrompt,
  createPrompt,
} from '../../../abacus/academy';

import {
  SOROBAN_ORIENTATION_STEPS,
  OrientationStep,
  isOrientationStepComplete,
} from '../../../abacus/orientationLesson';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useAbacusAcademyStore } from '../../../store/useAbacusAcademyStore';
import { useProgressStore } from '../../../store/useProgressStore';
import { useSettingsStore } from '../../../store/useSettingsStore';

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface RodState {
  upper: 0 | 1;
  lower: 0 | 1 | 2 | 3 | 4;
}

interface AbacusWidgetProps {
  onComplete?: (score: number) => void;
}

type AcademyPage =
  | 'overview'
  | 'practice'
  | 'result';

/* -------------------------------------------------------------------------- */
/* Stage metadata                                                             */
/* -------------------------------------------------------------------------- */

const STAGE_META: Record<
  number,
  {
    title: string;
    description: string;
    short: string;
  }
> = {
  1: {
    title: 'Foundation',
    short: 'Foundation',
    description:
      'Explore the Soroban, count beads and represent numbers.',
  },
  2: {
    title: 'Soroban Basics',
    short: 'Soroban Basics',
    description:
      'Learn bead values, direct calculation and place value.',
  },
  3: {
    title: 'Soroban Logic',
    short: 'Soroban Logic',
    description:
      'Develop complements, formulas and multi-digit calculation.',
  },
  4: {
    title: 'Mental Abacus',
    short: 'Mental Abacus',
    description:
      'Move from physical beads to visualisation and Anzan.',
  },
  5: {
    title: 'Advanced Anzan',
    short: 'Advanced Anzan',
    description:
      'Develop multi-digit mental calculation, speed and mastery.',
  },
};

const PAGE_ORDER: AcademyPage[] = [
  'overview',
  'practice',
  'result',
];

/* -------------------------------------------------------------------------- */
/* Soroban helpers                                                            */
/* -------------------------------------------------------------------------- */

const blankSoroban = (
  count: number,
): RodState[] =>
  Array.from(
    { length: Math.max(1, count) },
    () => ({
      upper: 0,
      lower: 0,
    }),
  );

const valueOf = (
  rods: RodState[],
): number =>
  rods.reduce(
    (total, rod, index) =>
      total +
      (rod.upper * 5 + rod.lower) *
        10 ** (rods.length - index - 1),
    0,
  );

const getPlaceName = (
  power: number,
): string => {
  const places = [
    'Ones',
    'Tens',
    'Hundreds',
    'Thousands',
    'Ten Thousands',
    'Hundred Thousands',
  ];

  return (
    places[power] ??
    `${10 ** power}s`
  );
};

/* -------------------------------------------------------------------------- */
/* Soroban                                                                    */
/* -------------------------------------------------------------------------- */

interface SorobanProps {
  rods: RodState[];
  onChange: (rods: RodState[]) => void;
  disabled?: boolean;
  soundOn: boolean;
  focus?: OrientationStep['focus'];
}

function Soroban({
  rods,
  onChange,
  disabled = false,
  soundOn,
  focus = 'all',
}: SorobanProps) {
  const updateRod = useCallback(
    (
      index: number,
      patch: Partial<RodState>,
    ) => {
      if (disabled) {
        return;
      }

      if (soundOn) {
        playSoundFeedback('move');
      }

      onChange(
        rods.map((rod, rodIndex) =>
          rodIndex === index
            ? {
                ...rod,
                ...patch,
              }
            : rod,
        ),
      );
    },
    [
      disabled,
      onChange,
      rods,
      soundOn,
    ],
  );

  const isFocused = (
    part:
      | 'frame'
      | 'rod'
      | 'beam'
      | 'heaven'
      | 'earth',
  ) =>
    focus === 'all' ||
    focus === part ||
    focus === 'value' ||
    focus === 'place-value';

  return (
    <div
      className={`relative mx-auto w-full max-w-3xl rounded-3xl border p-2 shadow-2xl transition-all sm:p-4 ${
        focus === 'frame'
          ? 'border-amber-300/70 shadow-amber-500/20'
          : 'border-amber-200/20'
      } bg-gradient-to-b from-[#4a2512] to-[#1b0d08]`}
      style={{
        touchAction: 'manipulation',
      }}
    >
      <div
        className={`relative min-w-[320px] overflow-hidden rounded-2xl border bg-[#2c160d] p-3 transition-all sm:p-4 ${
          isFocused('frame')
            ? 'border-amber-300/60'
            : 'border-[#c8863c]/40'
        }`}
      >
        {/* Frame label */}

        {focus === 'frame' && (
          <div className="absolute left-3 top-3 z-50 rounded-full border border-amber-200/30 bg-black/60 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-200 backdrop-blur">
            Frame
          </div>
        )}

        <div className="relative flex min-h-[280px] justify-center gap-2 px-2 pt-3 sm:gap-4">
          {/* Beam */}

          <div
            className={`absolute left-0 right-0 top-[31%] z-20 h-5 rounded transition-all ${
              isFocused('beam')
                ? 'shadow-[0_0_20px_rgba(251,191,36,.55)] ring-2 ring-amber-200'
                : ''
            } bg-gradient-to-b from-[#e6b45e] via-[#8d4c1b] to-[#4f240b] shadow-[0_4px_8px_rgba(0,0,0,.65)]`}
          />

          {focus === 'beam' && (
            <div className="absolute left-1/2 top-[24%] z-50 -translate-x-1/2 rounded-full border border-amber-200/30 bg-black/70 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-200">
              Beam
            </div>
          )}

          {rods.map(
            (rod, index) => {
              const placePower =
                rods.length -
                index -
                1;

              return (
                <div
                  key={`${placePower}-${index}`}
                  className={`relative z-10 h-[255px] w-11 shrink-0 rounded-xl transition-all sm:w-14 ${
                    isFocused('rod')
                      ? 'bg-amber-300/5 ring-1 ring-amber-300/30'
                      : ''
                  }`}
                >
                  {/* Rod */}

                  <div
                    className={`absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded transition-all ${
                      isFocused('rod')
                        ? 'bg-amber-200 shadow-[0_0_12px_rgba(251,191,36,.45)]'
                        : 'bg-[#24130c]'
                    }`}
                  />

                  {/* Heaven bead */}

                  <motion.button
                    type="button"
                    aria-label={`Heaven bead on ${getPlaceName(
                      placePower,
                    )} rod`}
                    disabled={disabled}
                    onPointerDown={event => {
                      event.preventDefault();

                      updateRod(index, {
                        upper: rod.upper
                          ? 0
                          : 1,
                      });
                    }}
                    animate={{
                      y: rod.upper ? 44 : 0,
                      scale:
                        isFocused('heaven')
                          ? 1.08
                          : 1,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 520,
                      damping: 28,
                    }}
                    className={`absolute left-1/2 top-2 z-30 h-10 w-10 -translate-x-1/2 rounded-full border-2 shadow-lg transition-shadow sm:h-12 sm:w-12 ${
                      rod.upper
                        ? 'border-amber-100 bg-gradient-to-br from-[#ffd36c] to-[#b45b16] shadow-[0_0_18px_rgba(251,191,36,.35)]'
                        : 'border-amber-900 bg-gradient-to-br from-[#a84b11] to-[#5f240d]'
                    } ${
                      isFocused('heaven')
                        ? 'ring-2 ring-amber-200 ring-offset-2 ring-offset-[#2c160d]'
                        : ''
                    } ${
                      disabled
                        ? 'cursor-not-allowed opacity-60'
                        : 'active:scale-95'
                    }`}
                  />

                  {/* Heaven label */}

                  {focus === 'heaven' &&
                    index ===
                      Math.floor(
                        rods.length / 2,
                      ) && (
                      <span className="absolute -top-7 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/80 px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-amber-200">
                        Heaven · 5
                      </span>
                    )}

                  {/* Earth beads */}

                  <motion.div
                    animate={{
                      y: rod.lower
                        ? -rod.lower * 8
                        : 0,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 26,
                    }}
                    className="absolute left-0 right-0 top-[108px] z-30 flex flex-col gap-2"
                  >
                    {[0, 1, 2, 3].map(
                      bead => {
                        const active =
                          rod.lower >
                          bead;

                        return (
                          <button
                            key={bead}
                            type="button"
                            disabled={disabled}
                            aria-label={`Earth bead ${
                              bead + 1
                            } on ${getPlaceName(
                              placePower,
                            )} rod`}
                            onPointerDown={event => {
                              event.preventDefault();

                              const nextLower =
                                active
                                  ? (bead as RodState['lower'])
                                  : ((bead +
                                      1) as RodState['lower']);

                              updateRod(
                                index,
                                {
                                  lower:
                                    nextLower,
                                },
                              );
                            }}
                            className={`mx-auto h-9 w-9 rounded-full border-2 shadow-lg transition-all sm:h-11 sm:w-11 ${
                              active
                                ? 'border-amber-100 bg-gradient-to-br from-[#ffd36c] to-[#b45b16] shadow-[0_0_14px_rgba(251,191,36,.25)]'
                                : 'border-amber-900 bg-gradient-to-br from-[#a84b11] to-[#5f240d]'
                            } ${
                              isFocused(
                                'earth',
                              )
                                ? 'ring-1 ring-amber-300/60'
                                : ''
                            } ${
                              disabled
                                ? 'cursor-not-allowed opacity-60'
                                : 'active:scale-95'
                            }`}
                          />
                        );
                      },
                    )}
                  </motion.div>

                  {focus === 'earth' &&
                    index ===
                      Math.floor(
                        rods.length / 2,
                      ) && (
                      <span className="absolute bottom-7 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/80 px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-amber-200">
                        Earth · 1 each
                      </span>
                    )}

                  <div className="absolute -bottom-5 left-0 right-0 text-center">
                    <span
                      className={`block text-[9px] font-bold ${
                        focus === 'place-value'
                          ? 'text-amber-200'
                          : 'text-amber-200/80'
                      }`}
                    >
                      {getPlaceName(
                        placePower,
                      )}
                    </span>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Numeric keypad                                                             */
/* -------------------------------------------------------------------------- */

interface NumberKeypadProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

function NumberKeypad({
  value,
  onChange,
  onSubmit,
  disabled = false,
}: NumberKeypadProps) {
  const addDigit = (
    digit: string,
  ) => {
    if (disabled || value.length >= 8) {
      return;
    }

    onChange(
      value === '0'
        ? digit
        : `${value}${digit}`,
    );
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-3 rounded-2xl border border-purple-500/20 bg-gray-950/70 px-4 py-3 text-center">
        <span className="text-[10px] uppercase tracking-widest text-gray-500">
          Your answer
        </span>

        <div className="mt-1 min-h-10 text-3xl font-bold text-white">
          {value || '—'}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
        ].map(digit => (
          <button
            key={digit}
            type="button"
            disabled={disabled}
            onClick={() =>
              addDigit(digit)
            }
            className="min-h-14 rounded-xl border border-gray-700 bg-gray-900 text-lg font-bold text-white transition hover:border-purple-400 hover:bg-purple-500/10 active:scale-95 disabled:opacity-50"
          >
            {digit}
          </button>
        ))}

        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('')}
          className="min-h-14 rounded-xl border border-gray-700 bg-gray-900 text-xs font-bold text-gray-400 transition hover:bg-gray-800 disabled:opacity-50"
        >
          Clear
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() =>
            addDigit('0')
          }
          className="min-h-14 rounded-xl border border-gray-700 bg-gray-900 text-lg font-bold text-white transition hover:border-purple-400 hover:bg-purple-500/10 active:scale-95 disabled:opacity-50"
        >
          0
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() =>
            onChange(
              value.slice(0, -1),
            )
          }
          className="min-h-14 rounded-xl border border-gray-700 bg-gray-900 text-xs font-bold text-gray-400 transition hover:bg-gray-800 disabled:opacity-50"
        >
          Delete
        </button>
      </div>

      <button
        type="button"
        disabled={
          disabled || !value
        }
        onClick={onSubmit}
        className="mt-3 min-h-14 w-full rounded-xl bg-purple-600 px-6 text-sm font-bold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Check answer
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main widget                                                                */
/* -------------------------------------------------------------------------- */

export const AbacusWidget: React.FC<
  AbacusWidgetProps
> = ({ onComplete }) => {
  const {
    levels,
    certificates,
    recordAttempt,
    isLevelUnlocked,
    getNextLevel,
  } = useAbacusAcademyStore();

  const {
    completeActivity,
  } = useProgressStore();

  const soundEnabled =
    useSettingsStore(
      state => state.soundEnabled,
    );

  const autoReadEnabled =
    useSettingsStore(
      state => state.autoReadEnabled,
    );

  const toggleSound =
    useSettingsStore(
      state => state.toggleSound,
    );

  const { speak } =
    useReadAloud();

  const initialLevel =
    useAbacusAcademyStore
      .getState()
      .getCurrentLevel();

  const [levelId, setLevelId] =
    useState<AbacusLevelId>(
      initialLevel?.id ??
        ABACUS_LEVELS[0].id,
    );

  const [mode, setMode] =
    useState<AbacusMode>(
      'beginner',
    );

  const level = useMemo<AbacusLevel>(
    () =>
      ABACUS_LEVELS.find(
        candidate =>
          candidate.id === levelId,
      ) ?? ABACUS_LEVELS[0],
    [levelId],
  );

  const isOrientation =
    level.id ===
    'abacus-orientation';

  const [page, setPage] =
    useState<AcademyPage>(
      'overview',
    );

  const [direction, setDirection] =
    useState(1);

  const [rods, setRods] =
    useState<RodState[]>(() =>
      blankSoroban(
        level.rodCount,
      ),
    );

  const [prompt, setPrompt] =
    useState<AbacusPrompt>(() =>
      createPrompt(
        level.id,
        'beginner',
      ),
    );

  const [mentalAnswer, setMentalAnswer] =
    useState('');

  const [feedback, setFeedback] =
    useState<
      'idle' | 'correct' | 'incorrect'
    >('idle');

  const [showHint, setShowHint] =
    useState(false);

  const [secondsLeft, setSecondsLeft] =
    useState(60);

  const [challengeScore, setChallengeScore] =
    useState(0);

  const [sessionCorrect, setSessionCorrect] =
    useState(0);

  const [sessionAttempts, setSessionAttempts] =
    useState(0);

  const [challengeFinished, setChallengeFinished] =
    useState(false);

  const [curriculumOpen, setCurriculumOpen] =
    useState(false);

  const [flashIndex, setFlashIndex] =
    useState(0);

  const [flashComplete, setFlashComplete] =
    useState(false);

  const [visualPromptVisible, setVisualPromptVisible] =
    useState(true);

  const [lastSubmitted, setLastSubmitted] =
    useState<number | null>(null);

  const [completionReported, setCompletionReported] =
    useState(false);

  /* ---------------------------------------------------------------------- */
  /* Orientation lesson state                                               */
  /* ---------------------------------------------------------------------- */

  const [orientationIndex, setOrientationIndex] =
    useState(0);

  const [orientationFeedback, setOrientationFeedback] =
    useState<
      'idle' | 'correct' | 'incorrect'
    >('idle');

  const orientationStep =
    isOrientation
      ? SOROBAN_ORIENTATION_STEPS[
          orientationIndex
        ]
      : undefined;

  const orientationProgress =
    isOrientation
      ? Math.round(
          ((orientationIndex + 1) /
            SOROBAN_ORIENTATION_STEPS.length) *
            100,
        )
      : 0;

  /* ---------------------------------------------------------------------- */
  /* Derived state                                                          */
  /* ---------------------------------------------------------------------- */

  const progress =
    levels[levelId];

  const currentValue = useMemo(
    () => valueOf(rods),
    [rods],
  );

  const accuracy = useMemo(() => {
    if (sessionAttempts === 0) {
      return 0;
    }

    return Math.round(
      (sessionCorrect /
        sessionAttempts) *
        100,
    );
  }, [
    sessionAttempts,
    sessionCorrect,
  ]);

  const isMentalTask =
    !isOrientation &&
    (level.isMental ||
      mode === 'mental' ||
      prompt.isMental);

  const isFlashTask =
    !isOrientation &&
    prompt.type === 'flash-anzan';

  const isVisualisationTask =
    !isOrientation &&
    prompt.type === 'visualisation';

  const hasChoices =
    !isOrientation &&
    !isMentalTask &&
    Boolean(
      prompt.options &&
        prompt.options.length > 0,
    );

  const overallProgress =
    useMemo(() => {
      const completed =
        ABACUS_LEVELS.filter(
          candidate =>
            levels[
              candidate.id
            ]?.completed,
        ).length;

      return Math.round(
        (completed /
          ABACUS_LEVELS.length) *
          100,
      );
    }, [levels]);

  const masteredCount =
    useMemo(
      () =>
        ABACUS_LEVELS.filter(
          candidate =>
            levels[
              candidate.id
            ]?.completed,
        ).length,
      [levels],
    );

  const currentModuleNumber =
    ABACUS_LEVELS.findIndex(
      candidate =>
        candidate.id === levelId,
    ) + 1;

  const certificateEarned =
    certificates.some(
      certificate =>
        certificate.levelId ===
        levelId,
    );

  const stages =
    useMemo(
      () =>
        [1, 2, 3, 4, 5].map(
          stage => ({
            stage,
            modules:
              ABACUS_LEVELS.filter(
                candidate =>
                  candidate.stage ===
                  stage,
              ),
          }),
        ),
      [],
    );

  /* ---------------------------------------------------------------------- */
  /* Navigation                                                             */
  /* ---------------------------------------------------------------------- */

  const goToPage = useCallback(
    (
      nextPage: AcademyPage,
    ) => {
      const currentIndex =
        PAGE_ORDER.indexOf(
          page,
        );

      const nextIndex =
        PAGE_ORDER.indexOf(
          nextPage,
        );

      setDirection(
        nextIndex >= currentIndex
          ? 1
          : -1,
      );

      setPage(nextPage);
    },
    [page],
  );

  const goNextPage =
    useCallback(() => {
      const index =
        PAGE_ORDER.indexOf(
          page,
        );

      if (
        index <
        PAGE_ORDER.length - 1
      ) {
        goToPage(
          PAGE_ORDER[index + 1],
        );
      }
    }, [
      goToPage,
      page,
    ]);

  const goPreviousPage =
    useCallback(() => {
      const index =
        PAGE_ORDER.indexOf(
          page,
        );

      if (index > 0) {
        goToPage(
          PAGE_ORDER[index - 1],
        );
      }
    }, [
      goToPage,
      page,
    ]);

  /* ---------------------------------------------------------------------- */
  /* Reset physical lesson state                                           */
  /* ---------------------------------------------------------------------- */

  const resetOrientationStep =
    useCallback(() => {
      setRods(
        blankSoroban(
          level.rodCount,
        ),
      );

      setOrientationFeedback(
        'idle',
      );

      setFeedback('idle');
      setShowHint(false);
    }, [level.rodCount]);

  /* ---------------------------------------------------------------------- */
  /* Start a round                                                          */
  /* ---------------------------------------------------------------------- */

  const startRound = useCallback(
    (
      nextMode: AbacusMode = mode,
      nextLevelId: AbacusLevelId = levelId,
    ) => {
      const nextLevel =
        ABACUS_LEVELS.find(
          candidate =>
            candidate.id ===
            nextLevelId,
        ) ?? ABACUS_LEVELS[0];

      setLevelId(
        nextLevelId,
      );

      setMode(nextMode);

      setRods(
        blankSoroban(
          nextLevel.rodCount,
        ),
      );

      setMentalAnswer('');
      setLastSubmitted(null);
      setFeedback('idle');
      setOrientationFeedback(
        'idle',
      );
      setShowHint(false);
      setFlashIndex(0);
      setFlashComplete(false);
      setVisualPromptVisible(true);

      if (
        nextLevelId ===
        'abacus-orientation'
      ) {
        setOrientationIndex(0);
      } else {
        setPrompt(
          createPrompt(
            nextLevelId,
            nextMode,
          ),
        );
      }

      if (
        nextMode ===
        'challenge'
      ) {
        setSecondsLeft(60);
      }

      goToPage(
        'practice',
      );

      if (
        autoReadEnabled
      ) {
        const text =
          nextLevelId ===
          'abacus-orientation'
            ? SOROBAN_ORIENTATION_STEPS[0]
                .explanation
            : createPrompt(
                nextLevelId,
                nextMode,
              ).question;

        window.setTimeout(
          () => speak(text),
          250,
        );
      }
    },
    [
      autoReadEnabled,
      goToPage,
      levelId,
      mode,
      speak,
    ],
  );

  /* ---------------------------------------------------------------------- */
  /* Orientation lesson narration                                           */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (
      !isOrientation ||
      page !== 'practice' ||
      !orientationStep ||
      !autoReadEnabled
    ) {
      return;
    }

    const text = [
      orientationStep.title,
      orientationStep.explanation,
      orientationStep.instruction,
    ]
      .filter(Boolean)
      .join('. ');

    const timeout =
      window.setTimeout(
        () => speak(text),
        300,
      );

    return () =>
      window.clearTimeout(
        timeout,
      );
  }, [
    autoReadEnabled,
    isOrientation,
    orientationIndex,
    orientationStep,
    page,
    speak,
  ]);

  /* ---------------------------------------------------------------------- */
  /* Orientation step completion                                            */
  /* ---------------------------------------------------------------------- */

  const continueOrientation =
    useCallback(() => {
      const nextIndex =
        orientationIndex + 1;

      if (
        nextIndex >=
        SOROBAN_ORIENTATION_STEPS.length
      ) {
        setFeedback('correct');

        goToPage(
          'result',
        );

        speak(
          'Excellent. You have completed your first Soroban orientation lesson.',
        );

        return;
      }

      setOrientationIndex(
        nextIndex,
      );

      setOrientationFeedback(
        'idle',
      );

      setFeedback('idle');

      setRods(
        blankSoroban(
          level.rodCount,
        ),
      );
    }, [
      goToPage,
      level.rodCount,
      orientationIndex,
      speak,
    ]);

  const checkOrientationStep =
    useCallback(() => {
      if (
        !orientationStep
      ) {
        return;
      }

      if (
        !orientationStep.requiresInteraction
      ) {
        continueOrientation();
        return;
      }

      const correct =
        isOrientationStepComplete(
          rods[rods.length - 1] ??
            {
              upper: 0,
              lower: 0,
            },
          {
            ...orientationStep,
            targetState:
              orientationStep.targetState,
          },
        );

      if (!correct) {
        setOrientationFeedback(
          'incorrect',
        );
        setShowHint(true);

        if (soundEnabled) {
          playSoundFeedback(
            'try-again',
          );
        }

        speak(
          orientationStep.hint ??
            'Not quite. Try again.',
        );

        return;
      }

      setOrientationFeedback(
        'correct',
      );

      if (soundEnabled) {
        playSoundFeedback(
          'correct',
        );
      }

      speak(
        orientationStep.successMessage ??
          'Correct!',
      );

      /*
       * Only the final guided check is treated
       * as a mastery attempt. Teaching actions
       * are learning interactions, not tests.
       */
      if (
        orientationStep.id ===
        'guided-check'
      ) {
        recordAttempt(
          levelId,
          true,
        );

        setSessionAttempts(
          value => value + 1,
        );

        setSessionCorrect(
          value => value + 1,
        );

        setFeedback('correct');

        window.setTimeout(
          () => {
            goToPage(
              'result',
            );
          },
          700,
        );

        return;
      }

      window.setTimeout(
        continueOrientation,
        850,
      );
    }, [
      continueOrientation,
      goToPage,
      levelId,
      orientationStep,
      recordAttempt,
      rods,
      soundEnabled,
      speak,
    ]);

  /* ---------------------------------------------------------------------- */
  /* Flash Anzan                                                            */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (
      page !== 'practice' ||
      !isFlashTask
    ) {
      return;
    }

    const sequence =
      prompt.sequence ?? [];

    if (
      sequence.length === 0
    ) {
      setFlashComplete(true);
      return;
    }

    let index = 0;

    setFlashIndex(0);
    setFlashComplete(false);

    const duration = Math.max(
      500,
      Math.min(
        1400,
        ((prompt.timeLimit ??
          4) *
          1000) /
          sequence.length,
      ),
    );

    const interval =
      window.setInterval(() => {
        index += 1;

        if (
          index >=
          sequence.length
        ) {
          window.clearInterval(
            interval,
          );

          setFlashComplete(
            true,
          );

          return;
        }

        setFlashIndex(index);
      }, duration);

    return () =>
      window.clearInterval(
        interval,
      );
  }, [
    isFlashTask,
    page,
    prompt.id,
    prompt.sequence,
    prompt.timeLimit,
  ]);

  /* ---------------------------------------------------------------------- */
  /* Visualisation                                                          */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (
      page !== 'practice' ||
      !isVisualisationTask
    ) {
      setVisualPromptVisible(
        true,
      );

      return;
    }

    setVisualPromptVisible(
      true,
    );

    const timeout =
      window.setTimeout(() => {
        setVisualPromptVisible(
          false,
        );
      }, 2800);

    return () =>
      window.clearTimeout(
        timeout,
      );
  }, [
    isVisualisationTask,
    page,
    prompt.id,
  ]);

  /* ---------------------------------------------------------------------- */
  /* Challenge timer                                                        */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (
      page !== 'practice' ||
      mode !== 'challenge' ||
      challengeFinished ||
      secondsLeft <= 0 ||
      isOrientation
    ) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        setSecondsLeft(
          seconds =>
            Math.max(
              0,
              seconds - 1,
            ),
        );
      }, 1000);

    return () =>
      window.clearTimeout(
        timer,
      );
  }, [
    challengeFinished,
    isOrientation,
    mode,
    page,
    secondsLeft,
  ]);

  useEffect(() => {
    if (
      mode !== 'challenge' ||
      secondsLeft !== 0 ||
      challengeFinished ||
      isOrientation
    ) {
      return;
    }

    setChallengeFinished(true);
    setFeedback('idle');

    goToPage('result');

    speak(
      `Time's up! You solved ${challengeScore} problem${
        challengeScore === 1
          ? ''
          : 's'
      } correctly.`,
    );
  }, [
    challengeFinished,
    challengeScore,
    goToPage,
    isOrientation,
    mode,
    secondsLeft,
    speak,
  ]);

  /* ---------------------------------------------------------------------- */
  /* Mode selection                                                         */
  /* ---------------------------------------------------------------------- */

  const chooseMode = useCallback(
    (
      nextMode: AbacusMode,
    ) => {
      setMode(nextMode);
      setSecondsLeft(60);
      setChallengeScore(0);
      setSessionCorrect(0);
      setSessionAttempts(0);
      setChallengeFinished(false);
      setFeedback('idle');

      speak(
        nextMode ===
          'challenge'
          ? 'Timed challenge. Work quickly and accurately.'
          : nextMode ===
              'mental'
            ? 'Mental abacus. Solve using visualisation and mental calculation.'
            : nextMode ===
                'practice'
              ? 'Practice mode. Take your time and think carefully.'
              : 'Beginner mode. Build confidence with the Soroban.',
      );
    },
    [speak],
  );

  /* ---------------------------------------------------------------------- */
  /* Module selection                                                       */
  /* ---------------------------------------------------------------------- */

  const chooseLevel = useCallback(
    (
      nextLevelId: AbacusLevelId,
    ) => {
      if (
        !isLevelUnlocked(
          nextLevelId,
        )
      ) {
        speak(
          'This module is locked. Master the required previous module first.',
        );

        return;
      }

      const nextLevel =
        ABACUS_LEVELS.find(
          candidate =>
            candidate.id ===
            nextLevelId,
        );

      if (!nextLevel) {
        return;
      }

      setLevelId(
        nextLevelId,
      );

      setSecondsLeft(60);
      setChallengeScore(0);
      setSessionCorrect(0);
      setSessionAttempts(0);
      setChallengeFinished(false);
      setFeedback('idle');
      setOrientationFeedback(
        'idle',
      );
      setOrientationIndex(0);
      setCurriculumOpen(false);

      goToPage(
        'overview',
      );

      speak(
        `${nextLevel.title}. ${nextLevel.subtitle}`,
      );
    },
    [
      goToPage,
      isLevelUnlocked,
      speak,
    ],
  );

  /* ---------------------------------------------------------------------- */
  /* Answer checking                                                        */
  /* ---------------------------------------------------------------------- */

  const checkAnswer =
    useCallback(
      (submitted?: number) => {
        if (
          feedback ===
            'correct' ||
          challengeFinished ||
          (mode === 'challenge' &&
            secondsLeft <= 0)
        ) {
          return;
        }

        let answerValue =
          currentValue;

        if (isMentalTask) {
          if (
            typeof submitted ===
            'number'
          ) {
            answerValue =
              submitted;
          } else {
            if (!mentalAnswer) {
              return;
            }

            answerValue =
              Number(
                mentalAnswer,
              );
          }
        } else if (
          hasChoices &&
          typeof submitted ===
            'number'
        ) {
          answerValue =
            submitted;
        }

        const correct =
          answerValue ===
          prompt.answer;

        setLastSubmitted(
          answerValue,
        );

        recordAttempt(
          levelId,
          correct,
        );

        setSessionAttempts(
          value => value + 1,
        );

        setFeedback(
          correct
            ? 'correct'
            : 'incorrect',
        );

        if (soundEnabled) {
          playSoundFeedback(
            correct
              ? 'correct'
              : 'try-again',
          );
        }

        if (!correct) {
          setShowHint(true);

          speak(
            `Not quite. Your answer was ${answerValue}. Try again.`,
          );

          goToPage(
            'result',
          );

          return;
        }

        setSessionCorrect(
          value => value + 1,
        );

        if (
          mode === 'challenge'
        ) {
          setChallengeScore(
            value => value + 1,
          );
        }

        speak(
          `Correct. ${prompt.answer} is the answer.`,
        );

        goToPage(
          'result',
        );
      },
      [
        challengeFinished,
        currentValue,
        feedback,
        goToPage,
        hasChoices,
        isMentalTask,
        levelId,
        mentalAnswer,
        mode,
        prompt.answer,
        recordAttempt,
        secondsLeft,
        soundEnabled,
        speak,
      ],
    );

  /* ---------------------------------------------------------------------- */
  /* Next question                                                          */
  /* ---------------------------------------------------------------------- */

  const nextQuestion =
    useCallback(() => {
      startRound(
        mode,
        levelId,
      );
    }, [
      levelId,
      mode,
      startRound,
    ]);

  /* ---------------------------------------------------------------------- */
  /* Clear Soroban                                                          */
  /* ---------------------------------------------------------------------- */

  const clearAbacus =
    useCallback(() => {
      if (
        feedback ===
          'correct' ||
        challengeFinished
      ) {
        return;
      }

      setRods(
        blankSoroban(
          level.rodCount,
        ),
      );

      setFeedback('idle');
      setShowHint(false);
    }, [
      challengeFinished,
      feedback,
      level.rodCount,
    ]);

  /* ---------------------------------------------------------------------- */
  /* Read prompt                                                            */
  /* ---------------------------------------------------------------------- */

  const speakPrompt =
    useCallback(() => {
      if (isOrientation) {
        const text = [
          orientationStep?.title,
          orientationStep?.explanation,
          orientationStep?.instruction,
        ]
          .filter(Boolean)
          .join('. ');

        speak(text);
        return;
      }

      speak(prompt.question);
    }, [
      isOrientation,
      orientationStep,
      prompt.question,
      speak,
    ]);

  /* ---------------------------------------------------------------------- */
  /* Finish session                                                         */
  /* ---------------------------------------------------------------------- */

  const finishSession =
    useCallback(() => {
      const score =
        sessionAttempts > 0
          ? Math.round(
              (sessionCorrect /
                sessionAttempts) *
                100,
            )
          : 0;

      const finalScore =
        Math.max(
          0,
          Math.min(
            100,
            score,
          ),
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
          ...level.skills,
        ],
      });

      speak(
        `Well done. You scored ${finalScore} percent in this session.`,
      );

      onComplete?.(
        finalScore,
      );
    }, [
      completeActivity,
      level.skills,
      onComplete,
      sessionAttempts,
      sessionCorrect,
      speak,
    ]);

  /* ---------------------------------------------------------------------- */
  /* Completion notification                                                */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (
      !progress?.completed ||
      completionReported
    ) {
      return;
    }

    setCompletionReported(
      true,
    );

    speak(
      `${level.title} has been mastered. The next module is now available.`,
    );
  }, [
    completionReported,
    level.title,
    progress?.completed,
    speak,
  ]);

  useEffect(() => {
    setCompletionReported(
      false,
    );
  }, [levelId]);

  /* ---------------------------------------------------------------------- */
  /* Curriculum drawer                                                      */
  /* ---------------------------------------------------------------------- */

  const renderCurriculum =
    () => (
      <AnimatePresence>
        {curriculumOpen && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            onClick={() =>
              setCurriculumOpen(
                false,
              )
            }
          >
            <motion.aside
              initial={{
                x: '100%',
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: '100%',
              }}
              transition={{
                type: 'spring',
                stiffness: 360,
                damping: 34,
              }}
              onClick={event =>
                event.stopPropagation()
              }
              className="ml-auto flex h-full w-[min(94vw,440px)] flex-col border-l border-gray-800 bg-[#0b0f18]"
            >
              <div className="flex items-center justify-between border-b border-gray-800 p-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-indigo-300">
                    Curriculum
                  </p>

                  <p className="mt-1 text-lg font-bold text-white">
                    {masteredCount}/
                    {
                      ABACUS_LEVELS.length
                    }{' '}
                    mastered
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setCurriculumOpen(
                      false,
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700"
                  aria-label="Close curriculum"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                <div className="space-y-4">
                  {stages.map(
                    ({
                      stage,
                      modules,
                    }) => {
                      const completed =
                        modules.filter(
                          candidate =>
                            levels[
                              candidate.id
                            ]?.completed,
                        ).length;

                      return (
                        <section
                          key={stage}
                        >
                          <div className="mb-2 flex items-center justify-between px-1">
                            <div>
                              <p className="text-xs font-bold text-white">
                                Stage{' '}
                                {stage}{' '}
                                ·{' '}
                                {
                                  STAGE_META[
                                    stage
                                  ]?.title
                                }
                              </p>

                              <p className="text-[10px] text-gray-500">
                                {completed}/
                                {
                                  modules.length
                                }{' '}
                                mastered
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {modules.map(
                              (
                                candidate,
                                moduleIndex,
                              ) => {
                                const moduleProgress =
                                  levels[
                                    candidate
                                      .id
                                  ];

                                const unlocked =
                                  isLevelUnlocked(
                                    candidate.id,
                                  );

                                const selected =
                                  candidate.id ===
                                  levelId;

                                const completed =
                                  moduleProgress?.completed ===
                                  true;

                                return (
                                  <button
                                    key={
                                      candidate.id
                                    }
                                    type="button"
                                    disabled={
                                      !unlocked
                                    }
                                    onClick={() =>
                                      chooseLevel(
                                        candidate.id,
                                      )
                                    }
                                    className={`w-full rounded-xl border p-3 text-left transition ${
                                      selected
                                        ? 'border-indigo-400 bg-indigo-500/10'
                                        : completed
                                          ? 'border-emerald-500/20 bg-emerald-500/5'
                                          : unlocked
                                            ? 'border-gray-800 bg-gray-900/60 hover:border-gray-700'
                                            : 'border-gray-900 bg-gray-950/40 opacity-50'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-800">
                                        {completed ? (
                                          <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                                        ) : unlocked ? (
                                          candidate.isMental ? (
                                            <Brain className="h-4 w-4 text-purple-300" />
                                          ) : (
                                            <span className="text-[10px] font-bold text-gray-400">
                                              {moduleIndex +
                                                1}
                                            </span>
                                          )
                                        ) : (
                                          <Lock className="h-3.5 w-3.5 text-gray-500" />
                                        )}
                                      </span>

                                      <span className="min-w-0 flex-1">
                                        <span className="flex items-center gap-2">
                                          <span className="truncate text-xs font-bold text-white">
                                            {
                                              candidate.title
                                            }
                                          </span>

                                          {candidate.isMental && (
                                            <span className="rounded-full bg-purple-500/10 px-1.5 py-0.5 text-[8px] font-bold text-purple-300">
                                              MENTAL
                                            </span>
                                          )}
                                        </span>

                                        <span className="mt-1 block truncate text-[10px] text-gray-500">
                                          {
                                            candidate.subtitle
                                          }
                                        </span>

                                        <span className="mt-1 block text-[9px] text-gray-600">
                                          Mastery{' '}
                                          {moduleProgress?.mastery ??
                                            0}
                                          %
                                        </span>
                                      </span>

                                      {selected && (
                                        <span className="text-[8px] font-bold uppercase tracking-wider text-indigo-300">
                                          Current
                                        </span>
                                      )}
                                    </div>
                                  </button>
                                );
                              },
                            )}
                          </div>
                        </section>
                      );
                    },
                  )}
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    );

  /* ---------------------------------------------------------------------- */
  /* Overview                                                               */
  /* ---------------------------------------------------------------------- */

  const renderOverview =
    () => (
      <div className="flex min-h-[calc(100svh-15rem)] flex-col justify-between gap-5">
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                Module {currentModuleNumber}/
                {ABACUS_LEVELS.length}
              </span>

              <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                {level.title}
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                {level.subtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setCurriculumOpen(
                  true,
                )
              }
              className="flex min-h-11 items-center gap-2 rounded-xl border border-gray-700 bg-gray-900 px-3 text-xs font-bold text-gray-300 hover:border-gray-600 hover:text-white"
            >
              <Menu className="h-4 w-4" />
              Curriculum
            </button>
          </div>

          {/* Mastery */}

          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                  Module mastery
                </span>

                <p className="mt-1 text-3xl font-bold text-white">
                  {progress?.mastery ??
                    0}
                  %
                </p>
              </div>

              <div className="text-right text-[10px] text-gray-500">
                Target{' '}
                <span className="font-bold text-gray-300">
                  {level.masteryTarget}%
                </span>
                <br />
                {progress?.attempts ??
                  0}{' '}
                /{' '}
                {level.minimumAttempts}{' '}
                attempts
              </div>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-900">
              <motion.div
                className="h-full rounded-full bg-indigo-500"
                animate={{
                  width: `${
                    progress?.mastery ??
                    0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Stage */}

          <div className="mt-4 rounded-2xl border border-gray-800 bg-gray-900/60 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10">
                <Layers3 className="h-5 w-5 text-indigo-300" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Stage {level.stage}
                </p>

                <p className="mt-1 font-bold text-white">
                  {
                    STAGE_META[
                      level.stage
                    ]?.title
                  }
                </p>

                <p className="mt-1 text-xs leading-relaxed text-gray-400">
                  {
                    STAGE_META[
                      level.stage
                    ]?.description
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Description */}

          <div className="mt-4">
            <p className="text-sm leading-relaxed text-gray-300">
              {level.description}
            </p>

            {level.skills.length >
              0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {level.skills
                  .slice(0, 5)
                  .map(skill => (
                    <span
                      key={skill}
                      className="rounded-full border border-gray-800 bg-gray-900 px-2.5 py-1 text-[9px] text-gray-400"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* Orientation introduction */}

          {isOrientation && (
            <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-500/5 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10">
                  <Target className="h-5 w-5 text-amber-300" />
                </div>

                <div>
                  <p className="text-sm font-bold text-white">
                    Your first Soroban lesson
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-gray-400">
                    Before you calculate, you will learn
                    what the Soroban is, what each part does,
                    and how Heaven and Earth beads represent
                    numbers.
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-amber-300">
                    <span>
                      {SOROBAN_ORIENTATION_STEPS.length}
                      {' '}guided steps
                    </span>

                    <ChevronRight className="h-3 w-3" />

                    <span>
                      Hands-on learning
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Practice modes */}

          {!isOrientation && (
            <div className="mt-5">
              <div className="mb-2 flex items-center gap-2">
                <Target className="h-4 w-4 text-indigo-300" />

                <span className="text-sm font-bold text-white">
                  Practice style
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
                ).map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      chooseMode(
                        option,
                      )
                    }
                    className={`min-h-12 rounded-xl px-2 text-xs font-bold transition ${
                      mode === option
                        ? 'bg-indigo-600 text-white'
                        : 'border border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700 hover:text-white'
                    }`}
                  >
                    {option ===
                    'mental'
                      ? 'Mental'
                      : option ===
                          'challenge'
                        ? 'Timed'
                        : option ===
                            'practice'
                          ? 'Practice'
                          : 'Beginner'}
                  </button>
                ))}
              </div>

              <p className="mt-2 text-[10px] text-gray-600">
                Practice style changes how you practise.
                Your module and mastery pathway remain unchanged.
              </p>
            </div>
          )}
        </div>

        {/* Start */}

        <div>
          <button
            type="button"
            onClick={() =>
              startRound(
                mode,
                levelId,
              )
            }
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-500 active:scale-[0.99]"
          >
            {isOrientation
              ? 'Begin Soroban lesson'
              : `Start ${
                  mode === 'challenge'
                    ? 'challenge'
                    : 'practice'
                }`}

            <ArrowRight className="h-5 w-5" />
          </button>

          {!isOrientation && (
            <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-gray-600">
              <span>
                {sessionCorrect}/
                {sessionAttempts}{' '}
                correct
              </span>

              <span>
                {accuracy}% session accuracy
              </span>
            </div>
          )}
        </div>
      </div>
    );

  /* ---------------------------------------------------------------------- */
  /* Orientation practice page                                              */
  /* ---------------------------------------------------------------------- */

  const renderOrientationPractice =
    () => {
      if (
        !orientationStep
      ) {
        return null;
      }

      const stepRequiresAction =
        orientationStep.requiresInteraction;

      const stepComplete =
        !stepRequiresAction ||
        isOrientationStepComplete(
          rods[rods.length - 1] ?? {
            upper: 0,
            lower: 0,
          },
          orientationStep,
        );

      return (
        <div className="flex min-h-[calc(100svh-15rem)] flex-col">
          {/* Lesson header */}

          <div className="mb-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() =>
                goToPage(
                  'overview',
                )
              }
              className="flex h-10 items-center gap-1 rounded-xl bg-gray-900 px-3 text-xs font-bold text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Module
            </button>

            <div className="text-center">
              <p className="text-[9px] font-bold uppercase tracking-widest text-amber-300">
                Soroban Orientation
              </p>

              <p className="mt-1 text-[10px] text-gray-500">
                Step {orientationIndex + 1}{' '}
                of{' '}
                {
                  SOROBAN_ORIENTATION_STEPS.length
                }
              </p>
            </div>

            <button
              type="button"
              onClick={speakPrompt}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-gray-400 hover:text-white"
              aria-label="Hear lesson"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          </div>

          {/* Lesson progress */}

          <div className="mb-4">
            <div className="h-1.5 overflow-hidden rounded-full bg-gray-900">
              <motion.div
                className="h-full rounded-full bg-amber-400"
                animate={{
                  width: `${orientationProgress}%`,
                }}
              />
            </div>

            <div className="mt-2 flex justify-between text-[9px] text-gray-600">
              <span>
                Soroban Foundation
              </span>

              <span>
                {orientationProgress}%
              </span>
            </div>
          </div>

          {/* Teaching card */}

          <div className="rounded-2xl border border-amber-400/20 bg-amber-500/5 p-4 text-center">
            <span className="text-[9px] font-bold uppercase tracking-widest text-amber-300">
              {orientationStep.kind ===
              'teach'
                ? 'Learn'
                : 'Your turn'}
            </span>

            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              {orientationStep.title}
            </h2>

            <p className="mt-1 text-xs font-medium text-amber-200/80">
              {orientationStep.subtitle}
            </p>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-300">
              {orientationStep.explanation}
            </p>

            {orientationStep.instruction && (
              <div className="mt-4 rounded-xl border border-gray-800 bg-gray-950/70 p-3">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
                  {stepRequiresAction
                    ? 'Do this'
                    : 'Remember'}
                </p>

                <p className="mt-1 text-sm font-bold text-white">
                  {
                    orientationStep.instruction
                  }
                </p>
              </div>
            )}
          </div>

          {/* Soroban */}

          <div className="mt-4 flex flex-1 flex-col justify-center">
            <Soroban
              rods={rods}
              onChange={setRods}
              disabled={
                !stepRequiresAction ||
                orientationFeedback ===
                  'correct'
              }
              soundOn={
                soundEnabled
              }
              focus={
                orientationStep.focus
              }
            />

            {stepRequiresAction && (
              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-2xl border border-amber-500/20 bg-gray-900 px-3 py-3 text-center">
                  <span className="block text-[9px] uppercase tracking-widest text-gray-500">
                    Your Soroban
                  </span>

                  <span className="text-2xl font-bold text-amber-300">
                    {currentValue}
                  </span>
                </div>

                <div className="rounded-2xl border border-gray-800 bg-gray-900 px-3 py-3 text-center">
                  <span className="block text-[9px] uppercase tracking-widest text-gray-500">
                    Goal
                  </span>

                  <span className="text-2xl font-bold text-white">
                    {orientationStep.targetValue ??
                      '—'}
                  </span>
                </div>
              </div>
            )}

            {/* Correct feedback */}

            <AnimatePresence>
              {orientationFeedback ===
                'correct' && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-center"
                >
                  <CheckCircle2 className="mx-auto h-6 w-6 text-emerald-300" />

                  <p className="mt-1 text-xs font-bold text-emerald-200">
                    {
                      orientationStep.successMessage
                    }
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Incorrect feedback */}

            <AnimatePresence>
              {orientationFeedback ===
                'incorrect' && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-3"
                >
                  <div className="flex gap-3">
                    <Lightbulb className="h-5 w-5 shrink-0 text-amber-300" />

                    <div>
                      <p className="text-xs font-bold text-amber-200">
                        Try again
                      </p>

                      <p className="mt-1 text-[11px] leading-relaxed text-gray-300">
                        {orientationStep.hint}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Lesson action */}

          <div className="mt-4">
            {stepRequiresAction ? (
              <button
                type="button"
                onClick={
                  checkOrientationStep
                }
                disabled={
                  orientationFeedback ===
                  'correct'
                }
                className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 px-6 text-sm font-bold text-black transition hover:bg-amber-400 disabled:opacity-50"
              >
                {stepComplete
                  ? 'Check my Soroban'
                  : 'Check my Soroban'}

                <CheckCircle2 className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={
                  continueOrientation
                }
                className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 text-sm font-bold text-white transition hover:bg-indigo-500"
              >
                I understand
                <ArrowRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      );
    };

  /* ---------------------------------------------------------------------- */
  /* Standard practice page                                                 */
  /* ---------------------------------------------------------------------- */

  const renderStandardPractice =
    () => (
      <div className="flex min-h-[calc(100svh-15rem)] flex-col">
        <div className="mb-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() =>
              goToPage(
                'overview',
              )
            }
            className="flex h-10 items-center gap-1 rounded-xl bg-gray-900 px-3 text-xs font-bold text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Module
          </button>

          <div className="text-center">
            <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-300">
              {level.title}
            </p>

            {mode ===
              'challenge' && (
              <p
                className={`mt-1 text-xs font-bold ${
                  secondsLeft <= 10
                    ? 'text-red-300'
                    : 'text-amber-300'
                }`}
              >
                <Clock3 className="mr-1 inline h-3.5 w-3.5" />
                {secondsLeft}s
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={
              speakPrompt
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-gray-400 hover:text-white"
            aria-label="Hear question"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>

        {/* Flash Anzan */}

        {isFlashTask ? (
          <div className="flex flex-1 flex-col justify-center">
            {!flashComplete ? (
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-purple-300">
                  Flash Anzan
                </p>

                <motion.div
                  key={flashIndex}
                  initial={{
                    opacity: 0,
                    scale: 0.7,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  className="mt-5 flex min-h-48 items-center justify-center rounded-3xl border border-purple-500/30 bg-purple-500/10"
                >
                  <span className="text-7xl font-bold text-white sm:text-8xl">
                    {
                      prompt
                        .sequence?.[
                        flashIndex
                      ]
                    }
                  </span>
                </motion.div>

                <p className="mt-4 text-xs text-gray-500">
                  Number{' '}
                  {flashIndex +
                    1}{' '}
                  of{' '}
                  {
                    prompt
                      .sequence
                      ?.length
                  }
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  Keep the running total in your mind.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-5 rounded-2xl border border-purple-500/20 bg-purple-500/10 p-4 text-center">
                  <Brain className="mx-auto h-7 w-7 text-purple-300" />

                  <p className="mt-2 text-sm font-bold text-white">
                    Sequence complete
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Enter the total you calculated mentally.
                  </p>
                </div>

                <NumberKeypad
                  value={
                    mentalAnswer
                  }
                  onChange={
                    setMentalAnswer
                  }
                  onSubmit={() =>
                    checkAnswer()
                  }
                  disabled={
                    feedback ===
                      'correct' ||
                    challengeFinished
                  }
                />
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Prompt */}

            <div className="mb-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4 text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                {isMentalTask
                  ? 'Mental calculation'
                  : hasChoices
                    ? 'Choose the answer'
                    : 'Work on the Soroban'}
              </span>

              <AnimatePresence
                mode="wait"
              >
                <motion.div
                  key={`${prompt.id}-${visualPromptVisible}`}
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity:
                      visualPromptVisible
                        ? 1
                        : 0,
                    y: 0,
                  }}
                  className="mt-2 text-xl font-bold text-white sm:text-3xl"
                >
                  {visualPromptVisible
                    ? prompt.question
                    : 'Hold the visualisation in your mind.'}
                </motion.div>
              </AnimatePresence>

              {prompt.instruction &&
                visualPromptVisible && (
                  <p className="mx-auto mt-2 max-w-xl text-[11px] leading-relaxed text-gray-400">
                    {
                      prompt.instruction
                    }
                  </p>
                )}

              {prompt.formula &&
                visualPromptVisible && (
                  <div className="mt-3 inline-flex rounded-lg border border-indigo-400/20 bg-gray-950/60 px-3 py-2 font-mono text-xs text-indigo-200">
                    {prompt.formula}
                  </div>
                )}
            </div>

            {/* Mental */}

            {isMentalTask ? (
              <div className="flex flex-1 flex-col justify-center">
                <div className="mb-4 rounded-2xl border border-purple-500/20 bg-purple-500/10 p-4 text-center">
                  <Brain className="mx-auto h-7 w-7 text-purple-300" />

                  <p className="mt-2 text-sm font-bold text-white">
                    Mental Abacus
                  </p>

                  <p className="mt-1 text-[11px] leading-relaxed text-gray-400">
                    Build the Soroban in your mind. The physical
                    Soroban is not the answer surface for this
                    module.
                  </p>
                </div>

                <NumberKeypad
                  value={
                    mentalAnswer
                  }
                  onChange={
                    setMentalAnswer
                  }
                  onSubmit={() =>
                    checkAnswer()
                  }
                  disabled={
                    feedback ===
                      'correct' ||
                    challengeFinished
                  }
                />
              </div>
            ) : hasChoices ? (
              <div className="flex flex-1 flex-col justify-center">
                <div className="grid grid-cols-2 gap-3">
                  {Array.from(
                    new Set(
                      prompt.options ??
                        [],
                    ),
                  ).map(
                    option => (
                      <button
                        key={option}
                        type="button"
                        disabled={
                          feedback ===
                            'correct' ||
                          challengeFinished
                        }
                        onClick={() =>
                          checkAnswer(
                            option,
                          )
                        }
                        className="min-h-16 rounded-2xl border border-gray-700 bg-gray-900 px-4 text-xl font-bold text-white transition hover:border-indigo-400 hover:bg-indigo-500/10 active:scale-[0.98] disabled:opacity-50"
                      >
                        {option}
                      </button>
                    ),
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-1 flex-col justify-center">
                <Soroban
                  rods={rods}
                  onChange={
                    setRods
                  }
                  disabled={
                    feedback ===
                      'correct' ||
                    challengeFinished
                  }
                  soundOn={
                    soundEnabled
                  }
                />

                <div className="mt-7 grid grid-cols-2 gap-2">
                  <div className="rounded-2xl border border-amber-500/20 bg-gray-900 px-3 py-3 text-center">
                    <span className="block text-[9px] uppercase tracking-widest text-gray-500">
                      Your number
                    </span>

                    <span className="text-2xl font-bold text-amber-300">
                      {currentValue}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-gray-800 bg-gray-900 px-3 py-3 text-center">
                    <span className="block text-[9px] uppercase tracking-widest text-gray-500">
                      Target
                    </span>

                    <span className="text-2xl font-bold text-white">
                      ?
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={
                      clearAbacus
                    }
                    disabled={
                      feedback ===
                        'correct' ||
                      challengeFinished
                    }
                    className="min-h-12 flex-1 rounded-xl bg-gray-900 text-xs font-bold text-gray-300 hover:bg-gray-800 disabled:opacity-50"
                  >
                    <RotateCcw className="mr-1 inline h-4 w-4" />
                    Clear
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      checkAnswer()
                    }
                    disabled={
                      feedback ===
                        'correct' ||
                      challengeFinished
                    }
                    className="min-h-12 flex-[2] rounded-xl bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-500 disabled:opacity-50"
                  >
                    Check beads
                  </button>
                </div>
              </div>
            )}

            {/* Hint */}

            <AnimatePresence>
              {showHint &&
                feedback !==
                  'correct' && (
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
                  <div className="flex gap-3 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-3">
                    <Lightbulb className="h-5 w-5 shrink-0 text-amber-300" />

                    <div>
                      <p className="text-xs font-bold text-amber-200">
                        Hint
                      </p>

                      <p className="mt-1 text-[11px] leading-relaxed text-gray-300">
                        Start with the largest place-value
                        rod. The upper bead is worth five and
                        each lower bead is worth one.
                      </p>

                      {prompt.type ===
                        'small-friend' && (
                        <p className="mt-1 text-[10px] text-amber-200/80">
                          Small friends use complements to five.
                        </p>
                      )}

                      {prompt.type ===
                        'big-friend' && (
                        <p className="mt-1 text-[10px] text-amber-200/80">
                          Big friends use complements to ten.
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!showHint &&
              feedback ===
                'idle' && (
              <button
                type="button"
                onClick={() =>
                  setShowHint(
                    true,
                  )
                }
                className="mx-auto mt-3 flex items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-gray-300"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                Need a hint?
              </button>
            )}
          </>
        )}
      </div>
    );

  /* ---------------------------------------------------------------------- */
  /* Practice router                                                        */
  /* ---------------------------------------------------------------------- */

  const renderPractice =
    () => {
      if (isOrientation) {
        return renderOrientationPractice();
      }

      return renderStandardPractice();
    };

  /* ---------------------------------------------------------------------- */
  /* Result page                                                            */
  /* ---------------------------------------------------------------------- */

  const renderResult =
    () => {
      const mastered =
        progress?.completed ===
        true;

      const next =
        getNextLevel(
          levelId,
        );

      const correct =
        feedback ===
        'correct';

      return (
        <div className="flex min-h-[calc(100svh-15rem)] flex-col justify-between">
          <div>
            <div className="text-center">
              {correct ? (
                <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-300" />
              ) : challengeFinished ? (
                <Trophy className="mx-auto h-14 w-14 text-amber-300" />
              ) : (
                <XCircle className="mx-auto h-14 w-14 text-red-300" />
              )}

              <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                {isOrientation
                  ? 'Lesson complete'
                  : challengeFinished
                    ? 'Challenge complete'
                    : correct
                      ? 'Correct'
                      : 'Keep going'}
              </p>

              <h2 className="mt-1 text-2xl font-bold text-white">
                {isOrientation
                  ? 'You met the Soroban'
                  : challengeFinished
                    ? `${challengeScore} correct`
                    : correct
                      ? 'Excellent work'
                      : 'Not quite yet'}
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-400">
                {isOrientation
                  ? 'You have learned the basic parts of the Soroban and how Heaven and Earth beads represent numbers.'
                  : !correct &&
                      !challengeFinished
                    ? 'Review the idea, use the hint if needed, then try the problem again.'
                    : 'Keep practising to strengthen your mastery.'}
              </p>

              {lastSubmitted !==
                null &&
                !isOrientation && (
                  <p className="mt-2 text-sm text-gray-400">
                    Your answer:{' '}
                    <span className="font-bold text-white">
                      {
                        lastSubmitted
                      }
                    </span>
                  </p>
                )}
            </div>

            {/* Session stats */}

            <div className="mt-6 grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-3 text-center">
                <span className="block text-[9px] uppercase tracking-widest text-gray-500">
                  Session
                </span>

                <span className="mt-1 block text-xl font-bold text-white">
                  {sessionCorrect}/
                  {sessionAttempts}
                </span>
              </div>

              <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-3 text-center">
                <span className="block text-[9px] uppercase tracking-widest text-gray-500">
                  Accuracy
                </span>

                <span className="mt-1 block text-xl font-bold text-indigo-300">
                  {accuracy}%
                </span>
              </div>

              <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-3 text-center">
                <span className="block text-[9px] uppercase tracking-widest text-gray-500">
                  Mastery
                </span>

                <span className="mt-1 block text-xl font-bold text-emerald-300">
                  {progress?.mastery ??
                    0}
                  %
                </span>
              </div>
            </div>

            {/* Mastery */}

            <div className="mt-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  {level.title}
                </span>

                <span className="text-xs font-bold text-indigo-300">
                  {progress?.mastery ??
                    0}
                  %
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-900">
                <motion.div
                  className="h-full rounded-full bg-indigo-500"
                  animate={{
                    width: `${
                      progress?.mastery ??
                      0
                    }%`,
                  }}
                />
              </div>

              <p className="mt-2 text-[10px] text-gray-500">
                Mastery target:{' '}
                {level.masteryTarget}%
              </p>
            </div>

            {certificateEarned && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4">
                <Trophy className="h-6 w-6 shrink-0 text-amber-300" />

                <div>
                  <p className="text-sm font-bold text-amber-200">
                    Module mastered
                  </p>

                  <p className="mt-1 text-[10px] text-gray-400">
                    You have demonstrated mastery of{' '}
                    {level.title}.
                  </p>
                </div>
              </div>
            )}

            {!correct &&
              !challengeFinished &&
              !isOrientation && (
                <button
                  type="button"
                  onClick={() =>
                    goToPage(
                      'practice',
                    )
                  }
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-amber-400/20 bg-amber-500/10 py-3 text-xs font-bold text-amber-200"
                >
                  <Lightbulb className="h-4 w-4" />
                  Return to the problem
                </button>
              )}
          </div>

          {/* Result actions */}

          <div className="mt-6 space-y-2">
            {isOrientation ? (
              mastered && next ? (
                <button
                  type="button"
                  onClick={() =>
                    chooseLevel(
                      next.id,
                    )
                  }
                  className="flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-500"
                >
                  Continue to{' '}
                  {next.title}
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    startRound(
                      'beginner',
                      levelId,
                    )
                  }
                  className="flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-500"
                >
                  <RotateCcw className="h-4 w-4" />
                  Review lesson
                </button>
              )
            ) : challengeFinished ? (
              <button
                type="button"
                onClick={() => {
                  setSecondsLeft(
                    60,
                  );
                  setChallengeScore(
                    0,
                  );
                  setSessionCorrect(
                    0,
                  );
                  setSessionAttempts(
                    0,
                  );
                  setChallengeFinished(
                    false,
                  );
                  startRound(
                    'challenge',
                    levelId,
                  );
                }}
                className="flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-500"
              >
                <RotateCcw className="h-4 w-4" />
                Try challenge again
              </button>
            ) : mastered &&
              next ? (
              <button
                type="button"
                onClick={() =>
                  chooseLevel(
                    next.id,
                  )
                }
                className="flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-500"
              >
                Continue to{' '}
                {next.title}
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : correct ? (
              <button
                type="button"
                onClick={
                  nextQuestion
                }
                className="flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-500"
              >
                Next question
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={
                  nextQuestion
                }
                className="flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-500"
              >
                Try again
                <RotateCcw className="h-4 w-4" />
              </button>
            )}

            {sessionAttempts >
              0 &&
              !isOrientation && (
                <button
                  type="button"
                  onClick={
                    finishSession
                  }
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-gray-800 bg-gray-900 text-xs font-bold text-gray-400 hover:text-white"
                >
                  <Trophy className="h-4 w-4" />
                  Finish session
                </button>
              )}
          </div>
        </div>
      );
    };

  /* ---------------------------------------------------------------------- */
  /* Render                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <>
      {renderCurriculum()}

      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-app-border bg-app-card p-3 shadow-xl sm:p-6">
        {/* Header */}

        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10">
              <Brain className="h-5 w-5 text-indigo-300" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                Abacus Academy
              </p>

              <p className="truncate text-sm font-bold text-white sm:text-base">
                Soroban → Mental Abacus
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setCurriculumOpen(
                  true,
                )
              }
              className="flex h-10 items-center gap-1.5 rounded-xl bg-gray-900 px-3 text-xs font-bold text-gray-400 hover:text-white"
            >
              <Menu className="h-4 w-4" />
              <span className="hidden sm:inline">
                Curriculum
              </span>
            </button>

            <button
              type="button"
              onClick={
                toggleSound
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-gray-400 hover:text-white"
              aria-label="Toggle sound"
            >
              <Volume2
                className={
                  soundEnabled
                    ? 'h-4 w-4 text-amber-300'
                    : 'h-4 w-4 text-gray-600'
                }
              />
            </button>
          </div>
        </div>

        {/* Academy progress */}

        <div className="mb-4 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-900">
            <motion.div
              className="h-full rounded-full bg-indigo-500"
              animate={{
                width: `${overallProgress}%`,
              }}
            />
          </div>

          <span className="shrink-0 text-[9px] font-bold text-gray-500">
            {masteredCount}/
            {ABACUS_LEVELS.length}
          </span>
        </div>

        {/* Slide area */}

        <div className="relative overflow-hidden">
          <AnimatePresence
            initial={false}
            custom={direction}
            mode="wait"
          >
            <motion.div
              key={page}
              custom={direction}
              initial={{
                x:
                  direction *
                  50,
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              exit={{
                x:
                  direction *
                  -50,
                opacity: 0,
              }}
              transition={{
                duration: 0.22,
                ease: 'easeOut',
              }}
              drag="x"
              dragConstraints={{
                left: 0,
                right: 0,
              }}
              dragElastic={0.12}
              onDragEnd={(
                _,
                info,
              ) => {
                if (
                  info.offset.x <
                  -70
                ) {
                  goNextPage();
                }

                if (
                  info.offset.x >
                  70
                ) {
                  goPreviousPage();
                }
              }}
            >
              {page ===
                'overview' &&
                renderOverview()}

              {page ===
                'practice' &&
                renderPractice()}

              {page ===
                'result' &&
                renderResult()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pager */}

        <div className="mt-4 flex items-center justify-between border-t border-gray-800 pt-3">
          <button
            type="button"
            disabled={
              page ===
              'overview'
            }
            onClick={
              goPreviousPage
            }
            className="flex min-h-9 items-center gap-1 rounded-lg px-2 text-[10px] font-bold text-gray-500 hover:text-white disabled:invisible"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>

          <div className="flex items-center gap-1.5">
            {PAGE_ORDER.map(
              item => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    goToPage(
                      item,
                    )
                  }
                  aria-label={`Go to ${item}`}
                  className={`h-1.5 rounded-full transition-all ${
                    item === page
                      ? 'w-6 bg-indigo-400'
                      : 'w-1.5 bg-gray-700'
                  }`}
                />
              ),
            )}
          </div>

          <button
            type="button"
            disabled={
              page ===
              'result'
            }
            onClick={
              goNextPage
            }
            className="flex min-h-9 items-center gap-1 rounded-lg px-2 text-[10px] font-bold text-gray-500 hover:text-white disabled:invisible"
          >
            Next
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <p className="mt-1 text-center text-[9px] text-gray-700 sm:hidden">
          Swipe left or right to move between pages
        </p>
      </div>
    </>
  );
};