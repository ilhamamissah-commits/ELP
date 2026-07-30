import React from 'react';
import { motion } from 'framer-motion';
import { setEmotion } from '../../services/AITeacher';

interface EmotionCheckProps {
  onComplete: () => void;
}

export const EmotionCheck: React.FC<EmotionCheckProps> = ({ onComplete }) => {
  const handleSelect = (emotion: 'happy' | 'tired' | 'frustrated' | 'neutral') => {
    setEmotion(emotion);
    onComplete();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-app-card border border-app-border p-8 rounded-2xl shadow-2xl text-center max-w-sm mx-auto relative z-50"
    >
      <h2 className="text-2xl font-bold text-white mb-2">How are you feeling?</h2>
      <p className="text-gray-400 text-sm mb-6">This helps me pick the best lesson for you today!</p>
      
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => handleSelect('happy')} className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl hover:bg-green-500/30 transition text-4xl">😊</button>
        <button onClick={() => handleSelect('tired')} className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-xl hover:bg-blue-500/30 transition text-4xl">😴</button>
        <button onClick={() => handleSelect('frustrated')} className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl hover:bg-red-500/30 transition text-4xl">😟</button>
        <button onClick={() => handleSelect('neutral')} className="p-4 bg-gray-500/20 border border-gray-500/50 rounded-xl hover:bg-gray-500/30 transition text-4xl">🤔</button>
      </div>
    </motion.div>
  );
};