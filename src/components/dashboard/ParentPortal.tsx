import React, { useMemo, useState } from 'react';
import {
  LockKeyhole,
  Unlock,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Users,
} from 'lucide-react';

import { useProgressStore } from '../../store/useProgressStore';
import { useProfileStore } from '../../store/useProfileStore';
import { useClassroomStore } from '../../store/useClassroomStore';

import { Card } from '../UI/Card';
import { BackButton } from '../core/BackButton';
import { AbacusAcademyReport } from './AbacusAcademyReport';

interface ParentPortalProps {
  onBack: () => void;
}

const LEVEL_INFO = {
  1: {
    name: 'Foundation Explorer',
    description: 'Building foundational literacy, numeracy and discovery skills.',
  },
  2: {
    name: 'Early Explorer',
    description: 'Developing confidence with early academic concepts and reasoning.',
  },
  3: {
    name: 'Confident Learner',
    description: 'Applying knowledge across literacy, mathematics, science and reasoning.',
  },
  4: {
    name: 'Independent Thinker',
    description: 'Working with increasingly challenging concepts and independent tasks.',
  },
  5: {
    name: 'Primary Scholar',
    description: 'Demonstrating advanced primary-level understanding and independence.',
  },
} as const;

const getMasteryLabel = (score: number) => {
  if (score >= 80) return 'Mastered';
  if (score >= 50) return 'Practicing';
  return 'Developing';
};

const getMasteryColor = (score: number) => {
  if (score >= 80) return 'text-emerald-300';
  if (score >= 50) return 'text-amber-300';
  return 'text-red-300';
};

const getRecommendation = (skillId: string) => {
  const skill = skillId.toLowerCase();

  if (skill.includes('letter') || skill.includes('phonics') || skill.includes('sound') || skill.includes('reading')) {
    return 'Practice phonics, letter-sound recognition and guided reading activities.';
  }

  if (skill.includes('number') || skill.includes('count') || skill.includes('addition') || skill.includes('math')) {
    return 'Practice counting, number sense and hands-on mathematics activities.';
  }

  if (skill.includes('science') || skill.includes('observation')) {
    return 'Try observation, classification and simple investigation activities.';
  }

  if (skill.includes('pattern') || skill.includes('logic') || skill.includes('reason')) {
    return 'Try pattern recognition, puzzles and problem-solving challenges.';
  }

  return 'Provide additional guided practice and revisit this skill through varied activities.';
};

export const ParentPortal: React.FC<ParentPortalProps> = ({ onBack }) => {
  const { skills, totalStars } = useProgressStore();
  const { profiles, currentProfileId } = useProfileStore();
  const { assignments, students } = useClassroomStore();

  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');

  // ✅ FIX: Pull childName from Profile Store (Source of Truth)
  const profile = currentProfileId ? profiles[currentProfileId] : undefined;
  const childName = profile?.name || 'Learner';
  const currentLevel = profile?.currentLevel ?? 1;

  const levelInfo = LEVEL_INFO[currentLevel as keyof typeof LEVEL_INFO] || LEVEL_INFO[1];
  const profileSkills = profile?.skills;

  const skillEntries = Object.values(skills);
  const totalSkills = skillEntries.length;

  const masteredSkills = skillEntries.filter((skill) => skill.bestScore >= 80).length;
  const practicingSkills = skillEntries.filter((skill) => skill.bestScore >= 50 && skill.bestScore < 80).length;
  const developingSkills = skillEntries.filter((skill) => skill.bestScore < 50).length;

  const averageScore = totalSkills > 0 ? Math.round(skillEntries.reduce((total, skill) => total + skill.bestScore, 0) / totalSkills) : 0;

  const weaknesses = useMemo(
    () => skillEntries.filter((skill) => skill.bestScore < 50).sort((a, b) => a.bestScore - b.bestScore),
    [skillEntries]
  );

  const handleUnlock = () => {
    setError('');
    if (passcode === '1234') {
      setIsUnlocked(true);
      setPasscode('');
      return;
    }
    setError('Incorrect passcode. Please try again.');
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-app-card rounded-2xl border border-app-border shadow-xl relative">

      {/* Navigation */}
      <div className="mb-5">
        <BackButton onClick={onBack} label="Back to World" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Parent Portal</h2>
          <p className="text-sm text-gray-400 mt-1">Learning progress and development overview</p>
        </div>

        <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          {isUnlocked ? <Unlock className="w-5 h-5 text-indigo-300" /> : <LockKeyhole className="w-5 h-5 text-indigo-300" />}
        </div>
      </div>

      {/* Locked state */}
      {!isUnlocked ? (
        <div className="flex flex-col items-center gap-5 p-8 bg-[#1a1a1a] rounded-xl border border-gray-800">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-indigo-300" />
          </div>

          <div className="text-center">
            <h3 className="font-bold text-white">Parent Access</h3>
            <p className="text-gray-400 text-sm mt-1">Enter the parent passcode to view {childName}'s learning analytics.</p>
          </div>

          <input
            type="password"
            inputMode="numeric"
            autoComplete="off"
            maxLength={4}
            value={passcode}
            onChange={(e) => {
              setPasscode(e.target.value.replace(/\D/g, '').slice(0, 4));
              setError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleUnlock();
            }}
            className="w-32 bg-black text-center text-2xl font-mono tracking-[0.4em] p-2 rounded-lg border border-gray-700 text-white outline-none focus:border-indigo-500"
            placeholder="••••"
            aria-label="Parent passcode"
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            onClick={handleUnlock}
            disabled={passcode.length !== 4}
            className="px-6 py-2.5 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Unlock Portal
          </button>
        </div>
      ) : (
        <div className="space-y-5">

          {/* Learner overview */}
          <Card className="p-5 border border-indigo-500/20 bg-indigo-500/5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center text-3xl">
                {profile?.avatar || '🌱'}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-bold text-white">{childName}</h3>
                  {profile?.age !== undefined && <span className="text-xs text-gray-500">Age {profile.age}</span>}
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <GraduationCap className="w-4 h-4 text-indigo-300" />
                  <span className="text-sm text-indigo-200">Level {currentLevel} — {levelInfo.name}</span>
                </div>

                <p className="text-xs text-gray-500 mt-2">{levelInfo.description}</p>
              </div>
            </div>
          </Card>

          {/* Core analytics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Card className="p-4 border-l-4 border-blue-500">
              <p className="text-gray-500 text-[11px] uppercase tracking-wide">Total Stars</p>
              <p className="text-2xl font-bold text-white mt-1">{totalStars}</p>
            </Card>

            <Card className="p-4 border-l-4 border-emerald-500">
              <p className="text-gray-500 text-[11px] uppercase tracking-wide">Avg Mastery</p>
              <p className="text-2xl font-bold text-white mt-1">{averageScore}%</p>
            </Card>

            <Card className="p-4 border-l-4 border-green-500">
              <p className="text-gray-500 text-[11px] uppercase tracking-wide">Mastered</p>
              <p className="text-2xl font-bold text-emerald-300 mt-1">{masteredSkills}</p>
            </Card>

            <Card className="p-4 border-l-4 border-amber-500">
              <p className="text-gray-500 text-[11px] uppercase tracking-wide">Developing</p>
              <p className="text-2xl font-bold text-amber-300 mt-1">{practicingSkills + developingSkills}</p>
            </Card>
          </div>

          {/* Domain mastery */}
          {profileSkills && (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-cyan-300" />
                <div>
                  <h4 className="font-bold text-white">Learning Domains</h4>
                  <p className="text-xs text-gray-500">Current demonstrated competency</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  ['literacy', 'Literacy'],
                  ['numeracy', 'Numeracy'],
                  ['language', 'Language'],
                  ['science', 'Science'],
                  ['reasoning', 'Reasoning'],
                ].map(([key, label]) => {
                  const score = profileSkills[key as keyof typeof profileSkills] ?? 0;

                  return (
                    <div key={key}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-300">{label}</span>
                        <span className={`text-xs font-medium ${getMasteryColor(score)}`}>{score}%</span>
                      </div>

                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Skill analysis */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-emerald-300" />
              <div>
                <h4 className="font-bold text-white">Skill Development</h4>
                <p className="text-xs text-gray-500">Detailed performance across completed learning activities</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <div className="text-[10px] text-gray-500">Mastered</div>
                <div className="text-lg font-bold text-emerald-300">{masteredSkills}</div>
              </div>

              <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                <div className="text-[10px] text-gray-500">Practicing</div>
                <div className="text-lg font-bold text-amber-300">{practicingSkills}</div>
              </div>

              <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                <div className="text-[10px] text-gray-500">Developing</div>
                <div className="text-lg font-bold text-red-300">{developingSkills}</div>
              </div>
            </div>

            {totalSkills === 0 ? (
              <div className="text-center py-5">
                <p className="text-sm text-gray-500">No skill performance has been recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {skillEntries
                  .sort((a, b) => a.bestScore - b.bestScore)
                  .slice(0, 8)
                  .map((skill) => (
                    <div key={skill.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/60">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          skill.bestScore >= 80 ? 'bg-emerald-400' : skill.bestScore >= 50 ? 'bg-amber-400' : 'bg-red-400'
                        }`}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm text-gray-200 truncate">{skill.id}</span>
                          <span className={`text-xs font-semibold ${getMasteryColor(skill.bestScore)}`}>{skill.bestScore}%</span>
                        </div>

                        <div className="mt-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-current rounded-full"
                            style={{ width: `${Math.min(100, Math.max(0, skill.bestScore))}%` }}
                          />
                        </div>
                      </div>

                      <span className={`text-[10px] whitespace-nowrap ${getMasteryColor(skill.bestScore)}`}>
                        {getMasteryLabel(skill.bestScore)}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </Card>

          {/* Weakness detector */}
          <Card className="p-4 border border-red-500/10">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-300" />
              <div>
                <h4 className="font-bold text-white">Learning Support</h4>
                <p className="text-xs text-gray-500">Areas that may benefit from additional practice</p>
              </div>
            </div>

            {weaknesses.length > 0 ? (
              <div className="space-y-2">
                {weaknesses.slice(0, 5).map((skill) => (
                  <div key={skill.id} className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-red-200 font-medium">{skill.id}</span>
                      <span className="text-xs text-red-300">{skill.bestScore}%</span>
                    </div>

                    <p className="text-xs text-gray-400 mt-1">{getRecommendation(skill.id)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <p className="text-sm text-gray-300">No major skill gaps detected. {childName} is demonstrating strong progress.</p>
              </div>
            )}
          </Card>

          {/* Academy progress */}
          <AbacusAcademyReport />

                    {/* Classroom assignments */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-indigo-300" />
              <div>
                <h4 className="font-bold text-white">Classroom Assignments</h4>
                <p className="text-xs text-gray-500">Activities assigned through the learner's classroom</p>
              </div>
            </div>

            {assignments.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No classroom assignments yet.</p>
            ) : (
              <div className="space-y-2">
                {assignments.map((assignment) => {
                  // ✅ PERFECT FIX: Guarantee we extract a string safely
                  const studentRaw = students[assignment.studentId];
                  const studentName = typeof studentRaw === 'string' ? studentRaw : studentRaw?.name || 'Learner';

                  return (
                    <div key={assignment.id} className="flex items-center justify-between gap-3 bg-gray-800/70 p-3 rounded-lg">
                      <div className="min-w-0">
                        <div className="text-sm text-gray-200">{studentName}</div>
                        <div className="text-xs text-gray-500 mt-0.5">Lesson {assignment.lessonId}</div>
                      </div>

                      {assignment.completed ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Done
                        </span>
                      ) : (
                        <span className="text-xs text-amber-400">Pending</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Development notice */}
          <div className="text-center pt-1">
            <p className="text-[10px] text-gray-600">
              Learning level is determined by demonstrated competency, not age. Foundational skills remain available for adaptive review.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};