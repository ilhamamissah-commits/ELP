import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, RotateCcw, Star } from 'lucide-react';
import { LEGO_CHALLENGES } from './engineeringData';

export const LegoBuilder: React.FC = () => {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [placedBlocks, setPlacedBlocks] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const challenge = LEGO_CHALLENGES[challengeIndex];

  useEffect(() => {
    setPlacedBlocks(0);
    setCompleted(false);
  }, [challengeIndex]);

  const handlePlaceBlock = () => {
    if (completed) return;
    if (placedBlocks < challenge.levels) {
      setPlacedBlocks(placedBlocks + 1);
    }
    if (placedBlocks + 1 === challenge.levels) {
      setCompleted(true);
      setScore(score + 10);
    }
  };

  const nextChallenge = () => {
    if (challengeIndex < LEGO_CHALLENGES.length - 1) {
      setChallengeIndex(challengeIndex + 1);
    } else {
      setChallengeIndex(0);
      setScore(0);
      alert("🎉 You completed all 50 Lego challenges!");
    }
  };

  const reset = () => {
    setPlacedBlocks(0);
    setCompleted(false);
  };

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-2xl font-bold text-white">🧱 Lego Builder</h3>
        <button onClick={reset} className="p-2 bg-gray-800 rounded-lg text-gray-300"><RotateCcw className="w-4 h-4" /></button>
      </div>
      <p className="text-gray-400 text-sm mb-4">Build the tower to match the image!</p>

      <div className="flex justify-between items-center mb-4">
        <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full text-xs">Challenge {challengeIndex + 1} / {LEGO_CHALLENGES.length}</span>
        <span className="text-yellow-400 font-bold text-xs">⭐ Score: {score}</span>
      </div>

      {/* Target Image */}
      <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 mb-6">
        <p className="text-gray-400 text-sm mb-2">Build this:</p>
        <div className="flex flex-col-reverse items-center gap-1">
          {Array.from({ length: challenge.levels }).map((_, i) => (
            <motion.div 
              key={i} 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="w-16 h-8 rounded-sm"
              style={{ backgroundColor: i === 0 ? challenge.color1 : i === challenge.levels - 1 ? challenge.color3 : challenge.color2 }}
            />
          ))}
        </div>
        <p className="text-gray-400 text-xs mt-2">{challenge.title} | Difficulty: {challenge.difficulty}</p>
      </div>

      {/* Building Area */}
      <div className="min-h-[120px] bg-[#1a1a1a] rounded-xl border-2 border-dashed border-gray-700 mb-6 flex flex-col-reverse items-center justify-start p-2">
        {Array.from({ length: placedBlocks }).map((_, i) => (
          <motion.div 
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-8 rounded-sm mb-1"
            style={{ backgroundColor: i === 0 ? challenge.color1 : i === placedBlocks - 1 ? challenge.color3 : challenge.color2 }}
          />
        ))}
        {placedBlocks === 0 && <span className="text-gray-500 text-sm italic mt-8">Tap "Add Block" to start!</span>}
      </div>

      <div className="flex justify-center gap-3 mb-4">
        <button 
          onClick={handlePlaceBlock}
          disabled={completed || placedBlocks >= challenge.levels}
          className="px-6 py-3 bg-indigo-600 rounded-xl text-white font-bold hover:bg-indigo-500 disabled:opacity-50"
        >
          Add Block
        </button>
      </div>

      {completed && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-3 bg-green-500/20 rounded-xl text-green-400 font-bold mb-2">
          <CheckCircle className="w-5 h-5 inline mr-1" /> Perfect! 
          <button onClick={nextChallenge} className="ml-2 px-4 py-1 bg-green-600 rounded-lg text-white">Next <ArrowRight className="w-4 h-4 inline" /></button>
        </motion.div>
      )}
    </div>
  );
};