import React from 'react';
import { Award, BarChart3 } from 'lucide-react';
import { ABACUS_LEVELS } from '../../abacus/academy';
import { useAbacusAcademyStore } from '../../store/useAbacusAcademyStore';

/** Parent-facing summary sourced from the Academy's persistent mastery record. */
export function AbacusAcademyReport() {
  const { levels, certificates } = useAbacusAcademyStore();
  const attempted = ABACUS_LEVELS.filter((level) => levels[level.id]?.attempts).length;
  const averageMastery = attempted ? Math.round(ABACUS_LEVELS.reduce((total, level) => total + (levels[level.id]?.mastery || 0), 0) / attempted) : 0;
  return (
    <section className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4">
      <div className="mb-3 flex items-center justify-between"><h4 className="flex items-center gap-2 font-bold text-white"><BarChart3 className="h-4 w-4 text-amber-300" /> Abacus Academy</h4><span className="text-xs text-amber-200">{averageMastery}% average mastery</span></div>
      <div className="space-y-2">
        {ABACUS_LEVELS.map((level) => {
          const progress = levels[level.id];
          return <div key={level.id} className="rounded-lg bg-black/20 p-2"><div className="flex justify-between gap-2 text-xs"><span className="text-gray-200">{level.title.replace('Level ', 'L')}</span><span className="text-gray-400">{progress ? `${progress.correct}/${progress.attempts} correct · ${progress.bestStreak} best streak` : 'Not started'}</span></div><div className="mt-1 h-1.5 overflow-hidden rounded bg-gray-700"><div className="h-full rounded bg-amber-400" style={{ width: `${progress?.mastery || 0}%` }} /></div></div>;
        })}
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-amber-100"><Award className="h-4 w-4 text-amber-300" /> Certificates earned: {certificates.length} / {ABACUS_LEVELS.length}</div>
    </section>
  );
}
