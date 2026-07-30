import React from 'react';
import { Modal } from '../core/Modal';
import { useProfileStore } from '../../store/useProfileStore';

interface ProfileSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitch: (id: string) => void;
}

export const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({ isOpen, onClose, onSwitch }) => {
  const { profiles, currentProfileId } = useProfileStore();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold text-white mb-4">Switch Profile</h2>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {Object.entries(profiles).map(([id, data]) => (
          <button
            key={id}
            onClick={() => onSwitch(id)}
            // We check if currentProfileId is NOT empty before marking it active
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition ${currentProfileId !== "" && id === currentProfileId ? 'bg-indigo-600 text-white ring-2 ring-indigo-400' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            <span className="text-2xl">{data.avatar}</span>
            <div>
              <div className="font-bold">{data.name}</div>
              <div className="text-xs opacity-70">Age {data.age}</div>
            </div>
            {currentProfileId !== "" && id === currentProfileId && <span className="ml-auto text-xs bg-indigo-800 px-2 py-0.5 rounded-full text-white">Active</span>}
          </button>
        ))}
        {Object.keys(profiles).length === 0 && (
          <div className="text-gray-500 text-center py-4 text-sm">No profiles yet. Go back to the main screen to add a child!</div>
        )}
      </div>
      
      <button 
        onClick={onClose} 
        className="w-full py-2 bg-gray-700 text-white rounded-lg mt-4 hover:bg-gray-600 transition"
      >
        Close
      </button>
    </Modal>
  );
};