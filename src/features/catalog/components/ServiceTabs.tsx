import { motion } from 'framer-motion'
import { Star, ShieldCheck, Check } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { GlassCard } from '../../../components/ui/GlassCard'

interface Provider {
  name: string
  rating: number
  completedJobs: number
  avatar: string
}

interface Props {
  activeTab: string
  setActiveTab: (tab: string) => void
  provider: Provider
}

const TABS = ['Overview', 'Requirements', 'Reviews']

const OVERVIEW_FEATURES = [
  'Guaranteed Timed Run',
  'Specific Dungeon Choice',
  'Loot Trading Available',
  'Self-play or Pilot',
]

export function ServiceTabs({ activeTab, setActiveTab, provider }: Props) {
  return (
    <>
      <div className="border-b border-white/10">
        <div className="flex gap-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === tab.toLowerCase() ? 'text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {tab}
              {activeTab === tab.toLowerCase() && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emperial-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[300px]">
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 leading-relaxed">
                Conquer the toughest dungeons in Azeroth with our elite Mythic+ team. Whether you need a
                specific key level for your weekly vault or are pushing for Keystone Master, our veteran
                players will ensure a smooth, timed run.
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {OVERVIEW_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-emperial-500" /> {feature}
                  </li>
                ))}
              </ul>
            </div>

            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Service Provider</h3>
              <div className="flex items-center gap-4">
                <img src={provider.avatar} alt={provider.name} className="w-12 h-12 rounded-full bg-slate-800" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{provider.name}</span>
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="text-sm text-slate-400">
                    {provider.completedJobs}+ jobs completed • {provider.rating} rating
                  </div>
                </div>
                <Button variant="secondary" size="sm" className="ml-auto">View Profile</Button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === 'requirements' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ul className="space-y-4">
              {[
                { title: 'Level 70 Character', desc: 'Must be max level on Dragonflight expansion.' },
                { title: 'Active Subscription', desc: 'World of Warcraft account must have active game time.' },
              ].map((req, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-400">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{req.title}</h4>
                    <p className="text-slate-400 text-sm">{req.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {activeTab === 'reviews' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {[1, 2, 3].map((i) => (
              <GlassCard key={i} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                      U{i}
                    </div>
                    <span className="font-bold text-white">User{i}</span>
                  </div>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3 h-3 fill-amber-400" />)}
                  </div>
                </div>
                <p className="text-slate-300 text-sm">
                  "Fast, efficient, and friendly. Got my loot and rating in no time. Highly recommended!"
                </p>
              </GlassCard>
            ))}
          </motion.div>
        )}
      </div>
    </>
  )
}
