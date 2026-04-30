import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'sonner'
import { useAuth } from '../../context/AuthContext'
import { LoginView } from './views/LoginView'
import { RoleSelectionView } from './views/RoleSelectionView'
import { ProviderOnboardingView } from './views/ProviderOnboardingView'

type View = 'auth' | 'role-selection' | 'provider-onboarding'

export function AuthPage() {
  const { isAuthenticated, role, isLoading } = useAuth()
  const navigate = useNavigate()
  const [view, setView] = useState<View>('auth')

  useEffect(() => {
    if (isLoading) return
    // Providers have no business here — send them to their dashboard
    if (isAuthenticated && role === 'PROVIDER') {
      navigate('/provider/dashboard', { replace: true })
      return
    }
    // Authenticated buyers skip login and go straight to role selection
    // (entry point for "Become a Provider" from the header)
    if (isAuthenticated && role === 'BUYER') {
      setView('role-selection')
    }
  }, [isAuthenticated, role, isLoading, navigate])

  if (isLoading) return null

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden pt-20">
      <Toaster theme="dark" position="top-center" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emperial-500/10 rounded-full blur-[120px] opacity-30" />
        {view === 'provider-onboarding' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[120px] opacity-30 transition-opacity duration-1000" />
        )}
      </div>

      <div className="relative z-10 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {view === 'auth' && (
              <LoginView onRegisterSuccess={() => setView('role-selection')} />
            )}
            {view === 'role-selection' && (
              <RoleSelectionView onSelectProvider={() => setView('provider-onboarding')} />
            )}
            {view === 'provider-onboarding' && (
              <ProviderOnboardingView />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
