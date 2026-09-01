import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const TIMES = [
  { hour: 1, minute: 0, label: '1:00' },
  { hour: 2, minute: 30, label: '2:30' },
  { hour: 6, minute: 0, label: '6:00' },
  { hour: 9, minute: 15, label: '9:15' },
];

export const ClockGame: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const current = TIMES[index];

  const handleAnswer = (answer: string) => {
    setSelected(answer);
    if (answer === current.label) {
      setTimeout(() => {
        setIndex((index + 1) % TIMES.length);
        setSelected(null);
      }, 1500);
    }
  };

  const options = [current.label, `${current.hour + 1}:00`, `${current.hour}:45`].sort(() => Math.random() - 0.5);

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-2xl font-bold text-white mb-2">🕐 Time</h3>
      <p className="text-gray-400 text-sm mb-4">What time is it?</p>

      <div className="flex justify-center mb-6">
        <div className="relative w-40 h-40 bg-gray-800 rounded-full border-4 border-gray-600">
          {/* Hands (visual approximation) */}
          <div className="absolute left-1/2 top-1/2 w-1 h-12 bg-white origin-top -translate-y-1 rotate-0" />
          <div className="absolute left-1/2 top-1/2 w-1 h-8 bg-red-500 origin-top -translate-y-1 rotate-90" />
          <div className="absolute left-1/2 top-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="flex justify-center gap-4">
        {options.map((option) => (
          <motion.button
            key={option} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => handleAnswer(option)}
            className={`px-6 py-2 rounded-xl text-2xl font-bold border-2 ${
              selected === option && option === current.label ? 'bg-green-500 border-green-400' :
              selected === option ? 'bg-red-500 border-red-400' :
              'bg-gray-800 border-gray-700'
            }`}
          >
            {option}
          </motion.button>
        ))}
      </div>

      {selected === current.label && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4 p-2 bg-green-500/20 rounded-xl text-green-400 font-bold">
          <CheckCircle className="w-5 h-5 inline mr-1" /> Correct!
        </motion.div>
      )}
    </div>
  );
};