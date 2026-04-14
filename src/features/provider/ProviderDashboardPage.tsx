import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { GlassCard } from '../../components/ui/GlassCard'
import {
  Briefcase,
  DollarSign,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Upload,
  Play,
  User,
  Shield,
  TrendingUp,
  Award,
  MapPin,
  ToggleLeft,
  ToggleRight,
  X,
  Zap,
  Crown,
  Target,
  Timer,
} from 'lucide-react'
import { toast } from 'sonner'
type JobStatus = 'new' | 'accepted' | 'in-progress' | 'completed'
type JobPriority = 'high' | 'normal'
interface Job {
  id: string
  service: string
  customer: string
  customerAvatar: string
  realm: string
  reward: number
  deadline: string
  status: JobStatus
  priority: JobPriority
  notes?: string
  addons?: string[]
}
const mockJobs: Job[] = [
  {
    id: 'JOB-001',
    service: 'Mythic+ 20 Timed Run',
    customer: 'Arthas',
    customerAvatar: 'A',
    realm: 'Illidan (US)',
    reward: 35,
    deadline: 'Today, 2:00 PM',
    status: 'new',
    priority: 'high',
    notes: 'Need loot funnel for plate',
    addons: ['Loot Funnel', 'Stream'],
  },
  {
    id: 'JOB-002',
    service: 'Amirdrassil Heroic Clear',
    customer: 'Jaina',
    customerAvatar: 'J',
    realm: 'Stormrage (US)',
    reward: 89,
    deadline: 'Today, 4:30 PM',
    status: 'new',
    priority: 'normal',
    addons: ['VIP Priority'],
  },
  {
    id: 'JOB-003',
    service: 'M+ 15 Weekly Vault',
    customer: 'Thrall',
    customerAvatar: 'T',
    realm: 'Area 52 (US)',
    reward: 15,
    deadline: 'In Progress',
    status: 'in-progress',
    priority: 'normal',
  },
  {
    id: 'JOB-004',
    service: 'Keystone Master Push',
    customer: 'Sylvanas',
    customerAvatar: 'S',
    realm: 'Kazzak (EU)',
    reward: 149,
    deadline: 'Tomorrow, 10:00 AM',
    status: 'accepted',
    priority: 'high',
    notes: 'Available after 8PM EST',
  },
  {
    id: 'JOB-005',
    service: 'Gold Delivery 500k',
    customer: 'Anduin',
    customerAvatar: 'A',
    realm: 'Illidan (US)',
    reward: 25,
    deadline: 'Completed',
    status: 'completed',
    priority: 'normal',
  },
]
export function ProviderDashboardPage() {
  const [providerStatus, setProviderStatus] = useState<'pending' | 'approved'>(
    'pending',
  )
  const [activeTab, setActiveTab] = useState<JobStatus | 'all'>('new')
  const [isOnline, setIsOnline] = useState(true)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [jobs, setJobs] = useState(mockJobs)
  const stats = {
    activeJobs: jobs.filter(
      (j) => j.status === 'in-progress' || j.status === 'accepted',
    ).length,
    completedToday: 5,
    earningsToday: 245,
    rating: 4.9,
    totalReviews: 1240,
  }
  const filteredJobs =
    activeTab === 'all' ? jobs : jobs.filter((j) => j.status === activeTab)
  const getStatusConfig = (status: JobStatus) => {
    switch (status) {
      case 'new':
        return {
          label: 'New',
          color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        }
      case 'accepted':
        return {
          label: 'Accepted',
          color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        }
      case 'in-progress':
        return {
          label: 'In Progress',
          color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        }
      case 'completed':
        return {
          label: 'Completed',
          color: 'bg-green-500/20 text-green-400 border-green-500/30',
        }
    }
  }
  const handleJobAction = (
    job: Job,
    action: 'accept' | 'start' | 'complete',
  ) => {
    const newStatus: JobStatus =
      action === 'accept'
        ? 'accepted'
        : action === 'start'
          ? 'in-progress'
          : 'completed'
    setJobs(
      jobs.map((j) =>
        j.id === job.id
          ? {
              ...j,
              status: newStatus,
            }
          : j,
      ),
    )
    toast.success(
      `Job ${action === 'accept' ? 'accepted' : action === 'start' ? 'started' : 'completed'}!`,
    )
    if (selectedJob?.id === job.id) {
      setSelectedJob({
        ...job,
        status: newStatus,
      })
    }
  }
  const getActionButton = (job: Job) => {
    switch (job.status) {
      case 'new':
        return (
          <Button
            size="sm"
            onClick={() => handleJobAction(job, 'accept')}
            className="bg-purple-500 hover:bg-purple-400"
          >
            Accept Job
          </Button>
        )
      case 'accepted':
        return (
          <Button
            size="sm"
            onClick={() => handleJobAction(job, 'start')}
            className="bg-blue-500 hover:bg-blue-400"
          >
            <Play className="w-3 h-3 mr-1" /> Start Job
          </Button>
        )
      case 'in-progress':
        return (
          <Button
            size="sm"
            onClick={() => handleJobAction(job, 'complete')}
            className="bg-green-500 hover:bg-green-400"
          >
            <CheckCircle2 className="w-3 h-3 mr-1" /> Complete
          </Button>
        )
      case 'completed':
        return (
          <Button size="sm" variant="secondary" disabled>
            Completed
          </Button>
        )
    }
  }
  // Job Detail Panel
  const JobDetailPanel = ({ job }: { job: Job }) => (
    <motion.div
      initial={{
        opacity: 0,
        x: 20,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: 20,
      }}
      className="fixed inset-y-0 right-0 w-full max-w-lg bg-slate-900 border-l border-white/10 shadow-2xl z-50 overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 bg-slate-900/95 backdrop-blur-lg border-b border-white/10 p-4 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-white">{job.service}</h2>
          <p className="text-sm text-slate-400">{job.id}</p>
        </div>
        <button
          onClick={() => setSelectedJob(null)}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Status & Priority */}
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusConfig(job.status).color}`}
          >
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
              <p className="text-sm text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {job.realm}
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="flex items-center gap-1"
            >
              <MessageSquare className="w-4 h-4" /> Chat
            </Button>
          </div>
        </GlassCard>

        {/* Order Details */}
        <GlassCard className="p-4">
          <h3 className="text-sm font-medium text-slate-400 mb-3">
            Order Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Service</span>
              <span className="text-white font-medium">{job.service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Deadline</span>
              <span className="text-white font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" /> {job.deadline}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Reward</span>
              <span className="text-green-400 font-bold">
                ${job.reward.toFixed(2)}
              </span>
            </div>
            {job.addons && job.addons.length > 0 && (
              <div className="pt-2 border-t border-white/5">
                <span className="text-slate-400 text-sm">Add-ons:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.addons.map((addon) => (
                    <span
                      key={addon}
                      className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-300"
                    >
                      {addon}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Customer Notes */}
        {job.notes && (
          <GlassCard className="p-4">
            <h3 className="text-sm font-medium text-slate-400 mb-2">
              Customer Notes
            </h3>
            <p className="text-slate-300 text-sm bg-slate-800/50 rounded-lg p-3">
              "{job.notes}"
            </p>
          </GlassCard>
        )}

        {/* Timeline */}
        <GlassCard className="p-4">
          <h3 className="text-sm font-medium text-slate-400 mb-4">
            Progress Timeline
          </h3>
          <div className="space-y-4 relative pl-4 border-l-2 border-slate-800 ml-2">
            <div className="relative">
              <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-green-500 border-2 border-slate-900" />
              <p className="text-white text-sm font-medium">Order Received</p>
              <p className="text-xs text-slate-500">Today, 1:30 PM</p>
            </div>
            {job.status !== 'new' && (
              <div className="relative">
                <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-blue-500 border-2 border-slate-900" />
                <p className="text-white text-sm font-medium">Job Accepted</p>
                <p className="text-xs text-slate-500">Today, 1:35 PM</p>
              </div>
            )}
            {(job.status === 'in-progress' || job.status === 'completed') && (
              <div className="relative">
                <div
                  className={`absolute -left-[21px] w-4 h-4 rounded-full border-2 border-slate-900 ${job.status === 'in-progress' ? 'bg-purple-500 animate-pulse' : 'bg-purple-500'}`}
                />
                <p className="text-white text-sm font-medium">In Progress</p>
                <p className="text-xs text-slate-500">
                  {job.status === 'in-progress'
                    ? 'Currently active'
                    : 'Today, 1:45 PM'}
                </p>
              </div>
            )}
            {job.status === 'completed' && (
              <div className="relative">
                <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-green-500 border-2 border-slate-900" />
                <p className="text-white text-sm font-medium">Completed</p>
                <p className="text-xs text-slate-500">Today, 2:30 PM</p>
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
        <Button
          variant="secondary"
          className="flex-1 flex items-center justify-center gap-2"
        >
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
  if (providerStatus === 'pending') {
    return (
      <div className="min-h-screen bg-slate-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="absolute top-24 right-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setProviderStatus('approved')}
            className="text-xs border-purple-500/30 text-purple-400"
          >
            Demo: Switch to Approved
          </Button>
        </div>

        <GlassCard className="max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Account Under Review
          </h1>
          <p className="text-slate-400 mb-8">
            Your provider application is currently being reviewed by our team.
            This process usually takes 24-48 hours. We will notify you via email
            once a decision has been made.
          </p>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-800/50 border border-white/5 flex items-start gap-3 text-left">
              <Shield className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-white">
                  Why the review?
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  We verify all boosters to maintain the highest quality of
                  service for our customers.
                </p>
              </div>
            </div>

            <Button
              className="w-full bg-purple-600 hover:bg-purple-500"
              onClick={() => {
                const event = new CustomEvent('openChat')
                window.dispatchEvent(event)
              }}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Support
            </Button>

            <Link to="/">
              <Button variant="ghost" className="w-full mt-2">
                Return to Home
              </Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white">
                Provider Dashboard
              </h1>
              <span className="px-2 py-1 rounded text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/20">
                PRO
              </span>
            </div>
            <p className="text-slate-400">
              Manage your active jobs and earnings
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setProviderStatus('pending')}
              className="text-xs border-amber-500/30 text-amber-400"
            >
              Demo: Switch to Pending
            </Button>
            {/* Availability Toggle */}
            <button
              onClick={() => {
                setIsOnline(!isOnline)
                toast.success(
                  isOnline ? 'You are now offline' : 'You are now online',
                )
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${isOnline ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-slate-800 border-white/10 text-slate-400'}`}
            >
              {isOnline ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-sm font-medium">Online</span>
                  <ToggleRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                  <span className="text-sm font-medium">Offline</span>
                  <ToggleLeft className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white">Shadowblade</p>
                <p className="text-xs text-purple-400">Master Provider</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                SB
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0,
            }}
          >
            <GlassCard className="p-5 border-purple-500/20">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Active Jobs</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.activeJobs}
                  </p>
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

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.1,
            }}
          >
            <GlassCard className="p-5 border-green-500/20">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Completed Today</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.completedToday}
                  </p>
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

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
            }}
          >
            <GlassCard className="p-5 border-emerald-500/20">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Earnings Today</p>
                  <p className="text-3xl font-bold text-white">
                    ${stats.earningsToday}
                  </p>
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

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.3,
            }}
          >
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
              <div className="mt-3 text-xs text-slate-400">
                {stats.totalReviews.toLocaleString()} reviews
              </div>
            </GlassCard>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Jobs Queue */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Jobs Queue</h2>
              <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
                {(
                  ['new', 'accepted', 'in-progress', 'completed'] as JobStatus[]
                ).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === tab ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  >
                    {tab === 'in-progress'
                      ? 'Active'
                      : tab.charAt(0).toUpperCase() + tab.slice(1)}
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
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
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
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.95,
                      }}
                      transition={{
                        delay: index * 0.05,
                      }}
                    >
                      <GlassCard
                        hoverEffect
                        className={`p-5 cursor-pointer transition-all ${job.priority === 'high' ? 'border-l-4 border-l-red-500' : ''}`}
                        onClick={() => setSelectedJob(job)}
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
                                <h3 className="font-bold text-white truncate">
                                  {job.service}
                                </h3>
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
                                <span
                                  className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusConfig(job.status).color}`}
                                >
                                  {getStatusConfig(job.status).label}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-lg font-bold text-green-400 mb-2">
                              ${job.reward.toFixed(2)}
                            </p>
                            <div onClick={(e) => e.stopPropagation()}>
                              {getActionButton(job)}
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar - Provider Profile */}
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
                      <h3 className="text-xl font-bold text-white">
                        Shadowblade
                      </h3>
                      <Shield className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center gap-1">
                        <Crown className="w-3 h-3" /> MASTER
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      Mythic+ Specialist
                    </p>
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
                      4.9{' '}
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
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
                  {
                    name: 'Arthas',
                    rating: 5,
                    text: 'Incredible run! Super fast and friendly.',
                  },
                  {
                    name: 'Jaina',
                    rating: 5,
                    text: "Best booster I've worked with. Highly recommend!",
                  },
                ].map((review, i) => (
                  <div
                    key={i}
                    className="pb-4 border-b border-white/5 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white text-sm">
                        {review.name}
                      </span>
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
        </div>
      </div>

      {/* Job Detail Slide-over */}
      <AnimatePresence>
        {selectedJob && (
          <>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedJob(null)}
            />
            <JobDetailPanel job={selectedJob} />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
