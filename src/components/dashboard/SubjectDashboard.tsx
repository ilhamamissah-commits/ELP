import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calculator, FlaskConical, Sigma, Layers } from 'lucide-react';

interface SubjectDashboardProps {
  onSelect: (subjectId: string) => void;
}

export const SubjectDashboard: React.FC<SubjectDashboardProps> = ({ onSelect }) => {
  const subjects = [
    { id: 'english', label: 'English', icon: <BookOpen className="w-6 h-6" />, color: 'bg-blue-500' },
    { id: 'maths', label: 'Mathematics', icon: <Calculator className="w-6 h-6" />, color: 'bg-yellow-500' },
    { id: 'science', label: 'Science', icon: <FlaskConical className="w-6 h-6" />, color: 'bg-red-500' },
    { id: 'abacus', label: 'Abacus', icon: <Sigma className="w-6 h-6" />, color: 'bg-orange-500' },
    { id: 'vocabulary', label: 'Vocabulary', icon: <Layers className="w-6 h-6" />, color: 'bg-purple-500' },
  ];

  return (
    <div className="w-full max-w-lg mx-auto pt-4">
      <h2 className="text-xl font-bold text-white mb-6 text-center">Learning Hub</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {subjects.map((sub) => (
          <motion.button
            key={sub.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(sub.id)}
            className="bg-app-card p-5 rounded-2xl hover:bg-[#252525] transition-colors border border-transparent hover:border-gray-700 flex flex-col items-center justify-center text-center h-36"
          >
            <div className={`${sub.color} bg-opacity-10 p-3 rounded-full mb-2`}>
              <div className="text-white">{sub.icon}</div>
            </div>
            <h3 className="font-bold text-white">{sub.label}</h3>
          </motion.button>
        ))}
      </div>
    </div>
  );
};