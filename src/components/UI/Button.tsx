import React from 'react';
import { motion, MotionProps } from 'framer-motion';

interface ButtonProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, className = '', onClick, disabled, ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-xl font-bold transition-colors ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};