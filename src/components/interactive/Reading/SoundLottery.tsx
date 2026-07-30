import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, CheckCircle, RotateCcw } from 'lucide-react';

// --- 1. Types & Interfaces ---
interface SoundCard {
  id: string;
  emoji: string;
  word: string;
  sound: string; // The phoneme it starts with
}

interface SoundLotteryProps {
  onComplete?: (score: number) => void;
}

// --- 2. THE PHONICS DATA BANK (SATPIN + More) ---
const PHONICS_BANK: SoundCard[] = [
  // Phase 1: SATPIN (The most important starting sounds)
  { id: 's1', emoji: '☀️', word: 'Sun', sound: 's' },
  { id: 's2', emoji: '🐍', word: 'Snake', sound: 's' },
  { id: 'a1', emoji: '🍎', word: 'Apple', sound: 'a' },
  { id: 'a2', emoji: '🐜', word: 'Ant', sound: 'a' },
  { id: 't1', emoji: '🐯', word: 'Tiger', sound: 't' },
  { id: 't2', emoji: '🌴', word: 'Tree', sound: 't' },
  { id: 'p1', emoji: '🐷', word: 'Pig', sound: 'p' },
  { id: 'p2', emoji: '🍕', word: 'Pizza', sound: 'p' },
  { id: 'i1', emoji: '🦎', word: 'Iguana', sound: 'i' },
  { id: 'i2', emoji: '🖍️', word: 'Ink', sound: 'i' },
  { id: 'n1', emoji: '🪹', word: 'Nest', sound: 'n' },
  { id: 'n2', emoji: '🥜', word: 'Nut', sound: 'n' },
];

// --- 3. Component Implementation ---
export const SoundLottery: React.FC<SoundLotteryProps> = ({ onComplete }) => {
  // -- Game State --
  const [currentSound, setCurrentSound] = useState<string>('s');
  const [cards, setCards] = useState<SoundCard[]>([]);
  const [revealed, setRevealed] = useState<string[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // -- Setup a new round --
  const setupRound = (targetSound: string) => {
    // 1. Find 3 cards with the target sound
    const validCards = PHONICS_BANK.filter(c => c.sound === targetSound);
    // 2. Grab 3 random *different* sound cards as distractors
    const distractors = PHONICS_BANK
      .filter(c => c.sound !== targetSound)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    // 3. Combine, Shuffle, and Set
    const newCards = [...validCards, ...distractors].sort(() => 0.5 - Math.random());
    setCards(newCards);
    setRevealed([]);
    setFound([]);
  };

  // -- Start or Advance the Game --
  const startGame = () => {
    // Cycle through sounds: s, a, t, p, i, n
    const sounds = ['s', 'a', 't', 'p', 'i', 'n'];
    const nextSound = sounds[round % sounds.length];
    
    setCurrentSound(nextSound);
    setupRound(nextSound);
    setRound(prev => prev + 1);
    setIsFinished(false);
  };

  // Initial load
  useEffect(() => {
    startGame();
  }, []);

  // -- Play the Sound using Speech Synthesis --
  const playSound = (sound: string) => {
    // Stop any currently playing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(sound);
    utterance.rate = 0.5; // Slow down for children
    utterance.pitch = 1.2; // Slightly higher pitch is easier for kids to hear
    window.speechSynthesis.speak(utterance);
  };

  // -- Handle Card Click --
  const handleReveal = (id: string, sound: string) => {
    if (revealed.includes(id) || found.includes(id) || isFinished) return;
    
    // Reveal the card
    setRevealed(prev => [...prev, id]);
    
    // Check if it's the correct sound
    if (sound === currentSound) {
      setFound(prev => [...prev, id]);
      setScore(prev => prev + 10);
      playSound(currentSound); // Reward them with the sound!
    }
  };

  // -- Check Round Completion --
  useEffect(() => {
    // If all correct cards are found, start next round
    const correctCardIds = cards.filter(c => c.sound === currentSound).map(c => c.id);
    const allFound = correctCardIds.every(id => found.includes(id));
    
    if (allFound && correctCardIds.length > 0 && !isFinished) {
      setIsFinished(true);
      setTimeout(() => {
        startGame();
      }, 1500); // Brief celebration before moving on
    }
  }, [found, cards, currentSound, isFinished]);

  // -- End Lesson --
  const handleFinish = () => {
    if (onComplete) onComplete(score);
  };

  // --- 4. Render UI ---
  return (
    <div className="max-w-2xl mx-auto p-6 bg-app-card rounded-2xl border border-app-border shadow-xl">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white">Sound Lottery</h3>
          <p className="text-gray-400 text-sm">Find the cards with the correct sound!</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-yellow-400 font-bold text-sm">⭐ {score}</span>
          <button 
            onClick={() => { setRound(0); setScore(0); startGame(); }} 
            className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-gray-300"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TARGET SOUND */}
      <div className="flex flex-col items-center justify-center mb-6 p-4 bg-[#222222] rounded-xl border border-gray-800">
        <span className="text-gray-400 text-xs mb-2">Find the sound</span>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => playSound(currentSound)}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white transition-colors"
          >
            <Volume2 className="w-6 h-6" />
          </button>
          <span className="text-4xl font-mono font-bold text-indigo-400 border-2 border-indigo-500/30 px-4 py-2 rounded-xl bg-indigo-500/10">
            /{currentSound}/
          </span>
        </div>
        <p className="text-gray-500 text-xs mt-2">Tap the speaker to hear the sound!</p>
      </div>

      {/* 3x3 GRID (The Lottery) */}
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
        {cards.map((card) => {
          const isRevealed = revealed.includes(card.id);
          const isFound = found.includes(card.id);
          const isHidden = !isRevealed && !isFound;

          return (
            <motion.button
              key={card.id}
              whileHover={!isHidden ? {} : { scale: 1.05 }}
              whileTap={!isHidden ? {} : { scale: 0.95 }}
              onClick={() => handleReveal(card.id, card.sound)}
              className={`aspect-square rounded-2xl border-2 text-3xl flex flex-col items-center justify-center transition-all duration-300 
                ${isFound ? 'bg-green-500/20 border-green-500 shadow-lg shadow-green-500/20' : ''}
                ${isRevealed && !isFound ? 'bg-red-500/10 border-red-500/50' : ''}
                ${isHidden ? 'bg-[#2a2a2a] border-gray-700 hover:border-gray-500 hover:bg-[#333]' : ''}
              `}
              disabled={!isHidden || isFinished}
            >
              {isHidden ? (
                <span className="text-4xl opacity-20">?</span>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-4xl">{card.emoji}</span>
                  <span className="text-xs font-bold text-white/80">{card.word}</span>
                  {isFound && (
                    <motion.div 
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="mt-1"
                    >
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </motion.div>
                  )}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* PROGRESS & ACTIONS */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Round {round}
        </div>
        
        {round >= 6 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleFinish}
            className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-colors"
          >
            Finish & Earn Stars
          </motion.button>
        )}
      </div>

      {/* COMPLETION MESSAGE (Floating) */}
      <AnimatePresence>
        {isFinished && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mt-4 p-4 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-center"
          >
            <p className="text-indigo-300 font-bold">🎉 All correct! Moving to the next sound...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};