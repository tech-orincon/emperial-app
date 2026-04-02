import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2,
  MessageCircle,
  ShoppingBag,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Shield,
  Mail,
  Lock,
  User } from
'lucide-react';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
type ViewState = 'auth' | 'role-selection' | 'provider-onboarding';
export function AuthPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewState>('auth');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [onboardingStep, setOnboardingStep] = useState(1);
  // Mock form states
  const [isLoading, setIsLoading] = useState(false);
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (authMode === 'login') {
        navigate('/');
      } else {
        setView('role-selection');
      }
    }, 800);
  };
  const handleSocialLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 800);
  };
  const renderAuthView = () =>
  <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emperial-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emperial-500/20 mx-auto mb-4">
          E
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Welcome to Emperial
        </h1>
        <p className="text-slate-400">
          {authMode === 'login' ?
        'Log in to your account to continue' :
        'Create an account to get started'}
        </p>
      </div>

      <GlassCard className="p-8">
        {/* Tabs */}
        <div className="flex relative mb-8 border-b border-white/10">
          <button
          onClick={() => setAuthMode('login')}
          className={`flex-1 pb-4 text-sm font-medium transition-colors ${authMode === 'login' ? 'text-white' : 'text-slate-400 hover:text-slate-300'}`}>
          
            Login
          </button>
          <button
          onClick={() => setAuthMode('signup')}
          className={`flex-1 pb-4 text-sm font-medium transition-colors ${authMode === 'signup' ? 'text-white' : 'text-slate-400 hover:text-slate-300'}`}>
          
            Sign Up
          </button>
          <motion.div
          className="absolute bottom-0 h-0.5 bg-emperial-500"
          initial={false}
          animate={{
            left: authMode === 'login' ? '0%' : '50%',
            width: '50%'
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30
          }} />
        
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
            key={authMode}
            initial={{
              opacity: 0,
              x: authMode === 'login' ? -20 : 20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            exit={{
              opacity: 0,
              x: authMode === 'login' ? 20 : -20
            }}
            transition={{
              duration: 0.2
            }}
            className="space-y-4">
            
              {authMode === 'signup' &&
            <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">
                    Username / Gamertag
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                  type="text"
                  required
                  className="w-full bg-slate-800 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500"
                  placeholder="Champion123" />
                
                  </div>
                </div>
            }

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                  type="email"
                  required
                  className="w-full bg-slate-800 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500"
                  placeholder="you@example.com" />
                
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
                  className="w-full bg-slate-800 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500"
                  placeholder="••••••••" />
                
                </div>
              </div>

              {authMode === 'signup' &&
            <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                  type="password"
                  required
                  className="w-full bg-slate-800 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500"
                  placeholder="••••••••" />
                
                  </div>
                </div>
            }

              {authMode === 'login' ?
            <div className="flex items-center justify-between text-sm pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                  type="checkbox"
                  className="rounded border-slate-600 text-emperial-500 focus:ring-emperial-500 bg-slate-700" />
                
                    <span className="text-slate-400">Remember me</span>
                  </label>
                  <a
                href="#"
                className="text-emperial-400 hover:text-emperial-300">
                
                    Forgot password?
                  </a>
                </div> :

            <div className="pt-2">
                  <label className="flex items-start gap-2 cursor-pointer text-sm">
                    <input
                  type="checkbox"
                  required
                  className="mt-1 rounded border-slate-600 text-emperial-500 focus:ring-emperial-500 bg-slate-700" />
                
                    <span className="text-slate-400 leading-tight">
                      I agree to the{' '}
                      <a
                    href="/terms"
                    className="text-emperial-400 hover:underline">
                    
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a
                    href="/privacy"
                    className="text-emperial-400 hover:underline">
                    
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                </div>
            }

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
            className="flex items-center justify-center gap-2 bg-[#5865F2]/10 text-[#5865F2] border-[#5865F2]/20 hover:bg-[#5865F2]/20">
            
              <MessageCircle className="w-5 h-5" />
              Discord
            </Button>
            <Button
            variant="secondary"
            onClick={handleSocialLogin}
            className="flex items-center justify-center gap-2 bg-[#00aeff]/10 text-[#00aeff] border-[#00aeff]/20 hover:bg-[#00aeff]/20">
            
              <Gamepad2 className="w-5 h-5" />
              Battle.net
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>;

  const renderRoleSelection = () =>
  <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          How will you use Emperial Boosting?
        </h2>
        <p className="text-slate-400 text-lg">
          Choose your path. You can always switch later in your account
          settings.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard
        hoverEffect
        className="p-8 cursor-pointer border-2 border-transparent hover:border-emperial-500/50 group"
        onClick={() => navigate('/catalog')}>
        
          <div className="w-16 h-16 rounded-2xl bg-emperial-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-8 h-8 text-emperial-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Buy Services</h3>
          <p className="text-slate-400 mb-6">
            Browse and purchase premium gaming services from our verified
            experts.
          </p>
          <ul className="space-y-3 mb-8">
            {[
          'Browse extensive marketplace',
          'Track orders in real-time',
          '24/7 premium support',
          'Secure payments & guarantees'].
          map((feature, i) =>
          <li key={i} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-emperial-500" />
                {feature}
              </li>
          )}
          </ul>
          <Button className="w-full group-hover:bg-emperial-400">
            Continue as Customer
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </GlassCard>

        <GlassCard
        hoverEffect
        className="p-8 cursor-pointer border-2 border-transparent hover:border-purple-500/50 group"
        onClick={() => setView('provider-onboarding')}>
        
          <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Briefcase className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Become a Booster
          </h3>
          <p className="text-slate-400 mb-6">
            Join our elite team of professional gamers and earn money doing what
            you love.
          </p>
          <ul className="space-y-3 mb-8">
            {[
          'Set your own schedule',
          'Competitive payouts & bonuses',
          'Access to premium jobs',
          'Dedicated provider support'].
          map((feature, i) =>
          <li key={i} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-purple-500" />
                {feature}
              </li>
          )}
          </ul>
          <Button className="w-full bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_-5px_rgba(147,51,234,0.5)] group-hover:shadow-[0_0_25px_-5px_rgba(147,51,234,0.7)]">
            Apply as Provider
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </GlassCard>
      </div>
    </div>;

  const renderProviderOnboarding = () => {
    const nextStep = () => setOnboardingStep((s) => Math.min(5, s + 1));
    const prevStep = () => setOnboardingStep((s) => Math.max(1, s - 1));
    const steps = [
    {
      id: 1,
      name: 'Basic Info'
    },
    {
      id: 2,
      name: 'Gaming'
    },
    {
      id: 3,
      name: 'Experience'
    },
    {
      id: 4,
      name: 'Availability'
    },
    {
      id: 5,
      name: 'Success'
    }];

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
              style={{
                width: `${(onboardingStep - 1) / 4 * 100}%`
              }} />
            

            <div className="relative flex justify-between">
              {steps.map((step) =>
              <div key={step.id} className="flex flex-col items-center gap-2">
                  <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-500 ${onboardingStep >= step.id ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-slate-800 text-slate-500 border border-white/10'}`}>
                  
                    {onboardingStep > step.id ?
                  <CheckCircle2 className="w-5 h-5" /> :

                  step.id
                  }
                  </div>
                  <span
                  className={`text-xs font-medium hidden sm:block ${onboardingStep >= step.id ? 'text-purple-400' : 'text-slate-500'}`}>
                  
                    {step.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <GlassCard className="p-6 sm:p-8 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={onboardingStep}
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              exit={{
                opacity: 0,
                x: -20
              }}
              transition={{
                duration: 0.3
              }}>
              
              {onboardingStep === 1 &&
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
                        Display Name
                      </label>
                      <input
                      type="text"
                      className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g. Shadowblade" />
                    
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">
                        Real Name (Optional)
                      </label>
                      <input
                      type="text"
                      className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="John Doe" />
                    
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">
                        Country
                      </label>
                      <select className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none">
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>Germany</option>
                        <option>France</option>
                        <option>Canada</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">
                        Timezone
                      </label>
                      <select className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none">
                        <option>PST (UTC-8)</option>
                        <option>EST (UTC-5)</option>
                        <option>GMT (UTC+0)</option>
                        <option>CET (UTC+1)</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">
                      Profile Bio
                    </label>
                    <textarea
                    rows={4}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Briefly describe your gaming background and what makes you a great booster...">
                  </textarea>
                  </div>
                </div>
              }

              {onboardingStep === 2 &&
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
                      <select className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none">
                        <option>World of Warcraft</option>
                        <option>Destiny 2</option>
                        <option>Final Fantasy XIV</option>
                        <option>League of Legends</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">
                        Battle.net ID
                      </label>
                      <input
                      type="text"
                      className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Player#1234" />
                    
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">
                        Server / Region
                      </label>
                      <select className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none">
                        <option>US - Illidan</option>
                        <option>US - Area 52</option>
                        <option>EU - Tarren Mill</option>
                        <option>EU - Kazzak</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">
                        Main Character Name
                      </label>
                      <input
                      type="text"
                      className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g. Thrall" />
                    
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">
                        Character Class
                      </label>
                      <select className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none">
                        <option>Warrior</option>
                        <option>Paladin</option>
                        <option>Hunter</option>
                        <option>Rogue</option>
                        <option>Priest</option>
                        <option>Death Knight</option>
                        <option>Shaman</option>
                        <option>Mage</option>
                        <option>Warlock</option>
                        <option>Monk</option>
                        <option>Druid</option>
                        <option>Demon Hunter</option>
                        <option>Evoker</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">
                        Current Item Level
                      </label>
                      <input
                      type="number"
                      className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g. 489" />
                    
                    </div>
                  </div>
                </div>
              }

              {onboardingStep === 3 &&
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
                    <select className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none">
                      <option>Less than 1 year</option>
                      <option>1-2 years</option>
                      <option>3-5 years</option>
                      <option>5+ years</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-400">
                      Services you can provide (Select all that apply)
                    </label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                    'Mythic+ Dungeons',
                    'Raid Carries',
                    'PvP Boosting',
                    'Leveling',
                    'Gold Farming',
                    'Achievements'].
                    map((service) =>
                    <label
                      key={service}
                      className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-slate-800/50 cursor-pointer hover:bg-slate-800 transition-colors">
                      
                          <input
                        type="checkbox"
                        className="rounded border-slate-600 text-purple-500 focus:ring-purple-500 bg-slate-700" />
                      
                          <span className="text-sm text-slate-300">
                            {service}
                          </span>
                        </label>
                    )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">
                      Highest Achievement
                    </label>
                    <input
                    type="text"
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g. Cutting Edge: Fyrakk, Rank 1 Gladiator" />
                  
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">
                      Link to Raider.io / Armory (Optional)
                    </label>
                    <input
                    type="url"
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://raider.io/characters/..." />
                  
                  </div>
                </div>
              }

              {onboardingStep === 4 &&
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
                    <select className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none">
                      <option>10-20 hours</option>
                      <option>20-30 hours</option>
                      <option>30-40 hours</option>
                      <option>40+ hours</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-400">
                      Preferred Schedule
                    </label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                    'Weekday mornings',
                    'Weekday evenings',
                    'Weekends',
                    'Flexible'].
                    map((schedule) =>
                    <label
                      key={schedule}
                      className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-slate-800/50 cursor-pointer hover:bg-slate-800 transition-colors">
                      
                          <input
                        type="checkbox"
                        className="rounded border-slate-600 text-purple-500 focus:ring-purple-500 bg-slate-700" />
                      
                          <span className="text-sm text-slate-300">
                            {schedule}
                          </span>
                        </label>
                    )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">
                        Expected Hourly Rate ($)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                          $
                        </span>
                        <input
                        type="number"
                        className="w-full bg-slate-800 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="15" />
                      
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">
                        Payment Method
                      </label>
                      <select className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none">
                        <option>PayPal</option>
                        <option>Bank Transfer</option>
                        <option>Crypto (USDT/USDC)</option>
                      </select>
                    </div>
                  </div>
                </div>
              }

              {onboardingStep === 5 &&
              <div className="py-8 text-center space-y-6">
                  <motion.div
                  initial={{
                    scale: 0
                  }}
                  animate={{
                    scale: 1
                  }}
                  transition={{
                    type: 'spring',
                    damping: 15,
                    delay: 0.2
                  }}
                  className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  
                    <CheckCircle2 className="w-12 h-12 text-green-400" />
                  </motion.div>

                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">
                      Application Submitted!
                    </h3>
                    <p className="text-slate-400 max-w-md mx-auto">
                      Welcome to the team! Your application has been received
                      and is currently under review.
                    </p>
                  </div>

                  <div className="bg-slate-800/50 rounded-xl p-6 max-w-md mx-auto border border-white/5 text-left">
                    <h4 className="font-medium text-white mb-4">
                      What happens next?
                    </h4>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-purple-400">
                            1
                          </span>
                        </div>
                        <p className="text-sm text-slate-300">
                          Our team will review your application within 24-48
                          hours.
                        </p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-purple-400">
                            2
                          </span>
                        </div>
                        <p className="text-sm text-slate-300">
                          You'll receive an email with a link to join our
                          Provider Discord server.
                        </p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-purple-400">
                            3
                          </span>
                        </div>
                        <p className="text-sm text-slate-300">
                          Complete a brief verification run to unlock premium
                          jobs.
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              }
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
            {onboardingStep > 1 && onboardingStep < 5 ?
            <Button variant="ghost" onClick={prevStep}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button> :

            <div></div>
            }

            {onboardingStep < 5 ?
            <Button
              onClick={nextStep}
              className="bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_-5px_rgba(147,51,234,0.5)]">
              
                {onboardingStep === 4 ? 'Submit Application' : 'Next Step'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button> :

            <Button
              onClick={() => navigate('/provider/dashboard')}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_-5px_rgba(147,51,234,0.5)]">
              
                Go to Provider Dashboard
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            }
          </div>
        </GlassCard>
      </div>);

  };
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emperial-500/10 rounded-full blur-[120px] opacity-30" />
        {view === 'provider-onboarding' &&
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[120px] opacity-30 transition-opacity duration-1000" />
        }
      </div>

      <div className="relative z-10 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -20
            }}
            transition={{
              duration: 0.3
            }}>
            
            {view === 'auth' && renderAuthView()}
            {view === 'role-selection' && renderRoleSelection()}
            {view === 'provider-onboarding' && renderProviderOnboarding()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>);

}