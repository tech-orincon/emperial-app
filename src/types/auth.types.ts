export type UserRole = 'guest' | 'BUYER' | 'PROVIDER' | 'ADMIN';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Session {
  user: AuthUser;
  token: string;
  expiresAt: string;
}
