import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { speakWord } from '../../../services/audioEngine';

const OCEANS = [
  { id: 1, name: 'Pacific Ocean', emoji: '🌊', fact: 'The largest and deepest ocean.' },
  { id: 2, name: 'Atlantic Ocean', emoji: '🌊', fact: 'Separates North America from Europe.' },
  { id: 3, name: 'Indian Ocean', emoji: '🌊', fact: 'Warmest ocean, near Asia and Africa.' },
  { id: 4, name: 'Arctic Ocean', emoji: '❄️', fact: 'The smallest and coldest ocean.' },
  { id: 5, name: 'Southern Ocean', emoji: '🐧', fact: 'Surrounds Antarctica.' },
];

export const OceanExplorer: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleClick = (id: number) => {
    setSelected(id);
    const ocean = OCEANS.find(o => o.id === id);
    if (ocean) speakWord(`${ocean.name}. ${ocean.fact}`);
  };

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-2xl font-bold text-white mb-2">🌊 Ocean Explorer</h3>
      <p className="text-gray-400 text-sm mb-6">Tap each ocean to learn about it!</p>

      <div className="grid grid-cols-1 gap-4">
        {OCEANS.map((ocean) => (
          <motion.button
            key={ocean.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleClick(ocean.id)}
            className={`p-4 rounded-xl border-2 transition-all ${selected === ocean.id ? 'bg-blue-500/20 border-blue-400' : 'bg-[#1a1a1a] border-gray-700'}`}
          >
            <span className="text-4xl block mb-2">{ocean.emoji}</span>
            <span className="font-bold text-white">{ocean.name}</span>
            {selected === ocean.id && (
              <p className="text-xs text-gray-300 mt-2">{ocean.fact}</p>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};