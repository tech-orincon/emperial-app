import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, Store, Package, Briefcase, ClipboardList, DollarSign } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import type { UserRole } from '../../types/auth.types'
import { GuestNav } from './nav/GuestNav'
import { CustomerNav } from './nav/CustomerNav'
import { ProviderNav } from './nav/ProviderNav'
import { MobileMenuContent } from './nav/MobileMenuContent'

function getNavLinks(role: UserRole) {
  switch (role) {
    case 'guest':
      return [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Services', href: '/catalog', icon: Store },
        { name: 'Track Order', href: '/account/orders', icon: ClipboardList },
      ]
    case 'customer':
      return [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Services', href: '/catalog', icon: Store },
        { name: 'My Orders', href: '/account/orders', icon: Package },
      ]
    case 'provider':
      return [
        { name: 'Dashboard', href: '/provider/dashboard', icon: Briefcase },
        { name: 'Jobs', href: '/provider/dashboard', icon: ClipboardList },
        { name: 'Earnings', href: '/provider/dashboard', icon: DollarSign },
      ]
  }
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [role, setRole] = useState<UserRole>('customer')
  const location = useLocation()
  const navigate = useNavigate()
  const cartCount = 2

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = () => { if (isUserMenuOpen) setIsUserMenuOpen(false) }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isUserMenuOpen])

  const navLinks = getNavLinks(role)

  const handleLogout = () => { setRole('guest'); setIsUserMenuOpen(false); navigate('/') }
  const handleLogin = (asRole: 'customer' | 'provider') => {
    setRole(asRole)
    setIsOpen(false)
    if (asRole === 'provider') navigate('/provider/dashboard')
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/95 backdrop-blur-lg border-b border-white/10 shadow-lg shadow-black/20' : 'bg-slate-900/80 backdrop-blur-md border-b border-white/5'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg transition-all ${role === 'provider' ? 'bg-gradient-to-br from-purple-500 to-pink-600 shadow-purple-500/20 group-hover:shadow-purple-500/40' : 'bg-gradient-to-br from-emperial-500 to-purple-600 shadow-emperial-500/20 group-hover:shadow-emperial-500/40'}`}>
              E
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Emperial<span className={role === 'provider' ? 'text-purple-400' : 'text-emperial-400'}>Boosting</span>
            </span>
            {role === 'provider' && (
              <span className="hidden sm:inline-flex ml-2 px-2 py-0.5 rounded text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/20">
                PROVIDER
              </span>
            )}
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-medium transition-colors relative ${location.pathname === link.href ? 'text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {link.name}
                {location.pathname === link.href && (
                  <motion.div
                    layoutId="navIndicator"
                    className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${role === 'provider' ? 'bg-purple-500' : 'bg-emperial-500'}`}
                  />
                )}
              </Link>
            ))}
          </div>

          {role === 'guest' && <GuestNav />}
          {role === 'customer' && (
            <CustomerNav
              cartCount={cartCount}
              isUserMenuOpen={isUserMenuOpen}
              setIsUserMenuOpen={setIsUserMenuOpen}
              handleLogout={handleLogout}
              handleLogin={handleLogin}
            />
          )}
          {role === 'provider' && (
            <ProviderNav
              isOnline={isOnline}
              setIsOnline={setIsOnline}
              isUserMenuOpen={isUserMenuOpen}
              setIsUserMenuOpen={setIsUserMenuOpen}
              handleLogout={handleLogout}
              handleLogin={handleLogin}
            />
          )}

          <button className="md:hidden p-2 text-slate-400 hover:text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-b border-white/5 overflow-hidden"
          >
            <MobileMenuContent
              role={role}
              setRole={setRole}
              navLinks={navLinks}
              cartCount={cartCount}
              isOnline={isOnline}
              setIsOnline={setIsOnline}
              handleLogout={handleLogout}
              onClose={() => setIsOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
