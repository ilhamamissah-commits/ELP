import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const PROBLEMS = [
  { a: 5, b: 2, emoji: '🍎' },
  { a: 8, b: 3, emoji: '⭐' },
  { a: 10, b: 4, emoji: '🍓' },
  { a: 7, b: 5, emoji: '🐟' },
];

export const SubtractionGame: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const current = PROBLEMS[index];
  const correctAnswer = current.a - current.b;
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
      <h3 className="text-2xl font-bold text-white mb-2">➖ Subtraction</h3>
      <p className="text-gray-400 text-sm mb-4">Take away the second group! (Score: {score})</p>

      <div className="flex justify-center items-end gap-6 mb-6">
        <div className="flex flex-col items-center">
          <span className="text-2xl text-white mb-2">{current.a}</span>
          <div className="flex gap-1">
            {Array.from({ length: current.a }).map((_, i) => <span key={i} className="text-3xl">{current.emoji}</span>)}
          </div>
        </div>
        <span className="text-4xl text-white">-</span>
        <div className="flex flex-col items-center">
          <span className="text-2xl text-white mb-2">{current.b}</span>
          <div className="flex gap-1 opacity-30">
            {Array.from({ length: current.b }).map((_, i) => <span key={i} className="text-3xl line-through">{current.emoji}</span>)}
          </div>
        </div>
        <span className="text-4xl text-white">=</span>
        <span className="text-4xl text-white">?</span>
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