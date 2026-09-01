import React from 'react';
import { motion } from 'framer-motion';

// Define 7 Learning Worlds (With their existing subjects)
const LEARNING_WORLDS = [
  {
    id: 'language', 
    title: 'Language World', 
    emoji: '📚', 
    color: 'bg-blue-500',
    description: 'English, Arabic, Reading & Stories'
  },
  {
    id: 'maths', 
    title: 'Math World', 
    emoji: '🔢', 
    color: 'bg-yellow-500',
    description: 'Numbers, Operations, Abacus & Logic'
  },
  {
    id: 'stem', 
    title: 'STEM World', 
    emoji: '🔬', 
    color: 'bg-red-500',
    description: 'Science, Engineering & Robotics'
  },
  {
    id: 'digital', 
    title: 'Digital World', 
    emoji: '💻', 
    color: 'bg-purple-500',
    description: 'Computing, AI & Digital Safety'
  },
  {
    id: 'creative', 
    title: 'Creative World', 
    emoji: '🎨', 
    color: 'bg-pink-500',
    description: 'Art & Design'
  },
  {
    id: 'global', 
    title: 'Global World', 
    emoji: '🌍', 
    color: 'bg-teal-500',
    description: 'Geography, Cultures & Humanities'
  },
  {
    id: 'life', 
    title: 'Life World', 
    emoji: '❤️', 
    color: 'bg-emerald-500',
    description: 'Wellbeing, Practical Life & PE'
  }
];

interface LearningWorldProps {
  onSelect: (subjectId: string) => void;
}

export const LearningWorld: React.FC<LearningWorldProps> = ({ onSelect }) => {
  return (
    <div className="w-full max-w-4xl mx-auto relative flex-1 min-h-[70vh] bg-gradient-to-br from-[#0b132b] via-[#1a1a3e] to-[#0d1f1f] rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center py-8 px-4">
      
      {/* Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] top-[-10%] left-[-10%] animate-pulse" />
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] bottom-[-10%] right-[-10%] animate-pulse delay-1000" />
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-white rounded-full opacity-20 animate-float"
            style={{ 
              width: Math.random() * 3 + 1 + 'px', 
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%', 
              top: Math.random() * 100 + '%',
              animationDuration: Math.random() * 10 + 10 + 's',
              animationDelay: Math.random() * 5 + 's'
            }}
          />
        ))}
      </div>

      <h2 className="relative z-10 text-3xl font-bold text-white mb-2">Choose Your Learning World</h2>
      <p className="relative z-10 text-gray-400 mb-8">Tap a world to begin your adventure!</p>

      {/* 7 Learning Zones Grid */}
      <div className="relative z-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-3xl">
        {LEARNING_WORLDS.map((world, index) => (
          <motion.button
            key={world.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(world.id)}
            className={`${world.color} bg-opacity-20 border-2 border-white/10 hover:border-white/40 rounded-2xl p-4 flex flex-col items-center text-center transition-all`}
          >
            <span className="text-5xl mb-2">{world.emoji}</span>
            <h3 className="text-white font-bold text-sm">{world.title}</h3>
            <p className="text-gray-400 text-[10px] mt-1 leading-tight">{world.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};