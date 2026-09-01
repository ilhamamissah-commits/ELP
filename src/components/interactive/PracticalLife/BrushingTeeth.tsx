import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const STEPS = [
  { icon: '🪥', title: 'Get Your Toothbrush', description: 'Pick up your toothbrush.' },
  { icon: '🧴', title: 'Add Toothpaste', description: 'Squeeze a pea-sized amount of toothpaste.' },
  { icon: '😁', title: 'Brush Front Teeth', description: 'Brush your front teeth in small circles.' },
  { icon: '🦷', title: 'Brush Back Teeth', description: 'Brush your back molars too.' },
  { icon: '🔄', title: 'Brush for 2 Minutes', description: 'Keep brushing for two whole minutes!' },
  { icon: '💦', title: 'Rinse & Spit', description: 'Spit out the foam and rinse your mouth.' },
  { icon: '✨', title: 'Clean Smile!', description: 'Your teeth are clean and healthy!' },
];

export const BrushingTeeth: React.FC = () => {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else setCompleted(true);
  };

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-2xl font-bold text-white mb-2">🦷 Brushing Teeth</h3>
      <p className="text-gray-400 text-sm mb-6">Learn how to brush your teeth properly!</p>

      {completed ? (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="text-6xl mb-4">😁</div>
          <p className="text-xl font-bold text-green-400 mb-4">Amazing! Your teeth are super clean!</p>
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