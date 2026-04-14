// Maps Firebase Auth error codes to human-readable messages.
// Firebase codes: https://firebase.google.com/docs/auth/admin/errors

const errorMap: Record<string, string> = {
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/too-many-requests':
    'Too many failed attempts. Please wait a few minutes before trying again.',
  'auth/network-request-failed':
    'Network error. Please check your connection and try again.',
  'auth/popup-closed-by-user': 'Sign-in popup was closed before completing.',
  'auth/cancelled-popup-request': 'Only one sign-in popup is allowed at a time.',
  'auth/requires-recent-login':
    'This action requires you to sign in again. Please log out and log back in.',
};

export function getFirebaseErrorMessage(code: string): string {
  return errorMap[code] ?? 'An unexpected error occurred. Please try again.';
}
