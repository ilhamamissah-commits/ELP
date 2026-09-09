import { useCallback } from 'react';

import {
  type SkillDomain,
  useProgressStore,
} from '../store/useProgressStore';

export interface SubjectMastery {
  domain: SkillDomain;
  totalSkills: number;
  masteredSkills: number;
  practicingSkills: number;
  developingSkills: number;
  masteryPercentage: number;
}

/**
 * React-facing progress API for ELP.
 *
 * Progress data belongs to useProgressStore.
 * Learner identity and overall ELP level belong to useProfileStore.
 *
 * This hook provides convenient derived calculations without
 * making curriculum or placement decisions.
 */
export const useProgress = () => {
  const totalStars = useProgressStore((state) => state.totalStars);
  const skills = useProgressStore((state) => state.skills);
  const activeProfileId = useProgressStore((state) => state.activeProfileId);
  const completeActivity = useProgressStore((state) => state.completeActivity);
  const setActiveProfile = useProgressStore((state) => state.setActiveProfile);
  const clearProgress = useProgressStore((state) => state.clearProgress);
  const getAverageMastery = useProgressStore(
    (state) => state.getAverageMastery,
  );
  const getMasteredSkillCount = useProgressStore(
    (state) => state.getMasteredSkillCount,
  );
  const getSkillStatus = useProgressStore((state) => state.getSkillStatus);

  /**
   * Calculate mastery statistics for a specific learning domain.
   *
   * Mastery is based on the learner's best score:
   * - 80–100: mastered
   * - 50–79: practicing
   * - 0–49: developing
   */
  const getMasteryForDomain = useCallback(
    (domain: SkillDomain): SubjectMastery => {
      const domainSkills = Object.values(skills).filter(
        (skill) => skill.domain === domain,
      );

      if (domainSkills.length === 0) {
        return {
          domain,
          totalSkills: 0,
          masteredSkills: 0,
          practicingSkills: 0,
          developingSkills: 0,
          masteryPercentage: 0,
        };
      }

      const masteredSkills = domainSkills.filter(
        (skill) => skill.bestScore >= 80,
      ).length;

      const practicingSkills = domainSkills.filter(
        (skill) => skill.bestScore >= 50 && skill.bestScore < 80,
      ).length;

      const developingSkills = domainSkills.filter(
        (skill) => skill.bestScore < 50,
      ).length;

      return {
        domain,
        totalSkills: domainSkills.length,
        masteredSkills,
        practicingSkills,
        developingSkills,
        masteryPercentage: Math.round(
          (masteredSkills / domainSkills.length) * 100,
        ),
      };
    },
    [skills],
  );

  /**
   * Backward-compatible mastery helper.
   *
   * Prefer getMasteryForDomain() in new ELP components.
   * This accepts a SkillDomain and deliberately does not inspect
   * skill IDs or prefixes.
   */
  const getMasteryForSubject = useCallback(
    (domain: SkillDomain): number => {
      return getMasteryForDomain(domain).masteryPercentage;
    },
    [getMasteryForDomain],
  );

  return {
    activeProfileId,
    totalStars,
    skills,

    completeActivity,
    setActiveProfile,
    clearProgress,

    getAverageMastery,
    getMasteredSkillCount,
    getSkillStatus,

    getMasteryForDomain,
    getMasteryForSubject,
  };
};
