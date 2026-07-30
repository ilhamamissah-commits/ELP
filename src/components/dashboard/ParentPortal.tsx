import React, { useState } from 'react';
import { useProgressStore } from '../../store/useProgressStore';
import { Card } from '../UI/Card';
import { BackButton } from '../core/BackButton';
import { useClassroomStore } from '../../store/useClassroomStore';


interface ParentPortalProps {
  onBack: () => void;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({ onBack }) => {
  const { skills, childName, totalStars } = useProgressStore();
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { assignments, students } = useClassroomStore();

  const handleUnlock = () => {
    // Hardcoded parent passcode: 1234 (You can change this)
    if (passcode === '1234') setIsUnlocked(true);
  };

  // Calculate Analytics
  const totalActivities = Object.keys(skills).length;
  const avgScore = totalActivities > 0 
    ? Math.round(Object.values(skills).reduce((acc, s) => acc + s.bestScore, 0) / totalActivities) 
    : 0;

  // Weakness Detection
  const weaknesses = Object.values(skills)
    .filter(s => s.bestScore < 50)
    .map(s => s.id);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-app-card rounded-2xl border border-app-border shadow-xl relative">
      <div className="mb-4"><BackButton onClick={onBack} label="Back to World" /></div>
      
      <h2 className="text-2xl font-bold text-white mb-6">👨‍👩‍👧‍👦 Parent Portal</h2>

      {!isUnlocked ? (
        <div className="flex flex-col items-center gap-4 p-8 bg-[#1a1a1a] rounded-xl border border-gray-800">
          <span className="text-gray-400 text-sm">Enter the 4-digit passcode to view analytics</span>
          <input 
            type="password" 
            maxLength={4}
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-32 bg-black text-center text-2xl font-mono p-2 rounded-lg border border-gray-700 text-white outline-none focus:border-indigo-500"
            placeholder="****"
          />
          <button onClick={handleUnlock} className="px-6 py-2 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-500 transition">Unlock</button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 border-l-4 border-blue-500"><p className="text-gray-400 text-xs">Total Stars</p><p className="text-2xl font-bold text-white">{totalStars}</p></Card>
            <Card className="p-4 border-l-4 border-green-500"><p className="text-gray-400 text-xs">Avg Score</p><p className="text-2xl font-bold text-white">{avgScore}%</p></Card>
          </div>

          <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
            <h4 className="font-bold text-white mb-2">Weakness Detector</h4>
            {weaknesses.length > 0 ? (
              weaknesses.map(w => (
                <div key={w} className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg mb-2 text-sm text-red-300">
                  ⚠️ {childName} is struggling with <strong>{w}</strong>. 
                  <span className="block mt-1 text-red-200/80">Recommend: Try the "Sound Lottery" activity.</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No major weaknesses detected. {childName} is doing great!</p>
            )}
          </div>
        </div>
      )}
      <div className="mt-4">
  <h4 className="font-bold text-white mb-2">📚 Classroom Assignments</h4>
  {assignments.map(a => (
    <div key={a.id} className="flex justify-between bg-gray-800 p-2 rounded-lg mb-1 text-sm">
      <span>{students[a.studentId]} - Lesson {a.lessonId}</span>
      <span className={a.completed ? 'text-green-400' : 'text-yellow-400'}>
        {a.completed ? '✅ Done' : '⏳ Pending'}
      </span>
    </div>
  ))}
</div>
    </div>
  );
};