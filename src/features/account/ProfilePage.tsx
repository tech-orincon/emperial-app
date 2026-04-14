import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { User, Shield, Link as LinkIcon } from 'lucide-react';
export function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-8">
            Account Settings
          </h1>

          <div className="space-y-6">
            {/* Profile Info */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-emperial-500" />
                <h2 className="text-xl font-bold text-white">
                  Profile Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">
                    Display Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Champion123"
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500" />
                  
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="champion@example.com"
                    disabled
                    className="w-full bg-slate-800/50 border border-white/5 rounded-lg px-4 py-2 text-slate-400 cursor-not-allowed" />
                  
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">
                    Region
                  </label>
                  <select className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500">
                    <option>North America (US)</option>
                    <option>Europe (EU)</option>
                    <option>Asia</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </GlassCard>

            {/* Security */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-emperial-500" />
                <h2 className="text-xl font-bold text-white">Security</h2>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-white/5">
                <div>
                  <h3 className="font-medium text-white">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-sm text-slate-400">
                    Add an extra layer of security to your account.
                  </p>
                </div>
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-700 cursor-pointer">
                  <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                </div>
              </div>

              <div className="mt-6">
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>
            </GlassCard>

            {/* Linked Accounts */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <LinkIcon className="w-6 h-6 text-emperial-500" />
                <h2 className="text-xl font-bold text-white">
                  Linked Accounts
                </h2>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#148EFF] flex items-center justify-center text-white font-bold">
                    BN
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Battle.net</h3>
                    <p className="text-sm text-slate-400">
                      Connected as Champion#1234
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                  
                  Disconnect
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>

      <Footer />
    </div>);

}