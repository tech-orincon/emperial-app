import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { Shield } from 'lucide-react';
export function ProviderLoginPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emperial-500/10 rounded-full blur-[120px] opacity-30" />
      </div>

      <GlassCard className="max-w-md w-full p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emperial-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emperial-500/20 mx-auto mb-4">
            E
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Provider Portal
          </h1>
          <p className="text-slate-400">
            Log in to manage your jobs and earnings
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            navigate('/provider/dashboard');
          }}>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">
              Email Address
            </label>
            <input
              type="email"
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500"
              placeholder="booster@emperial.com" />
            
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">
              Password
            </label>
            <input
              type="password"
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500"
              placeholder="••••••••" />
            
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-slate-600 text-emperial-500 focus:ring-emperial-500 bg-slate-700" />
              
              <span className="text-slate-400">Remember me</span>
            </label>
            <a href="#" className="text-emperial-400 hover:text-emperial-300">
              Forgot password?
            </a>
          </div>

          <Button className="w-full" size="lg">
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Want to join our team?{' '}
          <a
            href="#"
            className="text-emperial-400 hover:text-emperial-300 font-medium">
            
            Apply here
          </a>
        </div>
      </GlassCard>
    </div>);

}