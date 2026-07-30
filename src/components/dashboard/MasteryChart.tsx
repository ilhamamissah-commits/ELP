import React from 'react';
import { Card } from '../UI/Card';
import { useProgressStore } from '../../store/useProgressStore';

export const MasteryChart: React.FC = () => {
  const { skills } = useProgressStore();
  const total = Object.keys(skills).length;
  const mastered = Object.values(skills).filter(s => s.bestScore >= 80).length;
  const practicing = Object.values(skills).filter(s => s.bestScore >= 50 && s.bestScore < 80).length;

  return (
    <Card className="p-4">
      <h4 className="font-bold text-white mb-3">Skills Mastery</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-400"><span>Mastered (80%+)</span><span className="text-green-400">{mastered}</span></div>
        <div className="flex justify-between text-gray-400"><span>Practicing</span><span className="text-yellow-400">{practicing}</span></div>
        <div className="flex justify-between text-gray-400"><span>Total Activities</span><span className="text-white">{total}</span></div>
      </div>
    </Card>
  );
};