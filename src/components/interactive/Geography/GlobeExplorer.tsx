import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProgressStore } from '../../../store/useProgressStore';

// --- 1. DEEP DATA: Countries, Capitals, Currencies, Flags, Culture ---
const COUNTRY_DATABASE = [
  { 
    id: 1, continent: 'North America', emoji: '🗽', flag: '🇺🇸', 
    name: 'United States', capital: 'Washington D.C.', currency: 'USD ($)', 
    funFact: 'Home to the Grand Canyon and NASA!' 
  },
  { 
    id: 2, continent: 'North America', emoji: '🍁', flag: '🇨🇦', 
    name: 'Canada', capital: 'Ottawa', currency: 'CAD (C$)', 
    funFact: 'Has more lakes than the rest of the world combined!' 
  },
  { 
    id: 3, continent: 'South America', emoji: '🌴', flag: '🇧🇷', 
    name: 'Brazil', capital: 'Brasília', currency: 'BRL (R$)', 
    funFact: 'Home to the Amazon Rainforest and the largest river in the world.' 
  },
  { 
    id: 4, continent: 'Europe', emoji: '🗼', flag: '🇫🇷', 
    name: 'France', capital: 'Paris', currency: 'EUR (€)', 
    funFact: 'Known for the Eiffel Tower and delicious croissants!' 
  },
  { 
    id: 5, continent: 'Europe', emoji: '🏛️', flag: '🇮🇹', 
    name: 'Italy', capital: 'Rome', currency: 'EUR (€)', 
    funFact: 'Rome is home to the ancient Colosseum.' 
  },
  { 
    id: 6, continent: 'Africa', emoji: '🦒', flag: '🇰🇪', 
    name: 'Kenya', capital: 'Nairobi', currency: 'KES (Sh)', 
    funFact: 'Known for the "Big Five" animals in the Maasai Mara.' 
  },
  { 
    id: 7, continent: 'Africa', emoji: '🏜️', flag: '🇪🇬', 
    name: 'Egypt', capital: 'Cairo', currency: 'EGP (E£)', 
    funFact: 'Home to the Great Pyramids, one of the 7 Wonders of the World.' 
  },
  { 
    id: 8, continent: 'Asia', emoji: '🐼', flag: '🇨🇳', 
    name: 'China', capital: 'Beijing', currency: 'CNY (¥)', 
    funFact: 'The Great Wall of China is visible from space!' 
  },
  { 
    id: 9, continent: 'Asia', emoji: '🏯', flag: '🇯🇵', 
    name: 'Japan', capital: 'Tokyo', currency: 'JPY (¥)', 
    funFact: 'Known for cherry blossoms, sushi, and advanced technology.' 
  },
  { 
    id: 10, continent: 'Australia', emoji: '🦘', flag: '🇦🇺', 
    name: 'Australia', capital: 'Canberra', currency: 'AUD (A$)', 
    funFact: 'Home to unique animals like kangaroos and koalas.' 
  },
  { 
    id: 11, continent: 'Antarctica', emoji: '🐧', flag: '❄️', 
    name: 'Antarctica', capital: 'None', currency: 'None', 
    funFact: 'The coldest, windiest, and driest continent on Earth!' 
  }
];

export const GlobeExplorer: React.FC = () => {
  const [revealed, setRevealed] = useState<number[]>([]);
  
  // --- GET CHILD AGE FROM STORE ---
  const { childAge } = useProgressStore();

  // --- AGE 2-6: SORT BY CONTINENT ONLY ---
  const continents = ['North America', 'South America', 'Europe', 'Africa', 'Asia', 'Australia', 'Antarctica'];
  
  const handleReveal = (id: number) => {
    if (!revealed.includes(id)) {
      setRevealed([...revealed, id]);
    }
  };

  // --- RENDER FOR YOUNGER KIDS (AGES 2-6) ---
  if (childAge <= 6) {
    return (
      <div className="max-w-2xl w-full mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
        <h3 className="text-2xl font-bold text-white mb-2">🌍 Globe Explorer</h3>
        <p className="text-gray-400 text-sm mb-6">Tap a continent to discover it!</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {continents.map((cont, index) => {
            const sample = COUNTRY_DATABASE.find(c => c.continent === cont);
            const isRevealed = revealed.some(id => COUNTRY_DATABASE.find(c => c.id === id)?.continent === cont);
            
            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const ids = COUNTRY_DATABASE.filter(c => c.continent === cont).map(c => c.id);
                  setRevealed([...revealed, ...ids]);
                }}
                className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300
                  ${isRevealed ? 'bg-indigo-500/20 border-indigo-400' : 'border-gray-700 bg-[#1a1a1a]'}
                `}
              >
                {isRevealed ? (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-4xl">{sample?.flag || '🌍'}</span>
                    <span className="text-sm font-bold text-white">{cont}</span>
                    <span className="text-[10px] text-gray-400">Discovered!</span>
                  </div>
                ) : (
                  <span className="text-4xl opacity-30">🌍</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // --- RENDER FOR OLDER KIDS (AGES 7-10) ---
  return (
    <div className="max-w-2xl w-full mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-2xl font-bold text-white mb-2">🌍 Global Explorer</h3>
      <p className="text-gray-400 text-sm mb-6">Tap a flag to learn about its country!</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {COUNTRY_DATABASE.map((country) => {
          const isRevealed = revealed.includes(country.id);
          return (
            <motion.button
              key={country.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleReveal(country.id)}
              className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 p-2
                ${isRevealed ? 'bg-indigo-500/20 border-indigo-400' : 'border-gray-700 bg-[#1a1a1a]'}
              `}
            >
              {isRevealed ? (
                <div className="flex flex-col items-center gap-1 w-full">
                  <span className="text-4xl">{country.flag}</span>
                  <span className="text-xs font-bold text-white">{country.name}</span>
                  <div className="text-[8px] text-gray-400 mt-1 space-y-0.5 bg-black/40 p-1 rounded w-full">
                    <div>Capital: {country.capital}</div>
                    <div>Currency: {country.currency}</div>
                    <div className="text-indigo-300 truncate">💡 {country.funFact}</div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-4xl opacity-30">🌍</span>
                  <span className="text-[10px] text-gray-500 mt-1">{country.flag}</span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};