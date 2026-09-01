import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

const SCENARIOS = [
  {
    id: 1, 
    scenario: 'Your friend is crying because they dropped their ice cream.',
    options: ['Laugh at them', 'Share your ice cream', 'Tell them to stop crying'],
    correct: 1,
    explanation: 'Sharing is a great way to show kindness!'
  },
  {
    id: 2,
    scenario: 'A new student is sitting alone at lunch.',
    options: ['Ignore them', 'Ask them to sit with you', 'Make fun of them'],
    correct: 1,
    explanation: 'Making someone feel welcome is very kind!'
  },
  {
    id: 3,
    scenario: 'Your sibling is scared of the dark.',
    options: ['Call them a baby', 'Stay with them until they feel safe', 'Turn off the light'],
    correct: 1,
    explanation: 'Helping someone feel safe shows great empathy!'
  }
];

export const EmpathyBuilder: React.FC = () => {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const scenario = SCENARIOS[scenarioIndex];

  const handleAnswer = (index: number) => {
    setSelected(index);
    if (index === scenario.correct) {
      setCorrect(true);
      setScore(score + 10);
    }
  };

  const nextScenario = () => {
    setSelected(null);
    setCorrect(false);
    setScenarioIndex((scenarioIndex + 1) % SCENARIOS.length);
  };

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <h3 className="text-2xl font-bold text-white mb-2">❤️ Empathy Builder</h3>
      <p className="text-gray-400 text-sm mb-4">What would you do? (Score: {score})</p>

      <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 mb-4">
        <p className="text-white font-bold text-lg">{scenario.scenario}</p>
      </div>

      <div className="space-y-3 mb-6">
        {scenario.options.map((option, index) => (
          <motion.button
            key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswer(index)}
            disabled={selected !== null}
            className={`w-full p-3 rounded-xl border-2 font-bold transition-all ${
              selected === index && index === scenario.correct ? 'bg-green-500/20 border-green-500 text-green-400' :
              selected === index ? 'bg-red-500/20 border-red-500 text-red-400' :
              'bg-[#1a1a1a] border-gray-700 text-white'
            }`}
          >
            {option}
          </motion.button>
        ))}
      </div>

      {selected !== null && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="space-y-3">
          <div className={`p-3 rounded-xl font-bold ${correct ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {correct ? <><CheckCircle className="w-5 h-5 inline mr-1" /> {scenario.explanation}</> : 'Let\'s think about how they feel.'}
          </div>
          <button onClick={nextScenario} className="w-full py-3 bg-indigo-600 rounded-xl text-white font-bold">
            Next Scenario <ArrowRight className="w-4 h-4 inline" />
          </button>
        </motion.div>
      )}
    </div>
  );
};