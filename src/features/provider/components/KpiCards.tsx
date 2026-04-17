import React from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Briefcase, CheckCircle2, DollarSign, Star, TrendingUp, Target, Award } from 'lucide-react'
import type { DashboardStats } from '../types/provider.dashboard.types'

interface KpiCardsProps {
  stats: DashboardStats
}

export function KpiCards({ stats }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
        <GlassCard className="p-5 border-purple-500/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Active Jobs</p>
              <p className="text-3xl font-bold text-white">{stats.activeJobs}</p>
            </div>
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Briefcase className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-purple-400">
            <TrendingUp className="w-3 h-3" />
            <span>2 new today</span>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassCard className="p-5 border-green-500/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Completed Today</p>
              <p className="text-3xl font-bold text-white">{stats.completedToday}</p>
            </div>
            <div className="p-2 rounded-lg bg-green-500/10">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-green-400">
            <Target className="w-3 h-3" />
            <span>On track for daily goal</span>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <GlassCard className="p-5 border-emerald-500/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Earnings Today</p>
              <p className="text-3xl font-bold text-white">${stats.earningsToday}</p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>+18% vs yesterday</span>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <GlassCard className="p-5 border-amber-500/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Rating</p>
              <p className="text-3xl font-bold text-white flex items-center gap-1">
                {stats.rating}
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              </p>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">{stats.totalReviews.toLocaleString()} reviews</div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
