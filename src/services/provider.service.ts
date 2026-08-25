import { apiClient } from './api/client'
import type {
  ProviderJobsResponseDto,
  JobActionResponseDto,
  ProviderStatsResponseDto,
  ProviderProfileResponseDto,
  UpdateAvailabilityResponseDto,
} from '../types/provider.types'

export async function getProviderJobs(page = 1, limit = 20): Promise<ProviderJobsResponseDto> {
  const { data } = await apiClient.get<ProviderJobsResponseDto>('/provider/jobs', {
    params: { page, limit },
  })
  return data
}

export async function acceptJob(id: number): Promise<JobActionResponseDto> {
  const { data } = await apiClient.post<JobActionResponseDto>(`/provider/jobs/${id}/accept`)
  return data
}

export async function rejectJob(id: number): Promise<JobActionResponseDto> {
  const { data } = await apiClient.post<JobActionResponseDto>(`/provider/jobs/${id}/reject`)
  return data
}

export async function startJob(id: number): Promise<JobActionResponseDto> {
  const { data } = await apiClient.post<JobActionResponseDto>(`/provider/jobs/${id}/start`)
  return data
}

export async function completeJob(id: number): Promise<JobActionResponseDto> {
  const { data } = await apiClient.post<JobActionResponseDto>(`/provider/jobs/${id}/complete`)
  return data
}

export async function getProviderStats(): Promise<ProviderStatsResponseDto> {
  const { data } = await apiClient.get<ProviderStatsResponseDto>('/provider/stats')
  return data
}

export async function getProviderProfile(): Promise<ProviderProfileResponseDto> {
  const { data } = await apiClient.get<ProviderProfileResponseDto>('/provider/profile')
  return data
}

export async function setAvailability(isOnline: boolean): Promise<UpdateAvailabilityResponseDto> {
  const { data } = await apiClient.patch<UpdateAvailabilityResponseDto>('/provider/availability', {
    isOnline,
  })
  return data
}
