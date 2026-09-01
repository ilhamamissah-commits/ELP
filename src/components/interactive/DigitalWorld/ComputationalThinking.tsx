import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, RotateCcw } from 'lucide-react';

const CHALLENGES = [
  { id: 1, title: 'Find the Pattern', emoji: '🔴🔵🔴🔵', answer: '🔵', options: ['🔵', '🟡'], hint: 'The pattern alternates Red, Blue, Red, Blue...' },
  { id: 2, title: 'Break the Code', emoji: '⭐🌙⭐🌙⭐', answer: '🌙', options: ['🌙', '☀️'], hint: 'Star, Moon, Star, Moon...' },
  { id: 3, title: 'Sequence the Steps', emoji: '🌱➡️🌿➡️🌳', answer: '🌳', options: ['🌳', '🍂'], hint: 'A seed grows into a plant...' },
  { id: 4, title: 'Input vs Output', emoji: '🎤➡️🔊', answer: 'Sound', options: ['Sound', 'Light'], hint: 'A microphone takes in sound...' },
  { id: 5, title: 'Algorithm Step', emoji: '🍞➡️🔪➡️🍞', answer: 'Toast', options: ['Toast', 'Fruit'], hint: 'You slice bread and toast it...' },
  { id: 6, title: 'Find the Bug', emoji: '1, 2, 3, 🐛, 5', answer: '4', options: ['4', '6'], hint: 'Something is wrong with this sequence!' },
  { id: 7, title: 'Decomposition', emoji: '🍕➡️🍕🍕', answer: 'Slices', options: ['Slices', 'Whole'], hint: 'You break a big pizza into...' },
  { id: 8, title: 'Abstraction', emoji: '🚗🚗🚗', answer: 'Cars', options: ['Cars', 'Colors'], hint: 'What category do all these belong to?' },
];

export const ComputationalThinking: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const current = CHALLENGES[index];

  const handleSelect = (answer: string) => {
    if (isCorrect) return;
    setSelected(answer);
    if (answer === current.answer) {
      setIsCorrect(true);
      setScore(score + 10);
      setTimeout(() => {
        setIndex((index + 1) % CHALLENGES.length);
        setSelected(null);
        setIsCorrect(false);
      }, 1500);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-2xl font-bold text-white mb-2">🧠 Computational Thinking</h3>
      <p className="text-gray-400 text-sm mb-4">Solve the code puzzles! (Score: {score})</p>

      <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 mb-6">
        <p className="text-2xl font-bold text-white mb-4">{current.emoji}</p>
        <p className="text-white font-bold mb-2">{current.title}</p>
        <p className="text-gray-400 text-xs mb-4">{current.hint}</p>
      </div>

      <div className="flex justify-center gap-4 mb-4">
        {current.options.map((option) => (
          <motion.button
            key={option}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSelect(option)}
            className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center text-3xl font-bold ${
              selected === option && isCorrect ? 'bg-green-500 border-green-400' :
              selected === option ? 'bg-red-500 border-red-400' :
              'bg-gray-800 border-gray-700 text-white'
            }`}
          >
            {option}
          </motion.button>
        ))}
      </div>

      {isCorrect && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-3 bg-green-500/20 rounded-xl text-green-400 font-bold">
          <CheckCircle className="w-5 h-5 inline mr-1" /> Correct!
        </motion.div>
      )}
    </div>
  );
};