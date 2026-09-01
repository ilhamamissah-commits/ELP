import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TEMPS = [
  { id: 1, name: 'Cold', emoji: '❄️', description: 'Very cold like ice!' },
  { id: 2, name: 'Cool', emoji: '🧊', description: 'A little chilly!' },
  { id: 3, name: 'Warm', emoji: '🌤️', description: 'Nice and cozy!' },
  { id: 4, name: 'Hot', emoji: '🔥', description: 'Very hot like fire!' },
];

export const ThermicTablets: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-xl font-bold text-white mb-2">🌡️ Thermic Tablets</h3>
      <p className="text-gray-400 text-sm mb-4">Tap to feel the temperature!</p>

      <div className="grid grid-cols-2 gap-4">
        {TEMPS.map((temp) => (
          <motion.button
            key={temp.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(temp.id)}
            className={`p-6 rounded-xl border-2 transition-all ${selected === temp.id ? 'bg-cyan-500/20 border-cyan-400' : 'bg-[#1a1a1a] border-gray-700'}`}
          >
            <span className="text-4xl block mb-2">{temp.emoji}</span>
            <span className="font-bold text-white">{temp.name}</span>
            {selected === temp.id && <p className="text-sm text-gray-400 mt-1">{temp.description}</p>}
          </motion.button>
        ))}
      </div>
    </div>
  );
};