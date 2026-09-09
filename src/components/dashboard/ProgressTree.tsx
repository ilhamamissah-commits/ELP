import React from 'react';
import {
  BookOpen,
  Calculator,
  FlaskConical,
  MessageCircle,
  Brain,
  Lock,
  CheckCircle2,
  Circle,
} from 'lucide-react';

import { useProgressStore } from '../../store/useProgressStore';
import { useProfileStore } from '../../store/useProfileStore';
import { Card } from '../UI/Card';

const LEVEL_INFO = {
  1: 'Foundation Explorer',
  2: 'Early Explorer',
  3: 'Confident Learner',
  4: 'Independent Thinker',
  5: 'Primary Scholar',
} as const;

const DOMAIN_CONFIG = [
  {
    key: 'literacy',
    title: 'Literacy',
    icon: BookOpen,
    keywords: ['letter', 'reading', 'phonics', 'word', 'sound', 'writing'],
  },
  {
    key: 'numeracy',
    title: 'Numeracy',
    icon: Calculator,
    keywords: ['number', 'count', 'math', 'addition', 'subtraction', 'shape'],
  },
  {
    key: 'science',
    title: 'Science',
    icon: FlaskConical,
    keywords: ['science', 'observation', 'experiment', 'living', 'material'],
  },
  {
    key: 'language',
    title: 'Language',
    icon: MessageCircle,
    keywords: ['language', 'vocabulary', 'speaking', 'listening', 'communication'],
  },
  {
    key: 'reasoning',
    title: 'Reasoning',
    icon: Brain,
    keywords: ['pattern', 'logic', 'reason', 'problem', 'sequence', 'creative'],
  },
];

const getDomain = (skillId: string) => {
  const normalized = skillId.toLowerCase();

  return (
    DOMAIN_CONFIG.find((domain) =>
      domain.keywords.some((keyword) =>
        normalized.includes(keyword)
      )
    ) || DOMAIN_CONFIG[4]
  );
};

const getStatus = (score: number) => {
  if (score >= 80) return 'mastered';
  if (score >= 50) return 'practicing';
  return 'developing';
};

export const ProgressTree: React.FC = () => {
  const { skills } = useProgressStore();
  const { profiles, currentProfileId } = useProfileStore();

  const profile = currentProfileId
    ? profiles[currentProfileId]
    : undefined;

  const currentLevel = profile?.currentLevel ?? 1;
  const levelName =
    LEVEL_INFO[currentLevel as keyof typeof LEVEL_INFO] ||
    LEVEL_INFO[1];

  const skillEntries = Object.values(skills);

  /*
   * Group detailed skills into broader learning domains.
   */
  const groupedSkills = DOMAIN_CONFIG.reduce(
    (groups, domain) => {
      groups[domain.key] = [];
      return groups;
    },
    {} as Record<string, typeof skillEntries>
  );

  skillEntries.forEach((skill) => {
    const domain = getDomain(skill.id);
    groupedSkills[domain.key].push(skill);
  });

  const getDomainMastery = (domainSkills: typeof skillEntries) => {
    if (domainSkills.length === 0) return 0;

    return Math.round(
      domainSkills.reduce(
        (total, skill) => total + skill.bestScore,
        0
      ) / domainSkills.length
    );
  };

  return (
    <div className="p-4">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h3 className="text-xl font-bold text-white">
            🌳 My Progress Tree
          </h3>

          <p className="text-xs text-gray-500 mt-1">
            Skills grow through demonstrated mastery.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-500">
            Current Level
          </div>

          <div className="text-sm font-bold text-emerald-300">
            Level {currentLevel}
          </div>

          <div className="text-[10px] text-gray-500">
            {levelName}
          </div>
        </div>
      </div>

      {/* Overall level path */}
      <Card className="p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-bold text-white text-sm">
              Learning Journey
            </h4>

            <p className="text-[11px] text-gray-500">
              Progression is based on competency, not age.
            </p>
          </div>

          <span className="text-xs text-emerald-300">
            {currentLevel}/5
          </span>
        </div>

        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((level, index) => {
            const unlocked = level <= currentLevel;
            const current = level === currentLevel;

            return (
              <React.Fragment key={level}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                      current
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/20'
                        : unlocked
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                          : 'bg-gray-800 border-gray-700 text-gray-600'
                    }`}
                  >
                    {unlocked ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Lock className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <span
                    className={`text-[9px] mt-1 ${
                      current
                        ? 'text-emerald-300'
                        : unlocked
                          ? 'text-gray-400'
                          : 'text-gray-600'
                    }`}
                  >
                    L{level}
                  </span>
                </div>

                {index < 4 && (
                  <div
                    className={`h-px flex-1 mx-1 ${
                      level < currentLevel
                        ? 'bg-emerald-500/50'
                        : 'bg-gray-700'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </Card>

      {/* Domain tree */}
      <div className="space-y-4">
        {DOMAIN_CONFIG.map((domain) => {
          const Icon = domain.icon;
          const domainSkills = groupedSkills[domain.key];
          const mastery = getDomainMastery(domainSkills);

          return (
            <Card
              key={domain.key}
              className="p-4 border border-white/5"
            >
              {/* Domain heading */}
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-gray-800">
                  <Icon className="w-4 h-4 text-emerald-300" />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between gap-2">
                    <h4 className="font-bold text-white text-sm">
                      {domain.title}
                    </h4>

                    <span className="text-xs text-emerald-300">
                      {mastery}%
                    </span>
                  </div>

                  <div className="mt-1.5 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(0, mastery)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              {domainSkills.length > 0 ? (
                <div className="space-y-2 pl-11">
                  {domainSkills.map((skill) => {
                    const status = getStatus(skill.bestScore);

                    return (
                      <div
                        key={skill.id}
                        className="flex items-center gap-2"
                      >
                        {status === 'mastered' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle
                            className={`w-3.5 h-3.5 shrink-0 ${
                              status === 'practicing'
                                ? 'text-amber-400'
                                : 'text-gray-600'
                            }`}
                          />
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-2">
                            <span className="text-xs text-gray-300 truncate">
                              {skill.id}
                            </span>

                            <span
                              className={`text-[10px] ${
                                status === 'mastered'
                                  ? 'text-emerald-300'
                                  : status === 'practicing'
                                    ? 'text-amber-300'
                                    : 'text-gray-500'
                              }`}
                            >
                              {skill.bestScore}%
                            </span>
                          </div>

                          <div className="mt-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                status === 'mastered'
                                  ? 'bg-emerald-400'
                                  : status === 'practicing'
                                    ? 'bg-amber-400'
                                    : 'bg-gray-600'
                              }`}
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.max(0, skill.bestScore)
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="pl-11 flex items-center gap-2 text-xs text-gray-600">
                  <Lock className="w-3 h-3" />
                  No activities recorded yet
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Empty state */}
      {skillEntries.length === 0 && (
        <Card className="p-5 mt-4 text-center">
          <p className="text-sm text-gray-400">
            Complete your first learning activity to begin
            growing your progress tree.
          </p>

          <p className="text-xs text-gray-600 mt-1">
            Your starting level is determined through demonstrated
            competency rather than age.
          </p>
        </Card>
      )}
    </div>
  );
};
