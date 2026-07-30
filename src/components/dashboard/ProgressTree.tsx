import React from 'react';
import { useProgressStore } from '../../store/useProgressStore';
import { Card } from '../UI/Card';

export const ProgressTree: React.FC = () => {
  const { skills } = useProgressStore();
  
  return (
    <div className="p-4">
      <h3 className="text-xl font-bold text-white mb-4">🌳 My Progress Tree</h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.values(skills).map((skill) => (
          <Card key={skill.id} className="p-3 border-l-4 border-green-500">
            <div className="font-bold text-white text-sm">{skill.id}</div>
            <div className="text-xs text-gray-400">Attempts: {skill.attempts}</div>
            <div className="w-full bg-gray-700 h-1.5 rounded-full mt-2">
              <div className="bg-green-400 h-1.5 rounded-full" style={{ width: `${skill.bestScore}%` }}></div>
            </div>
          </Card>
        ))}
        {Object.keys(skills).length === 0 && <p className="text-gray-500 text-sm col-span-2">Complete an activity to see your progress!</p>}
      </div>
    </div>
  );
};