import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ToggleLeft, ToggleRight } from 'lucide-react'
import { toast } from 'sonner'
import { useProviderDashboard } from './hooks/useProviderDashboard'
import { PendingApprovalView } from './components/PendingApprovalView'
import { KpiCards } from './components/KpiCards'
import { JobsQueue } from './components/JobsQueue'
import { ProviderSidebar } from './components/ProviderSidebar'
import { JobDetailPanel } from './components/JobDetailPanel'

export function ProviderDashboardPage() {
  const {
    providerStatus,
    setProviderStatus,
    activeTab,
    setActiveTab,
    isOnline,
    selectedJob,
    setSelectedJob,
    jobs,
    stats,
    filteredJobs,
    getStatusConfig,
    getActionButton,
  } = useProviderDashboard()

  if (providerStatus === 'pending') {
    return <PendingApprovalView onSwitchToApproved={() => setProviderStatus('approved')} />
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white">Provider Dashboard</h1>
              <span className="px-2 py-1 rounded text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/20">PRO</span>
            </div>
            <p className="text-slate-400">Manage your active jobs and earnings</p>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setProviderStatus('pending')} className="text-xs px-3 py-1.5 rounded border border-amber-500/30 text-amber-400">
              Demo: Switch to Pending
            </button>
            <button
              onClick={() => toast.success(isOnline ? 'You are now offline' : 'You are now online')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${isOnline ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-slate-800 border-white/10 text-slate-400'}`}
            >
              {isOnline ? (
                <><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span><span className="text-sm font-medium">Online</span><ToggleRight className="w-5 h-5" /></>
              ) : (
                <><span className="w-2 h-2 rounded-full bg-slate-500"></span><span className="text-sm font-medium">Offline</span><ToggleLeft className="w-5 h-5" /></>
              )}
            </button>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white">Shadowblade</p>
                <p className="text-xs text-purple-400">Master Provider</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">SB</div>
            </div>
          </div>
        </div>

        <KpiCards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <JobsQueue
            jobs={jobs}
            filteredJobs={filteredJobs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onSelectJob={setSelectedJob}
            getStatusConfig={getStatusConfig}
            getActionButton={getActionButton}
          />
          <ProviderSidebar />
        </div>
      </div>

      {/* Job Detail Slide-over */}
      <AnimatePresence>
        {selectedJob && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedJob(null)}
            />
            <JobDetailPanel
              job={selectedJob}
              onClose={() => setSelectedJob(null)}
              getStatusConfig={getStatusConfig}
              getActionButton={getActionButton}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
