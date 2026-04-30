import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { Play, CheckCircle2 } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { useAuth } from '../../../context/AuthContext'
import {
  getProviderJobs, acceptJob, rejectJob, startJob, completeJob,
  getProviderStats, getProviderProfile, setAvailability,
} from '../../../services/provider.service'
import type { Job, JobStatus, DashboardStats } from '../types/provider.dashboard.types'
import type { ProviderJobDto, ProviderProfileResponseDto, ProviderStatsResponseDto } from '../../../types/provider.types'

// Maps backend status → frontend display status
const STATUS_MAP: Record<string, JobStatus> = {
  PENDING: 'new',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'completed',
  DISPUTED: 'completed',
}

function mapJob(pj: ProviderJobDto): Job {
  return {
    id: pj.id,
    service: pj.service.title,
    game: pj.service.game.name,
    category: pj.service.category.name,
    package: pj.package.name,
    addons: pj.addons.map((a) => a.name),
    customer: pj.customer.username,
    customerAvatar: pj.customer.avatarInitials,
    reward: parseFloat(pj.reward),
    deadline: pj.deadline ?? new Date(pj.createdAt).toLocaleDateString(),
    status: STATUS_MAP[pj.status] ?? 'new',
    priority: pj.priority === 'HIGH' ? 'high' : 'normal',
    notes: pj.notes,
  }
}

function mapStats(raw: ProviderStatsResponseDto): DashboardStats {
  return {
    activeJobs: raw.activeJobs,
    completedToday: raw.completedToday,
    earningsToday: raw.earningsToday,
    totalEarnings: raw.totalEarnings,
    ratingAvg: raw.ratingAvg,
    totalOrdersCompleted: raw.totalOrdersCompleted,
  }
}

const EMPTY_STATS: DashboardStats = {
  activeJobs: 0, completedToday: 0, earningsToday: '0', totalEarnings: '0', ratingAvg: 0, totalOrdersCompleted: 0,
}

export function useProviderDashboard() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<JobStatus | 'all'>('new')
  const [isOnline, setIsOnline] = useState(user?.isOnline ?? true)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS)
  const [profile, setProfile] = useState<ProviderProfileResponseDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadData = useCallback(async () => {
    if (isAuthLoading || !user) return
    try {
      // Load profile first — determines verificationStatus gate
      const rawProfile = await getProviderProfile()
      setProfile(rawProfile)
      setIsOnline(rawProfile.isOnline)

      // Skip jobs/stats only for explicitly blocked statuses
      const BLOCKED = ['PENDING', 'REJECTED', 'SUSPENDED']
      if (rawProfile.verificationStatus && BLOCKED.includes(rawProfile.verificationStatus)) return

      const [jobsRes, rawStats] = await Promise.all([
        getProviderJobs(),
        getProviderStats(),
      ])
      setJobs(jobsRes.data.map(mapJob))
      setStats(mapStats(rawStats))
    } catch (err) {
      console.error('[ProviderDashboard] loadData error:', err)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }, [isAuthLoading, user])

  useEffect(() => { loadData() }, [loadData])

  const filteredJobs = activeTab === 'all' ? jobs : jobs.filter((j) => j.status === activeTab)

  // profile is source of truth; fall back to auth's providerStatus while profile loads
  const verificationStatus = profile?.verificationStatus ?? user?.providerStatus

  const getStatusConfig = (status: JobStatus) => {
    switch (status) {
      case 'new': return { label: 'New', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' }
      case 'accepted': return { label: 'Accepted', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' }
      case 'in-progress': return { label: 'In Progress', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' }
      case 'completed': return { label: 'Completed', color: 'bg-green-500/20 text-green-400 border-green-500/30' }
    }
  }

  const handleJobAction = async (job: Job, action: 'accept' | 'reject' | 'start' | 'complete') => {
    if (action === 'reject') {
      setJobs((prev) => prev.filter((j) => j.id !== job.id))
      if (selectedJob?.id === job.id) setSelectedJob(null)
    } else {
      const newStatus: JobStatus =
        action === 'accept' ? 'accepted' : action === 'start' ? 'in-progress' : 'completed'
      setJobs((prev) => prev.map((j) => j.id === job.id ? { ...j, status: newStatus } : j))
      if (selectedJob?.id === job.id) setSelectedJob({ ...job, status: newStatus })
    }
    try {
      if (action === 'accept') await acceptJob(job.id)
      else if (action === 'reject') await rejectJob(job.id)
      else if (action === 'start') await startJob(job.id)
      else await completeJob(job.id)
      toast.success(`Job ${action === 'complete' ? 'completed' : action + 'ed'}!`)
    } catch {
      loadData()
      toast.error(`Failed to ${action} job`)
    }
  }

  const getActionButton = (job: Job) => {
    switch (job.status) {
      case 'new':
        return <Button size="sm" onClick={() => handleJobAction(job, 'accept')} className="bg-purple-500 hover:bg-purple-400">Accept Job</Button>
      case 'accepted':
        return <Button size="sm" onClick={() => handleJobAction(job, 'start')} className="bg-blue-500 hover:bg-blue-400"><Play className="w-3 h-3 mr-1" /> Start Job</Button>
      case 'in-progress':
        return <Button size="sm" onClick={() => handleJobAction(job, 'complete')} className="bg-green-500 hover:bg-green-400"><CheckCircle2 className="w-3 h-3 mr-1" /> Complete</Button>
      case 'completed':
        return <Button size="sm" variant="secondary" disabled>Completed</Button>
    }
  }

  const toggleOnline = async () => {
    const next = !isOnline
    setIsOnline(next)
    toast.success(next ? 'You are now online' : 'You are now offline')
    try {
      await setAvailability(next)
    } catch {
      setIsOnline(!next)
      toast.error('Failed to update availability')
    }
  }

  return {
    verificationStatus,
    activeTab, setActiveTab,
    isOnline, toggleOnline,
    selectedJob, setSelectedJob,
    jobs, stats, profile,
    filteredJobs, isLoading,
    getStatusConfig, handleJobAction, getActionButton,
  }
}
