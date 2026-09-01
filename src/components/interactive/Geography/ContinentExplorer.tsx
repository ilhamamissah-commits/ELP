import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { speakWord } from '../../../services/audioEngine';

const CONTINENTS = [
  { id: 1, name: 'Africa', emoji: '🦒', fact: 'Home to the Sahara Desert and the Nile River.' },
  { id: 2, name: 'Antarctica', emoji: '🐧', fact: 'The coldest place on Earth, covered in ice!' },
  { id: 3, name: 'Asia', emoji: '🐼', fact: 'The largest continent with the most people.' },
  { id: 4, name: 'Europe', emoji: '🗼', fact: 'Famous for castles, art, and history.' },
  { id: 5, name: 'North America', emoji: '🗽', fact: 'Home to the USA, Canada, and Mexico.' },
  { id: 6, name: 'South America', emoji: '🦜', fact: 'Contains the Amazon Rainforest!' },
  { id: 7, name: 'Oceania', emoji: '🦘', fact: 'Includes Australia and thousands of islands.' },
];

export const ContinentExplorer: React.FC = () => {
  const [revealed, setRevealed] = useState<number[]>([]);

  const revealContinent = (id: number) => {
    if (!revealed.includes(id)) {
      setRevealed([...revealed, id]);
      const continent = CONTINENTS.find(c => c.id === id);
      if (continent) speakWord(continent.fact);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-2xl font-bold text-white mb-2">🌍 Continent Explorer</h3>
      <p className="text-gray-400 text-sm mb-6">Tap each continent to learn a fun fact!</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {CONTINENTS.map((continent) => {
          const isRevealed = revealed.includes(continent.id);
          return (
            <motion.button
              key={continent.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => revealContinent(continent.id)}
              className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 p-3
                ${isRevealed ? 'bg-indigo-500/20 border-indigo-400' : 'bg-[#1a1a1a] border-gray-700'}
              `}
            >
              {isRevealed ? (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl">{continent.emoji}</span>
                  <span className="text-sm font-bold text-white">{continent.name}</span>
                  <span className="text-xs text-gray-400 leading-tight">{continent.fact}</span>
                </div>
              ) : (
                <span className="text-4xl opacity-30">🌍</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {revealed.length === CONTINENTS.length && (
        <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 font-bold">
          🎉 You explored all 7 continents!
        </div>
      )}
    </div>
  );
};