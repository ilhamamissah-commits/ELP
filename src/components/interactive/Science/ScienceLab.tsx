import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  RotateCcw,
  Star,
  Target,
  Lightbulb,
  BookOpen,
  FlaskConical,
  Microscope,
  Atom,
  Beaker,
  Shield,
  Eye,
  Search,
  Trophy,
  Sparkles,
  Volume2,
} from 'lucide-react';
import {
  BIOLOGY_EXPERIMENTS,
  PHYSICS_EXPERIMENTS,
  CHEMISTRY_EXPERIMENTS,
  Experiment,
} from '../../../data/scienceData';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

type ScienceType = 'biology' | 'physics' | 'chemistry';

type LearningMode = 'guided' | 'practice' | 'mastery';

type Stage =
  | 'question'
  | 'materials'
  | 'prediction'
  | 'experiment'
  | 'observation'
  | 'challenge'
  | 'reflection'
  | 'complete';

interface ScienceLabProps {
  type: ScienceType;
  onComplete?: (score: number) => void;
}

interface ExperimentProgress {
  attempts: number;
  completed: boolean;
  mastered: boolean;
  bestScore: number;
}

const getExperiments = (type: ScienceType): Experiment[] => {
  if (type === 'biology') return BIOLOGY_EXPERIMENTS;
  if (type === 'physics') return PHYSICS_EXPERIMENTS;
  return CHEMISTRY_EXPERIMENTS;
};

const getScienceTitle = (type: ScienceType) => {
  if (type === 'biology') return 'Biology Lab';
  if (type === 'physics') return 'Physics Lab';
  return 'Chemistry Lab';
};

const getScienceDescription = (type: ScienceType) => {
  if (type === 'biology') {
    return 'Explore living things, plants, animals, the human body and life around us.';
  }
  if (type === 'physics') {
    return 'Discover forces, motion, energy, light, sound, magnets and how things work.';
  }
  return 'Explore matter, materials, mixtures, changes and the building blocks of our world.';
};

const getScienceIcon = (type: ScienceType) => {
  if (type === 'biology') return Microscope;
  if (type === 'physics') return Atom;
  return FlaskConical;
};

const getDifficultyLabel = (level: number) => {
  if (level <= 2) return 'Foundation';
  if (level <= 4) return 'Developing';
  if (level <= 6) return 'Intermediate';
  if (level <= 8) return 'Advanced';
  return 'Mastery';
};

const normalizeExperiment = (experiment: Experiment) => {
  const item = experiment as Experiment & {
    question?: string;
    objective?: string;
    materials?: string[];
    prediction?: {
      question: string;
      options: string[];
      answer: number;
    };
    observation?: {
      question: string;
      options: string[];
      answer: number;
    };
    challenge?: {
      question: string;
      options: string[];
      answer: number;
    };
    explanation?: string;
    keyLearning?: string[];
  };

  return {
    ...item,
    question:
      item.question ||
      `What can we discover from ${item.title.toLowerCase()}?`,
    objective:
      item.objective ||
      item.description ||
      'Explore the science idea and observe what happens.',
    materials: item.materials || [],
    prediction: item.prediction,
    observation: item.observation,
    challenge: item.challenge,
    explanation:
      item.explanation ||
      item.conclusion ||
      'Science helps us understand what happens and why.',
    keyLearning: item.keyLearning || [
      'Scientists observe carefully.',
      'Scientists make predictions.',
      'Scientists learn from evidence.',
    ],
  };
};

export const ScienceLab: React.FC<ScienceLabProps> = ({
  type,
  onComplete,
}) => {
  const experiments = useMemo(() => getExperiments(type), [type]);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak } = useReadAloud();

  const [selectedExperiment, setSelectedExperiment] =
    useState<Experiment | null>(null);

  const [stage, setStage] = useState<Stage>('question');
  const [mode, setMode] = useState<LearningMode>('guided');

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [answerCorrect, setAnswerCorrect] = useState(false);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const [usedHint, setUsedHint] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const [progress, setProgress] = useState<
    Record<string | number, ExperimentProgress>
  >({});

  const [hasFinished, setHasFinished] = useState(false);

  const current = selectedExperiment
    ? normalizeExperiment(selectedExperiment)
    : null;

  const ScienceIcon = getScienceIcon(type);

  const currentProgress = current
    ? progress[current.id] || {
        attempts: 0,
        completed: false,
        mastered: false,
        bestScore: 0,
      }
    : null;

  const totalMastered = Object.values(progress).filter(
    (item) => item.mastered,
  ).length;

  const getQuestionForStage = () => {
    if (!current) return null;
    if (stage === 'prediction') return current.prediction;
    if (stage === 'observation') return current.observation;
    if (stage === 'challenge') return current.challenge;
    return null;
  };

  const question = getQuestionForStage();

  // Auto-read the stage prompt whenever the experiment or stage changes
  useEffect(() => {
    if (!autoReadEnabled || !current) return;

    let readOut = '';

    switch (stage) {
      case 'question':
        readOut = `${current.question}. ${current.objective}`;
        break;
      case 'materials':
        readOut =
          current.materials.length > 0
            ? `Prepare your materials. ${current.materials.join(', ')}.`
            : 'This activity needs no special materials.';
        break;
      case 'prediction':
        readOut = question
          ? `Make a prediction. ${question.question}`
          : 'Make a prediction about what will happen.';
        break;
      case 'experiment':
        readOut = `Run the experiment. ${current.steps.join(' ')}`;
        break;
      case 'observation':
        readOut = question
          ? `Observe carefully. ${question.question}`
          : 'Observe carefully what happened.';
        break;
      case 'challenge':
        readOut = question
          ? `Science challenge. ${question.question}`
          : 'Science challenge.';
        break;
      case 'reflection':
        readOut = `Think about your discovery. Key learning: ${current.keyLearning.join(' ')}`;
        break;
      case 'complete':
        readOut = `Experiment complete! ${current.keyLearning.join(' ')}`;
        break;
    }

    if (!readOut) return;

    const timer = window.setTimeout(() => speak(readOut), 350);
    return () => window.clearTimeout(timer);
  }, [stage, current, question, speak, autoReadEnabled]);

  // Read hint when it opens
  useEffect(() => {
    if (showHint) {
      speak(
        'Think carefully about what you observed. Scientists use evidence rather than simply guessing.',
      );
    }
  }, [showHint, speak]);

  const selectExperiment = (experiment: Experiment) => {
    setSelectedExperiment(experiment);
    setStage('question');
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setAnswerCorrect(false);
    setUsedHint(false);
    setShowHint(false);

    if (soundEnabled) playSoundFeedback('move');
  };

  const resetExperimentState = () => {
    setStage('question');
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setAnswerCorrect(false);
    setUsedHint(false);
    setShowHint(false);
  };

  const returnToList = () => {
    setSelectedExperiment(null);
    resetExperimentState();
  };

  const resetAll = () => {
    setSelectedExperiment(null);
    setProgress({});
    setScore(0);
    setStreak(0);
    setStage('question');
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setAnswerCorrect(false);
    setUsedHint(false);
    setShowHint(false);
    setHasFinished(false);

    speak('Progress reset. Choose an experiment to begin again.');
  };

  const updateProgress = (
    experimentId: string | number,
    updater: (previous: ExperimentProgress) => ExperimentProgress,
  ) => {
    setProgress((previous) => {
      const currentProgress = previous[experimentId] || {
        attempts: 0,
        completed: false,
        mastered: false,
        bestScore: 0,
      };

      return {
        ...previous,
        [experimentId]: updater(currentProgress),
      };
    });
  };

  const awardCompletion = () => {
    if (!current || currentProgress?.mastered) return;

    const basePoints = 10;
    const streakBonus = mode === 'mastery' && streak >= 2 ? 5 : 0;
    const hintPenalty = usedHint ? 5 : 0;

    const earned = Math.max(5, basePoints + streakBonus - hintPenalty);

    setScore((previous) => previous + earned);
    setStreak((previous) => previous + 1);

    updateProgress(current.id, (previous) => ({
      ...previous,
      completed: true,
      mastered: true,
      bestScore: Math.max(previous.bestScore, earned),
    }));
  };

  const checkAnswer = () => {
    if (!question || selectedAnswer === null || answerChecked) return;

    const correct = selectedAnswer === question.answer;

    setAnswerChecked(true);
    setAnswerCorrect(correct);

    if (current) {
      updateProgress(current.id, (previous) => ({
        ...previous,
        attempts: previous.attempts + 1,
      }));
    }

    if (correct) {
      if (soundEnabled) playSoundFeedback('correct');
      speak(`Correct! ${current.explanation}`);

      if (stage === 'challenge' || mode !== 'mastery') {
        awardCompletion();
      }
    } else {
      if (soundEnabled) playSoundFeedback('try-again');
      setStreak(0);

      speak(
        'Not quite. Scientists sometimes make predictions that do not match the result. That is part of learning. Look carefully at the evidence and try again.',
      );
    }
  };

  const moveToNextStage = () => {
    if (!current) return;

    setSelectedAnswer(null);
    setAnswerChecked(false);
    setAnswerCorrect(false);
    setShowHint(false);

    if (stage === 'question') {
      setStage(current.materials.length > 0 ? 'materials' : 'prediction');
      return;
    }
    if (stage === 'materials') {
      setStage('prediction');
      return;
    }
    if (stage === 'prediction') {
      setStage('experiment');
      return;
    }
    if (stage === 'experiment') {
      setStage(
        current.observation
          ? 'observation'
          : current.challenge
            ? 'challenge'
            : 'reflection',
      );
      return;
    }
    if (stage === 'observation') {
      setStage(current.challenge ? 'challenge' : 'reflection');
      return;
    }
    if (stage === 'challenge') {
      setStage('reflection');
      return;
    }
    if (stage === 'reflection') {
      setStage('complete');
    }
  };

  const goBackStage = () => {
    if (stage === 'materials') {
      setStage('question');
    } else if (stage === 'prediction') {
      setStage(current?.materials.length ? 'materials' : 'question');
    } else if (stage === 'experiment') {
      setStage('prediction');
    } else if (stage === 'observation') {
      setStage('experiment');
    } else if (stage === 'challenge') {
      setStage(current?.observation ? 'observation' : 'experiment');
    } else if (stage === 'reflection') {
      setStage(current?.challenge ? 'challenge' : 'experiment');
    }
  };

  const finishAndMoveUp = () => {
    if (hasFinished) return;
    setHasFinished(true);
    onComplete?.(score);

    speak(`Well done! You earned ${score} science points.`);
  };

  const stageLabels: { id: Stage; label: string }[] = [
    { id: 'question', label: 'Question' },
    { id: 'materials', label: 'Prepare' },
    { id: 'prediction', label: 'Predict' },
    { id: 'experiment', label: 'Explore' },
    { id: 'observation', label: 'Observe' },
    { id: 'challenge', label: 'Challenge' },
    { id: 'reflection', label: 'Reflect' },
  ];

  if (!selectedExperiment) {
    return (
      <div className="max-w-5xl w-full mx-auto bg-app-card/90 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8 relative overflow-hidden">
        <div
          className={`absolute inset-0 ${
            type === 'biology'
              ? 'bg-emerald-500/5'
              : type === 'physics'
                ? 'bg-blue-500/5'
                : 'bg-purple-500/5'
          } blur-[100px] -z-10`}
        />

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <ScienceIcon className="w-8 h-8 text-indigo-400" />
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white">
                  {getScienceTitle(type)}
                </h2>
                <p className="text-gray-400 text-sm">STEM Discovery Academy</p>
              </div>
            </div>

            <p className="text-gray-400 max-w-2xl">
              {getScienceDescription(type)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
              <div className="text-yellow-400 font-bold text-xl">{score}</div>
              <div className="text-[10px] text-gray-500 uppercase">
                Science Points
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
              <div className="text-emerald-400 font-bold text-xl">
                {totalMastered}
              </div>
              <div className="text-[10px] text-gray-500 uppercase">
                Mastered
              </div>
            </div>

            <button
              type="button"
              onClick={toggleSound}
              aria-label="Toggle sound"
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <Volume2
                className={`w-5 h-5 ${
                  soundEnabled ? 'text-amber-300' : 'text-gray-500'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-3">
          {(['guided', 'practice', 'mastery'] as LearningMode[]).map(
            (learningMode) => (
              <button
                key={learningMode}
                onClick={() => {
                  setMode(learningMode);
                  speak(
                    learningMode === 'guided'
                      ? 'Guided mode. Learn with step-by-step support.'
                      : learningMode === 'practice'
                        ? 'Practice mode. Practise what you discovered.'
                        : 'Mastery mode. Test your understanding independently.',
                  );
                }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  mode === learningMode
                    ? 'bg-indigo-500/15 border-indigo-400/60'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="font-bold text-white capitalize">
                  {learningMode}
                </div>

                <div className="text-xs text-gray-400 mt-1">
                  {learningMode === 'guided' &&
                    'Learn with step-by-step support.'}
                  {learningMode === 'practice' &&
                    'Practice what you discovered.'}
                  {learningMode === 'mastery' &&
                    'Test your understanding independently.'}
                </div>
              </button>
            ),
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">
              Choose an Experiment
            </h3>

            <p className="text-sm text-gray-500">
              All experiments remain available. Progress through them as your
              understanding grows.
            </p>
          </div>

          <button
            onClick={resetAll}
            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            title="Reset progress"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {experiments.length === 0 ? (
          <div className="py-16 text-center">
            <FlaskConical className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg">
              No experiments available yet
            </h3>
            <p className="text-gray-500 text-sm mt-2">
              Add experiments to scienceData.ts to populate this laboratory.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {experiments.map((experiment) => {
              const item = normalizeExperiment(experiment);
              const itemProgress = progress[item.id];

              return (
                <motion.button
                  key={item.id}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectExperiment(experiment)}
                  className="group text-left p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-400/50 transition-all relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors" />

                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
                        <FlaskConical className="w-6 h-6" />
                      </div>

                      {itemProgress?.mastered ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-gray-400">
                          Level {item.level}
                        </span>
                      )}
                    </div>

                    <h4 className="text-white font-bold text-lg mb-1">
                      {item.title}
                    </h4>

                    <p className="text-gray-400 text-sm line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-indigo-300">
                        {getDifficultyLabel(item.level)}
                      </span>

                      <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition-colors" />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (!current) return null;

  if (stage === 'complete') {
    const mastered = progress[current.id]?.mastered ?? false;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl w-full mx-auto bg-app-card border border-white/10 rounded-3xl shadow-2xl p-8 text-center"
      >
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center mb-5">
          <Trophy className="w-10 h-10 text-yellow-400" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">
          Experiment Complete!
        </h2>

        <p className="text-gray-400 max-w-xl mx-auto">
          You followed the scientific process, made observations, and tested
          your understanding.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
          <div className="bg-white/5 rounded-2xl p-4">
            <div className="text-yellow-400 text-2xl font-bold">
              +{currentProgress?.bestScore ?? 0}
            </div>
            <div className="text-xs text-gray-500">Best Points</div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4">
            <div className="text-indigo-400 text-2xl font-bold">
              {currentProgress?.attempts ?? 0}
            </div>
            <div className="text-xs text-gray-500">Attempts</div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4">
            <div className="text-emerald-400 text-2xl font-bold">
              {mastered ? 'Yes' : 'Keep Going'}
            </div>
            <div className="text-xs text-gray-500">Mastered</div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4">
            <div className="text-purple-400 text-2xl font-bold">{streak}</div>
            <div className="text-xs text-gray-500">Streak</div>
          </div>
        </div>

        <div className="mt-8 p-5 bg-indigo-500/5 border border-indigo-400/20 rounded-2xl text-left">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h3 className="font-bold text-white">What You Learned</h3>
          </div>

          <div className="space-y-2">
            {current.keyLearning.map((point, index) => (
              <div key={index} className="flex gap-3 text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            onClick={returnToList}
            className="flex-1 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10"
          >
            Back to Lab
          </button>

          <button
            onClick={resetExperimentState}
            className="flex-1 px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500"
          >
            Try Again
          </button>

          <button
            onClick={finishAndMoveUp}
            className="flex-1 px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500"
          >
            Finish &amp; Move Up
          </button>
        </div>
      </motion.div>
    );
  }

  const currentStageIndex = stageLabels.findIndex(
    (item) => item.id === stage,
  );

  return (
    <div className="max-w-4xl w-full mx-auto bg-app-card/90 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={returnToList}
            className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="text-xs text-indigo-400 uppercase font-bold tracking-wider">
              {getScienceTitle(type)}
            </div>

            <h2 className="text-2xl font-bold text-white">{current.title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xs text-gray-500">Score</span>
            <span className="ml-2 text-yellow-400 font-bold">{score}</span>
          </div>

          <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xs text-gray-500">Streak</span>
            <span className="ml-2 text-orange-400 font-bold">{streak}</span>
          </div>

          <button
            type="button"
            onClick={toggleSound}
            aria-label="Toggle sound"
            className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <Volume2
              className={`w-5 h-5 ${
                soundEnabled ? 'text-amber-300' : 'text-gray-500'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Scientific Process */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex min-w-max items-center gap-2">
          {stageLabels.map((item, index) => {
            const active = item.id === stage;
            const completed = index < currentStageIndex;

            return (
              <React.Fragment key={item.id}>
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
                    active
                      ? 'bg-indigo-500/15 border-indigo-400/50 text-indigo-300'
                      : completed
                        ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-400'
                        : 'bg-white/[0.03] border-white/10 text-gray-600'
                  }`}
                >
                  {completed ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-current text-[9px] flex items-center justify-center">
                      {index + 1}
                    </span>
                  )}

                  <span className="text-xs font-bold">{item.label}</span>
                </div>

                {index < stageLabels.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-gray-700" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -15 }}
          transition={{ duration: 0.2 }}
        >
          {/* QUESTION */}
          {stage === 'question' && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center mb-5">
                <Target className="w-10 h-10 text-indigo-400" />
              </div>

              <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-2">
                Ask a Scientist
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {current.question}
              </h3>

              <p className="text-gray-400 max-w-2xl mx-auto">
                {current.objective}
              </p>

              <div className="mt-8 p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-left">
                <div className="flex gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-400 shrink-0" />

                  <div>
                    <h4 className="font-bold text-white mb-1">
                      Think Like a Scientist
                    </h4>

                    <p className="text-sm text-gray-400">
                      Scientists begin by asking questions about the world
                      around them.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MATERIALS */}
          {stage === 'materials' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <Beaker className="w-7 h-7 text-amber-400" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Prepare Your Materials
                  </h3>

                  <p className="text-sm text-gray-400">
                    Gather the materials before you begin.
                  </p>
                </div>
              </div>

              {current.materials.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {current.materials.map((material, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3"
                    >
                      <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                        {index + 1}
                      </span>

                      <span className="text-white text-sm">{material}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center text-gray-400">
                  This activity needs no special materials.
                </div>
              )}

              <div className="mt-6 p-4 rounded-xl bg-red-500/5 border border-red-400/20 flex gap-3">
                <Shield className="w-5 h-5 text-red-400 shrink-0" />

                <p className="text-xs text-gray-400">
                  Always perform experiments safely and follow instructions
                  from a parent, teacher, or trusted adult when supervision is
                  needed.
                </p>
              </div>
            </div>
          )}

          {/* PREDICTION / OBSERVATION / CHALLENGE */}
          {(stage === 'prediction' ||
            stage === 'observation' ||
            stage === 'challenge') && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-indigo-500/10">
                  {stage === 'prediction' && (
                    <Lightbulb className="w-7 h-7 text-yellow-400" />
                  )}
                  {stage === 'observation' && (
                    <Eye className="w-7 h-7 text-blue-400" />
                  )}
                  {stage === 'challenge' && (
                    <Target className="w-7 h-7 text-purple-400" />
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {stage === 'prediction' && 'Make a Prediction'}
                    {stage === 'observation' && 'Observe Carefully'}
                    {stage === 'challenge' && 'Science Challenge'}
                  </h3>

                  <p className="text-sm text-gray-400">
                    {stage === 'prediction' &&
                      'What do you think will happen?'}
                    {stage === 'observation' &&
                      'What did you notice during the experiment?'}
                    {stage === 'challenge' &&
                      'Use what you discovered to solve this question.'}
                  </p>
                </div>
              </div>

              {!question ? (
                <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                  <Search className="w-10 h-10 text-gray-600 mx-auto mb-3" />

                  <p className="text-gray-400">
                    This experiment does not yet have a separate {stage}{' '}
                    question.
                  </p>
                </div>
              ) : (
                <>
                  <h4 className="text-xl font-bold text-white mb-5">
                    {question.question}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {question.options.map((option, index) => {
                      const selected = selectedAnswer === index;
                      const correct = question.answer === index;

                      let stateClass =
                        'bg-white/[0.03] border-white/10 hover:border-indigo-400/50';

                      if (answerChecked && correct) {
                        stateClass = 'bg-emerald-500/10 border-emerald-400/60';
                      } else if (answerChecked && selected && !correct) {
                        stateClass = 'bg-red-500/10 border-red-400/60';
                      } else if (selected) {
                        stateClass = 'bg-indigo-500/15 border-indigo-400/60';
                      }

                      return (
                        <button
                          key={index}
                          disabled={answerChecked}
                          onClick={() => setSelectedAnswer(index)}
                          className={`p-5 rounded-2xl border text-left transition-all ${stateClass}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-300 font-bold">
                              {String.fromCharCode(65 + index)}
                            </span>

                            <span className="text-white font-medium">
                              {option}
                            </span>

                            {answerChecked && correct && (
                              <CheckCircle className="w-5 h-5 text-emerald-400 ml-auto" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {answerChecked && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-5 p-5 rounded-2xl border ${
                        answerCorrect
                          ? 'bg-emerald-500/10 border-emerald-400/30'
                          : 'bg-red-500/10 border-red-400/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {answerCorrect ? (
                          <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
                        ) : (
                          <Lightbulb className="w-6 h-6 text-yellow-400 shrink-0" />
                        )}

                        <div>
                          <h4 className="font-bold text-white mb-1">
                            {answerCorrect
                              ? 'Excellent observation!'
                              : 'Keep investigating!'}
                          </h4>

                          <p className="text-sm text-gray-300">
                            {answerCorrect
                              ? current.explanation
                              : 'Scientists sometimes make predictions that do not match the result. That is part of learning. Look carefully at the evidence and try again.'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {!answerChecked && currentProgress && (
                    <button
                      onClick={() => {
                        setShowHint(true);
                        setUsedHint(true);
                      }}
                      className="mt-5 text-sm text-yellow-400 hover:text-yellow-300 flex items-center gap-2"
                    >
                      <Lightbulb className="w-4 h-4" />
                      {showHint ? 'Hint shown' : 'Need a hint?'}
                    </button>
                  )}

                  {showHint && (
                    <div className="mt-3 p-4 rounded-xl bg-yellow-500/5 border border-yellow-400/20 text-sm text-yellow-100">
                      Think carefully about what you observed. Scientists use
                      evidence rather than simply guessing.
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* EXPERIMENT */}
          {stage === 'experiment' && (
            <div>
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center mb-4">
                  <Microscope className="w-10 h-10 text-purple-400" />
                </div>

                <h3 className="text-2xl font-bold text-white">
                  Run the Experiment
                </h3>

                <p className="text-gray-400 text-sm mt-2">
                  Follow each instruction carefully and observe what happens.
                </p>
              </div>

              <div className="space-y-3">
                {current.steps.map((instruction, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10"
                  >
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold shrink-0">
                      {index + 1}
                    </div>

                    <p className="text-white text-sm leading-6">
                      {instruction}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-5 rounded-2xl bg-blue-500/5 border border-blue-400/20">
                <div className="flex gap-3">
                  <Eye className="w-5 h-5 text-blue-400 shrink-0" />

                  <div>
                    <h4 className="font-bold text-white mb-1">
                      Observation Mission
                    </h4>

                    <p className="text-sm text-gray-400">
                      Pay attention to changes in movement, colour, shape,
                      temperature, sound, position, growth or other evidence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REFLECTION */}
          {stage === 'reflection' && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-yellow-500/10 border border-yellow-400/20 flex items-center justify-center mb-5">
                <Star className="w-10 h-10 text-yellow-400" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">
                Think About Your Discovery
              </h3>

              <p className="text-gray-400 max-w-2xl mx-auto">
                Scientists do more than perform experiments. They think about
                what the evidence means.
              </p>

              <div className="mt-7 p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-left">
                <h4 className="font-bold text-white mb-4">Key Learning</h4>

                <div className="space-y-3">
                  {current.keyLearning.map((point, index) => (
                    <div key={index} className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span className="text-sm text-gray-300">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 p-5 rounded-2xl bg-indigo-500/5 border border-indigo-400/20 text-left">
                <div className="flex gap-3">
                  <BookOpen className="w-5 h-5 text-indigo-400 shrink-0" />

                  <div>
                    <h4 className="font-bold text-white mb-1">
                      Scientific Explanation
                    </h4>

                    <p className="text-sm text-gray-300 leading-6">
                      {current.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer Controls */}
      <div className="flex justify-between items-center gap-3 mt-8 pt-6 border-t border-white/10">
        <button
          onClick={goBackStage}
          disabled={stage === 'question'}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </span>
        </button>

        {question && !answerChecked ? (
          <button
            onClick={checkAnswer}
            disabled={selectedAnswer === null}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={moveToNextStage}
            className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500"
          >
            <span className="flex items-center gap-2">
              {stage === 'reflection' ? 'Complete Experiment' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
};