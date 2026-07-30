import React from 'react';

export const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-app-card border-r border-app-border p-4 hidden lg:block">
      <h2 className="text-lg font-bold text-white mb-6">Teacher Panel</h2>
      <nav className="space-y-2">
        <button className="w-full text-left px-4 py-2 bg-gray-800 rounded-lg text-gray-300">Dashboard</button>
        <button className="w-full text-left px-4 py-2 hover:bg-gray-800 rounded-lg text-gray-400 transition">Progress Reports</button>
        <button className="w-full text-left px-4 py-2 hover:bg-gray-800 rounded-lg text-gray-400 transition">Settings</button>
      </nav>
    </div>
  );
};