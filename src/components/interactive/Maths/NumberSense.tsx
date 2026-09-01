import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

const LEVELS = [
  { count: 3, emoji: '🍎' },
  { count: 5, emoji: '🍓' },
  { count: 7, emoji: '⭐' },
  { count: 9, emoji: '🐟' },
];

export const NumberSense: React.FC = () => {
  const [level, setLevel] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const current = LEVELS[level];
  const options = [current.count - 1, current.count, current.count + 1].sort(() => Math.random() - 0.5);

  const handleAnswer = (answer: number) => {
    setSelected(answer);
    if (answer === current.count) {
      setScore(score + 10);
      setTimeout(() => {
        if (level < LEVELS.length - 1) setLevel(level + 1);
        else setLevel(0);
        setSelected(null);
      }, 1500);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-2xl font-bold text-white mb-2">🔢 Number Sense</h3>
      <p className="text-gray-400 text-sm mb-4">How many {current.emoji} do you see? (Score: {score})</p>

      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        {Array.from({ length: current.count }).map((_, i) => (
          <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05 }} className="text-4xl">
            {current.emoji}
          </motion.span>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        {options.map((option) => (
          <motion.button
            key={option} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => handleAnswer(option)}
            className={`w-16 h-16 rounded-xl text-2xl font-bold border-2 ${
              selected === option && option === current.count ? 'bg-green-500 border-green-400' :
              selected === option ? 'bg-red-500 border-red-400' :
              'bg-gray-800 border-gray-700'
            }`}
          >
            {option}
          </motion.button>
        ))}
      </div>

      {selected === current.count && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4 p-2 bg-green-500/20 rounded-xl text-green-400 font-bold">
          <CheckCircle className="w-5 h-5 inline mr-1" /> Correct!
        </motion.div>
      )}
    </div>
  );
};