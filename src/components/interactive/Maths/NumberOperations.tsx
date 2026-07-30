import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const NumberOperations: React.FC = () => {
  const [number, setNumber] = useState(5);
  const [score, setScore] = useState(0);

  const add = () => setNumber(prev => Math.min(prev + 1, 20));
  const subtract = () => setNumber(prev => Math.max(prev - 1, 0));

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-xl font-bold text-white mb-2">🧮 Number Operations</h3>
      <p className="text-gray-400 text-sm mb-4">Use the buttons to add and subtract!</p>

      {/* Big Number Display */}
      <div className="text-8xl font-bold text-indigo-400 my-6 bg-[#1a1a1a] p-4 rounded-xl border border-gray-700">
        {number}
      </div>

      <div className="flex justify-center gap-8 mb-6">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={subtract}
          className="w-16 h-16 bg-red-600 rounded-full text-white text-3xl font-bold hover:bg-red-500 transition shadow-lg"
        >
          −
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={add}
          className="w-16 h-16 bg-green-600 rounded-full text-white text-3xl font-bold hover:bg-green-500 transition shadow-lg"
        >
          +
        </motion.button>
      </div>

      {/* Progress Check */}
      <button 
        onClick={() => setScore(prev => prev + 1)}
        className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-bold transition"
      >
        I finished this lesson! (Score: {score})
      </button>
    </div>
  );
};