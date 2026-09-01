import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, RotateCcw } from 'lucide-react';

const COMMANDS = ['Move Up', 'Move Down', 'Move Left', 'Move Right', 'Pick Up'];

const CHALLENGES = [
  { id: 1, title: 'Move the Star', targetSequence: ['Move Right', 'Move Up'], emoji: '⭐' },
  { id: 2, title: 'Collect the Gem', targetSequence: ['Move Down', 'Move Right'], emoji: '💎' },
  { id: 3, title: 'Grab the Apple', targetSequence: ['Move Right', 'Move Right', 'Pick Up'], emoji: '🍎' },
  { id: 4, title: 'Reach the Door', targetSequence: ['Move Down', 'Move Left', 'Move Up'], emoji: '🚪' },
  { id: 5, title: 'Fetch the Ball', targetSequence: ['Move Up', 'Move Right', 'Pick Up'], emoji: '⚽' },
  { id: 6, title: 'Save the Dog', targetSequence: ['Move Right', 'Move Down', 'Pick Up'], emoji: '🐶' },
  { id: 7, title: 'Collect 3 Stars', targetSequence: ['Move Up', 'Move Up', 'Move Right', 'Pick Up'], emoji: '⭐' },
  { id: 8, title: 'Maze Escape', targetSequence: ['Move Left', 'Move Down', 'Move Right', 'Pick Up'], emoji: '🏆' },
];

export const CodingBasics: React.FC = () => {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [sequence, setSequence] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const current = CHALLENGES[challengeIndex];

  useEffect(() => {
    setSequence([]);
    setCompleted(false);
  }, [challengeIndex]);

  const addCommand = (command: string) => setSequence([...sequence, command]);
  const removeLast = () => setSequence(sequence.slice(0, -1));

  const runCode = () => {
    const correct = JSON.stringify(sequence) === JSON.stringify(current.targetSequence);
    if (correct) {
      setCompleted(true);
      setScore(score + 10);
    } else {
      alert("The robot didn't follow the path. Try again!");
    }
  };

  const nextChallenge = () => {
    setChallengeIndex((challengeIndex + 1) % CHALLENGES.length);
  };

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-2xl font-bold text-white">💻 Coding Basics</h3>
        <button onClick={() => { setSequence([]); setCompleted(false); }} className="p-2 bg-gray-800 rounded-lg text-gray-300"><RotateCcw className="w-4 h-4" /></button>
      </div>
      <p className="text-gray-400 text-sm mb-4">Program the robot to reach the target! (Score: {score})</p>

      <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 mb-4">
        <div className="text-5xl mb-2">{current.emoji}</div>
        <p className="text-white font-bold">{current.title}</p>
        <p className="text-gray-400 text-xs">Goal: Program the robot to reach this.</p>
      </div>

      <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 mb-4 min-h-[50px] flex flex-wrap gap-2 justify-center">
        {sequence.length === 0 ? <span className="text-gray-500 italic">Write your code below...</span> : sequence.map((cmd, idx) => <span key={idx} className="bg-gray-700 px-3 py-1 rounded-lg text-white text-sm">{cmd}</span>)}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {COMMANDS.map((command) => (
          <motion.button
            key={command}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => addCommand(command)}
            className="p-3 bg-gray-800 rounded-lg text-white font-bold border-2 border-gray-700 hover:border-indigo-400"
          >
            {command}
          </motion.button>
        ))}
      </div>

      <div className="flex justify-center gap-3 mb-4">
        <button onClick={removeLast} className="px-4 py-2 bg-red-600 rounded-lg text-white font-bold">Delete</button>
        <button onClick={runCode} className="px-6 py-2 bg-indigo-600 rounded-lg text-white font-bold">Run Code!</button>
      </div>

      {completed && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-3 bg-green-500/20 rounded-xl text-green-400 font-bold">
          <CheckCircle className="w-5 h-5 inline mr-1" /> Code works perfectly!
          <button onClick={nextChallenge} className="ml-2 px-4 py-1 bg-green-600 rounded-lg text-white">Next Challenge</button>
        </motion.div>
      )}
    </div>
  );
};