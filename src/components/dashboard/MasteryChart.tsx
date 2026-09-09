import React from 'react';
import { Card } from '../UI/Card';
import {
  CheckCircle2,
  Target,
  BookOpen,
  TrendingUp,
} from 'lucide-react';
import { useProgressStore } from '../../store/useProgressStore';

export const MasteryChart: React.FC = () => {
  const { skills } = useProgressStore();

  const skillEntries = Object.values(skills);

  const totalSkills = skillEntries.length;

  const mastered = skillEntries.filter(
    (skill) => skill.bestScore >= 80
  ).length;

  const practicing = skillEntries.filter(
    (skill) => skill.bestScore >= 50 && skill.bestScore < 80
  ).length;

  const developing = skillEntries.filter(
    (skill) => skill.bestScore < 50
  ).length;

  const overallMastery =
    totalSkills > 0
      ? Math.round(
          skillEntries.reduce(
            (total, skill) => total + skill.bestScore,
            0
          ) / totalSkills
        )
      : 0;

  const masteryRate =
    totalSkills > 0
      ? Math.round((mastered / totalSkills) * 100)
      : 0;

  return (
    <Card className="p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h4 className="font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-300" />
            Skills Mastery
          </h4>

          <p className="text-xs text-gray-500 mt-1">
            Demonstrated competency across learning skills
          </p>
        </div>

        <div className="text-right">
          <div className="text-lg font-bold text-white">
            {overallMastery}%
          </div>
          <div className="text-[10px] uppercase tracking-wide text-gray-500">
            Overall
          </div>
        </div>
      </div>

      {/* Overall progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-400">
            Overall skill mastery
          </span>

          <span className="text-xs text-emerald-300">
            {masteryRate}% mastered
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-gray-700">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all duration-500"
            style={{
              width: `${Math.min(
                100,
                Math.max(0, overallMastery)
              )}%`,
            }}
          />
        </div>
      </div>

      {/* Mastery categories */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-emerald-500/10 bg-emerald-500/5 p-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] text-gray-400">
              Mastered
            </span>
          </div>

          <div className="text-xl font-bold text-emerald-300">
            {mastered}
          </div>

          <div className="text-[10px] text-gray-500">
            80%+
          </div>
        </div>

        <div className="rounded-lg border border-yellow-500/10 bg-yellow-500/5 p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-[11px] text-gray-400">
              Practicing
            </span>
          </div>

          <div className="text-xl font-bold text-yellow-300">
            {practicing}
          </div>

          <div className="text-[10px] text-gray-500">
            50–79%
          </div>
        </div>

        <div className="rounded-lg border border-blue-500/10 bg-blue-500/5 p-3">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] text-gray-400">
              Developing
            </span>
          </div>

          <div className="text-xl font-bold text-blue-300">
            {developing}
          </div>

          <div className="text-[10px] text-gray-500">
            Below 50%
          </div>
        </div>
      </div>

      {/* Empty state */}
      {totalSkills === 0 && (
        <div className="mt-4 rounded-lg border border-white/5 bg-gray-800/40 p-3 text-center">
          <p className="text-xs text-gray-500">
            Skill mastery will appear here as the learner
            completes activities.
          </p>
        </div>
      )}

      {/* Footer */}
      {totalSkills > 0 && (
        <div className="mt-4 pt-3 border-t border-white/5">
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              {totalSkills} skill{totalSkills === 1 ? '' : 's'} tracked
            </span>

            <span>
              {mastered} of {totalSkills} mastered
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};
