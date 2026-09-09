import React, { useMemo, useState } from 'react';
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
   * age = learner age (context only, not used as the learning level)
   * name = learner name
   * level = recommended starting learning level
   */
  onSelect: (age: number, name: string, level?: number) => void;
}

type OnboardingStep =
  | 'home'
  | 'profile'
  | 'placement'
  | 'results';

interface PlacementQuestion {
  id: string;
  category: 'literacy' | 'numeracy' | 'reasoning';
  question: string;
  options: string[];
  answer: number;
  icon: React.ReactNode;
}

const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  {
    id: 'letter-b',
    category: 'literacy',
    question: 'Which letter is this?',
    options: ['B', 'D', 'P'],
    answer: 0,
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    id: 'letter-sound',
    category: 'literacy',
    question: 'Which word starts with the sound "B"?',
    options: ['Ball', 'Sun', 'Cat'],
    answer: 0,
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    id: 'number',
    category: 'numeracy',
    question: 'Which number is this?',
    options: ['5', '2', '8'],
    answer: 0,
    icon: <Calculator className="w-5 h-5" />,
  },
  {
    id: 'counting',
    category: 'numeracy',
    question: 'What comes after 5?',
    options: ['4', '6', '8'],
    answer: 1,
    icon: <Calculator className="w-5 h-5" />,
  },
  {
    id: 'addition',
    category: 'numeracy',
    question: 'What is 2 + 1?',
    options: ['2', '3', '4'],
    answer: 1,
    icon: <Calculator className="w-5 h-5" />,
  },
  {
    id: 'pattern',
    category: 'reasoning',
    question: 'What comes next?',
    options: ['🔴', '🔵', '🟢'],
    answer: 0,
    icon: <Brain className="w-5 h-5" />,
  },
];

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
];

export const AgeGate: React.FC<AgeGateProps> = ({ onSelect }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [step, setStep] = useState<OnboardingStep>('home');

  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);

  const {
    profiles,
    currentProfileId,
    setCurrentProfile,
    removeProfile,
  } = useProfileStore();

  /**
   * Calculate the learner's placement level.
   *
   * IMPORTANT:
   * Age does NOT determine the level.
   *
   * The level is primarily determined by demonstrated knowledge.
   */
  const placementResult = useMemo(() => {
    const totalQuestions = PLACEMENT_QUESTIONS.length;

    const correctAnswers = PLACEMENT_QUESTIONS.filter(
      (question) => answers[question.id] === question.answer
    ).length;

    const literacyCorrect = PLACEMENT_QUESTIONS.filter(
      (question) =>
        question.category === 'literacy' &&
        answers[question.id] === question.answer
    ).length;

    const numeracyCorrect = PLACEMENT_QUESTIONS.filter(
      (question) =>
        question.category === 'numeracy' &&
        answers[question.id] === question.answer
    ).length;

    const reasoningCorrect = PLACEMENT_QUESTIONS.filter(
      (question) =>
        question.category === 'reasoning' &&
        answers[question.id] === question.answer
    ).length;

    const percentage = Math.round(
      (correctAnswers / totalQuestions) * 100
    );

    let level = 1;

    if (percentage >= 85) {
      level = 4;
    } else if (percentage >= 65) {
      level = 3;
    } else if (percentage >= 40) {
      level = 2;
    } else {
      level = 1;
    }

    /**
     * Prevent a learner from being placed too high
     * when both literacy and numeracy foundations are weak.
     */
    if (literacyCorrect === 0 && numeracyCorrect === 0) {
      level = 1;
    }

    /**
     * A learner who demonstrates strong foundational
     * literacy AND numeracy can skip Level 1.
     */
    if (literacyCorrect >= 2 && numeracyCorrect >= 2 && level < 3) {
      level = 3;
    }

    const levelInfo =
      LEVELS.find((item) => item.level === level) || LEVELS[0];

    return {
      level,
      levelInfo,
      correctAnswers,
      totalQuestions,
      percentage,
      literacyCorrect,
      numeracyCorrect,
      reasoningCorrect,
    };
  }, [answers]);

  const handleLogin = (id: string) => {
    const profile = profiles[id];

    if (!profile) return;

    setCurrentProfile(id);

    /**
     * Existing profiles may not have a currentLevel yet.
     * Until the store is upgraded, use Level 1 as fallback.
     */
    const existingLevel =
      (profile as any).currentLevel ||
      (profile as any).level ||
      1;

    onSelect(profile.age || 3, profile.name, existingLevel);
  };

  const startNewLearner = () => {
    if (!name.trim()) {
      setName('Explorer');
    }

    setStep('placement');
    setQuestionIndex(0);
    setAnswers({});
    setShowAnswerFeedback(false);
  };

  const handleAnswer = (answerIndex: number) => {
    const question = PLACEMENT_QUESTIONS[questionIndex];

    if (!question) return;

    const correct = answerIndex === question.answer;

    setAnswers((previous) => ({
      ...previous,
      [question.id]: answerIndex,
    }));

    setLastAnswerCorrect(correct);
    setShowAnswerFeedback(true);

    /**
     * Give the learner a short moment of feedback
     * before moving to the next question.
     */
    setTimeout(() => {
      setShowAnswerFeedback(false);

      if (questionIndex < PLACEMENT_QUESTIONS.length - 1) {
        setQuestionIndex((previous) => previous + 1);
      } else {
        setStep('results');
      }
    }, 650);
  };

  const finishPlacement = () => {
    const learnerName = name.trim() || 'Explorer';

    const learnerAge = Number(age) || 3;

    onSelect(
      learnerAge,
      learnerName,
      placementResult.level
    );
  };

  const currentQuestion =
    PLACEMENT_QUESTIONS[questionIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-700">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />

        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />

        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/80 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-float"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-xl">
        {/* Logo / Mascot */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-7xl mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
        >
          🌍
        </motion.div>

        <AnimatePresence mode="wait">
          {/* =========================================================
              HOME
          ========================================================= */}
          {step === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <h1 className="text-4xl font-bold text-white mb-2 text-center drop-shadow-lg">
                Welcome Back!
              </h1>

              <p className="text-white/80 mb-8 text-lg font-medium text-center">
                Who is learning today?
              </p>

              <button
                onClick={() => setStep('profile')}
                className="w-full mb-6 py-4 bg-white text-indigo-950 rounded-2xl font-bold text-lg shadow-xl hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                New Learner
              </button>

              {Object.entries(profiles).length > 0 && (
                <div className="w-full space-y-3 mb-6 max-h-[50vh] overflow-y-auto pr-2">
                  {Object.entries(profiles).map(([id, profile]) => (
                    <div
                      key={id}
                      className={`relative w-full p-4 bg-black/40 backdrop-blur-md border-2 rounded-2xl flex items-center gap-4 transition-all shadow-lg ${
                        id === currentProfileId
                          ? 'border-yellow-300/80'
                          : 'border-white/20 hover:border-white/50'
                      }`}
                    >
                      <button
                        onClick={() => handleLogin(id)}
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
                        onClick={(event) => {
                          event.stopPropagation();

                          if (
                            confirm(
                              `Are you sure you want to remove ${profile.name}?`
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
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* =========================================================
              PROFILE
          ========================================================= */}
          {step === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="w-full"
            >
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">
                  Let's Get Started! 🚀
                </h1>

                <p className="text-white/80 text-lg">
                  Tell us a little about the learner.
                </p>
              </div>

              <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
                {/* Name */}
                <label className="block text-white font-semibold mb-2">
                  Learner's name
                </label>

                <input
                  type="text"
                  placeholder="What is your name?"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  autoFocus
                  className="w-full p-4 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl text-white text-center placeholder-white/50 focus:border-yellow-300 outline-none transition shadow-lg text-lg mb-5"
                />

                {/* Age */}
                <label className="block text-white font-semibold mb-2">
                  Age
                  <span className="text-white/50 font-normal ml-2">
                    optional
                  </span>
                </label>

                <select
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                  className="w-full p-4 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl text-white focus:border-yellow-300 outline-none transition shadow-lg text-lg mb-4"
                >
                  <option value="" className="text-black">
                    Prefer not to say
                  </option>

                  {Array.from(
                    { length: 15 },
                    (_, index) => index + 3
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
                      Age helps us understand the learner's
                      developmental context. It does{' '}
                      <strong className="text-white">
                        not
                      </strong>{' '}
                      decide their learning level.
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startNewLearner}
                  className="w-full py-4 bg-white text-indigo-950 rounded-2xl font-bold text-xl shadow-xl hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
                >
                  Discover My Level
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>

              <button
                onClick={() => setStep('home')}
                className="w-full py-3 text-white/70 text-sm mt-3 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </motion.div>
          )}

          {/* =========================================================
              PLACEMENT
          ========================================================= */}
          {step === 'placement' && currentQuestion && (
            <motion.div
              key={`question-${currentQuestion.id}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="w-full"
            >
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-white/70 mb-2">
                  <span>
                    Discovering your level
                  </span>

                  <span>
                    {questionIndex + 1} /{' '}
                    {PLACEMENT_QUESTIONS.length}
                  </span>
                </div>

                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-yellow-300 rounded-full"
                    initial={{ width: 0 }}
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
                    {currentQuestion.icon}
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
                        answers[currentQuestion.id] ===
                        index;

                      return (
                        <motion.button
                          key={option}
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
                          disabled={showAnswerFeedback}
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
                    }
                  )}
                </div>

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
                        ? '✨ Great job!'
                        : '🌱 Good try!'}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* =========================================================
              RESULTS
          ========================================================= */}
          {step === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full"
            >
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    delay: 0.2,
                  }}
                  className="flex justify-center mb-4"
                >
                  <div className="w-20 h-20 rounded-full bg-yellow-300/20 border-2 border-yellow-300 flex items-center justify-center">
                    <Star className="w-10 h-10 text-yellow-300 fill-yellow-300" />
                  </div>
                </motion.div>

                <h1 className="text-4xl font-bold text-white mb-2">
                  We Found Your Starting Point!
                </h1>

                <p className="text-white/70">
                  This is a starting point — you can always
                  move forward as you grow.
                </p>
              </div>

              {/* Recommended level */}
              <div
                className={`bg-gradient-to-br ${placementResult.levelInfo.color} rounded-3xl p-6 shadow-2xl mb-5`}
              >
                <div className="text-center">
                  <div className="text-6xl mb-3">
                    {placementResult.levelInfo.emoji}
                  </div>

                  <p className="text-white/80 font-semibold">
                    Recommended Starting Level
                  </p>

                  <h2 className="text-3xl font-black text-white mb-2">
                    Level {placementResult.level}
                  </h2>

                  <h3 className="text-xl font-bold text-white mb-3">
                    {placementResult.levelInfo.name}
                  </h3>

                  <p className="text-white/90 leading-relaxed">
                    {placementResult.levelInfo.description}
                  </p>
                </div>
              </div>

              {/* Score */}
              <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-3xl p-5 mb-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/70">
                    Placement progress
                  </span>

                  <span className="text-xl font-bold text-white">
                    {placementResult.correctAnswers}/
                    {placementResult.totalQuestions}
                  </span>
                </div>

                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${placementResult.percentage}%`,
                    }}
                    transition={{ duration: 0.8 }}
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

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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