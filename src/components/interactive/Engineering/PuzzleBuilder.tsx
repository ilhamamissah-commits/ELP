import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  RotateCcw,
  Blocks,
  Star,
} from 'lucide-react';
import { PUZZLE_CHALLENGES } from './engineeringData';

type PuzzleChallenge = {
  title: string;
  emoji: string;
  gridSize: number;
  difficulty: string;
  skill?: string;
  objective?: string;
  hint?: string;
  learningPoint?: string;
  pattern?: number[];
};

const challenges = PUZZLE_CHALLENGES as PuzzleChallenge[];

export const PuzzleBuilder: React.FC = () => {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [placedPieces, setPlacedPieces] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const [tested, setTested] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [message, setMessage] = useState('');

  const challenge = challenges[challengeIndex];

  const totalPieces = challenge.gridSize * challenge.gridSize;

  /*
   * If engineeringData.ts contains a pattern array, use it.
   * Otherwise the module falls back to a complete grid.
   *
   * Example:
   * pattern: [0, 1, 1, 0, 1, 1, 0, 0, 0]
   *
   * 0 = empty
   * 1 = puzzle piece required
   */
  const targetPattern = useMemo(() => {
    if (
      Array.isArray(challenge.pattern) &&
      challenge.pattern.length === totalPieces
    ) {
      return challenge.pattern;
    }

    return Array.from({ length: totalPieces }, () => 1);
  }, [challenge, totalPieces]);

  const requiredPieces = targetPattern.filter(
    (cell) => cell === 1
  ).length;

  useEffect(() => {
    setPlacedPieces([]);
    setCompleted(false);
    setTested(false);
    setAttempts(0);
    setShowHint(false);
    setMessage('');
  }, [challengeIndex]);

  const togglePiece = (index: number) => {
    if (completed) return;

    setTested(false);
    setMessage('');

    setPlacedPieces((previous) => {
      if (previous.includes(index)) {
        return previous.filter((piece) => piece !== index);
      }

      return [...previous, index];
    });
  };

  const handleTest = () => {
    setTested(true);
    setAttempts((previous) => previous + 1);

    const targetCells = targetPattern
      .map((value, index) => (value === 1 ? index : -1))
      .filter((index) => index !== -1);

    const isCorrect =
      placedPieces.length === targetCells.length &&
      targetCells.every((index) => placedPieces.includes(index));

    if (isCorrect) {
      setCompleted(true);
      setScore((previous) => previous + 10);
      setMessage(
        'Excellent! You reconstructed the puzzle correctly.'
      );
    } else {
      setMessage(
        'Not quite. Look carefully at the pattern and try again.'
      );
    }
  };

  const removeLastPiece = () => {
    if (completed) return;

    setTested(false);
    setMessage('');

    setPlacedPieces((previous) => previous.slice(0, -1));
  };

  const reset = () => {
    setPlacedPieces([]);
    setCompleted(false);
    setTested(false);
    setAttempts(0);
    setShowHint(false);
    setMessage('');
  };

  const nextChallenge = () => {
    if (challengeIndex < challenges.length - 1) {
      setChallengeIndex((previous) => previous + 1);
    } else {
      setChallengeIndex(0);
      setScore(0);
      setMessage(
        'Wonderful! You completed the puzzle sequence. Let’s practise again.'
      );
    }
  };

  const completionPercentage = Math.round(
    (placedPieces.length / requiredPieces) * 100
  );

  return (
    <div className="max-w-2xl mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Blocks className="w-6 h-6 text-indigo-400" />
            <h3 className="text-2xl font-bold text-white">
              Puzzle Builder
            </h3>
          </div>

          <p className="text-gray-400 text-sm mt-1">
            Think, plan, build and test your solution.
          </p>
        </div>

        <button
          onClick={reset}
          className="p-2 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700"
          aria-label="Reset puzzle"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Challenge information */}
      <div className="flex flex-wrap justify-between gap-2 mb-5">
        <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs">
          Puzzle {challengeIndex + 1} / {challenges.length}
        </span>

        <span className="text-yellow-400 font-bold text-xs flex items-center gap-1">
          <Star className="w-4 h-4" />
          Score: {score}
        </span>

        <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs">
          {challenge.difficulty}
        </span>
      </div>

      {/* Objective */}
      <div className="bg-gray-900/70 rounded-xl p-4 mb-5 border border-gray-800">
        <p className="text-indigo-300 text-xs uppercase tracking-wide font-semibold mb-1">
          Your Mission
        </p>

        <h4 className="text-white font-bold text-lg">
          {challenge.title}
        </h4>

        <p className="text-gray-400 text-sm mt-1">
          {challenge.objective ||
            'Reconstruct the target pattern using the puzzle grid.'}
        </p>

        {challenge.skill && (
          <div className="mt-3">
            <span className="text-xs text-gray-500">
              Skill: 
            </span>{' '}
            <span className="text-xs text-gray-300">
              {challenge.skill}
            </span>
          </div>
        )}
      </div>

      {/* Target */}
      <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-5 mb-5">
        <div className="flex justify-between items-center mb-3">
          <p className="text-gray-300 text-sm font-semibold">
            Study the target
          </p>

          <span className="text-xs text-gray-500">
            Plan before you build
          </span>
        </div>

        <div
          className="grid gap-1 max-w-xs mx-auto"
          style={{
            gridTemplateColumns: `repeat(${challenge.gridSize}, 1fr)`,
          }}
        >
          {targetPattern.map((cell, index) => (
            <div
              key={index}
              className={`aspect-square rounded-md flex items-center justify-center ${
                cell === 1
                  ? 'bg-indigo-500/30 border border-indigo-400/40'
                  : 'bg-gray-900 border border-gray-800'
              }`}
            >
              {cell === 1 && (
                <span className="text-xl">
                  {challenge.emoji}
                </span>
              )}
            </div>
          ))}
        </div>

        <p className="text-gray-500 text-xs text-center mt-3">
          Remember the position of each piece.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-gray-400">
            Pieces placed
          </span>

          <span className="text-gray-300">
            {placedPieces.length} / {requiredPieces}
          </span>
        </div>

        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500"
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min(completionPercentage, 100)}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Building area */}
      <div className="mb-5">
        <p className="text-gray-300 text-sm font-semibold mb-2">
          Build your solution
        </p>

        <div
          className="gap-1 bg-[#111111] rounded-xl border-2 border-dashed border-gray-700 p-2"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${challenge.gridSize}, 1fr)`,
          }}
        >
          {Array.from({ length: totalPieces }).map((_, index) => {
            const isPlaced = placedPieces.includes(index);

            return (
              <motion.button
                key={index}
                type="button"
                onClick={() => togglePiece(index)}
                disabled={completed}
                whileTap={{ scale: 0.92 }}
                animate={
                  isPlaced
                    ? {
                        scale: 1,
                        opacity: 1,
                      }
                    : {
                        scale: 0.96,
                        opacity: 0.55,
                      }
                }
                className={`aspect-square rounded-md flex items-center justify-center transition ${
                  isPlaced
                    ? 'bg-indigo-500/30 border border-indigo-400'
                    : 'bg-gray-800 border border-gray-700 hover:bg-gray-700'
                }`}
                aria-label={
                  isPlaced
                    ? `Remove piece from position ${index + 1}`
                    : `Place piece at position ${index + 1}`
                }
              >
                {isPlaced && (
                  <span className="text-2xl">
                    {challenge.emoji}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        <p className="text-gray-500 text-xs text-center mt-2">
          Tap a space to place or remove a piece.
        </p>
      </div>

      {/* Controls */}
      {!completed && (
        <div className="flex justify-center gap-3 mb-5">
          <button
            onClick={removeLastPiece}
            disabled={placedPieces.length === 0}
            className="px-4 py-3 bg-gray-800 rounded-xl text-gray-300 font-semibold hover:bg-gray-700 disabled:opacity-40"
          >
            Remove
          </button>

          <button
            onClick={handleTest}
            disabled={placedPieces.length === 0}
            className="px-7 py-3 bg-indigo-600 rounded-xl text-white font-bold hover:bg-indigo-500 disabled:opacity-40"
          >
            Test Solution
          </button>
        </div>
      )}

      {/* Hint */}
      {!completed && (
        <div className="mb-4">
          <button
            onClick={() => setShowHint((previous) => !previous)}
            className="text-xs text-indigo-300 hover:text-indigo-200"
          >
            {showHint ? 'Hide hint' : 'Need a hint?'}
          </button>

          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg"
            >
              <p className="text-sm text-indigo-200">
                {challenge.hint ||
                  'Look at the target from left to right and top to bottom. Compare each space carefully.'}
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Feedback */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-xl text-sm mb-4 ${
            completed
              ? 'bg-green-500/20 text-green-400'
              : 'bg-yellow-500/10 text-yellow-300'
          }`}
        >
          {completed && (
            <CheckCircle className="w-5 h-5 inline mr-2" />
          )}
          {message}
        </motion.div>
      )}

      {/* Completion */}
      {completed && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
        >
          <div className="flex items-center justify-center gap-2 text-green-400 font-bold">
            <CheckCircle className="w-5 h-5" />
            Puzzle Complete!
          </div>

          <p className="text-gray-400 text-sm text-center mt-2">
            {challenge.learningPoint ||
              'You used observation, planning and spatial reasoning to solve the puzzle.'}
          </p>

          <div className="flex justify-center mt-4">
            <button
              onClick={nextChallenge}
              className="px-5 py-2 bg-green-600 rounded-lg text-white font-semibold hover:bg-green-500"
            >
              Next Puzzle
              <ArrowRight className="w-4 h-4 inline ml-1" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Attempt information */}
      {!completed && attempts > 0 && (
        <p className="text-center text-gray-500 text-xs mt-3">
          Attempts: {attempts}
        </p>
      )}
    </div>
  );
};