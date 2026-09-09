import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  onClick?: () => void;
}

const PADDING_STYLES = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hoverable = false,
  onClick,
}) => {
  const isInteractive = Boolean(onClick);

  const classes = `
    rounded-2xl
    border
    border-app-border
    bg-app-card
    ${PADDING_STYLES[padding]}
    transition-all
    duration-200
    ${
      hoverable || isInteractive
        ? 'hover:border-white/20 hover:bg-white/[0.03] hover:shadow-lg'
        : ''
    }
    ${
      isInteractive
        ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70'
        : ''
    }
    ${className}
  `;

  if (isInteractive) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`w-full text-left ${classes}`}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={classes}>
      {children}
    </div>
  );
};
