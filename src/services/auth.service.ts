import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { apiClient } from './api/client';

// ─── Backend Role & Schedule Types ────────────────────────────────────────────

export type BackendRole = 'BUYER' | 'PROVIDER' | 'ADMIN';

export type ScheduleEnum =
  | 'WEEKDAY_MORNING'
  | 'WEEKDAY_EVENING'
  | 'WEEKEND'
  | 'FLEXIBLE';

// ─── Backend Profile DTO ──────────────────────────────────────────────────────

export interface BackendProfile {
  id: string;
  username: string;
  email: string;
  role: BackendRole;
  uid?: string;
  avatarUrl?: string;
}

// ─── Firebase Auth Operations ─────────────────────────────────────────────────

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<FirebaseUser> {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

export async function registerWithEmail(
  email: string,
  password: string,
): Promise<FirebaseUser> {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  return user;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

// ─── Token Helpers ────────────────────────────────────────────────────────────

/**
 * Returns a fresh Firebase ID token for the current user.
 * Pass forceRefresh=true to always get a new token regardless of expiry.
 */
export async function getIdToken(forceRefresh = false): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken(forceRefresh);
}

// ─── Backend Auth Endpoints ───────────────────────────────────────────────────

/**
 * GET /auth/login
 * Returns the backend user profile for the authenticated Firebase user.
 * The Authorization + uid headers are injected by the axios interceptor.
 */
export async function fetchBackendProfile(): Promise<BackendProfile> {
  const { data } = await apiClient.get<BackendProfile>('/auth/login');
  return data;
}

/**
 * POST /auth/user
 * Creates the backend user record after Firebase registration.
 * User is created with BUYER role by default.
 * The uid header is injected automatically by the axios interceptor.
 */
export async function registerUser(payload: {
  email: string;
  username: string;
}): Promise<BackendProfile> {
  const { data } = await apiClient.post<BackendProfile>('/auth/user', payload);
  return data;
}

// ─── Provider Onboarding ──────────────────────────────────────────────────────

/**
 * POST /auth/onboarding/start
 * Step 1: Basic provider information (display name, location, timezone).
 */
export async function startOnboarding(payload: {
  displayName: string;
  realName?: string;
  countryId: number;
  timezone: string;
}): Promise<void> {
  await apiClient.post('/auth/onboarding/start', payload);
}

export interface GamingProfileResponse {
  /** ID used as providerGameProfileId in the skills step */
  id: number;
  gameId: number;
  slug: string;
}

/**
 * PATCH /auth/onboarding/gaming-profile
 * Step 2: Link the provider's primary game account.
 * Returns the created profile — its id is required in the next step.
 */
export async function updateGamingProfile(payload: {
  gameId: number;
  data: Record<string, unknown>;
  slug: string;
}): Promise<GamingProfileResponse> {
  const { data } = await apiClient.patch<GamingProfileResponse>(
    '/auth/onboarding/gaming-profile',
    payload,
  );
  return data;
}

/**
 * POST /auth/onboarding/skills
 * Step 3: Experience and per-category skills.
 *
 * providerGameProfileId — id returned by updateGamingProfile (step 2)
 * gameCategoryId        — id from GET /catalog/games/{gameId}/categories
 */
export async function saveSkills(payload: {
  providerProfileExperience: {
    yearExperience: string;
    highestAchievement: string;
  };
  providerGameSkill: Array<{
    providerGameProfileId: number;
    gameCategoryId: number;
  }>;
}): Promise<void> {
  await apiClient.post('/auth/onboarding/skills', payload);
}

/**
 * PUT /auth/onboarding/availability
 * Step 4: Weekly hours, schedule preferences, rate, and payment method.
 */
export async function saveAvailability(payload: {
  weeklyHours: string;
  schedules: ScheduleEnum[];
  hourlyRate: number;
  paymentMethod: string;
}): Promise<void> {
  await apiClient.put('/auth/onboarding/availability', payload);
}
