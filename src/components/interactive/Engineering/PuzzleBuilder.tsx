import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { PUZZLE_CHALLENGES } from './engineeringData';

export const PuzzleBuilder: React.FC = () => {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [placedPieces, setPlacedPieces] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const challenge = PUZZLE_CHALLENGES[challengeIndex];
  const totalPieces = challenge.gridSize * challenge.gridSize;

  useEffect(() => {
    setPlacedPieces([]);
    setCompleted(false);
  }, [challengeIndex]);

  const handlePlacePiece = () => {
    if (completed) return;
    if (placedPieces.length < totalPieces) {
      setPlacedPieces([...placedPieces, placedPieces.length]);
    }
    if (placedPieces.length + 1 === totalPieces) {
      setCompleted(true);
      setScore(score + 10);
    }
  };

  const nextChallenge = () => {
    if (challengeIndex < PUZZLE_CHALLENGES.length - 1) {
      setChallengeIndex(challengeIndex + 1);
    } else {
      setChallengeIndex(0);
      setScore(0);
      alert("🎉 You completed all 50 puzzles!");
    }
  };

  const reset = () => {
    setPlacedPieces([]);
    setCompleted(false);
  };

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-2xl font-bold text-white">🧩 Puzzle Builder</h3>
        <button onClick={reset} className="p-2 bg-gray-800 rounded-lg text-gray-300"><RotateCcw className="w-4 h-4" /></button>
      </div>
      <p className="text-gray-400 text-sm mb-4">Assemble the puzzle to match the image!</p>

      <div className="flex justify-between items-center mb-4">
        <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full text-xs">Puzzle {challengeIndex + 1} / {PUZZLE_CHALLENGES.length}</span>
        <span className="text-yellow-400 font-bold text-xs">⭐ Score: {score}</span>
      </div>

      {/* Target Image */}
      <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 mb-6">
        <p className="text-gray-400 text-sm mb-2">Build this:</p>
        <div className="text-7xl mb-2">{challenge.emoji}</div>
        <p className="text-gray-400 text-xs">{challenge.title} | {challenge.gridSize}x{challenge.gridSize} Grid | Difficulty: {challenge.difficulty}</p>
      </div>

      {/* Puzzle Area */}
      <div 
        className="gap-2 bg-[#1a1a1a] rounded-xl border-2 border-dashed border-gray-700 p-2 mb-6"
        style={{ display: 'grid', gridTemplateColumns: `repeat(${challenge.gridSize}, 1fr)` }}
      >
        {Array.from({ length: totalPieces }).map((_, index) => (
          <motion.div 
            key={index}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={placedPieces.includes(index) ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0.3 }}
            className="aspect-square bg-gray-800 rounded-md flex items-center justify-center"
          >
            {placedPieces.includes(index) ? <span className="text-2xl">{challenge.emoji}</span> : ''}
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center gap-3 mb-4">
        <button 
          onClick={handlePlacePiece}
          disabled={completed || placedPieces.length >= totalPieces}
          className="px-6 py-3 bg-indigo-600 rounded-xl text-white font-bold hover:bg-indigo-500 disabled:opacity-50"
        >
          Add Piece
        </button>
      </div>

      {completed && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-3 bg-green-500/20 rounded-xl text-green-400 font-bold mb-2">
          <CheckCircle className="w-5 h-5 inline mr-1" /> Puzzle Complete! 
          <button onClick={nextChallenge} className="ml-2 px-4 py-1 bg-green-600 rounded-lg text-white">Next <ArrowRight className="w-4 h-4 inline" /></button>
        </motion.div>
      )}
    </div>
  );
};