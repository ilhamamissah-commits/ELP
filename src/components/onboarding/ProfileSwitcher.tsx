import React from 'react';
import { Modal } from '../core/Modal';
import { useProfileStore } from '../../store/useProfileStore';
import { ArrowRight, Star } from 'lucide-react';

interface ProfileSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitch: (id: string) => void;
}

const LEVEL_INFO: Record<
  number,
  {
    name: string;
    emoji: string;
  }
> = {
  1: {
    name: 'Foundation Explorer',
    emoji: '🌱',
  },
  2: {
    name: 'Early Explorer',
    emoji: '🌿',
  },
  3: {
    name: 'Confident Learner',
    emoji: '🚀',
  },
  4: {
    name: 'Independent Thinker',
    emoji: '🧠',
  },
  5: {
    name: 'Primary Scholar',
    emoji: '⭐',
  },
};

export const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({
  isOpen,
  onClose,
  onSwitch,
}) => {
  const { profiles, currentProfileId } = useProfileStore();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-white">
          Switch Learner
        </h2>

        <p className="text-sm text-gray-400 mt-1">
          Choose who is learning today.
        </p>
      </div>

      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {Object.entries(profiles).map(([id, data]) => {
          /**
           * New profiles should have currentLevel.
           *
           * The fallback keeps older profiles compatible
           * while the profile store is being migrated.
           */
          const level =
            (data as any).currentLevel ||
            (data as any).level ||
            1;

          const levelInfo =
            LEVEL_INFO[level] || LEVEL_INFO[1];

          const isActive =
            currentProfileId !== '' &&
            id === currentProfileId;

          return (
            <button
              key={id}
              onClick={() => {
                onSwitch(id);
                onClose();
              }}
              className={`w-full text-left p-4 rounded-2xl flex items-center gap-4 transition-all border ${
                isActive
                  ? 'bg-indigo-600/90 border-indigo-400 text-white ring-2 ring-indigo-400/40'
                  : 'bg-gray-800/80 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-3xl ${
                  isActive
                    ? 'bg-white/15'
                    : 'bg-gray-700'
                }`}
              >
                {data.avatar}
              </div>

              {/* Learner information */}
              <div className="min-w-0 flex-1">
                <div className="font-bold text-base truncate">
                  {data.name}
                </div>

                {/* Level */}
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-sm">
                    {levelInfo.emoji}
                  </span>

                  <span
                    className={`text-xs font-semibold ${
                      isActive
                        ? 'text-indigo-100'
                        : 'text-gray-300'
                    }`}
                  >
                    Level {level}
                  </span>

                  <span
                    className={`text-xs ${
                      isActive
                        ? 'text-indigo-200'
                        : 'text-gray-500'
                    }`}
                  >
                    • {levelInfo.name}
                  </span>
                </div>

                {/* Age is secondary/contextual */}
                {data.age && (
                  <div
                    className={`text-[11px] mt-1 ${
                      isActive
                        ? 'text-indigo-200'
                        : 'text-gray-500'
                    }`}
                  >
                    Age {data.age} • Learning at their own pace
                  </div>
                )}
              </div>

              {/* Active / switch indicator */}
              {isActive ? (
                <div className="flex items-center gap-1.5 shrink-0">
                  <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />

                  <span className="text-xs bg-indigo-800/80 px-2 py-1 rounded-full text-white font-semibold">
                    Active
                  </span>
                </div>
              ) : (
                <ArrowRight className="w-5 h-5 text-gray-500 shrink-0" />
              )}
            </button>
          );
        })}

        {Object.keys(profiles).length === 0 && (
          <div className="text-gray-500 text-center py-8 text-sm">
            <div className="text-3xl mb-2">🌱</div>

            <p className="font-medium">
              No learners yet.
            </p>

            <p className="mt-1">
              Go back to the welcome screen to add a learner.
            </p>
          </div>
        )}
      </div>

      <button
        onClick={onClose}
        className="w-full py-3 bg-gray-700 text-white rounded-xl mt-5 hover:bg-gray-600 transition font-semibold"
      >
        Close
      </button>
    </Modal>
  );
};
