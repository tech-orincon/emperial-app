import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, ChevronDown, ToggleLeft, ToggleRight, Settings, User, LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../ui/Button'
import type { AuthUser } from '../../../context/AuthContext'

interface Props {
  user: AuthUser | null
  isOnline: boolean
  setIsOnline: (online: boolean) => void
  isUserMenuOpen: boolean
  setIsUserMenuOpen: (open: boolean) => void
  handleLogout: () => void
}

export function ProviderNav({ user, isOnline, setIsOnline, isUserMenuOpen, setIsUserMenuOpen, handleLogout }: Props) {
  const navigate = useNavigate()
  const initials = user?.username?.slice(0, 2).toUpperCase() ?? 'PR'

  return (
    <div className="hidden md:flex items-center gap-4">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-white/10">
        <button onClick={() => setIsOnline(!isOnline)} className="flex items-center gap-2">
          {isOnline ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-sm font-medium text-green-400">Online</span>
              <ToggleRight className="w-5 h-5 text-green-400" />
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              <span className="text-sm font-medium text-slate-400">Offline</span>
              <ToggleLeft className="w-5 h-5 text-slate-400" />
            </>
          )}
        </button>
      </div>

      <div className="relative">
        <Button
          variant="secondary"
          size="sm"
          className="flex items-center gap-2 bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20"
          onClick={(e) => { e.stopPropagation(); setIsUserMenuOpen(!isUserMenuOpen) }}
        >
          <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Briefcase className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <span className="text-purple-300">{user?.username ?? 'Provider'}</span>
          <ChevronDown className={`w-3 h-3 text-purple-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
        </Button>

        <AnimatePresence>
          {isUserMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-56 bg-slate-800 border border-purple-500/20 rounded-xl shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 border-b border-white/5 bg-purple-500/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{user?.username ?? '—'}</p>
                    <p className="text-xs text-purple-400">Provider</p>
                  </div>
                </div>
              </div>

              <div className="py-1">
                <Link
                  to="/provider/dashboard"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <Settings className="w-4 h-4" /> Provider Profile
                </Link>
              </div>

              <div className="border-t border-white/5 py-1">
                <button
                  onClick={() => { setIsUserMenuOpen(false); navigate('/') }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <User className="w-4 h-4" /> Browse as Customer
                </button>
              </div>

              <div className="border-t border-white/5 py-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
