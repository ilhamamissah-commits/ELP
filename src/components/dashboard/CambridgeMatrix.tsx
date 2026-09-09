import React from 'react';
import { Card } from '../UI/Card';
import {
  MessageCircle,
  Calculator,
  FlaskConical,
  Palette,
  Brain,
  Globe2,
} from 'lucide-react';
import { useProfileStore } from '../../store/useProfileStore';

interface Strand {
  key: 'language' | 'numeracy' | 'science' | 'reasoning';
  title: string;
  description: string;
  icon: React.ElementType;
}

const STRANDS: Strand[] = [
  {
    key: 'language',
    title: 'Communication',
    description: 'Listening, speaking, vocabulary and expression',
    icon: MessageCircle,
  },
  {
    key: 'numeracy',
    title: 'Numeracy',
    description: 'Number sense, patterns and mathematical thinking',
    icon: Calculator,
  },
  {
    key: 'science',
    title: 'Science',
    description: 'Observation, investigation and scientific thinking',
    icon: FlaskConical,
  },
  {
    key: 'reasoning',
    title: 'Creativity & Reasoning',
    description: 'Problem-solving, imagination and critical thinking',
    icon: Brain,
  },
];

export const CambridgeMatrix: React.FC = () => {
  const { profiles, currentProfileId } = useProfileStore();

  const profile = currentProfileId
    ? profiles[currentProfileId]
    : undefined;

  const skills = profile?.skills;

  return (
    <Card className="p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h4 className="font-bold text-white flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-cyan-300" />
            Cambridge Learning Matrix
          </h4>

          <p className="text-xs text-gray-400 mt-1">
            Development across key learning strands
          </p>
        </div>

        <span className="text-[10px] uppercase tracking-wider text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded-full">
          Cambridge Aligned
        </span>
      </div>

      {/* Strands */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {STRANDS.map((strand) => {
          const Icon = strand.icon;

          const mastery = skills?.[strand.key] ?? 0;

          return (
            <div
              key={strand.key}
              className="rounded-xl border border-white/5 bg-gray-800/60 p-3"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gray-700/70">
                  <Icon className="w-4 h-4 text-cyan-300" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white">
                      {strand.title}
                    </span>

                    <span className="text-xs font-medium text-gray-300">
                      {mastery}%
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                    {strand.description}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-3">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-700">
                  <div
                    className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(0, mastery))}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Learning note */}
      <div className="mt-4 rounded-lg border border-cyan-500/10 bg-cyan-500/5 px-3 py-2">
        <p className="text-[11px] leading-relaxed text-gray-400">
          Cambridge strands describe areas of development. A learner's
          progression is determined by demonstrated mastery, not age.
        </p>
      </div>
    </Card>
  );
};
