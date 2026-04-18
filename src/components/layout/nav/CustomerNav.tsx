import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, User, ChevronDown, Settings, Package, Briefcase, LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../ui/Button'
import type { AuthUser } from '../../../context/AuthContext'

interface Props {
  user: AuthUser | null
  cartCount: number
  isUserMenuOpen: boolean
  setIsUserMenuOpen: (open: boolean) => void
  handleLogout: () => void
}

export function CustomerNav({ user, cartCount, isUserMenuOpen, setIsUserMenuOpen, handleLogout }: Props) {
  const navigate = useNavigate()

  return (
    <div className="hidden md:flex items-center gap-4">
      <Link to="/checkout" className="relative p-2 text-slate-400 hover:text-white transition-colors">
        <ShoppingCart className="w-5 h-5" />
        {cartCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-emperial-500 text-white text-xs flex items-center justify-center font-bold"
          >
            {cartCount}
          </motion.span>
        )}
      </Link>

      <div className="relative">
        <Button
          variant="secondary"
          size="sm"
          className="flex items-center gap-2"
          onClick={(e) => { e.stopPropagation(); setIsUserMenuOpen(!isUserMenuOpen) }}
        >
          <div className="w-6 h-6 rounded-full bg-emperial-500/20 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-emperial-400" />
          </div>
          <span>{user?.username ?? 'Account'}</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
        </Button>

        <AnimatePresence>
          {isUserMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-56 bg-slate-800 border border-white/10 rounded-xl shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 border-b border-white/5 bg-slate-800/50">
                <p className="text-sm font-medium text-white">{user?.username ?? '—'}</p>
                <p className="text-xs text-slate-400">{user?.email ?? '—'}</p>
              </div>

              <div className="py-1">
                <Link
                  to="/account/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <Settings className="w-4 h-4" /> Profile Settings
                </Link>
                <Link
                  to="/account/orders"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <Package className="w-4 h-4" /> My Orders
                </Link>
              </div>

              <div className="border-t border-white/5 py-1">
                <button
                  onClick={() => { setIsUserMenuOpen(false); navigate('/auth') }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Briefcase className="w-4 h-4" /> Become a Provider
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
