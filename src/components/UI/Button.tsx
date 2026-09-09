import React from 'react';
import { motion, type MotionProps } from 'framer-motion';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'success';

type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * React button props that are safe to pass to a Framer Motion button.
 *
 * Framer Motion defines its own versions of several animation/event
 * properties, so those conflicting React properties are omitted.
 */
type NativeButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
  | 'onDrag'
  | 'onDragEnd'
  | 'onDragEnter'
  | 'onDragExit'
  | 'onDragLeave'
  | 'onDragOver'
  | 'onDragStart'
  | 'onDrop'
  | 'onMouseDown'
  | 'onMouseUp'
  | 'onMouseEnter'
  | 'onMouseLeave'
  | 'onMouseMove'
  | 'onMouseOver'
  | 'onMouseOut'
  | 'onTouchStart'
  | 'onTouchMove'
  | 'onTouchEnd'
>;

interface ButtonProps extends NativeButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;

  motionProps?: Pick<
    MotionProps,
    'whileHover' | 'whileTap' | 'transition'
  >;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    'bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/10',

  secondary:
    'bg-white/10 text-white border border-white/10 hover:bg-white/15 hover:border-white/20',

  ghost:
    'bg-transparent text-gray-300 hover:bg-white/5 hover:text-white',

  danger:
    'bg-red-500/15 text-red-300 border border-red-500/20 hover:bg-red-500/25',

  success:
    'bg-green-500/15 text-green-300 border border-green-500/20 hover:bg-green-500/25',
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3 text-xs rounded-lg',
  md: 'min-h-10 px-4 text-sm rounded-xl',
  lg: 'min-h-12 px-6 text-base rounded-xl',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  motionProps,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      {...props}
      type={type}
      disabled={isDisabled}
      whileHover={
        motionProps?.whileHover ??
        (!isDisabled ? { y: -1 } : undefined)
      }
      whileTap={
        motionProps?.whileTap ??
        (!isDisabled ? { scale: 0.985 } : undefined)
      }
      transition={
        motionProps?.transition ?? { duration: 0.15 }
      }
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        font-semibold
        transition-all
        duration-200
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-emerald-400/70
        focus-visible:ring-offset-2
        focus-visible:ring-offset-[#0b132b]
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${VARIANT_STYLES[variant]}
        ${SIZE_STYLES[size]}
        ${className}
      `}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}

      {loading ? 'Loading…' : children}
    </motion.button>
  );
};
