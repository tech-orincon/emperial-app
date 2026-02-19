import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
  {
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    children,
    ...props
  },
  ref) =>
  {
    const variants = {
      primary:
      'bg-emperial-500 text-white shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.7)] border border-transparent',
      secondary:
      'bg-white/10 text-white backdrop-blur-md border border-white/10 hover:bg-white/20',
      outline:
      'bg-transparent border border-emperial-500 text-emperial-400 hover:bg-emperial-500/10',
      ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-white/5'
    };
    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-6 text-base',
      lg: 'h-14 px-8 text-lg'
    };
    return (
      <motion.button
        ref={ref}
        whileHover={{
          scale: 1.02
        }}
        whileTap={{
          scale: 0.98
        }}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emperial-500 disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}>

        {isLoading ?
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> :
        null}
        {children}
      </motion.button>);

  }
);
Button.displayName = 'Button';