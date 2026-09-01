import React, { useState } from 'react';
import { motion } from 'framer-motion';

const COLORS = [
  { id: 1, name: 'Red', hex: '#ef4444', dark: '#991b1b' },
  { id: 2, name: 'Blue', hex: '#3b82f6', dark: '#1e40af' },
  { id: 3, name: 'Yellow', hex: '#f59e0b', dark: '#92400e' },
  { id: 4, name: 'Green', hex: '#22c55e', dark: '#14532d' },
  { id: 5, name: 'Purple', hex: '#a855f7', dark: '#581c87' },
  { id: 6, name: 'Orange', hex: '#f97316', dark: '#9a3412' },
];

export const ColorTablets: React.FC = () => {
  const [matched, setMatched] = useState<number[]>([]);

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-xl font-bold text-white mb-2">🎨 Color Tablets</h3>
      <p className="text-gray-400 text-sm mb-4">Tap each color to learn its name!</p>

      <div className="grid grid-cols-3 gap-4">
        {COLORS.map((color) => {
          const isMatched = matched.includes(color.id);
          return (
            <motion.button
              key={color.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setMatched([...matched, color.id])}
              className={`aspect-square rounded-xl border-4 border-white/10 flex items-center justify-center transition-all
                ${isMatched ? 'text-white font-bold' : ''}`}
              style={{ backgroundColor: isMatched ? color.hex : '#1a1a1a' }}
            >
              {isMatched ? <span>{color.name}</span> : <span className="text-gray-500">?</span>}
            </motion.button>
          );
        })}
      </div>

      {matched.length === COLORS.length && (
        <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 font-bold">
          🎉 You know all your colors!
        </div>
      )}
    </div>
  );
};