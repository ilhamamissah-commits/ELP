import React from 'react';
import {
  BookOpen,
  Calculator,
  FlaskConical,
  Sigma,
  Palette,
  PenTool,
  Globe2,
  Leaf,
  HeartPulse,
  Brain,
  Wrench,
  Bot,
  Languages,
  Cpu,
  Coins,
  Recycle,
  Landmark,
  Lightbulb,
  Sprout,
  Moon,
  Puzzle,
  Monitor,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  BookOpen,
  Calculator,
  FlaskConical,
  Sigma,
  Palette,
  PenTool,
  Globe2,
  Leaf,
  HeartPulse,
  Brain,
  Wrench,
  Bot,
  Languages,
  Cpu,
  Coins,
  Recycle,
  Landmark,
  Lightbulb,
  Sprout,
  Moon,
  Puzzle,
  Monitor,
};

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

const normalizeIconName = (name: string): string => {
  return name
    .trim()
    .split(/[-_\s]+/)
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join('');
};

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  className = 'h-6 w-6',
  size,
  strokeWidth = 2,
}) => {
  const iconName = normalizeIconName(name);
  const Icon = ICONS[iconName];

  if (!Icon) {
    return null;
  }

  return (
    <Icon
      className={className}
      size={size}
      strokeWidth={strokeWidth}
      aria-hidden="true"
    />
  );
};
