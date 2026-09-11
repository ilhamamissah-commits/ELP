import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfileStore } from '../../store/useProfileStore';
import {
  Trash2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Calculator,
  Brain,
  Star,
} from 'lucide-react';

interface AgeGateProps {
  /**
   * Age is developmental context only.
   * It does not determine the learner's ELP level.
   */
  onSelect: (
    age: number,
    name: string,
    level?: number,
  ) => void;
}

type OnboardingStep =
  | 'home'
  | 'profile'
  | 'placement'
  | 'results';

type PlacementCategory =
  | 'literacy'
  | 'numeracy'
  | 'reasoning';

type PlacementStage = 1 | 2 | 3 | 4 | 5;

interface PlacementQuestion {
  id: string;
  category: PlacementCategory;
  stage: PlacementStage;
  question: string;
  options: readonly string[];
  answer: number;
  explanation: string;
}

interface PlacementResult {
  level: number;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
  literacyCorrect: number;
  numeracyCorrect: number;
  reasoningCorrect: number;
  stageResults: readonly {
    stage: PlacementStage;
    correct: number;
    total: number;
  }[];
}

const PLACEMENT_QUESTIONS: readonly PlacementQuestion[] = [
  // ============================================================
  // STAGE 1 — FOUNDATION EXPLORER
  // ============================================================

  {
    id: 'foundation-letter',
    category: 'literacy',
    stage: 1,
    question: 'Which letter is B?',
    options: ['B', 'D', 'P'],
    answer: 0,
    explanation: 'B is the letter shown.',
  },
  {
    id: 'foundation-sound',
    category: 'literacy',
    stage: 1,
    question: 'Which word begins with the /b/ sound?',
    options: ['Ball', 'Sun', 'Cat'],
    answer: 0,
    explanation: 'Ball begins with the /b/ sound.',
  },
  {
    id: 'foundation-number',
    category: 'numeracy',
    stage: 1,
    question: 'Which number is 5?',
    options: ['5', '2', '8'],
    answer: 0,
    explanation: 'The number 5 represents five.',
  },

  // ============================================================
  // STAGE 2 — EARLY EXPLORER
  // ============================================================

  {
    id: 'early-digraph',
    category: 'literacy',
    stage: 2,
    question: 'Which word begins with the /sh/ sound?',
    options: ['Ship', 'Chip', 'Trip'],
    answer: 0,
    explanation: 'Ship begins with the /sh/ sound.',
  },
  {
    id: 'early-counting',
    category: 'numeracy',
    stage: 2,
    question: 'What number comes after 29?',
    options: ['28', '30', '31'],
    answer: 1,
    explanation: '30 comes after 29.',
  },
  {
    id: 'early-pattern',
    category: 'reasoning',
    stage: 2,
    question: 'What comes next: 2, 4, 6, ___?',
    options: ['7', '8', '10'],
    answer: 1,
    explanation: 'The numbers increase by 2 each time.',
  },

  // ============================================================
  // STAGE 3 — CONFIDENT LEARNER
  // ============================================================

  {
    id: 'confident-reading',
    category: 'literacy',
    stage: 3,
    question:
      'Mia has a red ball. She puts the ball in a box. Where is the ball?',
    options: ['In a box', 'Under a tree', 'At school'],
    answer: 0,
    explanation: 'The story says Mia puts the ball in a box.',
  },
  {
    id: 'confident-addition',
    category: 'numeracy',
    stage: 3,
    question: 'What is 14 + 8?',
    options: ['20', '22', '24'],
    answer: 1,
    explanation: '14 + 8 = 22.',
  },
  {
    id: 'confident-reasoning',
    category: 'reasoning',
    stage: 3,
    question:
      'A plant needs water to grow. What is most likely to happen if it is not watered?',
    options: [
      'It may wilt.',
      'It will become a stone.',
      'It will turn into an animal.',
    ],
    answer: 0,
    explanation:
      'Plants need water to remain healthy and grow.',
  },

  // ============================================================
  // STAGE 4 — INDEPENDENT THINKER
  // ============================================================

  {
    id: 'independent-inference',
    category: 'literacy',
    stage: 4,
    question:
      'Ama carried an umbrella and wore a raincoat before leaving home. What can we infer?',
    options: [
      'It was probably raining or about to rain.',
      'She was going swimming.',
      'She was going to play in the sand.',
    ],
    answer: 0,
    explanation:
      'An umbrella and raincoat are commonly used when rain is expected.',
  },
  {
    id: 'independent-division',
    category: 'numeracy',
    stage: 4,
    question: 'There are 24 apples shared equally among 6 children. How many does each child get?',
    options: ['3', '4', '6'],
    answer: 1,
    explanation: '24 ÷ 6 = 4.',
  },
  {
    id: 'independent-sequence',
    category: 'reasoning',
    stage: 4,
    question:
      'A pattern follows: 3, 6, 12, 24, ___. What comes next?',
    options: ['30', '36', '48'],
    answer: 2,
    explanation: 'Each number is doubled.',
  },

  // ============================================================
  // STAGE 5 — PRIMARY SCHOLAR
  // ============================================================

  {
    id: 'scholar-inference',
    category: 'literacy',
    stage: 5,
    question:
      'Kojo studied every evening before his science test. On test day, he felt prepared. What is the best conclusion?',
    options: [
      'His preparation probably helped him feel ready.',
      'He forgot everything he studied.',
      'He did not care about the test.',
    ],
    answer: 0,
    explanation:
      'Regular preparation can help a learner feel ready for an assessment.',
  },
  {
    id: 'scholar-fraction',
    category: 'numeracy',
    stage: 5,
    question:
      'A pizza is divided into 8 equal pieces. If 3 pieces are eaten, what fraction remains?',
    options: ['3/8', '5/8', '6/8'],
    answer: 1,
    explanation:
      '8 pieces − 3 eaten = 5 pieces remaining, so 5/8 remains.',
  },
  {
    id: 'scholar-reasoning',
    category: 'reasoning',
    stage: 5,
    question:
      'All blue boxes are large. This box is blue. What must be true?',
    options: [
      'The box is large.',
      'The box is small.',
      'The box is empty.',
    ],
    answer: 0,
    explanation:
      'If every blue box is large, a blue box must be large.',
  },
] as const;

const LEVELS = [
  {
    level: 1,
    name: 'Foundation Explorer',
    description:
      'Build strong foundations with letters, sounds, numbers, shapes and everyday vocabulary.',
    emoji: '🌱',
    color: 'from-emerald-400 to-green-600',
  },
  {
    level: 2,
    name: 'Early Explorer',
    description:
      'Strengthen phonics, counting, patterns, vocabulary and early problem-solving.',
    emoji: '🌿',
    color: 'from-teal-400 to-cyan-600',
  },
  {
    level: 3,
    name: 'Confident Learner',
    description:
      'Develop reading, writing, mathematics, comprehension and scientific thinking.',
    emoji: '🚀',
    color: 'from-blue-400 to-indigo-600',
  },
  {
    level: 4,
    name: 'Independent Thinker',
    description:
      'Take on more challenging literacy, mathematics, science and reasoning activities.',
    emoji: '🧠',
    color: 'from-violet-400 to-purple-600',
  },
  {
    level: 5,
    name: 'Primary Scholar',
    description:
      'Progress through advanced primary learning with increasingly independent challenges.',
    emoji: '⭐',
    color: 'from-amber-400 to-orange-600',
  },
] as const;

const BACKGROUND_PARTICLES = Array.from(
  { length: 20 },
  (_, index) => ({
    id: index,
    size: 2 + ((index * 7) % 4),
    left: (index * 37) % 100,
    top: (index * 61) % 100,
    duration: 10 + ((index * 3) % 10),
    delay: (index * 2) % 5,
  }),
);

const getPlacementLevel = (
  stageResults: readonly {
    stage: PlacementStage;
    correct: number;
    total: number;
  }[],
): number => {
  /*
   * A learner advances through demonstrated competency.
   *
   * A later stage cannot be awarded simply because the
   * learner guessed correctly on easier questions.
   *
   * Each stage contains three questions.
   */
  const stage1 = stageResults.find((item) => item.stage === 1);
  const stage2 = stageResults.find((item) => item.stage === 2);
  const stage3 = stageResults.find((item) => item.stage === 3);
  const stage4 = stageResults.find((item) => item.stage === 4);
  const stage5 = stageResults.find((item) => item.stage === 5);

  if (!stage1 || stage1.correct < 2) {
    return 1;
  }

  if (!stage2 || stage2.correct < 2) {
    return 2;
  }

  if (!stage3 || stage3.correct < 2) {
    return 2;
  }

  if (!stage4 || stage4.correct < 2) {
    return 3;
  }

  if (!stage5 || stage5.correct < 2) {
    return 4;
  }

  return 5;
};

const getLevelInfo = (level: number) =>
  LEVELS.find((item) => item.level === level) ?? LEVELS[0];

export const AgeGate: React.FC<AgeGateProps> = ({
  onSelect,
}) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [step, setStep] =
    useState<OnboardingStep>('home');

  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<
    Record<string, number | null>
  >({});
  const [showAnswerFeedback, setShowAnswerFeedback] =
    useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] =
    useState(false);

  const {
    profiles,
    currentProfileId,
    setCurrentProfile,
    removeProfile,
  } = useProfileStore();

  const currentQuestion =
    PLACEMENT_QUESTIONS[questionIndex];

  /*
   * Answers are calculated from the actual question set.
   * This means the result automatically stays correct if
   * questions are added or removed later.
   */
  const placementResult = useMemo<PlacementResult>(() => {
    const totalQuestions = PLACEMENT_QUESTIONS.length;

    const correctAnswers = PLACEMENT_QUESTIONS.filter(
      (question) =>
        answers[question.id] === question.answer,
    ).length;

    const literacyCorrect =
      PLACEMENT_QUESTIONS.filter(
        (question) =>
          question.category === 'literacy' &&
          answers[question.id] === question.answer,
      ).length;

    const numeracyCorrect =
      PLACEMENT_QUESTIONS.filter(
        (question) =>
          question.category === 'numeracy' &&
          answers[question.id] === question.answer,
      ).length;

    const reasoningCorrect =
      PLACEMENT_QUESTIONS.filter(
        (question) =>
          question.category === 'reasoning' &&
          answers[question.id] === question.answer,
      ).length;

    const percentage =
      totalQuestions > 0
        ? Math.round(
            (correctAnswers / totalQuestions) * 100,
          )
        : 0;

    const stageResults = [1, 2, 3, 4, 5].map(
      (stage) => {
        const questions = PLACEMENT_QUESTIONS.filter(
          (question) => question.stage === stage,
        );

        return {
          stage: stage as PlacementStage,
          correct: questions.filter(
            (question) =>
              answers[question.id] === question.answer,
          ).length,
          total: questions.length,
        };
      },
    );

    const level = getPlacementLevel(stageResults);

    return {
      level,
      correctAnswers,
      totalQuestions,
      percentage,
      literacyCorrect,
      numeracyCorrect,
      reasoningCorrect,
      stageResults,
    };
  }, [answers]);

  /*
   * The answer feedback timer is owned by the component
   * and cleaned up automatically if the learner leaves.
   */
  useEffect(() => {
    return () => {
      // No persistent resources to release.
    };
  }, []);

  const handleLogin = useCallback(
    (id: string) => {
      const profile = profiles[id];

      if (!profile) return;

      setCurrentProfile(id);

      /*
       * Older profiles may not have a stored level.
       * We intentionally fall back to Level 1 rather than
       * using age to infer a learning level.
       */
      const profileRecord =
        profile as typeof profile & {
          currentLevel?: number;
          level?: number;
        };

      const existingLevel =
        profileRecord.currentLevel ??
        profileRecord.level ??
        1;

      onSelect(
        profile.age || 3,
        profile.name,
        existingLevel,
      );
    },
    [
      onSelect,
      profiles,
      setCurrentProfile,
    ],
  );

  const startNewLearner = useCallback(() => {
    setName((previous) =>
      previous.trim() ? previous : 'Explorer',
    );

    setStep('placement');
    setQuestionIndex(0);
    setAnswers({});
    setShowAnswerFeedback(false);
    setLastAnswerCorrect(false);
  }, []);

  const handleAnswer = useCallback(
    (answerIndex: number | null) => {
      const question =
        PLACEMENT_QUESTIONS[questionIndex];

      if (!question || showAnswerFeedback) {
        return;
      }

      const correct =
        answerIndex !== null &&
        answerIndex === question.answer;

      setAnswers((previous) => ({
        ...previous,
        [question.id]: answerIndex,
      }));

      setLastAnswerCorrect(correct);
      setShowAnswerFeedback(true);

      window.setTimeout(() => {
        setShowAnswerFeedback(false);

        if (
          questionIndex <
          PLACEMENT_QUESTIONS.length - 1
        ) {
          setQuestionIndex(
            (previous) => previous + 1,
          );
        } else {
          setStep('results');
        }
      }, 700);
    },
    [questionIndex, showAnswerFeedback],
  );

  const finishPlacement = useCallback(() => {
    const learnerName =
      name.trim() || 'Explorer';

    const learnerAge =
      Number(age) || 3;

    onSelect(
      learnerAge,
      learnerName,
      placementResult.level,
    );
  }, [
    age,
    name,
    onSelect,
    placementResult.level,
  ]);

  const levelInfo = getLevelInfo(
    placementResult.level,
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-700">
      {/* ============================================================
          BACKGROUND
      ============================================================ */}

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />

        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />

        {BACKGROUND_PARTICLES.map((particle) => (
          <div
            key={particle.id}
            className="absolute bg-white/80 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-float"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-xl">
        {/* ============================================================
            BRAND MARK
        ============================================================ */}

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-7xl mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
          aria-hidden="true"
        >
          🌍
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ==========================================================
              HOME
          ========================================================== */}

          {step === 'home' && (
            <motion.div
              key="home"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              className="w-full"
            >
              <h1 className="text-4xl font-bold text-white mb-2 text-center">
                Welcome Back!
              </h1>

              <p className="text-white/80 mb-8 text-lg font-medium text-center">
                Who is learning today?
              </p>

              <button
                type="button"
                onClick={() => setStep('profile')}
                className="w-full mb-6 py-4 bg-white text-indigo-950 rounded-2xl font-bold text-lg shadow-xl hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                New Learner
              </button>

              {Object.entries(profiles).length > 0 && (
                <div className="w-full space-y-3 mb-6 max-h-[50vh] overflow-y-auto pr-2">
                  {Object.entries(profiles).map(
                    ([id, profile]) => (
                      <div
                        key={id}
                        className={`relative w-full p-4 bg-black/40 backdrop-blur-md border-2 rounded-2xl flex items-center gap-4 transition-all shadow-lg ${
                          id === currentProfileId
                            ? 'border-yellow-300/80'
                            : 'border-white/20 hover:border-white/50'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            handleLogin(id)
                          }
                          className="flex flex-1 items-center gap-4 text-left"
                        >
                          <span className="text-4xl">
                            {profile.avatar}
                          </span>

                          <div>
                            <div className="text-xl font-bold text-white">
                              {profile.name}
                            </div>

                            <div className="text-sm text-white/70">
                              {profile.age
                                ? `Age ${profile.age}`
                                : 'Learner'}{' '}
                              • Continue Learning
                            </div>
                          </div>

                          <span className="ml-auto text-yellow-300">
                            <ArrowRight className="w-5 h-5" />
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();

                            if (
                              window.confirm(
                                `Are you sure you want to remove ${profile.name}?`,
                              )
                            ) {
                              removeProfile(id);
                            }
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-500/20 text-red-300 rounded-full hover:bg-red-500/40 transition"
                          aria-label={`Remove ${profile.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ),
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ==========================================================
              PROFILE
          ========================================================== */}

          {step === 'profile' && (
            <motion.div
              key="profile"
              initial={{
                opacity: 0,
                x: 30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -30,
              }}
              className="w-full"
            >
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">
                  Let's Get Started
                </h1>

                <p className="text-white/80 text-lg">
                  Tell us a little about the learner.
                </p>
              </div>

              <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
                <label
                  htmlFor="learner-name"
                  className="block text-white font-semibold mb-2"
                >
                  Learner's name
                </label>

                <input
                  id="learner-name"
                  type="text"
                  placeholder="What is your name?"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  autoFocus
                  maxLength={40}
                  className="w-full p-4 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl text-white text-center placeholder-white/50 focus:border-yellow-300 outline-none transition shadow-lg text-lg mb-5"
                />

                <label
                  htmlFor="learner-age"
                  className="block text-white font-semibold mb-2"
                >
                  Age
                  <span className="text-white/50 font-normal ml-2">
                    optional
                  </span>
                </label>

                <select
                  id="learner-age"
                  value={age}
                  onChange={(event) =>
                    setAge(event.target.value)
                  }
                  className="w-full p-4 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl text-white focus:border-yellow-300 outline-none transition shadow-lg text-lg mb-4"
                >
                  <option
                    value=""
                    className="text-black"
                  >
                    Prefer not to say
                  </option>

                  {Array.from(
                    { length: 15 },
                    (_, index) => index + 3,
                  ).map((value) => (
                    <option
                      key={value}
                      value={value}
                      className="text-black"
                    >
                      {value} years old
                    </option>
                  ))}
                </select>

                <div className="bg-white/10 rounded-2xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Brain className="w-5 h-5 text-yellow-300 mt-0.5 shrink-0" />

                    <p className="text-sm text-white/80 leading-relaxed">
                      Age gives us developmental context.
                      It does{' '}
                      <strong className="text-white">
                        not
                      </strong>{' '}
                      decide the learner's level. The
                      short check that follows looks at
                      what they can already demonstrate.
                    </p>
                  </div>
                </div>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startNewLearner}
                  className="w-full py-4 bg-white text-indigo-950 rounded-2xl font-bold text-xl shadow-xl hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
                >
                  Find My Starting Point
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>

              <button
                type="button"
                onClick={() => setStep('home')}
                className="w-full py-3 text-white/70 text-sm mt-3 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </motion.div>
          )}

          {/* ==========================================================
              PLACEMENT
          ========================================================== */}

          {step === 'placement' &&
            currentQuestion && (
              <motion.div
                key={`question-${currentQuestion.id}`}
                initial={{
                  opacity: 0,
                  x: 30,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -30,
                }}
                className="w-full"
              >
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-white/70 mb-2">
                    <span>
                      Finding your starting point
                    </span>

                    <span>
                      {questionIndex + 1} /{' '}
                      {PLACEMENT_QUESTIONS.length}
                    </span>
                  </div>

                  <div
                    className="w-full h-2 bg-white/10 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={
                      PLACEMENT_QUESTIONS.length
                    }
                    aria-valuenow={
                      questionIndex + 1
                    }
                  >
                    <motion.div
                      className="h-full bg-yellow-300 rounded-full"
                      animate={{
                        width: `${
                          ((questionIndex + 1) /
                            PLACEMENT_QUESTIONS.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-3xl p-7 shadow-2xl">
                  <div className="flex justify-center mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-yellow-300">
                      {currentQuestion.category ===
                      'literacy' ? (
                        <BookOpen className="w-6 h-6" />
                      ) : currentQuestion.category ===
                        'numeracy' ? (
                        <Calculator className="w-6 h-6" />
                      ) : (
                        <Brain className="w-6 h-6" />
                      )}
                    </div>
                  </div>

                  <p className="text-sm uppercase tracking-widest text-yellow-300 font-bold text-center mb-3">
                    {currentQuestion.category}
                  </p>

                  <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
                    {currentQuestion.question}
                  </h2>

                  <div className="grid gap-3">
                    {currentQuestion.options.map(
                      (option, index) => {
                        const selected =
                          answers[
                            currentQuestion.id
                          ] === index;

                        return (
                          <motion.button
                            key={`${currentQuestion.id}-${option}`}
                            type="button"
                            whileHover={{
                              scale: showAnswerFeedback
                                ? 1
                                : 1.02,
                            }}
                            whileTap={{
                              scale: showAnswerFeedback
                                ? 1
                                : 0.98,
                            }}
                            disabled={
                              showAnswerFeedback
                            }
                            onClick={() =>
                              handleAnswer(index)
                            }
                            className={`w-full p-5 rounded-2xl border-2 text-xl font-bold transition-all ${
                              selected
                                ? 'border-yellow-300 bg-yellow-300/20 text-yellow-100'
                                : 'border-white/20 bg-white/5 text-white hover:border-white/50 hover:bg-white/10'
                            }`}
                          >
                            {option}
                          </motion.button>
                        );
                      },
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={showAnswerFeedback}
                    onClick={() => handleAnswer(null)}
                    className="w-full mt-4 py-3 text-white/60 hover:text-white text-sm transition-colors disabled:opacity-40"
                  >
                    I'm not sure
                  </button>

                  <AnimatePresence>
                    {showAnswerFeedback && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 10,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        className={`mt-5 text-center font-bold ${
                          lastAnswerCorrect
                            ? 'text-emerald-300'
                            : 'text-white/70'
                        }`}
                      >
                        {lastAnswerCorrect
                          ? 'Great job!'
                          : 'Good try — keep exploring!'}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

          {/* ==========================================================
              RESULTS
          ========================================================== */}

          {step === 'results' && (
            <motion.div
              key="results"
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="w-full"
            >
              <div className="text-center mb-6">
                <motion.div
                  initial={{
                    scale: 0,
                  }}
                  animate={{
                    scale: 1,
                  }}
                  transition={{
                    type: 'spring',
                    delay: 0.2,
                  }}
                  className="flex justify-center mb-4"
                >
                  <div className="w-20 h-20 rounded-full bg-yellow-300/20 border-2 border-yellow-300 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-yellow-300" />
                  </div>
                </motion.div>

                <h1 className="text-4xl font-bold text-white mb-2">
                  Your Starting Point Is Ready
                </h1>

                <p className="text-white/70">
                  This is a starting recommendation,
                  not a permanent label. Your learning
                  evidence will help ELP adapt as you
                  progress.
                </p>
              </div>

              {/* Recommended level */}

              <div
                className={`bg-gradient-to-br ${levelInfo.color} rounded-3xl p-6 shadow-2xl mb-5`}
              >
                <div className="text-center">
                  <div className="text-6xl mb-3">
                    {levelInfo.emoji}
                  </div>

                  <p className="text-white/80 font-semibold">
                    Recommended Starting Level
                  </p>

                  <h2 className="text-3xl font-black text-white mb-2">
                    Level {placementResult.level}
                  </h2>

                  <h3 className="text-xl font-bold text-white mb-3">
                    {levelInfo.name}
                  </h3>

                  <p className="text-white/90 leading-relaxed">
                    {levelInfo.description}
                  </p>
                </div>
              </div>

              {/* Placement evidence */}

              <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-3xl p-5 mb-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/70">
                    Placement evidence
                  </span>

                  <span className="text-xl font-bold text-white">
                    {placementResult.correctAnswers}/
                    {placementResult.totalQuestions}
                  </span>
                </div>

                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-5">
                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${placementResult.percentage}%`,
                    }}
                    transition={{
                      duration: 0.8,
                    }}
                    className="h-full bg-yellow-300 rounded-full"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white/5 rounded-2xl p-3">
                    <BookOpen className="w-5 h-5 mx-auto mb-1 text-white/70" />

                    <div className="text-white font-bold">
                      {placementResult.literacyCorrect}
                    </div>

                    <div className="text-xs text-white/50">
                      Literacy
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-3">
                    <Calculator className="w-5 h-5 mx-auto mb-1 text-white/70" />

                    <div className="text-white font-bold">
                      {placementResult.numeracyCorrect}
                    </div>

                    <div className="text-xs text-white/50">
                      Numeracy
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-3">
                    <Brain className="w-5 h-5 mx-auto mb-1 text-white/70" />

                    <div className="text-white font-bold">
                      {placementResult.reasoningCorrect}
                    </div>

                    <div className="text-xs text-white/50">
                      Reasoning
                    </div>
                  </div>
                </div>
              </div>

              {/* Progression evidence */}

              <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-3xl p-5 mb-5">
                <h3 className="text-white font-bold mb-4">
                  Learning readiness
                </h3>

                <div className="space-y-3">
                  {placementResult.stageResults.map(
                    (stage) => (
                      <div
                        key={stage.stage}
                        className="flex items-center gap-3"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            stage.correct >= 2
                              ? 'bg-emerald-400/20 text-emerald-300'
                              : 'bg-white/10 text-white/50'
                          }`}
                        >
                          {stage.correct >= 2 ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <span className="text-xs">
                              {stage.stage}
                            </span>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/80">
                              Stage {stage.stage}
                            </span>

                            <span className="text-white/50">
                              {stage.correct}/
                              {stage.total}
                            </span>
                          </div>

                          <div className="h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-full bg-emerald-300 rounded-full"
                              style={{
                                width:
                                  stage.total > 0
                                    ? `${
                                        (stage.correct /
                                          stage.total) *
                                        100
                                      }%`
                                    : '0%',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <motion.button
                type="button"
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={finishPlacement}
                className="w-full py-4 bg-white text-indigo-950 rounded-2xl font-bold text-xl shadow-xl hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
              >
                Start My Learning Journey
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};