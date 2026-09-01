import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

const SCENARIOS = [
  { id: 1, scenario: 'A stranger online asks for your home address.', safe: false, tip: 'Never give personal information to strangers online!' },
  { id: 2, scenario: 'You see a nice picture of a dog on a website.', safe: true, tip: 'Looking at pictures is perfectly safe! But always ask an adult before clicking.' },
  { id: 3, scenario: 'Someone online is being mean to you.', safe: false, tip: 'If someone is unkind online, tell a trusted adult immediately!' },
  { id: 4, scenario: 'A website asks you to create a password.', safe: true, tip: 'Passwords are important! Use a secret word only you and your parents know.' },
  { id: 5, scenario: 'A pop-up says you won a free game, but it wants your email.', safe: false, tip: 'Too good to be true? It might be a trick! Never click without asking an adult.' },
  { id: 6, scenario: 'You want to watch a cartoon, so you ask your mom for permission.', safe: true, tip: 'Always ask a parent before watching or playing anything new!' },
  { id: 7, scenario: 'A friend shares a video of you without asking.', safe: false, tip: 'You should always ask permission before sharing pictures or videos of others.' },
  { id: 8, scenario: 'You are learning to type your name on a keyboard.', safe: true, tip: 'Learning computer skills is great! Just stay safe while you do it.' },
];

export const DigitalSafety: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const current = SCENARIOS[index];

  const handleAnswer = (safe: boolean) => {
    setSelected(safe);
    if (safe === current.safe) {
      setScore(score + 10);
    }
  };

  const nextScenario = () => {
    setSelected(null);
    setIndex((index + 1) % SCENARIOS.length);
  };

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-2xl font-bold text-white mb-2">🔒 Digital Safety</h3>
      <p className="text-gray-400 text-sm mb-4">Learn to stay safe online! (Score: {score})</p>

      <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 mb-4">
        <p className="text-white font-bold text-lg mb-2">Scenario {index + 1}:</p>
        <p className="text-gray-300 mb-4">{current.scenario}</p>
      </div>

      <div className="flex justify-center gap-3 mb-4">
        <button
          onClick={() => handleAnswer(true)}
          disabled={selected !== null}
          className={`px-6 py-2 rounded-lg font-bold border-2 ${selected === true ? 'border-green-500 bg-green-500/20 text-green-400' : 'bg-gray-800 border-gray-700 text-white'}`}
        >
          ✅ Safe
        </button>
        <button
          onClick={() => handleAnswer(false)}
          disabled={selected !== null}
          className={`px-6 py-2 rounded-lg font-bold border-2 ${selected === false ? 'border-red-500 bg-red-500/20 text-red-400' : 'bg-gray-800 border-gray-700 text-white'}`}
        >
          ❌ Unsafe
        </button>
      </div>

      {selected !== null && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-3 bg-blue-500/20 rounded-xl text-blue-300 text-sm mb-4">
          💡 <strong>{current.tip}</strong>
        </motion.div>
      )}

      {selected !== null && (
        <button onClick={nextScenario} className="w-full py-2 bg-indigo-600 rounded-lg text-white font-bold">Next Scenario</button>
      )}
    </div>
  );
};