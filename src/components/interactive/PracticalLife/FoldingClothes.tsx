import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const STEPS = [
  { icon: '👕', title: 'Lay the Shirt Flat', description: 'Place the shirt on a flat surface.' },
  { icon: '↔️', title: 'Fold Left Side', description: 'Fold the left sleeve and side inward.' },
  { icon: '↔️', title: 'Fold Right Side', description: 'Fold the right sleeve and side inward.' },
  { icon: '⬇️', title: 'Fold in Half', description: 'Fold the shirt in half from the bottom to the top.' },
  { icon: '📦', title: 'Tidy and Neat!', description: 'Your shirt is now beautifully folded!' },
];

export const FoldingClothes: React.FC = () => {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else setCompleted(true);
  };

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-2xl font-bold text-white mb-2">👕 Folding Clothes</h3>
      <p className="text-gray-400 text-sm mb-6">Learn to fold your clothes neatly!</p>

      {completed ? (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="text-6xl mb-4">👔</div>
          <p className="text-xl font-bold text-green-400 mb-4">Fantastic! You are a folding master!</p>
          <button onClick={() => { setStep(0); setCompleted(false); }} className="px-6 py-2 bg-gray-700 rounded-lg text-white font-bold">
            Do It Again
          </button>
        </motion.div>
      ) : (
        <>
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 mb-6">
            <div className="text-6xl mb-4">{STEPS[step].icon}</div>
            <h4 className="text-xl font-bold text-white mb-2">{STEPS[step].title}</h4>
            <p className="text-gray-400">{STEPS[step].description}</p>
            <div className="mt-4 text-xs text-gray-500">Step {step + 1} of {STEPS.length}</div>
          </div>

          <button onClick={handleNext} className="w-full py-3 bg-indigo-600 rounded-xl text-white font-bold hover:bg-indigo-500 flex items-center justify-center gap-2">
            {step < STEPS.length - 1 ? 'Next Step' : 'Finish'} <ArrowRight className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
};