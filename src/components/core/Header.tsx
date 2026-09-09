import React from 'react';
import { useProgressStore } from '../../store/useProgressStore';

import { useProfileStore } from '../../store/useProfileStore';

export const Header: React.FC = () => {
  const { currentProfileId, profiles } = useProfileStore();
  const profile = currentProfileId ? profiles[currentProfileId] : null;

  return (
    <header className="sticky top-0 z-50 bg-app-bg/80 backdrop-blur-md border-b border-app-border px-4 py-3 flex justify-between items-center">
      <span className="font-bold text-white text-lg">Early Engine</span>
      
      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-400">{profile?.name || 'Guest'}</span>
        <span className="bg-gray-800 px-2 py-1 rounded text-white">Age {profile?.age || ''}</span>
      </div>
    </header>
  );
};