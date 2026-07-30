import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick, label = 'Back' }) => {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium mb-4 group"
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      {label}
    </button>
  );
};