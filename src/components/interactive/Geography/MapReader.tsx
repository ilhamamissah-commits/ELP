import React, { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Map,
  MapPin,
  Navigation,
  RotateCcw,
  Volume2,
  CheckCircle2,
  XCircle,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { speakWord } from '../../../services/audioEngine';
import { useProfileStore } from '../../../store/useProfileStore';
import { useProgressStore } from '../../../store/useProgressStore';

type DirectionName = 'North' | 'South' | 'East' | 'West';

type Direction = {
  name: DirectionName;
  short: string;
  description: string;
  position: string;
};

type MapSymbol = {
  id: string;
  name: string;
  emoji: string;
  description: string;
};

type Challenge = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

const DIRECTIONS: Direction[] = [
  {
    name: 'North',
    short: 'N',
    description: 'North is usually shown at the top of a map.',
    position: 'Up',
  },
  {
    name: 'South',
    short: 'S',
    description: 'South is usually shown at the bottom of a map.',
    position: 'Down',
  },
  {
    name: 'East',
    short: 'E',
    description: 'East is usually shown on the right side of a map.',
    position: 'Right',
  },
  {
    name: 'West',
    short: 'W',
    description: 'West is usually shown on the left side of a map.',
    position: 'Left',
  },
];

const MAP_SYMBOLS: MapSymbol[] = [
  {
    id: 'school',
    name: 'School',
    emoji: '🏫',
    description: 'A place where children learn.',
  },
  {
    id: 'hospital',
    name: 'Hospital',
    emoji: '🏥',
    description: 'A place where people receive medical care.',
  },
  {
    id: 'park',
    name: 'Park',
    emoji: '🌳',
    description: 'A green public place for people and nature.',
  },
  {
    id: 'water',
    name: 'Water',
    emoji: '🌊',
    description: 'A river, lake, ocean, or other body of water.',
  },
  {
    id: 'home',
    name: 'Home',
    emoji: '🏠',
    description: 'A place where people live.',
  },
  {
    id: 'market',
    name: 'Market',
    emoji: '🛒',
    description: 'A place where people buy and sell things.',
  },
];

const CHALLENGES: Challenge[] = [
  {
    question: 'Which direction is usually at the top of a map?',
    options: ['North', 'South', 'East', 'West'],
    answer: 'North',
    explanation: 'Maps commonly place North at the top.',
  },
  {
    question: 'Which direction is usually to the right on a map?',
    options: ['North', 'South', 'East', 'West'],
    answer: 'East',
    explanation: 'East is commonly shown on the right side of a map.',
  },
  {
    question: 'Which direction is usually at the bottom of a map?',
    options: ['North', 'South', 'East', 'West'],
    answer: 'South',
    explanation: 'South is commonly shown at the bottom.',
  },
  {
    question: 'Which direction is usually to the left on a map?',
    options: ['North', 'South', 'East', 'West'],
    answer: 'West',
    explanation: 'West is commonly shown on the left side.',
  },
  {
    question: 'If the school is above the park, which direction is the school from the park?',
    options: ['North', 'South', 'East', 'West'],
    answer: 'North',
    explanation: 'Above means North when using a standard map.',
  },
  {
    question: 'If the market is to the left of the home, which direction is the market?',
    options: ['North', 'South', 'East', 'West'],
    answer: 'West',
    explanation: 'Left means West on a standard map.',
  },
  {
    question: 'What tool helps us find directions?',
    options: ['Compass', 'Ruler', 'Pencil', 'Clock'],
    answer: 'Compass',
    explanation: 'A compass helps us identify directions.',
  },
  {
    question: 'What does the letter E mean on a compass?',
    options: ['East', 'Earth', 'Everywhere', 'Entrance'],
    answer: 'East',
    explanation: 'E is the standard abbreviation for East.',
  },
];

const DIRECTION_ICONS: Record<DirectionName, React.ReactNode> = {
  North: <ArrowUp className="w-7 h-7" />,
  South: <ArrowDown className="w-7 h-7" />,
  East: <ArrowRight className="w-7 h-7" />,
  West: <ArrowLeft className="w-7 h-7" />,
};

const getStage = (level: number) => {
  if (level <= 2) return 'foundation';
  if (level === 3) return 'developing';
  return 'advanced';
};

export const MapReader: React.FC = () => {
  const profile = useProfileStore(
    (state) => state.profiles[state.currentProfileId]
  );

  const completeActivity = useProgressStore(
    (state) => state.completeActivity
  );

  const currentLevel = profile?.currentLevel ?? 1;
  const stage = getStage(currentLevel);

  const [selectedDirection, setSelectedDirection] =
    useState<DirectionName | null>(null);

  const [selectedSymbol, setSelectedSymbol] =
    useState<string | null>(null);

  const [mode, setMode] = useState<'explore' | 'symbols' | 'challenge'>(
    'explore'
  );

  const [challengeIndex, setChallengeIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [challengeComplete, setChallengeComplete] = useState(false);

  const currentChallenge = CHALLENGES[challengeIndex];

  const progressPercent = useMemo(() => {
    return Math.round(
      ((challengeIndex + (selectedAnswer ? 1 : 0)) /
        CHALLENGES.length) *
        100
    );
  }, [challengeIndex, selectedAnswer]);

  const speak = useCallback((text: string) => {
    speakWord(text);
  }, []);

  const handleDirectionClick = (direction: Direction) => {
    setSelectedDirection(direction.name);

    speak(
      `${direction.name}. ${direction.description}`
    );
  };

  const handleSymbolClick = (symbol: MapSymbol) => {
    setSelectedSymbol(symbol.id);

    speak(
      `${symbol.name}. ${symbol.description}`
    );
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);

    if (answer === currentChallenge.answer) {
      setScore((previous) => previous + 1);
    }
  };

  const nextChallenge = () => {
    if (challengeIndex >= CHALLENGES.length - 1) {
      const finalScore =
        score + (selectedAnswer === currentChallenge.answer ? 1 : 0);

      const percentage = Math.round(
        (finalScore / CHALLENGES.length) * 100
      );

      completeActivity({
        id: 'geography-map-reader',
        score: percentage,
        academyId: 'global',
        domain: 'general',
        skillIds: [
          'map-orientation',
          'cardinal-directions',
          'compass-skills',
          'map-symbols',
          'spatial-awareness',
          'geographical-vocabulary',
        ],
      });

      setChallengeComplete(true);
      return;
    }

    setChallengeIndex((previous) => previous + 1);
    setSelectedAnswer(null);
  };

  const resetChallenge = () => {
    setChallengeIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setChallengeComplete(false);
  };

  const resetExplorer = () => {
    setSelectedDirection(null);
    setSelectedSymbol(null);
    resetChallenge();
    setMode('explore');
  };

  return (
    <div className="max-w-3xl mx-auto bg-app-card rounded-3xl border border-app-border shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-app-border bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-7 h-7 text-cyan-400" />

              <h3 className="text-2xl font-bold text-white">
                Map Reader
              </h3>
            </div>

            <p className="text-gray-400 text-sm mt-2">
              Learn how maps help us understand places, directions,
              symbols, and routes.
            </p>
          </div>

          <button
            type="button"
            onClick={resetExplorer}
            aria-label="Reset map reader"
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Learning stage */}
        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="text-gray-500">
            Geography • Level {currentLevel}
          </span>

          <span className="text-cyan-400 capitalize">
            {stage} explorer
          </span>
        </div>
      </div>

      {/* Mode navigation */}
      <div className="p-4 border-b border-app-border">
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              id: 'explore' as const,
              label: 'Directions',
              icon: Compass,
            },
            {
              id: 'symbols' as const,
              label: 'Map Symbols',
              icon: Map,
            },
            {
              id: 'challenge' as const,
              label: 'Challenge',
              icon: Navigation,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition-all ${
                  mode === item.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                    : 'bg-white/5 text-gray-400 border border-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* DIRECTIONS */}
          {mode === 'explore' && (
            <motion.div
              key="directions"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
            >
              <div className="text-center mb-6">
                <p className="text-gray-300 text-sm">
                  A compass helps us understand which way we are going.
                </p>
              </div>

              {/* Visual compass */}
              <div className="relative mx-auto w-56 h-56 mb-8">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 bg-cyan-400/5" />

                <div className="absolute inset-5 rounded-full border border-gray-700" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
                    <Compass className="w-6 h-6 text-cyan-300" />
                  </div>
                </div>

                <span className="absolute top-2 left-1/2 -translate-x-1/2 font-bold text-cyan-300">
                  N
                </span>

                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-bold text-cyan-300">
                  S
                </span>

                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-cyan-300">
                  E
                </span>

                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-cyan-300">
                  W
                </span>

                <motion.div
                  className="absolute left-1/2 top-1/2 origin-bottom"
                  style={{
                    height: '82px',
                    width: '3px',
                    transform: 'translateX(-50%) translateY(-100%)',
                  }}
                  animate={{
                    rotate:
                      selectedDirection === 'North'
                        ? 0
                        : selectedDirection === 'East'
                        ? 90
                        : selectedDirection === 'South'
                        ? 180
                        : selectedDirection === 'West'
                        ? -90
                        : 0,
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-t from-red-400 to-transparent rounded-full" />
                </motion.div>
              </div>

              {/* Direction cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DIRECTIONS.map((direction) => {
                  const selected =
                    selectedDirection === direction.name;

                  return (
                    <motion.button
                      key={direction.name}
                      type="button"
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleDirectionClick(direction)}
                      className={`relative p-4 rounded-2xl border transition-all ${
                        selected
                          ? 'bg-cyan-500/15 border-cyan-400/50'
                          : 'bg-white/[0.03] border-white/10 hover:border-cyan-400/30'
                      }`}
                    >
                      <div className="flex justify-center mb-2 text-cyan-300">
                        {DIRECTION_ICONS[direction.name]}
                      </div>

                      <div className="text-white font-bold">
                        {direction.name}
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        {direction.short}
                      </div>

                      {selected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 text-xs text-gray-300"
                        >
                          {direction.description}
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {selectedDirection && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 p-4 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-sm text-gray-400">
                      You selected
                    </p>

                    <p className="text-lg font-bold text-white">
                      {selectedDirection}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      speak(
                        `${selectedDirection}. ${
                          DIRECTIONS.find(
                            (item) =>
                              item.name === selectedDirection
                          )?.description ?? ''
                        }`
                      )
                    }
                    className="p-3 rounded-xl bg-white/5 text-cyan-300 hover:bg-white/10"
                    aria-label={`Hear ${selectedDirection}`}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* SYMBOLS */}
          {mode === 'symbols' && (
            <motion.div
              key="symbols"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
            >
              <div className="text-center mb-6">
                <p className="text-gray-300 text-sm">
                  Maps use symbols to show places and features.
                </p>
              </div>

              {/* Mini map */}
              <div className="relative h-64 rounded-2xl border border-emerald-400/20 bg-emerald-500/5 overflow-hidden mb-6">
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute left-1/3 top-0 bottom-0 w-px bg-emerald-300" />
                  <div className="absolute left-2/3 top-0 bottom-0 w-px bg-emerald-300" />
                  <div className="absolute top-1/3 left-0 right-0 h-px bg-emerald-300" />
                  <div className="absolute top-2/3 left-0 right-0 h-px bg-emerald-300" />
                </div>

                <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/30 text-xs text-gray-300">
                  N ↑
                </div>

                {MAP_SYMBOLS.map((symbol, index) => {
                  const positions = [
                    'left-[15%] top-[20%]',
                    'left-[62%] top-[18%]',
                    'left-[40%] top-[52%]',
                    'left-[72%] top-[65%]',
                    'left-[18%] top-[68%]',
                    'left-[48%] top-[25%]',
                  ];

                  const selected = selectedSymbol === symbol.id;

                  return (
                    <motion.button
                      key={symbol.id}
                      type="button"
                      onClick={() => handleSymbolClick(symbol)}
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.95 }}
                      className={`absolute ${positions[index]} w-12 h-12 rounded-xl flex items-center justify-center text-2xl border transition-all ${
                        selected
                          ? 'bg-cyan-500/20 border-cyan-300 shadow-lg shadow-cyan-500/10'
                          : 'bg-black/30 border-white/10'
                      }`}
                      aria-label={symbol.name}
                    >
                      {symbol.emoji}
                    </motion.button>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {MAP_SYMBOLS.map((symbol) => {
                  const selected = selectedSymbol === symbol.id;

                  return (
                    <button
                      key={symbol.id}
                      type="button"
                      onClick={() => handleSymbolClick(symbol)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selected
                          ? 'bg-cyan-500/10 border-cyan-400/40'
                          : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <span className="text-3xl">{symbol.emoji}</span>

                      <p className="text-white font-semibold mt-2">
                        {symbol.name}
                      </p>

                      {selected && (
                        <p className="text-xs text-gray-400 mt-2">
                          {symbol.description}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* CHALLENGE */}
          {mode === 'challenge' && !challengeComplete && (
            <motion.div
              key="challenge"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
            >
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>
                    Question {challengeIndex + 1} of{' '}
                    {CHALLENGES.length}
                  </span>

                  <span>{progressPercent}%</span>
                </div>

                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full bg-cyan-400 rounded-full"
                    animate={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">
                    Map Challenge
                  </span>

                  <span className="text-sm text-gray-500">
                    Score: {score}
                  </span>
                </div>

                <h4 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
                  {currentChallenge.question}
                </h4>

                <button
                  type="button"
                  onClick={() => speak(currentChallenge.question)}
                  className="mt-4 flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200"
                >
                  <Volume2 className="w-4 h-4" />
                  Hear question
                </button>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  {currentChallenge.options.map((option) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrect =
                      selectedAnswer &&
                      option === currentChallenge.answer;
                    const isWrong =
                      isSelected && option !== currentChallenge.answer;

                    return (
                      <motion.button
                        key={option}
                        type="button"
                        whileHover={!selectedAnswer ? { y: -2 } : {}}
                        whileTap={!selectedAnswer ? { scale: 0.98 } : {}}
                        onClick={() => handleAnswer(option)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          isCorrect
                            ? 'bg-emerald-500/15 border-emerald-400/50'
                            : isWrong
                            ? 'bg-red-500/15 border-red-400/50'
                            : isSelected
                            ? 'bg-cyan-500/10 border-cyan-400/40'
                            : 'bg-white/[0.03] border-white/10 hover:border-cyan-400/30'
                        }`}
                        disabled={Boolean(selectedAnswer)}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-white">
                            {option}
                          </span>

                          {isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          )}

                          {isWrong && (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {selectedAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-5 p-4 rounded-xl ${
                      selectedAnswer === currentChallenge.answer
                        ? 'bg-emerald-500/10 border border-emerald-400/20'
                        : 'bg-red-500/10 border border-red-400/20'
                    }`}
                  >
                    <p className="font-semibold text-white">
                      {selectedAnswer === currentChallenge.answer
                        ? 'Excellent work! 🎯'
                        : `The answer is ${currentChallenge.answer}.`}
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                      {currentChallenge.explanation}
                    </p>

                    <button
                      type="button"
                      onClick={nextChallenge}
                      className="mt-4 w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors"
                    >
                      {challengeIndex === CHALLENGES.length - 1
                        ? 'Finish Challenge'
                        : 'Next Question'}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* COMPLETION */}
          {mode === 'challenge' && challengeComplete && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="w-20 h-20 mx-auto rounded-full bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </motion.div>

              <h4 className="text-2xl font-bold text-white mt-6">
                Map Challenge Complete
              </h4>

              <p className="text-gray-400 mt-2">
                You scored {score} out of {CHALLENGES.length}.
              </p>

              <div className="mt-6 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                <p className="text-sm text-gray-500">
                  Geography skills practised
                </p>

                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {[
                    'Directions',
                    'Compass Skills',
                    'Map Symbols',
                    'Spatial Awareness',
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-xs text-cyan-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={resetChallenge}
                className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Learning note */}
      <div className="px-6 pb-6">
        <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />

            <div>
              <p className="text-sm font-semibold text-white">
                Think like a geographer
              </p>

              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Maps are models of real places. We use directions,
                symbols, scale, and location clues to understand where
                things are and how places are connected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
