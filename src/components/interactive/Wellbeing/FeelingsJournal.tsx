import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const MOODS = [
  { id: 1, emoji: '😊', label: 'Happy', color: 'bg-yellow-500/20 border-yellow-500' },
  { id: 2, emoji: '😢', label: 'Sad', color: 'bg-blue-500/20 border-blue-500' },
  { id: 3, emoji: '😡', label: 'Angry', color: 'bg-red-500/20 border-red-500' },
  { id: 4, emoji: '😴', label: 'Tired', color: 'bg-gray-500/20 border-gray-500' },
  { id: 5, emoji: '😟', label: 'Worried', color: 'bg-orange-500/20 border-orange-500' },
];

export const FeelingsJournal: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (selectedMood !== null) setSaved(true);
  };

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-2xl font-bold text-white mb-2">📓 Feelings Journal</h3>
      <p className="text-gray-400 text-sm mb-6">How do you feel right now? Be honest!</p>

      <div className="grid grid-cols-5 gap-2 mb-6">
        {MOODS.map((mood) => (
          <motion.button
            key={mood.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => { setSelectedMood(mood.id); setSaved(false); }}
            className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center transition-all ${selectedMood === mood.id ? mood.color : 'bg-[#1a1a1a] border-gray-700'}`}
          >
            <span className="text-3xl">{mood.emoji}</span>
            <span className="text-[10px] text-gray-400 mt-1">{mood.label}</span>
          </motion.button>
        ))}
      </div>

      <button 
        onClick={handleSave} 
        disabled={selectedMood === null}
        className="w-full py-3 bg-indigo-600 rounded-xl text-white font-bold hover:bg-indigo-500 disabled:opacity-50"
      >
        Save My Feeling
      </button>

      {saved && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4 p-3 bg-green-500/20 rounded-xl text-green-400 font-bold">
          <CheckCircle className="w-5 h-5 inline mr-1" /> 
          Thank you for sharing! It's okay to feel {MOODS.find(m => m.id === selectedMood)?.label.toLowerCase()}.
        </motion.div>
      )}
    </div>
  );
};