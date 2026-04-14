import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Gamepad2,
  MessageCircle,
  ShoppingBag,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Mail,
  Lock,
  User,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { GlassCard } from '../../components/ui/GlassCard'
import { Toaster, toast } from 'sonner'
import { FirebaseError } from 'firebase/app'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import {
  loginWithEmail,
  registerWithEmail,
  registerUser,
  startOnboarding,
  updateGamingProfile,
  saveSkills,
  saveAvailability,
  type ScheduleEnum,
} from '../../services/auth.service'
import { getFirebaseErrorMessage } from '../../lib/firebaseErrors'
import { useAuth } from '../../context/AuthContext'

type ViewState = 'auth' | 'role-selection' | 'provider-onboarding'

// ─── Backend mapping tables ───────────────────────────────────────────────────
// These map form label values to API-expected IDs / enums.
// Update numeric IDs once the backend provides a reference endpoint.

const COUNTRY_IDS: Record<string, number> = {
  'United States': 1,
  'United Kingdom': 2,
  Germany: 3,
  France: 4,
  Canada: 5,
}

const GAME_IDS: Record<string, number> = {
  'World of Warcraft': 1,
  'Destiny 2': 2,
  'Final Fantasy XIV': 3,
  'League of Legends': 4,
}

const EXPERIENCE_YEARS: Record<string, number> = {
  'Less than 1 year': 0,
  '1-2 years': 1,
  '3-5 years': 3,
  '5+ years': 5,
}

const WEEKLY_HOURS: Record<string, number> = {
  '10-20 hours': 15,
  '20-30 hours': 25,
  '30-40 hours': 35,
  '40+ hours': 45,
}

const SCHEDULE_ENUM: Record<string, ScheduleEnum> = {
  'Weekday mornings': 'WEEKDAY_MORNING',
  'Weekday evenings': 'WEEKDAY_EVENING',
  Weekends: 'WEEKEND',
  Flexible: 'FLEXIBLE',
}

export function AuthPage() {
  const navigate = useNavigate()
  const { refreshProfile } = useAuth()

  const [view, setView] = useState<ViewState>('auth')
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [onboardingStep, setOnboardingStep] = useState(1)

  // Provider status
  const [providerStatus, setProviderStatus] = useState<
    'none' | 'pending' | 'approved' | 'rejected'
  >('none')

  // ── Auth form fields ──────────────────────────────────────────────────────
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // ── Provider onboarding form ──────────────────────────────────────────────
  const [formData, setFormData] = useState({
    displayName: '',
    realName: '',
    country: 'United States',
    timezone: 'PST (UTC-8)',
    bio: '',
    primaryGame: 'World of Warcraft',
    battlenetId: '',
    server: 'US - Illidan',
    characterName: '',
    characterClass: 'Warrior',
    itemLevel: '',
    experience: 'Less than 1 year',
    services: [] as string[],
    highestAchievement: '',
    raiderioLink: '',
    weeklyHours: '10-20 hours',
    schedule: [] as string[],
    hourlyRate: '',
    paymentMethod: 'PayPal',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSavingStep, setIsSavingStep] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // ── Auth submit ───────────────────────────────────────────────────────────
  const handleAuthSubmit = async (e: React.FormEvent) => {
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
        // Fetch backend profile (token is injected automatically by apiClient)
        await refreshProfile()
        navigate('/')
      } else {
        const fbUser = await registerWithEmail(email, password)
        // Create the backend user record (BUYER role by default)
        await registerUser({ email: fbUser.email ?? email, username })
        setView('role-selection')
      }
    } catch (err) {
      if (err instanceof FirebaseError) {
        setAuthError(getFirebaseErrorMessage(err.code))
      } else {
        setAuthError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // ── Forgot password ───────────────────────────────────────────────────────
  const handleForgotPassword = async () => {
    if (!email) {
      setAuthError('Enter your email address first, then click "Forgot password?"')
      return
    }
    try {
      await sendPasswordResetEmail(auth, email)
      toast.success('Password reset email sent! Check your inbox.')
    } catch (err) {
      if (err instanceof FirebaseError) {
        toast.error(getFirebaseErrorMessage(err.code))
      }
    }
  }

  // ── Social login (placeholder) ────────────────────────────────────────────
  const handleSocialLogin = () => {
    toast.info('Social login coming soon!')
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Views
  // ─────────────────────────────────────────────────────────────────────────

  const renderAuthView = () => (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emperial-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emperial-500/20 mx-auto mb-4">
          E
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Welcome to Emperial
        </h1>
        <p className="text-slate-400">
          {authMode === 'login'
            ? 'Log in to your account to continue'
            : 'Create an account to get started'}
        </p>
      </div>

      <GlassCard className="p-8">
        {/* Tabs */}
        <div className="flex relative mb-8 border-b border-white/10">
          <button
            onClick={() => { setAuthMode('login'); setAuthError(null) }}
            className={`flex-1 pb-4 text-sm font-medium transition-colors ${authMode === 'login' ? 'text-white' : 'text-slate-400 hover:text-slate-300'}`}
          >
            Login
          </button>
          <button
            onClick={() => { setAuthMode('signup'); setAuthError(null) }}
            className={`flex-1 pb-4 text-sm font-medium transition-colors ${authMode === 'signup' ? 'text-white' : 'text-slate-400 hover:text-slate-300'}`}
          >
            Sign Up
          </button>
          <motion.div
            className="absolute bottom-0 h-0.5 bg-emperial-500"
            initial={false}
            animate={{ left: authMode === 'login' ? '0%' : '50%', width: '50%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={authMode}
              initial={{ opacity: 0, x: authMode === 'login' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: authMode === 'login' ? 20 : -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Firebase error banner */}
              {authError && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{authError}</p>
                </div>
              )}

              {authMode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">
                    Username / Gamertag
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-800 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500"
                      placeholder="Champion123"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setAuthError(null) }}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setAuthError(null) }}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {authMode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setAuthError(null) }}
                      className="w-full bg-slate-800 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              {authMode === 'login' ? (
                <div className="flex items-center justify-between text-sm pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-slate-600 text-emperial-500 focus:ring-emperial-500 bg-slate-700"
                    />
                    <span className="text-slate-400">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-emperial-400 hover:text-emperial-300"
                  >
                    Forgot password?
                  </button>
                </div>
              ) : (
                <div className="pt-2">
                  <label className="flex items-start gap-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 rounded border-slate-600 text-emperial-500 focus:ring-emperial-500 bg-slate-700"
                    />
                    <span className="text-slate-400 leading-tight">
                      I agree to the{' '}
                      <a href="/terms" className="text-emperial-400 hover:underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="/privacy" className="text-emperial-400 hover:underline">
                        Privacy Policy
                      </a>
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
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900/40 text-slate-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button
              variant="secondary"
              onClick={handleSocialLogin}
              className="flex items-center justify-center gap-2 bg-[#5865F2]/10 text-[#5865F2] border-[#5865F2]/20 hover:bg-[#5865F2]/20"
            >
              <MessageCircle className="w-5 h-5" />
              Discord
            </Button>
            <Button
              variant="secondary"
              onClick={handleSocialLogin}
              className="flex items-center justify-center gap-2 bg-[#00aeff]/10 text-[#00aeff] border-[#00aeff]/20 hover:bg-[#00aeff]/20"
            >
              <Gamepad2 className="w-5 h-5" />
              Battle.net
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  )

  const renderRoleSelection = () => (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          How will you use Emperial Boosting?
        </h2>
        <p className="text-slate-400 text-lg">
          Choose your path. You can always switch later in your account settings.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard
          hoverEffect
          className="p-8 cursor-pointer border-2 border-transparent hover:border-emperial-500/50 group"
          onClick={() => navigate('/catalog')}
        >
          <div className="w-16 h-16 rounded-2xl bg-emperial-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-8 h-8 text-emperial-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Buy Services</h3>
          <p className="text-slate-400 mb-6">
            Browse and purchase premium gaming services from our verified experts.
          </p>
          <ul className="space-y-3 mb-8">
            {[
              'Browse extensive marketplace',
              'Track orders in real-time',
              '24/7 premium support',
              'Secure payments & guarantees',
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-emperial-500" />
                {feature}
              </li>
            ))}
          </ul>
          <Button className="w-full group-hover:bg-emperial-400">
            Continue as Customer
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </GlassCard>

        <GlassCard
          hoverEffect
          className="p-8 cursor-pointer border-2 border-transparent hover:border-purple-500/50 group"
          onClick={() => {
            if (providerStatus === 'pending') {
              toast.error('Your application is already under review.')
            } else if (providerStatus === 'approved') {
              navigate('/provider/dashboard')
            } else {
              setView('provider-onboarding')
            }
          }}
        >
          <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Briefcase className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Become a Booster
          </h3>
          <p className="text-slate-400 mb-6">
            Join our elite team of professional gamers and earn money doing what you love.
          </p>
          <ul className="space-y-3 mb-8">
            {[
              'Set your own schedule',
              'Competitive payouts & bonuses',
              'Access to premium jobs',
              'Dedicated provider support',
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-purple-500" />
                {feature}
              </li>
            ))}
          </ul>
          <Button className="w-full bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_-5px_rgba(147,51,234,0.5)] group-hover:shadow-[0_0_25px_-5px_rgba(147,51,234,0.7)]">
            Apply as Provider
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </GlassCard>
      </div>
    </div>
  )

  const renderProviderOnboarding = () => {
    const validateStep = (step: number) => {
      const newErrors: Record<string, string> = {}
      let isValid = true
      if (step === 1) {
        if (!formData.displayName || formData.displayName.length < 3) {
          newErrors.displayName = 'Display name must be at least 3 characters'
          isValid = false
        }
        if (!formData.country) {
          newErrors.country = 'Country is required'
          isValid = false
        }
        if (!formData.timezone) {
          newErrors.timezone = 'Timezone is required'
          isValid = false
        }
      } else if (step === 2) {
        if (!formData.battlenetId || !formData.battlenetId.includes('#')) {
          newErrors.battlenetId = 'Valid Battle.net ID required (e.g. Player#1234)'
          isValid = false
        }
        if (!formData.characterName) {
          newErrors.characterName = 'Character name is required'
          isValid = false
        }
        if (!formData.itemLevel || parseInt(formData.itemLevel) <= 0) {
          newErrors.itemLevel = 'Valid item level is required'
          isValid = false
        }
      } else if (step === 3) {
        if (formData.services.length === 0) {
          newErrors.services = 'Select at least one service'
          isValid = false
        }
      } else if (step === 4) {
        if (formData.schedule.length === 0) {
          newErrors.schedule = 'Select at least one schedule option'
          isValid = false
        }
        if (!formData.hourlyRate || parseInt(formData.hourlyRate) <= 0) {
          newErrors.hourlyRate = 'Valid hourly rate is required'
          isValid = false
        }
      }
      setErrors(newErrors)
      return isValid
    }

    const handleNextStep = async () => {
      if (!validateStep(onboardingStep)) return
      setIsSavingStep(true)
      setSaveError(null)
      try {
        if (onboardingStep === 1) {
          await startOnboarding({
            displayName: formData.displayName,
            realName: formData.realName || undefined,
            countryId: COUNTRY_IDS[formData.country] ?? 1,
            timezone: formData.timezone,
          })
        } else if (onboardingStep === 2) {
          await updateGamingProfile({
            gameId: GAME_IDS[formData.primaryGame] ?? 1,
            slug: formData.battlenetId,
            data: {
              battlenetId: formData.battlenetId,
              server: formData.server,
              characterName: formData.characterName,
              characterClass: formData.characterClass,
              itemLevel: parseInt(formData.itemLevel, 10),
            },
          })
        } else if (onboardingStep === 3) {
          await saveSkills({
            yearExperience: EXPERIENCE_YEARS[formData.experience] ?? 0,
            highestAchievement: formData.highestAchievement || undefined,
            providerGameSkill: formData.services,
          })
        } else if (onboardingStep === 4) {
          await saveAvailability({
            weeklyHours: WEEKLY_HOURS[formData.weeklyHours] ?? 15,
            schedules: formData.schedule
              .map((s) => SCHEDULE_ENUM[s])
              .filter(Boolean) as ScheduleEnum[],
            hourlyRate: parseInt(formData.hourlyRate, 10),
            paymentMethod: formData.paymentMethod,
          })
          setProviderStatus('pending')
        }
        toast.success('Progress saved')
        setOnboardingStep((s) => Math.min(5, s + 1))
      } catch {
        setSaveError("We couldn't save your progress. Please try again.")
        toast.error('Failed to save progress')
      } finally {
        setIsSavingStep(false)
      }
    }

    const prevStep = () => {
      setErrors({})
      setSaveError(null)
      setOnboardingStep((s) => Math.max(1, s - 1))
    }

    const handleInputChange = (field: string, value: unknown) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }))
      }
    }

    const toggleArrayItem = (field: 'services' | 'schedule', item: string) => {
      setFormData((prev) => {
        const array = prev[field]
        const newArray = array.includes(item)
          ? array.filter((i) => i !== item)
          : [...array, item]
        if (errors[field] && newArray.length > 0) {
          setErrors((e) => ({ ...e, [field]: '' }))
        }
        return { ...prev, [field]: newArray }
      })
    }

    const steps = [
      { id: 1, name: 'Basic Info' },
      { id: 2, name: 'Gaming' },
      { id: 3, name: 'Experience' },
      { id: 4, name: 'Availability' },
      { id: 5, name: 'Success' },
    ]

    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Provider Application
          </h2>

          {/* Progress Bar */}
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 rounded-full" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-purple-500 -translate-y-1/2 rounded-full transition-all duration-500"
              style={{ width: `${((onboardingStep - 1) / 4) * 100}%` }}
            />
            <div className="relative flex justify-between">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-500 ${onboardingStep >= step.id ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-slate-800 text-slate-500 border border-white/10'}`}
                  >
                    {onboardingStep > step.id ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:block ${onboardingStep >= step.id ? 'text-purple-400' : 'text-slate-500'}`}
                  >
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <GlassCard className="p-6 sm:p-8 overflow-hidden">
          {providerStatus === 'pending' && onboardingStep < 5 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Application Under Review
              </h3>
              <p className="text-slate-400 mb-6">
                Your provider application is currently being reviewed by our team.
              </p>
              <Button onClick={() => navigate('/')}>Return Home</Button>
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={onboardingStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {saveError && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-400 font-medium">{saveError}</p>
                    </div>
                  )}

                  {onboardingStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          Basic Information
                        </h3>
                        <p className="text-sm text-slate-400">
                          Tell us a bit about yourself.
                        </p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-400">
                            Display Name <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.displayName}
                            onChange={(e) => handleInputChange('displayName', e.target.value)}
                            className={`w-full bg-slate-800 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.displayName ? 'border-red-500/50' : 'border-white/10'}`}
                            placeholder="e.g. Shadowblade"
                          />
                          {errors.displayName && (
                            <p className="text-xs text-red-400">{errors.displayName}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-400">
                            Real Name (Optional)
                          </label>
                          <input
                            type="text"
                            value={formData.realName}
                            onChange={(e) => handleInputChange('realName', e.target.value)}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-400">
                            Country <span className="text-red-400">*</span>
                          </label>
                          <select
                            value={formData.country}
                            onChange={(e) => handleInputChange('country', e.target.value)}
                            className={`w-full bg-slate-800 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none ${errors.country ? 'border-red-500/50' : 'border-white/10'}`}
                          >
                            <option>United States</option>
                            <option>United Kingdom</option>
                            <option>Germany</option>
                            <option>France</option>
                            <option>Canada</option>
                          </select>
                          {errors.country && (
                            <p className="text-xs text-red-400">{errors.country}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-400">
                            Timezone <span className="text-red-400">*</span>
                          </label>
                          <select
                            value={formData.timezone}
                            onChange={(e) => handleInputChange('timezone', e.target.value)}
                            className={`w-full bg-slate-800 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none ${errors.timezone ? 'border-red-500/50' : 'border-white/10'}`}
                          >
                            <option>PST (UTC-8)</option>
                            <option>EST (UTC-5)</option>
                            <option>GMT (UTC+0)</option>
                            <option>CET (UTC+1)</option>
                          </select>
                          {errors.timezone && (
                            <p className="text-xs text-red-400">{errors.timezone}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">
                          Profile Bio
                        </label>
                        <textarea
                          rows={4}
                          value={formData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                          placeholder="Briefly describe your gaming background and what makes you a great booster..."
                        />
                      </div>
                    </div>
                  )}

                  {onboardingStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          Gaming Credentials
                        </h3>
                        <p className="text-sm text-slate-400">
                          Link your primary gaming accounts.
                        </p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-400">
                            Primary Game
                          </label>
                          <select
                            value={formData.primaryGame}
                            onChange={(e) => handleInputChange('primaryGame', e.target.value)}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                          >
                            <option>World of Warcraft</option>
                            <option>Destiny 2</option>
                            <option>Final Fantasy XIV</option>
                            <option>League of Legends</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-400">
                            Battle.net ID <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.battlenetId}
                            onChange={(e) => handleInputChange('battlenetId', e.target.value)}
                            className={`w-full bg-slate-800 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.battlenetId ? 'border-red-500/50' : 'border-white/10'}`}
                            placeholder="Player#1234"
                          />
                          {errors.battlenetId && (
                            <p className="text-xs text-red-400">{errors.battlenetId}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-400">
                            Server / Region
                          </label>
                          <select
                            value={formData.server}
                            onChange={(e) => handleInputChange('server', e.target.value)}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                          >
                            <option>US - Illidan</option>
                            <option>US - Area 52</option>
                            <option>EU - Tarren Mill</option>
                            <option>EU - Kazzak</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-400">
                            Main Character Name <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.characterName}
                            onChange={(e) => handleInputChange('characterName', e.target.value)}
                            className={`w-full bg-slate-800 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.characterName ? 'border-red-500/50' : 'border-white/10'}`}
                            placeholder="e.g. Thrall"
                          />
                          {errors.characterName && (
                            <p className="text-xs text-red-400">{errors.characterName}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-400">
                            Character Class
                          </label>
                          <select
                            value={formData.characterClass}
                            onChange={(e) => handleInputChange('characterClass', e.target.value)}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                          >
                            {['Warrior','Paladin','Hunter','Rogue','Priest','Death Knight','Shaman','Mage','Warlock','Monk','Druid','Demon Hunter','Evoker'].map((c) => (
                              <option key={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-400">
                            Current Item Level <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="number"
                            value={formData.itemLevel}
                            onChange={(e) => handleInputChange('itemLevel', e.target.value)}
                            className={`w-full bg-slate-800 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.itemLevel ? 'border-red-500/50' : 'border-white/10'}`}
                            placeholder="e.g. 489"
                          />
                          {errors.itemLevel && (
                            <p className="text-xs text-red-400">{errors.itemLevel}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {onboardingStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          Experience & Services
                        </h3>
                        <p className="text-sm text-slate-400">
                          What services can you provide?
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">
                          Years of Boosting Experience
                        </label>
                        <select
                          value={formData.experience}
                          onChange={(e) => handleInputChange('experience', e.target.value)}
                          className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                        >
                          <option>Less than 1 year</option>
                          <option>1-2 years</option>
                          <option>3-5 years</option>
                          <option>5+ years</option>
                        </select>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-400">
                          Services you can provide (Select all that apply){' '}
                          <span className="text-red-400">*</span>
                        </label>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {['Mythic+ Dungeons','Raid Carries','PvP Boosting','Leveling','Gold Farming','Achievements'].map((service) => (
                            <label
                              key={service}
                              className={`flex items-center gap-3 p-3 rounded-lg border bg-slate-800/50 cursor-pointer hover:bg-slate-800 transition-colors ${errors.services ? 'border-red-500/50' : 'border-white/10'}`}
                            >
                              <input
                                type="checkbox"
                                checked={formData.services.includes(service)}
                                onChange={() => toggleArrayItem('services', service)}
                                className="rounded border-slate-600 text-purple-500 focus:ring-purple-500 bg-slate-700"
                              />
                              <span className="text-sm text-slate-300">{service}</span>
                            </label>
                          ))}
                        </div>
                        {errors.services && (
                          <p className="text-xs text-red-400">{errors.services}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">
                          Highest Achievement
                        </label>
                        <input
                          type="text"
                          value={formData.highestAchievement}
                          onChange={(e) => handleInputChange('highestAchievement', e.target.value)}
                          className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="e.g. Cutting Edge: Fyrakk, Rank 1 Gladiator"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">
                          Link to Raider.io / Armory (Optional)
                        </label>
                        <input
                          type="url"
                          value={formData.raiderioLink}
                          onChange={(e) => handleInputChange('raiderioLink', e.target.value)}
                          className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="https://raider.io/characters/..."
                        />
                      </div>
                    </div>
                  )}

                  {onboardingStep === 4 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          Availability & Rates
                        </h3>
                        <p className="text-sm text-slate-400">
                          Set your schedule and payment preferences.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">
                          Weekly Availability (Hours)
                        </label>
                        <select
                          value={formData.weeklyHours}
                          onChange={(e) => handleInputChange('weeklyHours', e.target.value)}
                          className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                        >
                          <option>10-20 hours</option>
                          <option>20-30 hours</option>
                          <option>30-40 hours</option>
                          <option>40+ hours</option>
                        </select>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-400">
                          Preferred Schedule <span className="text-red-400">*</span>
                        </label>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {['Weekday mornings','Weekday evenings','Weekends','Flexible'].map((schedule) => (
                            <label
                              key={schedule}
                              className={`flex items-center gap-3 p-3 rounded-lg border bg-slate-800/50 cursor-pointer hover:bg-slate-800 transition-colors ${errors.schedule ? 'border-red-500/50' : 'border-white/10'}`}
                            >
                              <input
                                type="checkbox"
                                checked={formData.schedule.includes(schedule)}
                                onChange={() => toggleArrayItem('schedule', schedule)}
                                className="rounded border-slate-600 text-purple-500 focus:ring-purple-500 bg-slate-700"
                              />
                              <span className="text-sm text-slate-300">{schedule}</span>
                            </label>
                          ))}
                        </div>
                        {errors.schedule && (
                          <p className="text-xs text-red-400">{errors.schedule}</p>
                        )}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-400">
                            Expected Hourly Rate ($) <span className="text-red-400">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                            <input
                              type="number"
                              value={formData.hourlyRate}
                              onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                              className={`w-full bg-slate-800 border rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.hourlyRate ? 'border-red-500/50' : 'border-white/10'}`}
                              placeholder="15"
                            />
                          </div>
                          {errors.hourlyRate && (
                            <p className="text-xs text-red-400">{errors.hourlyRate}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-400">
                            Payment Method
                          </label>
                          <select
                            value={formData.paymentMethod}
                            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                          >
                            <option>PayPal</option>
                            <option>Bank Transfer</option>
                            <option>Crypto (USDT/USDC)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {onboardingStep === 5 && (
                    <div className="py-8 text-center space-y-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 15, delay: 0.2 }}
                        className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto"
                      >
                        <CheckCircle2 className="w-12 h-12 text-green-400" />
                      </motion.div>

                      <div>
                        <h3 className="text-3xl font-bold text-white mb-2">
                          Application Submitted!
                        </h3>
                        <p className="text-slate-400 max-w-md mx-auto">
                          We are reviewing your profile. Welcome to the team!
                        </p>
                      </div>

                      <div className="bg-slate-800/50 rounded-xl p-6 max-w-md mx-auto border border-white/5 text-left">
                        <h4 className="font-medium text-white mb-4">What happens next?</h4>
                        <ul className="space-y-4">
                          {[
                            'Our team will review your application within 24-48 hours.',
                            "You'll receive an email with a link to join our Provider Discord server.",
                            'Complete a brief verification run to unlock premium jobs.',
                          ].map((text, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-xs font-bold text-purple-400">{i + 1}</span>
                              </div>
                              <p className="text-sm text-slate-300">{text}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                {onboardingStep > 1 && onboardingStep < 5 ? (
                  <Button variant="ghost" onClick={prevStep} disabled={isSavingStep}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {onboardingStep < 5 ? (
                  <Button
                    onClick={handleNextStep}
                    disabled={isSavingStep}
                    className="bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_-5px_rgba(147,51,234,0.5)]"
                  >
                    {isSavingStep ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        {onboardingStep === 4 ? 'Submit Application' : 'Next Step'}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate('/')}
                    className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_-5px_rgba(147,51,234,0.5)]"
                  >
                    Go to Home
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </>
          )}
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden pt-20">
      <Toaster theme="dark" position="top-center" />
      {/* Background Elements */}
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
            {view === 'auth' && renderAuthView()}
            {view === 'role-selection' && renderRoleSelection()}
            {view === 'provider-onboarding' && renderProviderOnboarding()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
