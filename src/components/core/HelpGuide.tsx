import React from 'react';
import { Modal } from './Modal';
import { Lightbulb } from 'lucide-react';

interface HelpGuideProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  steps: string[];
}

export const HelpGuide: React.FC<HelpGuideProps> = ({ isOpen, onClose, title, steps }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-start gap-3">
        <div className="flex items-center gap-2 text-yellow-400">
          <Lightbulb className="w-6 h-6" />
          <h2 className="text-xl font-bold text-white">How to play: {title}</h2>
        </div>
        
        <div className="space-y-3 my-4 text-gray-300 text-sm w-full">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-3 items-start">
              <span className="bg-gray-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {index + 1}
              </span>
              <p>{step}</p>
            </div>
          ))}
        </div>

        <button 
          onClick={onClose}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold transition-colors mt-2"
        >
          Got it! Let's start 🚀
        </button>
      </div>
    </Modal>
  );
};