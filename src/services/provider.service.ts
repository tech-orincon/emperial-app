// ─── Provider Service ─────────────────────────────────────────────────────────
//
// Backend integration points for booster/provider operations.
// Replace mock implementations with real API calls.

import type { ProviderJob, ProviderStats } from '../types/provider.types';

// TODO: Replace with real API call → GET /provider/jobs
export async function getAvailableJobs(): Promise<ProviderJob[]> {
  throw new Error('provider.service.getAvailableJobs: not implemented');
}

// TODO: Replace with real API call → POST /provider/jobs/:id/accept
export async function acceptJob(_jobId: string): Promise<void> {
  throw new Error('provider.service.acceptJob: not implemented');
}

// TODO: Replace with real API call → POST /provider/jobs/:id/reject
export async function rejectJob(_jobId: string): Promise<void> {
  throw new Error('provider.service.rejectJob: not implemented');
}

// TODO: Replace with real API call → POST /provider/jobs/:id/complete
export async function completeJob(_jobId: string): Promise<void> {
  throw new Error('provider.service.completeJob: not implemented');
}

// TODO: Replace with real API call → GET /provider/stats
export async function getProviderStats(): Promise<ProviderStats> {
  throw new Error('provider.service.getProviderStats: not implemented');
}

// TODO: Replace with real API call → PATCH /provider/availability
export async function setAvailability(_isOnline: boolean): Promise<void> {
  throw new Error('provider.service.setAvailability: not implemented');
}
