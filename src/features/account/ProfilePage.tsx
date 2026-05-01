import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'
import { Button } from '../../components/ui/Button'
import { GlassCard } from '../../components/ui/GlassCard'
import { User, Shield } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { updateProfile, sendPasswordReset } from '../../services/auth.service'
import { getCountries } from '../../services/reference.service'
import type { CountryDto } from '../../types/reference.types'

export function ProfilePage() {
  const { user, refreshProfile } = useAuth()

  const [username, setUsername] = useState(user?.username ?? '')
  const [countryId, setCountryId] = useState<number | ''>(user?.countryId ?? '')
  const [countries, setCountries] = useState<CountryDto[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isSendingReset, setIsSendingReset] = useState(false)

  useEffect(() => {
    getCountries().then(setCountries).catch(() => toast.error('Failed to load countries'))
  }, [])

  // Sync form when user loads (may be null on first render)
  useEffect(() => {
    if (user) {
      setUsername(user.username)
      setCountryId(user.countryId ?? '')
    }
  }, [user])

  const handleSave = async () => {
    if (!username.trim() && countryId === '') return
    setIsSaving(true)
    try {
      const payload: { username?: string; countryId?: number } = {}
      if (username.trim() !== user?.username) payload.username = username.trim()
      if (countryId !== '' && countryId !== user?.countryId) payload.countryId = countryId as number
      if (Object.keys(payload).length === 0) {
        toast.info('No changes to save')
        return
      }
      await updateProfile(payload)
      await refreshProfile()
      toast.success('Profile updated')
    } catch {
      toast.error('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!user?.email) return
    setIsSendingReset(true)
    try {
      await sendPasswordReset(user.email)
      toast.success('Password reset email sent')
    } catch {
      toast.error('Failed to send reset email')
    } finally {
      setIsSendingReset(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>

          <div className="space-y-6">
            {/* Profile Info */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Profile Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Email Address</label>
                  <input
                    type="email"
                    value={user?.email ?? ''}
                    disabled
                    className="w-full bg-slate-800/50 border border-white/5 rounded-lg px-4 py-2 text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Country</label>
                  <select
                    value={countryId}
                    onChange={(e) => setCountryId(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select a country</option>
                    {countries.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Saving…' : 'Save Changes'}
                </Button>
              </div>
            </GlassCard>

            {/* Security */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Security</h2>
              </div>

              <div className="flex items-center justify-between py-4">
                <div>
                  <h3 className="font-medium text-white">Password</h3>
                  <p className="text-sm text-slate-400">
                    We'll send a reset link to {user?.email}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePasswordReset}
                  disabled={isSendingReset}
                >
                  {isSendingReset ? 'Sending…' : 'Change Password'}
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
