import { apiClient } from './api/client'
import type {
  ProviderJobsResponseDto,
  ProviderJobDetailResponseDto,
  AcceptJobResponseDto,
  RejectJobResponseDto,
  StartJobResponseDto,
  CompleteJobResponseDto,
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

export async function getProviderJobById(id: number): Promise<ProviderJobDetailResponseDto> {
  const { data } = await apiClient.get<ProviderJobDetailResponseDto>(`/provider/jobs/${id}`)
  return data
}

export async function acceptJob(id: number): Promise<AcceptJobResponseDto> {
  const { data } = await apiClient.post<AcceptJobResponseDto>(`/provider/jobs/${id}/accept`)
  return data
}

export async function rejectJob(id: number): Promise<RejectJobResponseDto> {
  const { data } = await apiClient.post<RejectJobResponseDto>(`/provider/jobs/${id}/reject`)
  return data
}

export async function startJob(id: number): Promise<StartJobResponseDto> {
  const { data } = await apiClient.post<StartJobResponseDto>(`/provider/jobs/${id}/start`)
  return data
}

export async function completeJob(id: number): Promise<CompleteJobResponseDto> {
  const { data } = await apiClient.post<CompleteJobResponseDto>(`/provider/jobs/${id}/complete`)
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
