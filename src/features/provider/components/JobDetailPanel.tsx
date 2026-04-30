import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../../components/ui/Button'
import { GlassCard } from '../../../components/ui/GlassCard'
import { X, Zap, MessageSquare, Clock, Upload } from 'lucide-react'
import type { Job, JobStatus } from '../types/provider.dashboard.types'

interface JobDetailPanelProps {
  job: Job
  onClose: () => void
  getStatusConfig: (status: JobStatus) => { label: string; color: string }
  getActionButton: (job: Job) => React.ReactNode
}

export function JobDetailPanel({ job, onClose, getStatusConfig, getActionButton }: JobDetailPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed inset-y-0 right-0 w-full max-w-lg bg-slate-900 border-l border-white/10 shadow-2xl z-50 overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 bg-slate-900/95 backdrop-blur-lg border-b border-white/10 p-4 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-white">{job.service}</h2>
          <p className="text-sm text-slate-400">#{job.id}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Status & Priority */}
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusConfig(job.status).color}`}>
            {getStatusConfig(job.status).label}
          </span>
          {job.priority === 'high' && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
              <Zap className="w-3 h-3" /> High Priority
            </span>
          )}
        </div>

        {/* Customer Info */}
        <GlassCard className="p-4">
          <h3 className="text-sm font-medium text-slate-400 mb-3">Customer</h3>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-lg">
              {job.customerAvatar}
            </div>
            <div className="flex-1">
              <p className="font-bold text-white">{job.customer}</p>
            </div>
            <Button variant="secondary" size="sm" className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" /> Chat
            </Button>
          </div>
        </GlassCard>

        {/* Order Details */}
        <GlassCard className="p-4">
          <h3 className="text-sm font-medium text-slate-400 mb-3">Order Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Game</span>
              <span className="text-white font-medium">{job.game}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Category</span>
              <span className="text-white font-medium">{job.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Service</span>
              <span className="text-white font-medium">{job.service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Package</span>
              <span className="text-white font-medium">{job.package}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Deadline</span>
              <span className="text-white font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" /> {job.deadline}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Payout</span>
              <span className="text-green-400 font-bold">${job.reward.toFixed(2)}</span>
            </div>
          </div>
        </GlassCard>

        {/* Add-ons */}
        {job.addons.length > 0 && (
          <GlassCard className="p-4">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Add-ons</h3>
            <div className="flex flex-wrap gap-2">
              {job.addons.map((addon) => (
                <span key={addon} className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {addon}
                </span>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Customer Notes */}
        {job.notes && (
          <GlassCard className="p-4">
            <h3 className="text-sm font-medium text-slate-400 mb-2">Notes</h3>
            <p className="text-slate-300 text-sm bg-slate-800/50 rounded-lg p-3">"{job.notes}"</p>
          </GlassCard>
        )}

        {/* Timeline */}
        <GlassCard className="p-4">
          <h3 className="text-sm font-medium text-slate-400 mb-4">Progress Timeline</h3>
          <div className="space-y-4 relative pl-4 border-l-2 border-slate-800 ml-2">
            <div className="relative">
              <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-green-500 border-2 border-slate-900" />
              <p className="text-white text-sm font-medium">Order Received</p>
              <p className="text-xs text-slate-500">{job.deadline}</p>
            </div>
            {job.status !== 'new' && (
              <div className="relative">
                <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-blue-500 border-2 border-slate-900" />
                <p className="text-white text-sm font-medium">Job Accepted</p>
              </div>
            )}
            {(job.status === 'in-progress' || job.status === 'completed') && (
              <div className="relative">
                <div className={`absolute -left-[21px] w-4 h-4 rounded-full border-2 border-slate-900 ${job.status === 'in-progress' ? 'bg-purple-500 animate-pulse' : 'bg-purple-500'}`} />
                <p className="text-white text-sm font-medium">In Progress</p>
                {job.status === 'in-progress' && <p className="text-xs text-slate-500">Currently active</p>}
              </div>
            )}
            {job.status === 'completed' && (
              <div className="relative">
                <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-green-500 border-2 border-slate-900" />
                <p className="text-white text-sm font-medium">Completed</p>
              </div>
            )}
            {job.status !== 'completed' && (
              <div className="relative opacity-50">
                <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-slate-700 border-2 border-slate-900" />
                <p className="text-white text-sm font-medium">Completion</p>
                <p className="text-xs text-slate-500">Pending</p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Sticky Action Bar */}
      <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-lg border-t border-white/10 p-4 flex items-center gap-3">
        {getActionButton(job)}
        <Button variant="secondary" className="flex-1 flex items-center justify-center gap-2">
          <MessageSquare className="w-4 h-4" /> Contact Customer
        </Button>
        {job.status === 'in-progress' && (
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload Proof
          </Button>
        )}
      </div>
    </motion.div>
  )
}
