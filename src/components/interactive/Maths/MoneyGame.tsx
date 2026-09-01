import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const COINS = [
  { value: 1, emoji: '🪙', name: '1¢' },
  { value: 5, emoji: '🪙', name: '5¢' },
  { value: 10, emoji: '🪙', name: '10¢' },
  { value: 25, emoji: '🪙', name: '25¢' },
];

const PROBLEMS = [
  { coins: [1, 1, 5], answer: 7 },
  { coins: [10, 10, 5], answer: 25 },
  { coins: [25, 10, 5], answer: 40 },
  { coins: [10, 10, 10, 5], answer: 35 },
];

export const MoneyGame: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const current = PROBLEMS[index];

  const handleAnswer = (answer: number) => {
    setSelected(answer);
    if (answer === current.answer) {
      setTimeout(() => {
        setIndex((index + 1) % PROBLEMS.length);
        setSelected(null);
      }, 1500);
    }
  };

  const options = [current.answer - 5, current.answer, current.answer + 5].sort(() => Math.random() - 0.5);

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-2xl font-bold text-white mb-2">💰 Money</h3>
      <p className="text-gray-400 text-sm mb-4">How much money is this?</p>

      <div className="flex justify-center gap-2 mb-6">
        {current.coins.map((coin, i) => (
          <span key={i} className="text-4xl">{COINS.find(c => c.value === coin)?.emoji}</span>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        {options.map((option) => (
          <motion.button
            key={option} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => handleAnswer(option)}
            className={`w-16 h-16 rounded-xl text-2xl font-bold border-2 ${
              selected === option && option === current.answer ? 'bg-green-500 border-green-400' :
              selected === option ? 'bg-red-500 border-red-400' :
              'bg-gray-800 border-gray-700'
            }`}
          >
            {option}¢
          </motion.button>
        ))}
      </div>

      {selected === current.answer && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4 p-2 bg-green-500/20 rounded-xl text-green-400 font-bold">
          <CheckCircle className="w-5 h-5 inline mr-1" /> Correct!
        </motion.div>
      )}
    </div>
  );
};