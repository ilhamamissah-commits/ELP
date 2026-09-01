import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, RotateCcw } from 'lucide-react';

const STEPS = [
  { title: 'Find a way', description: 'Help the fox cross the river safely!' },
  { title: 'Add a Raft', description: 'A raft is a floating platform. Place it in the water.' },
  { title: 'Add a Rope', description: 'A rope connects the raft to the shore. Add it.' },
  { title: 'Test the Crossing', description: 'Now the fox can safely cross the river!' },
];

export const AnimalCrossing: React.FC = () => {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else setCompleted(true);
  };

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-2xl font-bold text-white mb-2">🦊 Animal Crossing</h3>
      <p className="text-gray-400 text-sm mb-4">Solve the problem using engineering!</p>

      <div className="flex flex-col items-center gap-4 mb-6 min-h-[200px] bg-[#1a1a1a] rounded-xl border border-gray-800 p-4">
        {/* Visual Setup */}
        <div className="flex items-center justify-between w-full px-4">
          <span className="text-6xl">🦊</span>
          <div className="flex-1 mx-4 h-2 bg-blue-500/50 rounded-full" />
          <span className="text-6xl">🌲</span>
        </div>

        {/* Solution Stage */}
        {step >= 1 && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-4xl">🛟</motion.div>}
        {step >= 2 && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-3xl">🪢</motion.div>}
        {completed && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-5xl">🎉</motion.div>}
      </div>

      <div className="bg-gray-800 p-4 rounded-xl mb-4">
        <p className="text-white font-bold mb-1">{STEPS[step].title}</p>
        <p className="text-gray-400 text-sm">{STEPS[step].description}</p>
      </div>

      <button onClick={handleNext} className="w-full py-3 bg-indigo-600 rounded-lg text-white font-bold hover:bg-indigo-500">
        {completed ? '✔ Done!' : 'Next Step →'}
      </button>

      {completed && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4 p-3 bg-green-500/20 rounded-xl text-green-400 font-bold">
          <CheckCircle className="w-5 h-5 inline mr-1" /> The fox is safely across!
        </motion.div>
      )}
    </div>
  );
};