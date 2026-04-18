import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, AlertCircle, MessageCircle, Gamepad2 } from 'lucide-react'
import { toast } from 'sonner'
import { FirebaseError } from 'firebase/app'
import { sendPasswordResetEmail } from 'firebase/auth'
import { Button } from '../../../components/ui/Button'
import { GlassCard } from '../../../components/ui/GlassCard'
import { auth } from '../../../lib/firebase'
import { loginWithEmail, registerWithEmail, registerUser } from '../../../services/auth.service'
import { getFirebaseErrorMessage } from '../../../lib/firebaseErrors'
import { useAuth } from '../../../context/AuthContext'

interface LoginViewProps {
  onRegisterSuccess: () => void
}

export function LoginView({ onRegisterSuccess }: LoginViewProps) {
  const navigate = useNavigate()
  const { refreshProfile } = useAuth()

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    if (authMode === 'signup' && password !== confirmPassword) {
      setAuthError('Passwords do not match.')
      return
    }
    setIsLoading(true)
    try {
      if (authMode === 'login') {
        await loginWithEmail(email, password)
        await refreshProfile()
        navigate('/')
      } else {
        const fbUser = await registerWithEmail(email, password)
        await registerUser({ email: fbUser.email ?? email, username })
        await refreshProfile()
        onRegisterSuccess()
      }
    } catch (err) {
      setAuthError(
        err instanceof FirebaseError
          ? getFirebaseErrorMessage(err.code)
          : 'An unexpected error occurred. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setAuthError('Enter your email address first, then click "Forgot password?"')
      return
    }
    try {
      await sendPasswordResetEmail(auth, email)
      toast.success('Password reset email sent! Check your inbox.')
    } catch (err) {
      if (err instanceof FirebaseError) toast.error(getFirebaseErrorMessage(err.code))
    }
  }

  const inputCls = 'w-full bg-slate-800 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500'

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emperial-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emperial-500/20 mx-auto mb-4">
          E
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Welcome to Emperial</h1>
        <p className="text-slate-400">
          {authMode === 'login' ? 'Log in to your account to continue' : 'Create an account to get started'}
        </p>
      </div>

      <GlassCard className="p-8">
        {/* Tabs */}
        <div className="flex relative mb-8 border-b border-white/10">
          {(['login', 'signup'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => { setAuthMode(mode); setAuthError(null) }}
              className={`flex-1 pb-4 text-sm font-medium transition-colors ${authMode === mode ? 'text-white' : 'text-slate-400 hover:text-slate-300'}`}
            >
              {mode === 'login' ? 'Login' : 'Sign Up'}
            </button>
          ))}
          <motion.div
            className="absolute bottom-0 h-0.5 bg-emperial-500"
            initial={false}
            animate={{ left: authMode === 'login' ? '0%' : '50%', width: '50%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={authMode}
              initial={{ opacity: 0, x: authMode === 'login' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: authMode === 'login' ? 20 : -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {authError && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{authError}</p>
                </div>
              )}

              {authMode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Username / Gamertag</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className={inputCls} placeholder="Champion123" />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input type="email" required value={email} onChange={(e) => { setEmail(e.target.value); setAuthError(null) }} className={inputCls} placeholder="you@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input type="password" required value={password} onChange={(e) => { setPassword(e.target.value); setAuthError(null) }} className={inputCls} placeholder="••••••••" />
                </div>
              </div>

              {authMode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input type="password" required value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setAuthError(null) }} className={inputCls} placeholder="••••••••" />
                  </div>
                </div>
              )}

              {authMode === 'login' ? (
                <div className="flex items-center justify-between text-sm pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-slate-600 text-emperial-500 focus:ring-emperial-500 bg-slate-700" />
                    <span className="text-slate-400">Remember me</span>
                  </label>
                  <button type="button" onClick={handleForgotPassword} className="text-emperial-400 hover:text-emperial-300">
                    Forgot password?
                  </button>
                </div>
              ) : (
                <div className="pt-2">
                  <label className="flex items-start gap-2 cursor-pointer text-sm">
                    <input type="checkbox" required className="mt-1 rounded border-slate-600 text-emperial-500 focus:ring-emperial-500 bg-slate-700" />
                    <span className="text-slate-400 leading-tight">
                      I agree to the{' '}
                      <a href="/terms" className="text-emperial-400 hover:underline">Terms of Service</a>
                      {' '}and{' '}
                      <a href="/privacy" className="text-emperial-400 hover:underline">Privacy Policy</a>
                    </span>
                  </label>
                </div>
              )}

              <Button className="w-full mt-6" size="lg" isLoading={isLoading}>
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </motion.div>
          </AnimatePresence>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900/40 text-slate-500">Or continue with</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button variant="secondary" onClick={() => toast.info('Social login coming soon!')} className="flex items-center justify-center gap-2 bg-[#5865F2]/10 text-[#5865F2] border-[#5865F2]/20 hover:bg-[#5865F2]/20">
              <MessageCircle className="w-5 h-5" /> Discord
            </Button>
            <Button variant="secondary" onClick={() => toast.info('Social login coming soon!')} className="flex items-center justify-center gap-2 bg-[#00aeff]/10 text-[#00aeff] border-[#00aeff]/20 hover:bg-[#00aeff]/20">
              <Gamepad2 className="w-5 h-5" /> Battle.net
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
