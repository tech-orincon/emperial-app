import React from 'react';
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}
export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height
}: SkeletonProps) {
  const baseClasses = 'bg-slate-800 animate-pulse relative overflow-hidden';
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };
  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1em' : '100%')
  };
  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
    </div>);

}
// Preset skeleton components for common use cases
export function SkeletonCard({ className = '' }: {className?: string;}) {
  return (
    <div
      className={`bg-slate-900/40 border border-white/10 rounded-2xl p-6 ${className}`}>
      
      <div className="flex items-start justify-between mb-4">
        <Skeleton width={80} height={24} className="rounded" />
        <Skeleton width={60} height={16} />
      </div>
      <Skeleton height={24} className="mb-2" />
      <Skeleton width="60%" height={16} className="mb-6" />
      <Skeleton height={8} className="rounded-full mb-6" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton width={80} height={16} />
        </div>
        <Skeleton width={100} height={36} className="rounded-lg" />
      </div>
    </div>);

}
export function SkeletonServiceCard({
  className = ''


}: {className?: string;}) {
  return (
    <div
      className={`bg-slate-900/40 border border-white/10 rounded-2xl overflow-hidden ${className}`}>
      
      <Skeleton height={192} className="rounded-none" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Skeleton width={60} height={16} />
          <Skeleton width={80} height={16} />
        </div>
        <Skeleton height={24} className="mb-2" />
        <Skeleton width="80%" height={16} className="mb-6" />
        <div className="flex items-end justify-between pt-4 border-t border-white/5">
          <div>
            <Skeleton width={60} height={12} className="mb-1" />
            <Skeleton width={50} height={24} />
          </div>
          <Skeleton width={100} height={36} className="rounded-lg" />
        </div>
      </div>
    </div>);

}
export function SkeletonCategoryCard({
  className = ''


}: {className?: string;}) {
  return (
    <div
      className={`bg-slate-900/40 border border-white/10 rounded-2xl p-8 ${className}`}>
      
      <div className="flex items-start justify-between mb-6">
        <Skeleton width={64} height={64} className="rounded-xl" />
        <Skeleton width={80} height={24} className="rounded-full" />
      </div>
      <Skeleton height={24} className="mb-2" />
      <Skeleton width="90%" height={16} className="mb-2" />
      <Skeleton width="70%" height={16} className="mb-6" />
      <Skeleton width={120} height={16} />
    </div>);

}
export function SkeletonOrderRow({ className = '' }: {className?: string;}) {
  return (
    <div
      className={`bg-slate-900/40 border border-white/10 rounded-2xl p-6 ${className}`}>
      
      <div className="flex items-start justify-between mb-4">
        <Skeleton width={80} height={24} className="rounded" />
        <Skeleton width={80} height={16} />
      </div>
      <Skeleton height={20} className="mb-2" />
      <Skeleton width="50%" height={16} className="mb-6" />
      <div className="space-y-2 mb-6">
        <div className="flex justify-between">
          <Skeleton width={60} height={14} />
          <Skeleton width={40} height={14} />
        </div>
        <Skeleton height={8} className="rounded-full" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton width={80} height={16} />
        </div>
        <Skeleton width={100} height={32} className="rounded-lg" />
      </div>
    </div>);

}
export function SkeletonTimeline({ className = '' }: {className?: string;}) {
  return (
    <div
      className={`space-y-6 pl-4 border-l-2 border-slate-800 ml-2 ${className}`}>
      
      {[1, 2, 3, 4].map((i) =>
      <div key={i} className="relative">
          <Skeleton
          variant="circular"
          width={16}
          height={16}
          className="absolute -left-[21px]" />
        
          <Skeleton width={120} height={18} className="mb-1" />
          <Skeleton width={100} height={14} />
        </div>
      )}
    </div>);

}