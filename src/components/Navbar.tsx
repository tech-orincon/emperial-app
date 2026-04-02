import React, { useEffect, useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ShoppingCart,
  User,
  ChevronDown,
  LogIn,
  UserPlus,
  Package,
  Settings,
  LogOut,
  Briefcase,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  Home,
  Store,
  ClipboardList } from
'lucide-react';
import { Button } from './ui/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// Auth Context for role management
type UserRole = 'guest' | 'customer' | 'provider';
interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  cartCount: number;
}
const AuthContext = createContext<AuthContextType>({
  role: 'guest',
  setRole: () => {},
  cartCount: 0
});
export const useAuth = () => useContext(AuthContext);
// Export provider for App.tsx usage
export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [role, setRole] = useState<UserRole>('customer'); // Default to customer for demo
  const [cartCount] = useState(2);
  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        cartCount
      }}>
      
      {children}
    </AuthContext.Provider>);

}
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  // Mock auth state - in production this would come from context/store
  const [role, setRole] = useState<UserRole>('customer');
  const cartCount = 2;
  // Handle scroll for sticky effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isUserMenuOpen]);
  // Navigation links based on role
  const getNavLinks = () => {
    switch (role) {
      case 'guest':
        return [
        {
          name: 'Home',
          href: '/',
          icon: Home
        },
        {
          name: 'Services',
          href: '/catalog',
          icon: Store
        },
        {
          name: 'Track Order',
          href: '/account/orders',
          icon: ClipboardList
        }];

      case 'customer':
        return [
        {
          name: 'Home',
          href: '/',
          icon: Home
        },
        {
          name: 'Services',
          href: '/catalog',
          icon: Store
        },
        {
          name: 'My Orders',
          href: '/account/orders',
          icon: Package
        }];

      case 'provider':
        return [
        {
          name: 'Dashboard',
          href: '/provider/dashboard',
          icon: Briefcase
        },
        {
          name: 'Jobs',
          href: '/provider/dashboard',
          icon: ClipboardList
        },
        {
          name: 'Earnings',
          href: '/provider/dashboard',
          icon: DollarSign
        }];

    }
  };
  const navLinks = getNavLinks();
  const handleLogout = () => {
    setRole('guest');
    setIsUserMenuOpen(false);
    navigate('/');
  };
  const handleLogin = (asRole: 'customer' | 'provider') => {
    setRole(asRole);
    setIsOpen(false);
    if (asRole === 'provider') {
      navigate('/provider/dashboard');
    }
  };
  // Guest Navigation
  const GuestNav = () =>
  <>
      <div className="hidden md:flex items-center gap-4">
        {/* Cart - Disabled for guests */}
        <div className="relative group">
          <button className="p-2 text-slate-500 cursor-not-allowed" disabled>
            <ShoppingCart className="w-5 h-5" />
          </button>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-xs text-slate-400 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Login to checkout
          </div>
        </div>

        <Link to="/auth">
          <Button variant="ghost" size="sm" className="text-slate-400">
            Provider Portal
          </Button>
        </Link>

        <Link to="/auth">
          <Button
          variant="secondary"
          size="sm"
          className="flex items-center gap-2">
          
            <LogIn className="w-4 h-4" />
            Login
          </Button>
        </Link>

        <Link to="/auth">
          <Button size="sm" className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Sign Up
          </Button>
        </Link>
      </div>
    </>;

  // Customer Navigation
  const CustomerNav = () =>
  <>
      <div className="hidden md:flex items-center gap-4">
        {/* Cart with badge */}
        <Link
        to="/checkout"
        className="relative p-2 text-slate-400 hover:text-white transition-colors">
        
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 &&
        <motion.span
          initial={{
            scale: 0
          }}
          animate={{
            scale: 1
          }}
          className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-emperial-500 text-white text-xs flex items-center justify-center font-bold">
          
              {cartCount}
            </motion.span>
        }
        </Link>

        {/* Account Dropdown */}
        <div className="relative">
          <Button
          variant="secondary"
          size="sm"
          className="flex items-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            setIsUserMenuOpen(!isUserMenuOpen);
          }}>
          
            <div className="w-6 h-6 rounded-full bg-emperial-500/20 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-emperial-400" />
            </div>
            <span>Account</span>
            <ChevronDown
            className={`w-3 h-3 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
          
          </Button>

          <AnimatePresence>
            {isUserMenuOpen &&
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
              scale: 0.95
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }}
            exit={{
              opacity: 0,
              y: 10,
              scale: 0.95
            }}
            transition={{
              duration: 0.15
            }}
            className="absolute right-0 mt-2 w-56 bg-slate-800 border border-white/10 rounded-xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-white/5 bg-slate-800/50">
                  <p className="text-sm font-medium text-white">Champion123</p>
                  <p className="text-xs text-slate-400">champion@example.com</p>
                </div>

                <div className="py-1">
                  <Link
                to="/account/profile"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                onClick={() => setIsUserMenuOpen(false)}>
                
                    <Settings className="w-4 h-4" />
                    Profile Settings
                  </Link>
                  <Link
                to="/account/orders"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                onClick={() => setIsUserMenuOpen(false)}>
                
                    <Package className="w-4 h-4" />
                    My Orders
                  </Link>
                </div>

                <div className="border-t border-white/5 py-1">
                  <button
                onClick={() => handleLogin('provider')}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
                
                    <Briefcase className="w-4 h-4" />
                    Switch to Provider
                  </button>
                </div>

                <div className="border-t border-white/5 py-1">
                  <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
          }
          </AnimatePresence>
        </div>
      </div>
    </>;

  // Provider Navigation
  const ProviderNav = () =>
  <>
      <div className="hidden md:flex items-center gap-4">
        {/* Availability Toggle */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-white/10">
          <button
          onClick={() => setIsOnline(!isOnline)}
          className="flex items-center gap-2">
          
            {isOnline ?
          <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-green-400">
                  Online
                </span>
                <ToggleRight className="w-5 h-5 text-green-400" />
              </> :

          <>
                <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                <span className="text-sm font-medium text-slate-400">
                  Offline
                </span>
                <ToggleLeft className="w-5 h-5 text-slate-400" />
              </>
          }
          </button>
        </div>

        {/* Provider Dropdown */}
        <div className="relative">
          <Button
          variant="secondary"
          size="sm"
          className="flex items-center gap-2 bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20"
          onClick={(e) => {
            e.stopPropagation();
            setIsUserMenuOpen(!isUserMenuOpen);
          }}>
          
            <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <span className="text-purple-300">Provider</span>
            <ChevronDown
            className={`w-3 h-3 text-purple-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
          
          </Button>

          <AnimatePresence>
            {isUserMenuOpen &&
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
              scale: 0.95
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }}
            exit={{
              opacity: 0,
              y: 10,
              scale: 0.95
            }}
            transition={{
              duration: 0.15
            }}
            className="absolute right-0 mt-2 w-56 bg-slate-800 border border-purple-500/20 rounded-xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            
                {/* Provider Info Header */}
                <div className="px-4 py-3 border-b border-white/5 bg-purple-500/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                      SB
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        Shadowblade
                      </p>
                      <p className="text-xs text-purple-400">
                        Top 500 Provider
                      </p>
                    </div>
                  </div>
                </div>

                <div className="py-1">
                  <Link
                to="/provider/dashboard"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                onClick={() => setIsUserMenuOpen(false)}>
                
                    <Settings className="w-4 h-4" />
                    Provider Profile
                  </Link>
                  <div className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-sm text-slate-400">This Week</span>
                    <span className="text-sm font-bold text-green-400">
                      $1,240
                    </span>
                  </div>
                </div>

                <div className="border-t border-white/5 py-1">
                  <button
                onClick={() => handleLogin('customer')}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
                
                    <User className="w-4 h-4" />
                    Switch to Customer
                  </button>
                </div>

                <div className="border-t border-white/5 py-1">
                  <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
          }
          </AnimatePresence>
        </div>
      </div>
    </>;

  // Mobile Menu Content
  const MobileMenuContent = () =>
  <div className="px-4 py-4 space-y-4">
      {/* Role Switcher for Demo */}
      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50 border border-white/5">
        <span className="text-xs text-slate-500 mr-2">Demo:</span>
        {(['guest', 'customer', 'provider'] as UserRole[]).map((r) =>
      <button
        key={r}
        onClick={() => setRole(r)}
        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${role === r ? 'bg-emperial-500 text-white' : 'text-slate-400 hover:text-white'}`}>
        
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
      )}
      </div>

      {/* Nav Links */}
      {navLinks.map((link) =>
    <Link
      key={link.name}
      to={link.href}
      className={`flex items-center gap-3 text-base font-medium transition-colors ${location.pathname === link.href ? 'text-white' : 'text-slate-400 hover:text-white'}`}
      onClick={() => setIsOpen(false)}>
      
          <link.icon className="w-5 h-5" />
          {link.name}
        </Link>
    )}

      {/* Role-specific mobile actions */}
      <div className="pt-4 border-t border-white/5 space-y-3">
        {role === 'guest' &&
      <>
            <Link
          to="/auth"
          onClick={() => setIsOpen(false)}
          className="block w-full">
          
              <Button variant="secondary" className="w-full justify-start">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            </Link>
            <Link
          to="/auth"
          onClick={() => setIsOpen(false)}
          className="block w-full mt-3">
          
              <Button className="w-full justify-start">
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up
              </Button>
            </Link>
          </>
      }

        {role === 'customer' &&
      <>
            <Link to="/checkout" onClick={() => setIsOpen(false)}>
              <Button className="w-full justify-start">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart ({cartCount})
              </Button>
            </Link>
            <Link to="/account/profile" onClick={() => setIsOpen(false)}>
              <Button variant="secondary" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Account
              </Button>
            </Link>
            <Button
          variant="ghost"
          className="w-full justify-start text-red-400"
          onClick={handleLogout}>
          
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </>
      }

        {role === 'provider' &&
      <>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
              <span className="text-sm text-slate-400">Availability</span>
              <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-2 px-3 py-1 rounded-full ${isOnline ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
            
                {isOnline ? 'Online' : 'Offline'}
              </button>
            </div>
            <Button
          variant="ghost"
          className="w-full justify-start text-red-400"
          onClick={handleLogout}>
          
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </>
      }
      </div>
    </div>;

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/95 backdrop-blur-lg border-b border-white/10 shadow-lg shadow-black/20' : 'bg-slate-900/80 backdrop-blur-md border-b border-white/5'}`}
      initial={{
        y: -100
      }}
      animate={{
        y: 0
      }}
      transition={{
        duration: 0.3
      }}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg transition-all ${role === 'provider' ? 'bg-gradient-to-br from-purple-500 to-pink-600 shadow-purple-500/20 group-hover:shadow-purple-500/40' : 'bg-gradient-to-br from-emperial-500 to-purple-600 shadow-emperial-500/20 group-hover:shadow-emperial-500/40'}`}>
              
              E
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Emperial
              <span
                className={
                role === 'provider' ? 'text-purple-400' : 'text-emperial-400'
                }>
                
                Boosting
              </span>
            </span>
            {role === 'provider' &&
            <span className="hidden sm:inline-flex ml-2 px-2 py-0.5 rounded text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/20">
                PROVIDER
              </span>
            }
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
            <Link
              key={link.name}
              to={link.href}
              className={`text-sm font-medium transition-colors relative ${location.pathname === link.href ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
              
                {link.name}
                {location.pathname === link.href &&
              <motion.div
                layoutId="navIndicator"
                className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${role === 'provider' ? 'bg-purple-500' : 'bg-emperial-500'}`} />

              }
              </Link>
            )}
          </div>

          {/* Role-specific actions */}
          {role === 'guest' && <GuestNav />}
          {role === 'customer' && <CustomerNav />}
          {role === 'provider' && <ProviderNav />}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}>
            
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen &&
        <motion.div
          initial={{
            opacity: 0,
            height: 0
          }}
          animate={{
            opacity: 1,
            height: 'auto'
          }}
          exit={{
            opacity: 0,
            height: 0
          }}
          className="md:hidden bg-slate-900 border-b border-white/5 overflow-hidden">
          
            <MobileMenuContent />
          </motion.div>
        }
      </AnimatePresence>
    </motion.nav>);

}