import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  height?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color = 'bg-indigo-500', height = 'h-2' }) => {
  return (
    <div className={`w-full bg-gray-800 rounded-full ${height} overflow-hidden`}>
      <div 
        className={`${color} h-full transition-all duration-500`} 
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
};