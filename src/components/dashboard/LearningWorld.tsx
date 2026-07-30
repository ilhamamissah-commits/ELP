import React from 'react';
import { motion } from 'framer-motion';
import { WORLD_BUILDINGS } from '../../data/worldMapData';

interface LearningWorldProps {
  onSelect: (subjectId: string) => void;
  onOpenPortal: () => void;
}

export const LearningWorld: React.FC<LearningWorldProps> = ({ onSelect, onOpenPortal }) => {
  return (
    <div className="w-full max-w-5xl mx-auto relative h-[85vh] bg-gradient-to-br from-[#0b132b] via-[#1a1a3e] to-[#0d1f1f] rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center perspective-1000">
      
      {/* 1. Deep Space Particle Background (The "Deep Tech" Look) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] top-[-10%] left-[-10%] animate-pulse" />
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] bottom-[-10%] right-[-10%] animate-pulse delay-1000" />
        
        {/* Floating Stars */}
        {[...Array(30)].map((_, i) => (
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

      {/* 2. The Floating 3D Map Ground */}
      <div className="relative z-10 w-full max-w-4xl transform rotate-x-6 scale-90 md:scale-100 transition-transform duration-700 hover:rotate-x-2">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent rounded-[50%] blur-2xl" />
        
        {/* 3. The Buildings in an Elegant Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 p-8 relative z-20">
          {WORLD_BUILDINGS.map((building, index) => (
            <motion.button
              key={building.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
              whileHover={{ scale: 1.08, y: -12, transition: { type: 'spring', stiffness: 400 } }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(building.id)}
              className="flex flex-col items-center gap-3 cursor-pointer group"
            >
              {/* The Isometric Building Block */}
              <div 
                className={`${building.color} w-24 h-24 md:w-28 md:h-28 rounded-2xl shadow-2xl border-2 border-white/10 group-hover:border-white/40 transition-all duration-300 flex items-center justify-center text-white relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/30 before:to-transparent before:opacity-0 group-hover:before:opacity-100 before:transition-opacity`}
              >
                {/* Glowing Underlight */}
                <div className={`absolute inset-0 ${building.color} opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500`} />
                
                {/* Large Icon */}
                <div className="relative z-10 scale-125">
                  {building.icon}
                </div>
              </div>
              
              {/* The Glowing Label */}
              <div className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-bold px-4 py-2 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all whitespace-nowrap">
                {building.label}
              </div>
            </motion.button>
          ))}
        </div>

        {/* 4. The Child Avatar (At the bottom center with a magical glow) */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 z-30">
          <div className="relative p-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_30px_rgba(99,102,241,0.5)] animate-pulse">
            <div className="bg-[#0b132b] p-3 rounded-full border-2 border-indigo-400/50 flex items-center justify-center">
              <span className="text-3xl">🧑‍🎓</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Parents Button (Magical Floating Button) */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenPortal}
        className="absolute top-4 right-4 z-50 bg-indigo-600/80 hover:bg-indigo-500 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold transition shadow-lg border border-white/10 flex items-center gap-2"
      >
        <span className="text-sm">👨‍👩‍👧‍👦</span> Parents
      </motion.button>
      
      {/* 6. Ambient Floating Clouds (Decorative) */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-float">☁️</div>
      <div className="absolute top-20 right-20 text-6xl opacity-20 animate-float delay-1000">☁️</div>
    </div>
  );
};

// Add the keyframes for floating stars/clouds to your global CSS if not using Tailwind animations:
// @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
// .animate-float { animation: float 6s ease-in-out infinite; }