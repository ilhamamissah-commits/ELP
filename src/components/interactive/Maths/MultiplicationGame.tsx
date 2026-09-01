import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const PROBLEMS = [
  { a: 2, b: 3, emoji: '🍎' },
  { a: 3, b: 4, emoji: '⭐' },
  { a: 2, b: 5, emoji: '🍓' },
  { a: 4, b: 2, emoji: '🐟' },
];

export const MultiplicationGame: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const current = PROBLEMS[index];
  const correctAnswer = current.a * current.b;
  const options = [correctAnswer - 1, correctAnswer, correctAnswer + 1].sort(() => Math.random() - 0.5);

  const handleAnswer = (answer: number) => {
    setSelected(answer);
    if (answer === correctAnswer) {
      setScore(score + 10);
      setTimeout(() => {
        setIndex((index + 1) % PROBLEMS.length);
        setSelected(null);
      }, 1500);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-2xl font-bold text-white mb-2">✖️ Multiplication</h3>
      <p className="text-gray-400 text-sm mb-4">Count the groups! (Score: {score})</p>

      <div className="flex justify-center items-end gap-4 mb-6">
        <span className="text-2xl text-white">{current.a} groups of {current.b} {current.emoji}</span>
        <span className="text-4xl text-white">=</span>
        <span className="text-4xl text-white">?</span>
      </div>

      <div className="flex justify-center mb-6">
        {Array.from({ length: current.a }).map((_, row) => (
          <div key={row} className="flex gap-1 mx-1">
            {Array.from({ length: current.b }).map((_, col) => <span key={col} className="text-2xl">{current.emoji}</span>)}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        {options.map((option) => (
          <motion.button
            key={option} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => handleAnswer(option)}
            className={`w-16 h-16 rounded-xl text-2xl font-bold border-2 ${
              selected === option && option === correctAnswer ? 'bg-green-500 border-green-400' :
              selected === option ? 'bg-red-500 border-red-400' :
              'bg-gray-800 border-gray-700'
            }`}
          >
            {option}
          </motion.button>
        ))}
      </div>

      {selected === correctAnswer && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4 p-2 bg-green-500/20 rounded-xl text-green-400 font-bold">
          <CheckCircle className="w-5 h-5 inline mr-1" /> Correct!
        </motion.div>
      )}
    </div>
  );
};