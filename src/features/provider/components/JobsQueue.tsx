import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Briefcase, User, Timer, Zap } from 'lucide-react'
import type { Job, JobStatus } from '../types/provider.dashboard.types'

interface JobsQueueProps {
  jobs: Job[]
  filteredJobs: Job[]
  activeTab: JobStatus | 'all'
  onTabChange: (tab: JobStatus | 'all') => void
  onSelectJob: (job: Job) => void
  getStatusConfig: (status: JobStatus) => { label: string; color: string }
  getActionButton: (job: Job) => React.ReactNode
}

export function JobsQueue({
  jobs,
  filteredJobs,
  activeTab,
  onTabChange,
  onSelectJob,
  getStatusConfig,
  getActionButton,
}: JobsQueueProps) {
  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Jobs Queue</h2>
        <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
          {(['new', 'accepted', 'in-progress', 'completed'] as JobStatus[]).map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === tab ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              {tab === 'in-progress' ? 'Active' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'new' && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-xs">
                  {jobs.filter((j) => j.status === 'new').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredJobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-slate-400">No {activeTab} jobs</p>
            </motion.div>
          ) : (
            filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard
                  hoverEffect
                  className={`p-5 cursor-pointer transition-all ${job.priority === 'high' ? 'border-l-4 border-l-red-500' : ''}`}
                  onClick={() => onSelectJob(job)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${job.status === 'new' ? 'bg-amber-500/10 text-amber-400' : job.status === 'accepted' ? 'bg-blue-500/10 text-blue-400' : job.status === 'in-progress' ? 'bg-purple-500/10 text-purple-400' : 'bg-green-500/10 text-green-400'}`}
                      >
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-white truncate">{job.service}</h3>
                          {job.priority === 'high' && (
                            <span className="shrink-0 px-1.5 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400 flex items-center gap-0.5">
                              <Zap className="w-3 h-3" /> Priority
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" /> {job.customer}
                          </span>
                          <span className="flex items-center gap-1">
                            <Timer className="w-3 h-3" /> {job.deadline}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusConfig(job.status).color}`}>
                            {getStatusConfig(job.status).label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-green-400 mb-2">${job.reward.toFixed(2)}</p>
                      <div onClick={(e) => e.stopPropagation()}>{getActionButton(job)}</div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
