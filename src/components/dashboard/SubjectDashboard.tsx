import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Calculator, FlaskConical, Sigma, Layers, 
  Palette, PenTool, Globe2, Leaf, HeartPulse, Brain, 
  Wrench, Rocket, Bot, Languages, Puzzle, Cpu
} from 'lucide-react';

interface SubjectDashboardProps {
  worldId: string;
  onSelect: (subjectId: string) => void;
  onBack: () => void;
}

export const SubjectDashboard: React.FC<SubjectDashboardProps> = ({ worldId, onSelect, onBack }) => {
  
  // Dynamic content based on which World is clicked
  const getWorldSubjects = (): { id: string; label: string; icon: React.ReactNode; color: string }[] => {
    switch(worldId) {
      case 'language': return [
        { id: 'english', label: 'English', icon: <BookOpen className="w-6 h-6" />, color: 'bg-blue-500' },
        { id: 'arabic', label: 'Arabic', icon: <Languages className="w-6 h-6" />, color: 'bg-emerald-500' },
        { id: 'writing', label: 'Writing', icon: <PenTool className="w-6 h-6" />, color: 'bg-indigo-500' }
      ];
      case 'maths': return [
        { id: 'maths', label: 'Maths', icon: <Calculator className="w-6 h-6" />, color: 'bg-yellow-500' },
        { id: 'abacus', label: 'Abacus', icon: <Sigma className="w-6 h-6" />, color: 'bg-orange-500' },
        { id: 'logic', label: 'Logic', icon: <Puzzle className="w-6 h-6" />, color: 'bg-teal-500' }
      ];
      case 'digital': return [
        { id: 'digital', label: 'Digital World', icon: <Cpu className="w-6 h-6" />, color: 'bg-purple-500' },
      ];
      case 'creative': return [
        { id: 'art', label: 'Art & Design', icon: <Palette className="w-6 h-6" />, color: 'bg-pink-500' },
        { id: 'writing', label: 'Writing', icon: <PenTool className="w-6 h-6" />, color: 'bg-indigo-500' }
      ];
      case 'global': return [
        { id: 'geography', label: 'Geography', icon: <Globe2 className="w-6 h-6" />, color: 'bg-cyan-500' }
      ];
      case 'life': return [
        { id: 'practical-life', label: 'Practical Life', icon: <Leaf className="w-6 h-6" />, color: 'bg-green-500' },
        { id: 'wellbeing', label: 'Wellbeing', icon: <HeartPulse className="w-6 h-6" />, color: 'bg-red-500' }
      ];
      case 'stem': return [
        { id: 'science', label: 'Science', icon: <FlaskConical className="w-6 h-6" />, color: 'bg-red-500' },
        { id: 'engineering', label: 'Engineering', icon: <Wrench className="w-6 h-6" />, color: 'bg-green-500' },
        { id: 'robotics', label: 'Robotics', icon: <Bot className="w-6 h-6" />, color: 'bg-purple-500' },
      ];
      default: return [];
    }
  };

  const subjects = getWorldSubjects();

  return (
    <div className="w-full max-w-lg mx-auto pt-4">
      {/* Back Button */}
      <button onClick={onBack} className="text-sm text-gray-400 hover:text-white mb-4">← Back to Worlds</button>
      
      <h2 className="text-xl font-bold text-white mb-6 text-center capitalize">{worldId} World</h2>
      
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