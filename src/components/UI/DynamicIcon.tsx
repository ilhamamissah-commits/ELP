import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-6 h-6' }) => {
  const Icon = (Icons as any)[name.charAt(0).toUpperCase() + name.slice(1)];
  return Icon ? <Icon className={className} /> : null;
};