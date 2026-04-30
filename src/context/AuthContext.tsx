import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '../lib/firebase';
import {
  logout as firebaseLogout,
  fetchBackendProfile,
  type BackendProfile,
} from '../services/auth.service';

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = 'guest' | 'BUYER' | 'PROVIDER' | 'ADMIN';

export type AuthUser = BackendProfile;

export interface AuthContextType {
  /** Merged Firebase + backend user. null while loading or unauthenticated. */
  user: AuthUser | null;
  /** Firebase raw user — use for getIdToken(), uid, etc. */
  firebaseUser: FirebaseUser | null;
  role: UserRole;
  /** true once the initial Firebase session check has resolved */
  isLoading: boolean;
  isAuthenticated: boolean;
  /**
   * Called by AuthPage after a successful Firebase login/register
   * so we can immediately fetch the backend profile without waiting
   * for the onAuthStateChanged delay.
   */
  refreshProfile: () => Promise<void>;
  setRole: (role: UserRole) => void;
  logout: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  role: 'guest',
  isLoading: true,
  isAuthenticated: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  refreshProfile: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setRole: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  logout: async () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<UserRole>('guest');
  // Starts true — we don't know if there's a session until Firebase resolves
  const [isLoading, setIsLoading] = useState(true);

  // ── Backend profile fetch ─────────────────────────────────────────────────
  const loadBackendProfile = useCallback(async () => {
    try {
      const profile = await fetchBackendProfile();
      console.log('profile ====>', profile);
      setUser(profile);
      setRole(profile.role as UserRole);
    } catch {
      // Backend unreachable or profile not created yet.
      // Keep firebaseUser set so the session still exists; user is null.
      setUser(null);
    }
  }, []);

  // ── Firebase session listener ─────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        await loadBackendProfile();
      } else {
        setUser(null);
        setRole('guest');
      }

      setIsLoading(false);
    });

    return unsubscribe;
  }, [loadBackendProfile]);

  // ── Exposed helpers ───────────────────────────────────────────────────────

  const refreshProfile = useCallback(async () => {
    if (!auth.currentUser) return;
    await loadBackendProfile();
  }, [loadBackendProfile]);

  const handleLogout = useCallback(async () => {
    await firebaseLogout();
    // onAuthStateChanged will fire and clear state automatically
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        role,
        isLoading,
        isAuthenticated: !!user,
        refreshProfile,
        setRole,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
