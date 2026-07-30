import React from 'react';
import { Card } from '../UI/Card';

export const CambridgeMatrix: React.FC = () => {
  return (
    <Card className="p-4">
      <h4 className="font-bold text-white mb-3">Cambridge Strands</h4>
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
        <div className="p-2 bg-gray-800 rounded">Communication</div>
        <div className="p-2 bg-gray-800 rounded">Numeracy</div>
        <div className="p-2 bg-gray-800 rounded">Science</div>
        <div className="p-2 bg-gray-800 rounded">Creativity</div>
      </div>
    </Card>
  );
};