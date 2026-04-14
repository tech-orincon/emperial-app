import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, Scroll, Compass } from 'lucide-react';
import { Button } from './Button';
interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'search' | 'orders' | 'cart';
}
const variantIcons = {
  default: Compass,
  search: Search,
  orders: Scroll,
  cart: ShoppingCart
};
const variantColors = {
  default: 'from-emperial-500/20 to-purple-500/20',
  search: 'from-amber-500/20 to-orange-500/20',
  orders: 'from-emerald-500/20 to-teal-500/20',
  cart: 'from-pink-500/20 to-rose-500/20'
};
export function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = 'default'
}: EmptyStateProps) {
  const Icon = icon || variantIcons[variant];
  const gradientColor = variantColors[variant];
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center">
      
      {/* Animated Icon Container */}
      <motion.div
        initial={{
          scale: 0.8
        }}
        animate={{
          scale: 1
        }}
        transition={{
          type: 'spring',
          damping: 15,
          delay: 0.1
        }}
        className={`relative w-24 h-24 rounded-2xl bg-gradient-to-br ${gradientColor} flex items-center justify-center mb-6`}>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          {[...Array(3)].map((_, i) =>
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/20"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              opacity: 0
            }}
            animate={{
              y: [null, -20, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut'
            }} />

          )}
        </div>
        <Icon className="w-10 h-10 text-slate-300" />
      </motion.div>

      <motion.h3
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        transition={{
          delay: 0.2
        }}
        className="text-xl font-bold text-white mb-2">
        
        {title}
      </motion.h3>

      <motion.p
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        transition={{
          delay: 0.3
        }}
        className="text-slate-400 max-w-md mb-8">
        
        {description}
      </motion.p>

      <motion.div
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: 0.4
        }}
        className="flex flex-col sm:flex-row items-center gap-3">
        
        {primaryAction &&
        <Button onClick={primaryAction.onClick}>{primaryAction.label}</Button>
        }
        {secondaryAction &&
        <Button variant="ghost" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        }
      </motion.div>
    </motion.div>);

}