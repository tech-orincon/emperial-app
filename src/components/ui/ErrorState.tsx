import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, MessageCircle, WifiOff } from 'lucide-react';
import { Button } from './Button';
interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  onSupport?: () => void;
  variant?: 'default' | 'network' | 'notFound' | 'unavailable';
}
const variantConfig = {
  default: {
    icon: AlertTriangle,
    title: 'Something went wrong',
    description:
    'We encountered an error while loading this content. Please try again.',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20'
  },
  network: {
    icon: WifiOff,
    title: 'Connection lost',
    description:
    'Unable to connect to our servers. Please check your internet connection.',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20'
  },
  notFound: {
    icon: AlertTriangle,
    title: 'Not found',
    description:
    "The content you're looking for doesn't exist or has been removed.",
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/20'
  },
  unavailable: {
    icon: AlertTriangle,
    title: 'Service unavailable',
    description:
    'This service is temporarily unavailable. Please try again later.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20'
  }
};
export function ErrorState({
  title,
  description,
  onRetry,
  onSupport,
  variant = 'default'
}: ErrorStateProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.95
      }}
      animate={{
        opacity: 1,
        scale: 1
      }}
      className={`rounded-2xl border ${config.borderColor} ${config.bgColor} p-8 text-center max-w-md mx-auto`}>

      <motion.div
        initial={{
          scale: 0
        }}
        animate={{
          scale: 1
        }}
        transition={{
          type: 'spring',
          damping: 15,
          delay: 0.1
        }}
        className={`w-16 h-16 rounded-full ${config.bgColor} flex items-center justify-center mx-auto mb-6`}>

        <Icon className={`w-8 h-8 ${config.color}`} />
      </motion.div>

      <h3 className="text-xl font-bold text-white mb-2">
        {title || config.title}
      </h3>
      <p className="text-slate-400 mb-6">{description || config.description}</p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {onRetry &&
        <Button onClick={onRetry} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        }
        {onSupport &&
        <Button
          variant="ghost"
          onClick={onSupport}
          className="flex items-center gap-2">

            <MessageCircle className="w-4 h-4" />
            Contact Support
          </Button>
        }
      </div>
    </motion.div>);

}