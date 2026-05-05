import { Link, useLocation } from 'react-router-dom'
import { LogIn, UserPlus, ShoppingCart, User, LogOut, LayoutDashboard, Package, Settings } from 'lucide-react'
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
  navLinks: NavLink[]
  cartCount: number
  handleLogout: () => void
  onClose: () => void
}

export function MobileMenuContent({ role, navLinks, cartCount, handleLogout, onClose }: Props) {
  const location = useLocation()

  return (
    <div className="px-4 py-4 space-y-4">
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

      {/* Role-specific actions */}
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

        {(role === 'BUYER' || role === 'ADMIN') && (
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

        {role === 'PROVIDER' && (
          <>
            <Link to="/checkout" onClick={onClose}>
              <Button className="w-full justify-start">
                <ShoppingCart className="w-4 h-4 mr-2" /> Cart ({cartCount})
              </Button>
            </Link>
            <Link to="/account/profile" onClick={onClose}>
              <Button variant="secondary" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" /> Profile Settings
              </Button>
            </Link>
            <Link to="/account/orders" onClick={onClose}>
              <Button variant="secondary" className="w-full justify-start">
                <Package className="w-4 h-4 mr-2" /> My Orders
              </Button>
            </Link>
            <Link to="/provider/dashboard" onClick={onClose}>
              <Button variant="secondary" className="w-full justify-start text-purple-400 border-purple-500/20">
                <LayoutDashboard className="w-4 h-4 mr-2" /> Provider Dashboard
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start text-red-400" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
