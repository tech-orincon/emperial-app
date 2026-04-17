import React from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Shield, Star, Crown, Zap } from 'lucide-react'

export function ProviderSidebar() {
  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <GlassCard className="p-6 border-purple-500/20 overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-purple-500/30">
                SB
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-slate-900 flex items-center justify-center">
                <Shield className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">Shadowblade</h3>
                <Shield className="w-4 h-4 text-purple-400" />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center gap-1">
                  <Crown className="w-3 h-3" /> MASTER
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">Mythic+ Specialist</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center p-3 rounded-lg bg-slate-800/50">
              <p className="text-2xl font-bold text-white">2,400</p>
              <p className="text-xs text-slate-400">Jobs</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-slate-800/50">
              <p className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                4.9 <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              </p>
              <p className="text-xs text-slate-400">Rating</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-slate-800/50">
              <p className="text-2xl font-bold text-white">3yr</p>
              <p className="text-xs text-slate-400">Experience</p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Verified
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
              <Star className="w-3 h-3" /> Top Rated
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
              <Zap className="w-3 h-3" /> Fast Delivery
            </span>
          </div>

          {/* Quick Stats */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Completion Rate</span>
              <span className="text-white font-medium">99.8%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Avg. Response</span>
              <span className="text-white font-medium">&lt; 5 min</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">This Week</span>
              <span className="text-green-400 font-bold">$1,240</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Recent Reviews */}
      <GlassCard className="p-6">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400" /> Recent Reviews
        </h3>
        <div className="space-y-4">
          {[
            { name: 'Arthas', rating: 5, text: 'Incredible run! Super fast and friendly.' },
            { name: 'Jaina', rating: 5, text: "Best booster I've worked with. Highly recommend!" },
          ].map((review, i) => (
            <div key={i} className="pb-4 border-b border-white/5 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white text-sm">{review.name}</span>
                <div className="flex text-amber-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-400">"{review.text}"</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
