import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Lightbulb,
  RotateCcw,
  Star,
  Target,
} from "lucide-react";

type LearningMode = "guided" | "practice" | "mastery";

type MemoryLevel = {
  id: number;
  name: string;
  pairs: number;
  gridCols: number;
  difficulty: "Easy" | "Medium" | "Hard";
  skill: string;
  objective: string;
  strategy: string;
};

type MemoryProgress = {
  attempts: number;
  matches: number;
  mastered: boolean;
};

type MemoryMatchProps = {
  onComplete?: (score: number) => void;
};

type Card = {
  id: number;
  symbol: string;
};

const EMOJI_BANK = [
  "🍎",
  "🍌",
  "🐶",
  "🐱",
  "🚗",
  "🎈",
  "⭐",
  "🌙",
  "🐟",
  "🌸",
  "🍓",
  "🍊",
  "🐸",
  "🦋",
  "🚀",
  "🎁",
  "⚽",
  "🎨",
  "🍕",
  "🧸",
  "🍔",
  "🍟",
  "🐷",
  "🐰",
  "🚲",
  "✈️",
  "🎵",
  "🌈",
  "🍦",
  "🐧",
  "🥕",
  "🌽",
  "🐢",
  "🦁",
  "🚢",
  "🪁",
  "🎮",
  "📚",
  "🍪",
  "🐝",
  "🍇",
  "🍒",
  "🦄",
  "🐬",
  "🚜",
  "🛸",
  "🎪",
  "🎸",
  "🍬",
  "🦉",
  "🥦",
  "🍄",
  "🦚",
  "🐊",
  "🚁",
  "🛴",
  "🎺",
  "🍩",
  "🐙",
  "🍍",
  "🥝",
  "🦩",
  "🐋",
  "🚃",
  "🛶",
  "🎤",
  "🎬",
  "🍫",
  "🐜",
  "🍉",
  "🫐",
  "🦒",
  "🐘",
  "🚔",
  "🛵",
  "🎧",
  "🎯",
  "🍰",
  "🐚",
  "🍑",
  "🍋",
  "🦘",
  "🦥",
  "🚚",
  "🏎️",
  "🎼",
  "🎭",
  "🍭",
  "🦔",
  "🍐",
  "🥥",
  "🦜",
  "🐆",
  "🚕",
  "🎲",
  "🍮",
  "🐌",
];

const LEVELS: MemoryLevel[] = [
  {
    id: 1,
    name: "Beginner",
    pairs: 3,
    gridCols: 3,
    difficulty: "Easy",
    skill: "Visual Memory",
    objective: "Remember where matching pictures are located.",
    strategy: "Look carefully and remember the position of each picture.",
  },
  {
    id: 2,
    name: "Easy",
    pairs: 6,
    gridCols: 4,
    difficulty: "Easy",
    skill: "Concentration",
    objective: "Find more matching pairs while remembering card locations.",
    strategy: "Use the position of each picture as a memory clue.",
  },
  {
    id: 3,
    name: "Medium",
    pairs: 8,
    gridCols: 4,
    difficulty: "Medium",
    skill: "Working Memory",
    objective: "Hold several visual details in your memory at once.",
    strategy: "Group pictures mentally and remember where they appear.",
  },
  {
    id: 4,
    name: "Hard",
    pairs: 10,
    gridCols: 5,
    difficulty: "Hard",
    skill: "Attention & Recall",
    objective: "Use focused attention to remember a larger set of cards.",
    strategy: "Stay focused and avoid rushing your choices.",
  },
  {
    id: 5,
    name: "Master",
    pairs: 12,
    gridCols: 6,
    difficulty: "Hard",
    skill: "Memory Strategy",
    objective: "Apply memory strategies to solve a large matching challenge.",
    strategy: "Build a mental map of the board and update it as you learn.",
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

export const MemoryMatch: React.FC<MemoryMatchProps> = ({
  onComplete,
}) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [mode, setMode] = useState<LearningMode>("guided");

  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);

  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const [feedback, setFeedback] = useState("");
  const [showStrategy, setShowStrategy] = useState(false);

  const [isChecking, setIsChecking] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const [progress, setProgress] = useState<
    Record<number, MemoryProgress>
  >({});

  const level = LEVELS[currentLevel];

  const masteryPercentage = useMemo(() => {
    if (level.pairs === 0) return 0;

    return Math.min(
      100,
      Math.round((matches / level.pairs) * 100),
    );
  }, [matches, level.pairs]);

  const generateCards = () => {
    const selectedSymbols = shuffle(EMOJI_BANK).slice(
      0,
      level.pairs,
    );

    const newCards = shuffle(
      [...selectedSymbols, ...selectedSymbols].map(
        (symbol, index) => ({
          id: index,
          symbol,
        }),
      ),
    );

    setCards(newCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setMatches(0);
    setStreak(0);
    setFeedback("");
    setShowStrategy(false);
    setIsChecking(false);
    setIsComplete(false);
    setHasFinished(false);
  };

  useEffect(() => {
    generateCards();
  }, [currentLevel, mode]);

  const updateProgress = (
    wasCorrect: boolean,
    matchedPairCount: number,
  ) => {
    setProgress((previous) => {
      const existing = previous[level.id] ?? {
        attempts: 0,
        matches: 0,
        mastered: false,
      };

      return {
        ...previous,
        [level.id]: {
          attempts: existing.attempts + 1,
          matches: existing.matches + matchedPairCount,
          mastered:
            existing.mastered ||
            matchedPairCount >= level.pairs,
        },
      };
    });

    if (!wasCorrect) {
      setStreak(0);
    }
  };

  const handleFlip = (index: number) => {
    if (
      isChecking ||
      isComplete ||
      flipped.includes(index) ||
      matched.includes(index) ||
      flipped.length === 2
    ) {
      return;
    }

    const nextFlipped = [...flipped, index];

    setFlipped(nextFlipped);

    if (nextFlipped.length !== 2) {
      return;
    }

    setMoves((previous) => previous + 1);
    setIsChecking(true);

    const [firstIndex, secondIndex] = nextFlipped;
    const firstCard = cards[firstIndex];
    const secondCard = cards[secondIndex];

    const isMatch =
      firstCard?.symbol === secondCard?.symbol;

    window.setTimeout(() => {
      if (isMatch) {
        const nextMatches = matches + 1;
        const nextStreak = streak + 1;

        setMatched((previous) => [
          ...previous,
          firstIndex,
          secondIndex,
        ]);

        setMatches(nextMatches);
        setStreak(nextStreak);

        const basePoints = 10;
        const streakBonus =
          nextStreak >= 3 ? 5 : 0;

        setScore((previous) =>
          previous + basePoints + streakBonus,
        );

        setFeedback(
          nextMatches === level.pairs
            ? "Excellent memory! You found every pair."
            : "Great memory! You found a match.",
        );

        updateProgress(true, 1);

        setFlipped([]);
        setIsChecking(false);

        if (nextMatches === level.pairs) {
          setIsComplete(true);
        }
      } else {
        setFeedback(
          "Not a match this time. Remember where you saw those pictures.",
        );

        setStreak(0);
        updateProgress(false, 0);

        setFlipped([]);

        setIsChecking(false);
      }
    }, isMatch ? 500 : 900);
  };

  const finishAndMoveUp = () => {
    if (hasFinished) return;

    setHasFinished(true);
    onComplete?.(score);
  };

  const nextLevel = () => {
    if (currentLevel < LEVELS.length - 1) {
      setCurrentLevel((previous) => previous + 1);
    } else {
      finishAndMoveUp();
    }
  };

  const previousLevel = () => {
    if (currentLevel > 0) {
      setCurrentLevel((previous) => previous - 1);
    }
  };

  const resetGame = () => {
    generateCards();
  };

  const startAgain = () => {
    setHasFinished(false);
    setCurrentLevel(0);
    setScore(0);
    setProgress({});
  };

  if (hasFinished) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
          <Star className="w-8 h-8 text-yellow-400" />
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">
          Memory Master!
        </h3>

        <p className="text-gray-400 mb-6">
          You completed the Memory Match journey.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gray-800/60 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">
              {score}
            </div>
            <div className="text-xs text-gray-400">
              Total Score
            </div>
          </div>

          <div className="bg-gray-800/60 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">
              {LEVELS.length}
            </div>
            <div className="text-xs text-gray-400">
              Levels Completed
            </div>
          </div>
        </div>

        <button
          onClick={startAgain}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 mx-auto"
        >
          <RotateCcw className="w-4 h-4" />
          Play Again
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-app-card p-5 sm:p-6 rounded-2xl border border-app-border shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-start gap-4 mb-4">
        <div>
          <h3 className="text-2xl font-bold text-white">
            🧠 Memory Match
          </h3>

          <p className="text-sm text-gray-400 mt-1">
            Train your memory, attention and concentration.
          </p>
        </div>

        <button
          onClick={resetGame}
          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300"
          aria-label="Restart game"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Learning Modes */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {(
          [
            ["guided", "Guided"],
            ["practice", "Practice"],
            ["mastery", "Mastery"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setMode(value)}
            className={`py-2 px-3 rounded-lg text-xs font-semibold transition ${
              mode === value
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Level and Stats */}
      <div className="flex flex-wrap justify-between gap-2 mb-4">
        <div className="flex flex-wrap gap-2">
          <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs">
            Level {level.id}: {level.name}
          </span>

          <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs">
            {level.skill}
          </span>
        </div>

        <div className="flex gap-2">
          <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold">
            ⭐ {score}
          </span>

          <span className="bg-gray-800 text-gray-400 px-3 py-1 rounded-full text-xs">
            Moves: {moves}
          </span>
        </div>
      </div>

      {/* Objective */}
      <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />

          <div>
            <div className="text-sm font-semibold text-white">
              Challenge
            </div>

            <p className="text-sm text-gray-400 mt-1">
              {level.objective}
            </p>
          </div>
        </div>
      </div>

      {/* Strategy */}
      {mode === "guided" && (
        <div className="mb-4">
          <button
            onClick={() =>
              setShowStrategy((previous) => !previous)
            }
            className="flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300"
          >
            <Lightbulb className="w-4 h-4" />
            {showStrategy
              ? "Hide memory strategy"
              : "Show memory strategy"}
          </button>

          {showStrategy && (
            <div className="mt-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-sm text-yellow-200">
              {level.strategy}
            </div>
          )}
        </div>
      )}

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-400">
            Pairs found
          </span>

          <span className="text-gray-300">
            {matches} / {level.pairs}
          </span>
        </div>

        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${masteryPercentage}%` }}
          />
        </div>
      </div>

      {/* Memory Grid */}
      <div
        className="grid gap-2 sm:gap-3 mb-4"
        style={{
          gridTemplateColumns: `repeat(${level.gridCols}, minmax(0, 1fr))`,
        }}
      >
        {cards.map((card, index) => {
          const isFlipped =
            flipped.includes(index) ||
            matched.includes(index);

          const isMatched = matched.includes(index);

          return (
            <motion.button
              key={card.id}
              whileHover={
                !isFlipped && !isChecking
                  ? { scale: 1.04 }
                  : undefined
              }
              whileTap={
                !isFlipped && !isChecking
                  ? { scale: 0.95 }
                  : undefined
              }
              onClick={() => handleFlip(index)}
              disabled={
                isChecking ||
                isFlipped ||
                isComplete
              }
              aria-label={
                isFlipped
                  ? `Memory card showing ${card.symbol}`
                  : "Hidden memory card"
              }
              className={`aspect-square rounded-xl border-2 flex items-center justify-center text-2xl sm:text-3xl transition-all ${
                isMatched
                  ? "bg-green-500/20 border-green-400"
                  : isFlipped
                    ? "bg-indigo-500/20 border-indigo-400"
                    : "bg-gray-800 border-gray-700 hover:border-indigo-400"
              }`}
            >
              {isFlipped ? card.symbol : "❓"}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback */}
      {feedback && !isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-gray-300 mb-4"
        >
          {feedback}
        </motion.div>
      )}

      {/* Completion */}
      {isComplete && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-5 bg-green-500/10 border border-green-500/20 rounded-xl mb-4 text-center"
        >
          <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />

          <h4 className="text-lg font-bold text-white">
            {level.name} Level Complete!
          </h4>

          <p className="text-sm text-gray-400 mt-1">
            You found all {level.pairs} pairs in{" "}
            {moves} moves.
          </p>

          <div className="flex justify-center gap-3 mt-4">
            <span className="text-yellow-400 font-bold">
              ⭐ {score}
            </span>

            <span className="text-gray-400">
              {masteryPercentage}% mastery
            </span>
          </div>

          <button
            onClick={nextLevel}
            className="mt-4 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-bold flex items-center justify-center gap-2 mx-auto"
          >
            {currentLevel < LEVELS.length - 1
              ? "Next Level"
              : "Finish & Move Up"}

            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={previousLevel}
          disabled={currentLevel === 0}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="text-xs text-gray-500">
          Level {currentLevel + 1} of {LEVELS.length}
        </div>

        <button
          onClick={nextLevel}
          disabled={!isComplete}
          className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};