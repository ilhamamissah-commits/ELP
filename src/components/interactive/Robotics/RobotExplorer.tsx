import React, { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle,
  Lightbulb,
  Brain,
  Sparkles,
  Target,
  BookOpen,
  Award,
} from 'lucide-react';
import { ROBOT_PARTS } from './roboticsData';

type ExplorerMode = 'explore' | 'question' | 'complete';

export const RobotExplorer: React.FC = () => {
  const [partIndex, setPartIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [learned, setLearned] = useState<string[]>([]);
  const [mode, setMode] = useState<ExplorerMode>('explore');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [questionCorrect, setQuestionCorrect] = useState<boolean | null>(null);
  const [showTechnical, setShowTechnical] = useState(false);

  const part = ROBOT_PARTS[partIndex];

  const progress = Math.round(
    ((learned.length + (learned.includes(part.id) ? 0 : 0)) /
      ROBOT_PARTS.length) *
      100
  );

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  }, []);

  const speakPart = useCallback(() => {
    speak(
      `${part.name}. ${part.childDescription}`
    );
  }, [part, speak]);

  const markAsLearned = useCallback(() => {
    setLearned((previous) => {
      if (previous.includes(part.id)) return previous;
      return [...previous, part.id];
    });
  }, [part.id]);

  const handleLearn = () => {
    markAsLearned();
    setMode(part.question ? 'question' : 'explore');
  };

  const handleAnswer = (answerIndex: number) => {
    if (!part.question || questionCorrect !== null) return;

    setSelectedAnswer(answerIndex);

    const correct = answerIndex === part.question.answer;
    setQuestionCorrect(correct);

    if (correct) {
      setScore((previous) => previous + 10);
      markAsLearned();
    }
  };

  const nextPart = () => {
    const nextIndex = partIndex + 1;

    if (nextIndex >= ROBOT_PARTS.length) {
      setMode('complete');
      return;
    }

    setPartIndex(nextIndex);
    setMode('explore');
    setSelectedAnswer(null);
    setQuestionCorrect(null);
    setShowTechnical(false);
  };

  const previousPart = () => {
    if (partIndex === 0) return;

    setPartIndex((previous) => previous - 1);
    setMode('explore');
    setSelectedAnswer(null);
    setQuestionCorrect(null);
    setShowTechnical(false);
  };

  const reset = () => {
    window.speechSynthesis?.cancel();

    setPartIndex(0);
    setScore(0);
    setLearned([]);
    setMode('explore');
    setSelectedAnswer(null);
    setQuestionCorrect(null);
    setShowTechnical(false);
  };

  const realityLabel = useMemo(() => {
    switch (part.reality) {
      case 'real':
        return {
          label: 'Real Robotics',
          description: 'Used in real robotic systems.',
          className:
            'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
        };

      case 'simplified':
        return {
          label: 'Simplified Model',
          description: 'A child-friendly model of a real idea.',
          className:
            'bg-blue-500/10 text-blue-300 border-blue-500/20',
        };

      case 'imagination':
        return {
          label: 'Imagination Lab',
          description: 'A creative robotics idea for exploration.',
          className:
            'bg-purple-500/10 text-purple-300 border-purple-500/20',
        };

      default:
        return {
          label: 'Robotics',
          description: '',
          className:
            'bg-slate-500/10 text-slate-300 border-slate-500/20',
        };
    }
  }, [part.reality]);

  if (mode === 'complete') {
    return (
      <div className="max-w-xl mx-auto bg-app-card p-6 md:p-8 rounded-3xl border border-app-border shadow-xl text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
        >
          <Award className="w-10 h-10 text-emerald-400" />
        </motion.div>

        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Robot Explorer Complete
        </h3>

        <p className="text-gray-400 mb-6">
          Excellent work! You explored the robot parts in this learning
          journey.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-gray-900/70 border border-gray-800">
            <div className="text-2xl font-bold text-white">
              {learned.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Parts explored
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-900/70 border border-gray-800">
            <div className="text-2xl font-bold text-yellow-400">
              {score}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Points earned
            </div>
          </div>
        </div>

        <button
          onClick={reset}
          className="w-full px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Explore Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-app-card p-5 md:p-7 rounded-3xl border border-app-border shadow-xl">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">
              Robotics Academy
            </span>
          </div>

          <h3 className="text-2xl font-bold text-white">
            Robot Explorer
          </h3>

          <p className="text-sm text-gray-400 mt-1">
            Discover how robots sense, think and act.
          </p>
        </div>

        <button
          onClick={reset}
          aria-label="Reset Robot Explorer"
          className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* PROGRESS */}
      <div className="mb-6">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-gray-400">
            Part {partIndex + 1} of {ROBOT_PARTS.length}
          </span>

          <span className="text-emerald-400 font-semibold">
            {learned.length} learned
          </span>
        </div>

        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'explore' && (
          <motion.div
            key={`explore-${part.id}`}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
          >
            {/* PART CARD */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-[#151515] p-6 md:p-8 rounded-2xl border border-gray-800 mb-5">
              <div className="absolute top-3 right-3">
                <span
                  className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide ${realityLabel.className}`}
                >
                  {realityLabel.label}
                </span>
              </div>

              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 180 }}
                className="text-7xl md:text-8xl text-center mb-5"
              >
                {part.emoji}
              </motion.div>

              <div className="text-center">
                <h4 className="text-2xl font-bold text-white mb-2">
                  {part.name}
                </h4>

                <p className="text-gray-300 leading-relaxed max-w-md mx-auto">
                  {part.childDescription}
                </p>
              </div>
            </div>

            {/* CLASSIFICATION */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <div className="text-[10px] uppercase tracking-wide text-blue-400 font-bold mb-1">
                  Type
                </div>
                <div className="text-sm text-white capitalize">
                  {part.type}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <div className="text-[10px] uppercase tracking-wide text-emerald-400 font-bold mb-1">
                  Function
                </div>
                <div className="text-sm text-white capitalize">
                  {part.function}
                </div>
              </div>
            </div>

            {/* REALITY EXPLANATION */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-gray-800 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold text-white">
                  Robotics connection
                </span>
              </div>

              <p className="text-sm text-gray-400">
                {realityLabel.description}
              </p>
            </div>

            {/* TECHNICAL DETAILS */}
            <button
              onClick={() => setShowTechnical((previous) => !previous)}
              className="w-full p-3 rounded-xl bg-gray-900/60 border border-gray-800 text-left hover:border-gray-700 transition-colors mb-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-semibold text-white">
                    Engineer's View
                  </span>
                </div>

                <span className="text-xs text-gray-500">
                  {showTechnical ? 'Hide' : 'Show'}
                </span>
              </div>

              {showTechnical && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-gray-400 mt-3 leading-relaxed"
                >
                  {part.technicalDescription}
                </motion.p>
              )}
            </button>

            {/* VOCABULARY */}
            {part.vocabulary?.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-bold text-white">
                    Robotics Vocabulary
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {part.vocabulary.map((word) => (
                    <span
                      key={word}
                      className="px-2.5 py-1 rounded-lg bg-yellow-500/5 border border-yellow-500/10 text-xs text-yellow-300"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AUDIO + LEARN */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={speakPart}
                className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                Hear
              </button>

              <button
                onClick={handleLearn}
                className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 transition-colors"
              >
                {part.question ? 'Check' : 'Learned'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {mode === 'question' && part.question && (
          <motion.div
            key={`question-${part.id}`}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
          >
            {/* QUESTION HEADER */}
            <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold">
                  Quick Check
                </span>
              </div>

              <h4 className="text-xl font-bold text-white">
                {part.question.prompt}
              </h4>
            </div>

            {/* ANSWERS */}
            <div className="space-y-3 mb-5">
              {part.question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === part.question?.answer;

                let className =
                  'border-gray-800 bg-gray-900/60 hover:border-indigo-500/50';

                if (questionCorrect !== null && isCorrect) {
                  className =
                    'border-emerald-500/40 bg-emerald-500/10';
                } else if (isSelected && questionCorrect === false) {
                  className =
                    'border-red-500/40 bg-red-500/10';
                }

                return (
                  <motion.button
                    key={option}
                    whileTap={{ scale: 0.98 }}
                    disabled={questionCorrect !== null}
                    onClick={() => handleAnswer(index)}
                    className={`w-full p-4 rounded-xl border text-left transition-colors ${className}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">
                        {String.fromCharCode(65 + index)}
                      </span>

                      <span className="text-sm font-semibold text-white">
                        {option}
                      </span>

                      {questionCorrect !== null && isCorrect && (
                        <CheckCircle className="w-5 h-5 text-emerald-400 ml-auto" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* FEEDBACK */}
            {questionCorrect !== null && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl mb-4 ${
                  questionCorrect
                    ? 'bg-emerald-500/10 border border-emerald-500/20'
                    : 'bg-red-500/10 border border-red-500/20'
                }`}
              >
                <div
                  className={`font-bold mb-1 ${
                    questionCorrect
                      ? 'text-emerald-400'
                      : 'text-red-400'
                  }`}
                >
                  {questionCorrect
                    ? 'Excellent! +10 points'
                    : 'Not quite — let’s learn from it.'}
                </div>

                <p className="text-sm text-gray-400">
                  {questionCorrect
                    ? `${part.name} is an important part of understanding how robots work.`
                    : `Remember: ${part.childDescription}`}
                </p>
              </motion.div>
            )}

            {/* ACTIONS */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setMode('explore');
                  setSelectedAnswer(null);
                  setQuestionCorrect(null);
                }}
                className="px-4 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Review
              </button>

              {questionCorrect !== null && (
                <button
                  onClick={nextPart}
                  className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2"
                >
                  Next Part
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER STATS */}
      <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-gray-500">
          <Brain className="w-4 h-4" />
          <span>Score: {score}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-500">
          <CheckCircle className="w-4 h-4" />
          <span>{learned.length} mastered</span>
        </div>
      </div>
    </div>
  );
};