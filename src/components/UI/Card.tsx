import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-app-card border border-app-border rounded-2xl p-4 ${className}`}>
      {children}
    </div>
  );
};