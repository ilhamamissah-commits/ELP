import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

const PARTS = [
  { id: 1, name: 'Monitor', emoji: '🖥️', description: 'Shows pictures and videos' },
  { id: 2, name: 'Keyboard', emoji: '⌨️', description: 'Used for typing letters and numbers' },
  { id: 3, name: 'Mouse', emoji: '🖱️', description: 'Used for clicking and moving around' },
  { id: 4, name: 'CPU', emoji: '🗄️', description: 'The "brain" of the computer' },
  { id: 5, name: 'Printer', emoji: '🖨️', description: 'Prints pictures and documents on paper' },
  { id: 6, name: 'Tablet', emoji: '📱', description: 'A touch-screen computer you can hold' },
  { id: 7, name: 'Speaker', emoji: '🔊', description: 'Lets you hear sound' },
  { id: 8, name: 'Camera', emoji: '📷', description: 'Takes photos and videos' },
];

export const ComputerBasics: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [learned, setLearned] = useState<number[]>([]);

  const current = PARTS[index];

  const handleNext = () => {
    if (!learned.includes(current.id)) {
      setLearned([...learned, current.id]);
      setScore(score + 10);
    }
    setIndex((index + 1) % PARTS.length);
  };

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-2xl font-bold text-white mb-2">💻 Computer Basics</h3>
      <p className="text-gray-400 text-sm mb-4">Learn the parts of a computer! (Score: {score})</p>

      <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 mb-4">
        <div className="text-7xl mb-3">{current.emoji}</div>
        <p className="text-2xl font-bold text-white mb-2">{current.name}</p>
        <p className="text-gray-400">{current.description}</p>
      </div>

      <button onClick={handleNext} className="w-full py-3 bg-indigo-600 rounded-lg text-white font-bold flex justify-center items-center gap-2">
        Next Part <ArrowRight className="w-4 h-4" />
      </button>

      {learned.length === PARTS.length && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4 p-3 bg-green-500/20 rounded-xl text-green-400 font-bold">
          <CheckCircle className="w-5 h-5 inline mr-1" /> You learned all the parts!
        </motion.div>
      )}
    </div>
  );
};