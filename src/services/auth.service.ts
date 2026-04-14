import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { apiClient } from './api/client';
import type { UserRole } from '../context/AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BackendProfile {
  id: string;
  username: string;
  email: string;
  role: UserRole;
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
 * Firebase automatically refreshes it when it's about to expire (every hour).
 * Pass forceRefresh=true to always get a new token regardless.
 */
export async function getIdToken(forceRefresh = false): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken(forceRefresh);
}

// ─── Backend Profile ──────────────────────────────────────────────────────────

/**
 * After Firebase auth succeeds, call the backend with the Firebase token
 * to retrieve or create the user's application profile (role, username, etc.).
 *
 * The token is automatically injected by the axios interceptor in api/client.ts.
 */
export async function fetchBackendProfile(): Promise<BackendProfile> {
  const { data } = await apiClient.get<BackendProfile>('/auth/me');
  return data;
}

/**
 * Called once after a new user registers.
 * Creates the user profile in the backend linked to their Firebase UID.
 */
export async function createBackendProfile(payload: {
  username: string;
  role: UserRole;
}): Promise<BackendProfile> {
  const { data } = await apiClient.post<BackendProfile>('/auth/profile', payload);
  return data;
}
