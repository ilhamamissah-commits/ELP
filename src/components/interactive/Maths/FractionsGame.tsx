import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const FRACTIONS = [
  { numerator: 1, denominator: 2, emoji: '🍕' },
  { numerator: 1, denominator: 3, emoji: '🍕' },
  { numerator: 2, denominator: 4, emoji: '🍕' },
  { numerator: 3, denominator: 4, emoji: '🍕' },
];

export const FractionsGame: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const current = FRACTIONS[index];
  const correctAnswer = `${current.numerator}/${current.denominator}`;

  const options = [
    correctAnswer,
    `1/${current.denominator}`,
    `${current.denominator}/${current.numerator}`
  ].sort(() => Math.random() - 0.5);

  const handleAnswer = (answer: string) => {
    setSelected(answer);
    if (answer === correctAnswer) {
      setTimeout(() => {
        setIndex((index + 1) % FRACTIONS.length);
        setSelected(null);
      }, 1500);
    }
  };

  // Visual pizza (just simple text for now)
  const pizzaSlices = Array.from({ length: current.denominator }).map((_, i) => (
    <div key={i} className={`w-8 h-8 rounded-full border-2 ${i < current.numerator ? 'bg-yellow-400' : 'bg-gray-700'}`}></div>
  ));

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-2xl font-bold text-white mb-2">🍕 Fractions</h3>
      <p className="text-gray-400 text-sm mb-4">What fraction is shaded?</p>

      <div className="flex justify-center gap-2 mb-6">{pizzaSlices}</div>

      <div className="flex justify-center gap-4">
        {options.map((option) => (
          <motion.button
            key={option} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => handleAnswer(option)}
            className={`px-6 py-2 rounded-xl text-2xl font-bold border-2 ${
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