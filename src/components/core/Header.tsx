import React from 'react';
import { useProgressStore } from '../../store/useProgressStore';

export const Header: React.FC = () => {
  const { childAge, childName, totalStars } = useProgressStore();
  return (
    <header className="sticky top-0 z-50 bg-app-bg/80 backdrop-blur-md border-b border-app-border px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <span className="font-bold text-white text-lg">Early Engine</span>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-400">{childName}</span>
        <span className="bg-gray-800 px-2 py-1 rounded text-white">Age {childAge}</span>
        <span className="text-yellow-400 font-bold">⭐ {totalStars}</span>
      </div>
    </header>
  );
};