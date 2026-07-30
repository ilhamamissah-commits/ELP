import React, { useState } from 'react';
import { motion } from 'framer-motion';

// --- 1. THE 4 ADVENTURE JOURNEYS ---
const JOURNEYS = [
  { 
    id: 'explorer', 
    title: 'Little Explorer', 
    emoji: '🐣', 
    description: 'Sensorial, Phonics, Practical Life',
    ageRange: [2, 4] 
  },
  { 
    id: 'thinker', 
    title: 'Curious Thinker', 
    emoji: '🦊', 
    description: 'Reading, Number Sense, Science',
    ageRange: [4, 6] 
  },
  { 
    id: 'scholar', 
    title: 'Confident Scholar', 
    emoji: '🦉', 
    description: 'Grammar, Operations, Geography',
    ageRange: [6, 8] 
  },
  { 
    id: 'master', 
    title: 'Master Learner', 
    emoji: '🐉', 
    description: 'Mental Math, Writing, STEM',
    ageRange: [8, 10] 
  },
];

interface AgeGateProps {
  onSelect: (age: number, name: string) => void;
}

export const AgeGate: React.FC<AgeGateProps> = ({ onSelect }) => {
  const [name, setName] = useState('');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-600">
      
      {/* --- LIVELY BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        {/* Floating Glowing Orbs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse mix-blend-screen" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000 mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl" />
        
        {/* Floating Magical Stars */}
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-float"
            style={{ 
              width: Math.random() * 4 + 2 + 'px', 
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%', 
              top: Math.random() * 100 + '%',
              animationDuration: Math.random() * 10 + 10 + 's',
              animationDelay: Math.random() * 5 + 's'
            }}
          />
        ))}
      </div>

      {/* --- CONTENT --- */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl">
        <div className="text-7xl mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">🌍</div>
        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Choose Your Adventure</h1>
        <p className="text-white/80 mb-8 text-lg font-medium">Select the journey that feels right for you!</p>
        
        {/* Name Input - Glassmorphism style */}
        <div className="mb-10 w-full max-w-sm">
          <input 
            type="text" 
            placeholder="What is your name, adventurer?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl text-white text-center placeholder-white/60 focus:border-yellow-300 outline-none transition shadow-lg text-lg"
          />
        </div>
        
        {/* Adventure Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {JOURNEYS.map((journey) => (
            <motion.button
              key={journey.id}
              whileHover={{ scale: 1.04, y: -5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                const avgAge = Math.round((journey.ageRange[0] + journey.ageRange[1]) / 2);
                onSelect(avgAge, name || journey.title);
              }}
              className="bg-black/40 backdrop-blur-md border-2 border-white/20 hover:border-yellow-300/80 rounded-3xl p-8 flex flex-col items-center gap-4 transition-all shadow-2xl group"
            >
              <div className="text-7xl group-hover:scale-110 transition-transform duration-300">{journey.emoji}</div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white">{journey.title}</h3>
                <p className="text-white/70 text-sm mt-1">{journey.description}</p>
                <div className="mt-3 text-xs bg-white/10 px-3 py-1 rounded-full text-white/50 inline-block border border-white/10">
                  Ages {journey.ageRange[0]} - {journey.ageRange[1]}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};