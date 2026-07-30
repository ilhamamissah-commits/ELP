import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VirtualLabProps {
  experimentId?: string; // We pass this from App.tsx
  onComplete?: (score: number) => void;
}

// --- Master Experiment Database ---
const ALL_EXPERIMENTS = {
  'bio-1': {
    title: 'Plant Life Cycle',
    icon: '🌱',
    question: 'How does a tiny seed become a big plant?',
    steps: ['Place the seed in the soil.', 'Water it gently every day.', 'Watch the sprout break through!', 'It grows into a full plant!'],
    conclusion: 'Plants need soil, water, and sunlight to grow!'
  },
  'bio-2': {
    title: 'My Amazing Heart',
    icon: '🫀',
    question: 'What does your heart do all day?',
    steps: ['Place your hand on your chest to feel your heartbeat.', 'Run in place for 10 seconds!', 'Feel your heart beating faster.', 'Take deep breaths to slow it down.'],
    conclusion: 'Your heart pumps blood to give your body energy!'
  },
  'phy-1': {
    title: 'Sink or Float?',
    icon: '💧',
    question: 'Why do some objects sink and others float?',
    steps: ['Place a heavy rock into the water.', 'Place a light cork on the water.', 'Push the cork down with your finger.', 'Compare the rock and the cork.'],
    conclusion: 'Heavy objects sink. Objects lighter than water float!'
  }
  // Add more IDs here later
};

export const VirtualLab: React.FC<VirtualLabProps> = ({ experimentId = 'bio-1', onComplete }) => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);

  // Get the specific experiment based on the ID passed in
  const experiment = ALL_EXPERIMENTS[experimentId as keyof typeof ALL_EXPERIMENTS] || ALL_EXPERIMENTS['bio-1'];
  const currentStep = experiment.steps[step];
  const isLastStep = step === experiment.steps.length - 1;

  const handleNext = () => {
    if (step < experiment.steps.length - 1) {
      setStep(prev => prev + 1);
      setScore(prev => prev + 10);
    } else {
      // Experiment Complete
      const finalScore = score + 50;
      if (onComplete) onComplete(finalScore);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="text-gray-400 text-xs mb-2 flex justify-between px-2">
        <span>Experiment</span>
        <span className="text-indigo-400">Step {step + 1} of {experiment.steps.length}</span>
      </div>

      <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 mb-4 min-h-[200px] flex flex-col items-center justify-center gap-3">
        <div className="text-6xl mb-2">{experiment.icon}</div>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <h3 className="text-xl font-bold text-white">{currentStep}</h3>
            {step === 0 && <p className="text-gray-400 text-sm mt-2 italic">"{experiment.question}"</p>}
          </motion.div>
        </AnimatePresence>
      </div>

      <button onClick={handleNext} className="w-full py-3 bg-indigo-600 rounded-xl text-white font-bold flex justify-center items-center gap-2 hover:bg-indigo-500 transition">
        {isLastStep ? 'Finish Experiment 🎉' : 'Next Step →'}
      </button>
    </div>
  );
};