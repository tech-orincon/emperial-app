import React from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Shield, Star, Crown, Zap, CheckCircle2 } from 'lucide-react'
import type { ProviderProfileResponseDto } from '../../../types/provider.types'

interface ProviderSidebarProps {
  profile: ProviderProfileResponseDto | null
}

const TIER_BADGE: Record<string, string> = {
  STANDARD: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  ADVANCED: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  MASTER: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  ELITE: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0',
}

export function ProviderSidebar({ profile }: ProviderSidebarProps) {
  const initials = profile?.displayName
    ? profile.displayName.slice(0, 2).toUpperCase()
    : '??'
  const tier = profile?.tier ?? 'STANDARD'

  return (
    <div className="space-y-6">
      <GlassCard className="p-6 border-purple-500/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.displayName} className="w-20 h-20 rounded-full object-cover shadow-lg shadow-purple-500/30" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-purple-500/30">
                  {initials}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-slate-900 flex items-center justify-center">
                <Shield className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{profile?.displayName ?? '—'}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded text-xs font-bold border flex items-center gap-1 ${TIER_BADGE[tier]}`}>
                  <Crown className="w-3 h-3" /> {tier}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center p-3 rounded-lg bg-slate-800/50">
              <p className="text-2xl font-bold text-white">{profile?.totalOrdersCompleted ?? '—'}</p>
              <p className="text-xs text-slate-400">Jobs</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-slate-800/50">
              <p className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                {profile?.ratingAvg != null ? profile.ratingAvg.toFixed(1) : '—'} <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              </p>
              <p className="text-xs text-slate-400">Rating</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-slate-800/50">
              <p className="text-2xl font-bold text-white">
                {profile?.completionRate != null ? `${profile.completionRate.toFixed(0)}%` : '—'}
              </p>
              <p className="text-xs text-slate-400">Completion</p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {profile?.verificationStatus === 'APPROVED' && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verified
              </span>
            )}
            {profile && profile.ratingAvg != null && profile.ratingAvg >= 4.5 && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                <Star className="w-3 h-3" /> Top Rated
              </span>
            )}
            {profile?.isActive && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
                <Zap className="w-3 h-3" /> Active
              </span>
            )}
          </div>

          {/* Quick Stats */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Completion Rate</span>
              <span className="text-white font-medium">
                {profile?.completionRate != null ? `${profile.completionRate.toFixed(1)}%` : '—'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Total Completed</span>
              <span className="text-white font-medium">
                {profile?.totalOrdersCompleted != null ? profile.totalOrdersCompleted.toLocaleString() : '—'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Status</span>
              <span className={`font-medium text-sm ${profile?.isOnline ? 'text-green-400' : 'text-slate-500'}`}>
                {profile?.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
