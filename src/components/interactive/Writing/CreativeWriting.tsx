import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CHARACTERS = [
  { id: 1, name: 'a brave knight', emoji: '🛡️' },
  { id: 2, name: 'a cute cat', emoji: '🐱' },
  { id: 3, name: 'a flying dragon', emoji: '🐉' },
  { id: 4, name: 'a curious astronaut', emoji: '👨‍🚀' },
];

const PLACES = [
  { id: 1, name: 'in the forest', emoji: '🌲' },
  { id: 2, name: 'at the beach', emoji: '🏖️' },
  { id: 3, name: 'on the moon', emoji: '🌙' },
  { id: 4, name: 'at a castle', emoji: '🏰' },
];

const ACTIONS = [
  { id: 1, name: 'was looking for treasure', emoji: '💰' },
  { id: 2, name: 'was making a sandcastle', emoji: '🏰' },
  { id: 3, name: 'was dancing happily', emoji: '💃' },
  { id: 4, name: 'was flying to the stars', emoji: '✨' },
];

export const CreativeWriting: React.FC = () => {
  const [character, setCharacter] = useState(CHARACTERS[0]);
  const [place, setPlace] = useState(PLACES[0]);
  const [action, setAction] = useState(ACTIONS[0]);
  const [saved, setSaved] = useState(false);

  const story = `Once upon a time, ${character.name} ${action.name} ${place.name}. It was a magical adventure!`;

  const handleSave = () => setSaved(true);

  return (
    <div className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-2xl font-bold text-white mb-2">✍️ Creative Writing</h3>
      <p className="text-gray-400 text-sm mb-6">Build your own story!</p>

      {/* Character Select */}
      <div className="mb-4">
        <p className="text-gray-400 text-sm mb-2">1. Choose a character:</p>
        <div className="flex justify-center gap-2">
          {CHARACTERS.map(c => (
            <motion.button
              key={c.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => { setCharacter(c); setSaved(false); }}
              className={`p-2 rounded-xl border-2 text-2xl ${character.id === c.id ? 'bg-indigo-500/20 border-indigo-400' : 'bg-[#1a1a1a] border-gray-700'}`}
            >
              {c.emoji}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Place Select */}
      <div className="mb-4">
        <p className="text-gray-400 text-sm mb-2">2. Choose a place:</p>
        <div className="flex justify-center gap-2">
          {PLACES.map(p => (
            <motion.button
              key={p.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => { setPlace(p); setSaved(false); }}
              className={`p-2 rounded-xl border-2 text-2xl ${place.id === p.id ? 'bg-green-500/20 border-green-400' : 'bg-[#1a1a1a] border-gray-700'}`}
            >
              {p.emoji}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Action Select */}
      <div className="mb-6">
        <p className="text-gray-400 text-sm mb-2">3. Choose an action:</p>
        <div className="flex justify-center gap-2">
          {ACTIONS.map(a => (
            <motion.button
              key={a.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => { setAction(a); setSaved(false); }}
              className={`p-2 rounded-xl border-2 text-2xl ${action.id === a.id ? 'bg-purple-500/20 border-purple-400' : 'bg-[#1a1a1a] border-gray-700'}`}
            >
              {a.emoji}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Story Output */}
      <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 mb-4">
        <AnimatePresence mode="wait">
          <motion.p key={story} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-white text-lg italic">
            {story}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-4">
        <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 rounded-xl text-white font-bold hover:bg-indigo-500">
          {saved ? '✅ Saved!' : '💾 Save Story'}
        </button>
      </div>
    </div>
  );
};