import { useState } from 'react'
import { toast } from 'sonner'
import { Play, CheckCircle2 } from 'lucide-react'
import React from 'react'
import { Button } from '../../../components/ui/Button'
import type { Job, JobStatus, DashboardStats } from '../types/provider.dashboard.types'

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

export function useProviderDashboard() {
  const [providerStatus, setProviderStatus] = useState<'pending' | 'approved'>('pending')
  const [activeTab, setActiveTab] = useState<JobStatus | 'all'>('new')
  const [isOnline, setIsOnline] = useState(true)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [jobs, setJobs] = useState(mockJobs)

  const stats: DashboardStats = {
    activeJobs: jobs.filter((j) => j.status === 'in-progress' || j.status === 'accepted').length,
    completedToday: 5,
    earningsToday: 245,
    rating: 4.9,
    totalReviews: 1240,
  }

  const filteredJobs = activeTab === 'all' ? jobs : jobs.filter((j) => j.status === activeTab)

  const getStatusConfig = (status: JobStatus) => {
    switch (status) {
      case 'new':
        return { label: 'New', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' }
      case 'accepted':
        return { label: 'Accepted', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' }
      case 'in-progress':
        return { label: 'In Progress', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' }
      case 'completed':
        return { label: 'Completed', color: 'bg-green-500/20 text-green-400 border-green-500/30' }
    }
  }

  const handleJobAction = (job: Job, action: 'accept' | 'start' | 'complete') => {
    const newStatus: JobStatus =
      action === 'accept' ? 'accepted' : action === 'start' ? 'in-progress' : 'completed'
    setJobs(jobs.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j)))
    toast.success(
      `Job ${action === 'accept' ? 'accepted' : action === 'start' ? 'started' : 'completed'}!`,
    )
    if (selectedJob?.id === job.id) {
      setSelectedJob({ ...job, status: newStatus })
    }
  }

  const getActionButton = (job: Job) => {
    switch (job.status) {
      case 'new':
        return (
          <Button size="sm" onClick={() => handleJobAction(job, 'accept')} className="bg-purple-500 hover:bg-purple-400">
            Accept Job
          </Button>
        )
      case 'accepted':
        return (
          <Button size="sm" onClick={() => handleJobAction(job, 'start')} className="bg-blue-500 hover:bg-blue-400">
            <Play className="w-3 h-3 mr-1" /> Start Job
          </Button>
        )
      case 'in-progress':
        return (
          <Button size="sm" onClick={() => handleJobAction(job, 'complete')} className="bg-green-500 hover:bg-green-400">
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

  const toggleOnline = () => {
    setIsOnline((prev) => {
      toast.success(prev ? 'You are now offline' : 'You are now online')
      return !prev
    })
  }

  return {
    providerStatus,
    setProviderStatus,
    activeTab,
    setActiveTab,
    isOnline,
    toggleOnline,
    selectedJob,
    setSelectedJob,
    jobs,
    stats,
    filteredJobs,
    getStatusConfig,
    handleJobAction,
    getActionButton,
  }
}
