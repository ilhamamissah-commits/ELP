import { useProgressStore } from '../store/useProgressStore';

export const useProgress = () => {
  const { 
    childAge, 
    childName, 
    totalStars, 
    skills, 
    setProfile, 
    completeActivity 
  } = useProgressStore();

  return {
    childAge,
    childName,
    totalStars,
    skills,
    setProfile,
    completeActivity,
    // Helper to calculate mastery percentage for a specific subject
    getMasteryForSubject: (subjectPrefix: string) => {
      const subjectSkills = Object.values(skills).filter(s => s.id.startsWith(subjectPrefix));
      if (subjectSkills.length === 0) return 0;
      const mastered = subjectSkills.filter(s => s.bestScore >= 80).length;
      return Math.round((mastered / subjectSkills.length) * 100);
    }
  };
};