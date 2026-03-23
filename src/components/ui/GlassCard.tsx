import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
interface GlassCardProps extends HTMLMotionProps<'div'> {
  hoverEffect?: boolean;
}
export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, hoverEffect = false, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={
        hoverEffect ?
        {
          y: 0
        } :
        undefined
        }
        whileHover={
        hoverEffect ?
        {
          y: -5,
          boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.15)'
        } :
        undefined
        }
        className={cn(
          'relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl',
          hoverEffect &&
          'transition-colors hover:border-emperial-500/30 hover:bg-slate-800/50',
          className
        )}
        {...props}>
        
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </motion.div>);

  }
);
GlassCard.displayName = 'GlassCard';