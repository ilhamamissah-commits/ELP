import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SOUNDS = [
  { id: 1, name: 'Soft Bell', emoji: '🔔' },
  { id: 2, name: 'Rattle', emoji: '🎁' },
  { id: 3, name: 'Whistle', emoji: '🎺' },
  { id: 4, name: 'Drum', emoji: '🥁' },
  { id: 5, name: 'Rain', emoji: '🌧️' },
  { id: 6, name: 'Birds', emoji: '🐦' },
];

export const SoundBoxes: React.FC = () => {
  const [opened, setOpened] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTap = (name: string, id: number) => {
    if (!opened.includes(id)) setOpened([...opened, id]);
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 1000);
  };

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-xl font-bold text-white mb-2">🔊 Sound Boxes</h3>
      <p className="text-gray-400 text-sm mb-4">Tap each box to hear the sound!</p>

      <div className="grid grid-cols-3 gap-4">
        {SOUNDS.map((sound) => (
          <motion.button
            key={sound.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => handleTap(sound.name, sound.id)}
            className={`p-4 rounded-xl border-2 transition-all ${isPlaying && opened.includes(sound.id) ? 'bg-indigo-500/20 border-indigo-400' : 'bg-[#1a1a1a] border-gray-700'}`}
          >
            <span className="text-4xl block mb-2">{opened.includes(sound.id) ? sound.emoji : '🎁'}</span>
            {opened.includes(sound.id) && <span className="text-white font-bold">{sound.name}</span>}
          </motion.button>
        ))}
      </div>
    </div>
  );
};