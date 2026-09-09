import React from 'react';

interface ProgressBarProps {
  /** Progress value from 0 to 100 */
  progress: number;

  /** Tailwind background class for the filled portion */
  color?: string;

  /** Tailwind height class */
  height?: string;

  /** Optional accessible/visible label */
  label?: string;

  /** Show percentage text alongside the bar */
  showPercentage?: boolean;

  /** Additional classes for the outer container */
  className?: string;

  /** Accessible label when no visible label is provided */
  ariaLabel?: string;
}

const clampProgress = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'bg-emerald-500',
  height = 'h-2',
  label,
  showPercentage = false,
  className = '',
  ariaLabel = 'Progress',
}) => {
  const normalizedProgress = clampProgress(progress);

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="mb-1.5 flex items-center justify-between gap-3">
          {label && (
            <span className="text-xs font-medium text-app-muted">
              {label}
            </span>
          )}

          {showPercentage && (
            <span className="text-xs font-semibold text-app-text">
              {Math.round(normalizedProgress)}%
            </span>
          )}
        </div>
      )}

      <div
        className={`w-full overflow-hidden rounded-full bg-app-border/60 ${height}`}
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuenow={Math.round(normalizedProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`${color} h-full rounded-full transition-[width] duration-500 ease-out`}
          style={{ width: `${normalizedProgress}%` }}
        />
      </div>
    </div>
  );
};
