import React from 'react';
import { Award, BarChart3, Calculator } from 'lucide-react';
import { ABACUS_LEVELS } from '../../abacus/academy';
import { useAbacusAcademyStore } from '../../store/useAbacusAcademyStore';

/**
 * Parent-facing summary for the Abacus Academy.
 *
 * IMPORTANT:
 * Abacus progression is independent from the learner's
 * overall ELP learning level.
 *
 * A learner can therefore be:
 *
 * Overall ELP Level 3
 * Abacus Level 5
 * Science Level 2
 *
 * This allows genuine competency-based progression.
 */
export function AbacusAcademyReport() {
  const { levels, certificates } =
    useAbacusAcademyStore();

  const attempted = ABACUS_LEVELS.filter(
    (level) => levels[level.id]?.attempts
  ).length;

  const averageMastery = attempted
    ? Math.round(
        ABACUS_LEVELS.reduce(
          (total, level) =>
            total +
            (levels[level.id]?.mastery || 0),
          0
        ) / attempted
      )
    : 0;

  const masteredLevels = ABACUS_LEVELS.filter(
    (level) =>
      (levels[level.id]?.mastery || 0) >= 80
  ).length;

  return (
    <section className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h4 className="flex items-center gap-2 font-bold text-white">
          <Calculator className="h-4 w-4 text-amber-300" />
          Abacus Academy
        </h4>

        <span className="text-xs text-amber-200">
          {averageMastery}% average mastery
        </span>
      </div>

      {/* Academy summary */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-black/20 p-3">
          <div className="text-[11px] text-gray-400">
            Levels explored
          </div>

          <div className="mt-1 text-lg font-bold text-white">
            {attempted}/{ABACUS_LEVELS.length}
          </div>
        </div>

        <div className="rounded-lg bg-black/20 p-3">
          <div className="text-[11px] text-gray-400">
            Levels mastered
          </div>

          <div className="mt-1 text-lg font-bold text-white">
            {masteredLevels}/{ABACUS_LEVELS.length}
          </div>
        </div>
      </div>

      {/* Individual levels */}
      <div className="space-y-2">
        {ABACUS_LEVELS.map((level) => {
          const progress = levels[level.id];

          const mastery =
            progress?.mastery || 0;

          const isMastered = mastery >= 80;

          return (
            <div
              key={level.id}
              className="rounded-lg bg-black/20 p-3"
            >
              <div className="flex justify-between gap-2 text-xs">
                <span className="font-medium text-gray-200">
                  {level.title.replace(
                    'Level ',
                    'L'
                  )}
                </span>

                <span className="text-gray-400">
                  {progress
                    ? `${progress.correct}/${progress.attempts} correct`
                    : 'Not started'}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-2 h-1.5 overflow-hidden rounded bg-gray-700">
                <div
                  className={`h-full rounded transition-all ${
                    isMastered
                      ? 'bg-emerald-400'
                      : 'bg-amber-400'
                  }`}
                  style={{
                    width: `${mastery}%`,
                  }}
                />
              </div>

              {/* Secondary stats */}
              {progress && (
                <div className="mt-1.5 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500">
                    {mastery}% mastery
                  </span>

                  <span className="text-gray-500">
                    Best streak: {progress.bestStreak}
                  </span>
                </div>
              )}

              {isMastered && (
                <div className="mt-1.5 text-[11px] font-semibold text-emerald-300">
                  ✓ Mastered
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Certificates */}
      <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-3 text-xs text-amber-100">
        <Award className="h-4 w-4 text-amber-300" />

        <span>
          Certificates earned:{' '}
          <strong>
            {certificates.length}
          </strong>{' '}
          / {ABACUS_LEVELS.length}
        </span>
      </div>
    </section>
  );
}
