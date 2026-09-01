import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FLAGS = [
  { id: 1, country: 'USA', flag: '🇺🇸', capital: 'Washington D.C.' },
  { id: 2, country: 'UK', flag: '🇬🇧', capital: 'London' },
  { id: 3, country: 'France', flag: '🇫🇷', capital: 'Paris' },
  { id: 4, country: 'Japan', flag: '🇯🇵', capital: 'Tokyo' },
  { id: 5, country: 'Brazil', flag: '🇧🇷', capital: 'Brasília' },
  { id: 6, country: 'Ghana', flag: '🇬🇭', capital: 'Accra' },
  { id: 7, country: 'Egypt', flag: '🇪🇬', capital: 'Cairo' },
  { id: 8, country: 'Australia', flag: '🇦🇺', capital: 'Canberra' },
];

export const FlagMatch: React.FC = () => {
  const [matched, setMatched] = useState<number[]>([]);

  const handleMatch = (id: number) => {
    if (!matched.includes(id)) {
      setMatched([...matched, id]);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-2xl font-bold text-white mb-2">🚩 Flag Match</h3>
      <p className="text-gray-400 text-sm mb-6">Tap each flag to learn its country and capital!</p>

      <div className="grid grid-cols-2 gap-4">
        {FLAGS.map((flag) => {
          const isMatched = matched.includes(flag.id);
          return (
            <motion.button
              key={flag.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMatch(flag.id)}
              className={`p-4 rounded-xl border-2 transition-all ${isMatched ? 'bg-yellow-500/20 border-yellow-400' : 'bg-[#1a1a1a] border-gray-700'}`}
            >
              <span className="text-5xl block mb-2">{flag.flag}</span>
              {isMatched ? (
                <div>
                  <span className="font-bold text-white">{flag.country}</span>
                  <p className="text-xs text-gray-400">Capital: {flag.capital}</p>
                </div>
              ) : (
                <span className="text-gray-500">Tap to reveal</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {matched.length === FLAGS.length && (
        <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 font-bold">
          🎉 You know all the flags!
        </div>
      )}
    </div>
  );
};