import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const CalmCorner: React.FC = () => {
  const [stage, setStage] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);

  useEffect(() => {
    if (stage === 0) return;
    setIsBreathing(true);
    const timer = setTimeout(() => setStage(0), 6000);
    return () => clearTimeout(timer);
  }, [stage]);

  const startBreathing = () => setStage(1);

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-2xl font-bold text-white mb-2">🧘 Calm Corner</h3>
      <p className="text-gray-400 text-sm mb-6">Let's take a moment to relax!</p>

      <div className="bg-[#1a1a1a] p-8 rounded-xl border border-gray-800 mb-6 flex flex-col items-center justify-center min-h-[200px]">
        <motion.div
          animate={isBreathing ? { scale: [1, 1.5, 1] } : {}}
          transition={{ duration: 3, repeat: isBreathing ? Infinity : 0 }}
          className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 opacity-80"
        />
        <p className="text-white font-bold mt-4">
          {stage === 0 ? 'Take a deep breath' : stage === 1 ? 'Breathe in... Breathe out...' : ''}
        </p>
      </div>

      <button
        onClick={startBreathing}
        disabled={isBreathing}
        className="w-full py-3 bg-teal-600 rounded-xl text-white font-bold hover:bg-teal-500 disabled:opacity-50"
      >
        {isBreathing ? 'Keep Breathing...' : 'Start Breathing Exercise'}
      </button>
    </div>
  );
};