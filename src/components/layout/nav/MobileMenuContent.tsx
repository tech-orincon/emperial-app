import { Link, useLocation } from 'react-router-dom'
import { LogIn, UserPlus, ShoppingCart, User, LogOut } from 'lucide-react'
import { Button } from '../../ui/Button'
import type { UserRole } from '../../../types/auth.types'
import type React from 'react'

interface NavLink {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface Props {
  role: UserRole
  setRole: (role: UserRole) => void
  navLinks: NavLink[]
  cartCount: number
  isOnline: boolean
  setIsOnline: (online: boolean) => void
  handleLogout: () => void
  onClose: () => void
}

export function MobileMenuContent({ role, setRole, navLinks, cartCount, isOnline, setIsOnline, handleLogout, onClose }: Props) {
  const location = useLocation()

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Role Switcher for Demo */}
      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50 border border-white/5">
        <span className="text-xs text-slate-500 mr-2">Demo:</span>
        {(['guest', 'customer', 'provider'] as UserRole[]).map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${role === r ? 'bg-emperial-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>

      {/* Nav Links */}
      {navLinks.map((link) => (
        <Link
          key={link.name}
          to={link.href}
          className={`flex items-center gap-3 text-base font-medium transition-colors ${location.pathname === link.href ? 'text-white' : 'text-slate-400 hover:text-white'}`}
          onClick={onClose}
        >
          <link.icon className="w-5 h-5" />
          {link.name}
        </Link>
      ))}

      {/* Role-specific mobile actions */}
      <div className="pt-4 border-t border-white/5 space-y-3">
        {role === 'guest' && (
          <>
            <Link to="/auth" onClick={onClose} className="block w-full">
              <Button variant="secondary" className="w-full justify-start">
                <LogIn className="w-4 h-4 mr-2" /> Login
              </Button>
            </Link>
            <Link to="/auth" onClick={onClose} className="block w-full mt-3">
              <Button className="w-full justify-start">
                <UserPlus className="w-4 h-4 mr-2" /> Sign Up
              </Button>
            </Link>
          </>
        )}

        {role === 'customer' && (
          <>
            <Link to="/checkout" onClick={onClose}>
              <Button className="w-full justify-start">
                <ShoppingCart className="w-4 h-4 mr-2" /> Cart ({cartCount})
              </Button>
            </Link>
            <Link to="/account/profile" onClick={onClose}>
              <Button variant="secondary" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" /> Account
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start text-red-400" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </>
        )}

        {role === 'provider' && (
          <>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
              <span className="text-sm text-slate-400">Availability</span>
              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`flex items-center gap-2 px-3 py-1 rounded-full ${isOnline ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}
              >
                {isOnline ? 'Online' : 'Offline'}
              </button>
            </div>
            <Button variant="ghost" className="w-full justify-start text-red-400" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
