import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { speakWord } from '../../../services/audioEngine';

const LANDFORMS = [
  { id: 1, name: 'Mountain', emoji: '⛰️', description: 'Very tall, rocky land that reaches high into the sky.' },
  { id: 2, name: 'Valley', emoji: '🏞️', description: 'A low area between hills or mountains.' },
  { id: 3, name: 'River', emoji: '🏞️', description: 'A long body of water that flows across the land.' },
  { id: 4, name: 'Desert', emoji: '🏜️', description: 'A very dry area with little rain and lots of sand.' },
  { id: 5, name: 'Ocean', emoji: '🌊', description: 'A huge body of salt water that covers most of Earth.' },
  { id: 6, name: 'Lake', emoji: '💧', description: 'A body of water surrounded by land.' },
  { id: 7, name: 'Island', emoji: '🏝️', description: 'A piece of land surrounded by water.' },
  { id: 8, name: 'Forest', emoji: '🌳', description: 'A large area covered with trees and plants.' },
];

export const Landforms: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleClick = (id: number) => {
    setSelected(id);
    const landform = LANDFORMS.find(l => l.id === id);
    if (landform) speakWord(`${landform.name}. ${landform.description}`);
  };

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-2xl font-bold text-white mb-2">🗺️ Landforms</h3>
      <p className="text-gray-400 text-sm mb-6">Tap a landform to learn its name!</p>

      <div className="grid grid-cols-2 gap-4">
        {LANDFORMS.map((landform) => (
          <motion.button
            key={landform.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(landform.id)}
            className={`p-4 rounded-xl border-2 transition-all ${selected === landform.id ? 'bg-cyan-500/20 border-cyan-400' : 'bg-[#1a1a1a] border-gray-700'}`}
          >
            <span className="text-4xl block mb-2">{landform.emoji}</span>
            <span className="font-bold text-white">{landform.name}</span>
            {selected === landform.id && (
              <p className="text-xs text-gray-300 mt-2">{landform.description}</p>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};