import React from 'react';
import { motion } from 'framer-motion';
import { WORLD_BUILDINGS } from '../../data/worldMapData';

interface LearningWorldProps {
  onSelect: (subjectId: string) => void;
}

export const LearningWorld: React.FC<LearningWorldProps> = ({ onSelect }) => {
  return (
    <div className="w-full max-w-4xl mx-auto relative flex-1 min-h-[60vh] bg-gradient-to-br from-[#0b132b] via-[#1a1a3e] to-[#0d1f1f] rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center py-8">
      
      {/* Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] top-[-10%] left-[-10%] animate-pulse" />
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] bottom-[-10%] right-[-10%] animate-pulse delay-1000" />
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

      {/* Buildings Grid - 3x3 */}
      <div className="relative z-20 grid grid-cols-3 gap-4 md:gap-6 p-6 md:p-8 w-full">
        {WORLD_BUILDINGS.map((building, index) => (
          <motion.button
            key={building.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ scale: 1.05, y: -8 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(building.id)}
            className="flex flex-col items-center justify-center gap-2 cursor-pointer group w-full"
          >
            <div 
              className={`${building.color} w-full aspect-square max-w-[100px] md:max-w-[120px] rounded-2xl shadow-xl border-2 border-white/10 group-hover:border-white/40 transition-all duration-300 flex items-center justify-center text-white relative overflow-hidden`}
            >
              <div className={`absolute inset-0 ${building.color} opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500`} />
              <div className="relative z-10 scale-125">
                {building.icon}
              </div>
            </div>
            <span className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all whitespace-nowrap text-center">
              {building.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Ambient Floating Clouds */}
      <div className="absolute top-6 left-6 text-5xl opacity-20 animate-float pointer-events-none">☁️</div>
      <div className="absolute top-10 right-14 text-5xl opacity-20 animate-float delay-1000 pointer-events-none">☁️</div>
    </div>
  );
};