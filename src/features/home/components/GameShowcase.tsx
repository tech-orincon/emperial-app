import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ChevronRight, Gamepad2, Sword, Shield, Crosshair, Trophy,
  Zap, Star, Target, Flame, Crown, Swords, Joystick, Dice5,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { HomeGame } from '../../../types/catalog.types'

// Backend sends the PascalCase Lucide icon name, e.g. "Sword", "Shield", "Crosshair"
// Add more entries here as needed when new games are created in the backend
const GAME_ICONS: Record<string, LucideIcon> = {
  Sword, Shield, Crosshair, Trophy, Zap, Star, Target,
  Flame, Crown, Swords, Joystick, Dice5, Gamepad2,
}

function GameIcon({ name }: { name: string | null }) {
  const Icon = (name && GAME_ICONS[name]) ? GAME_ICONS[name] : Gamepad2
  return <Icon className="w-5 h-5 text-white" />
}

interface Props {
  games: HomeGame[]
  isLoading: boolean
}

// Cycles through a palette so each card has a distinct tint
const CARD_COLORS = [
  'from-amber-500/20 to-orange-600/20',
  'from-purple-500/20 to-pink-600/20',
  'from-red-500/20 to-rose-600/20',
  'from-cyan-500/20 to-blue-600/20',
]

function GameCardSkeleton() {
  return (
    <div className="h-64 rounded-2xl border border-white/10 bg-slate-800/50 animate-pulse" />
  )
}

export function GameShowcase({ games, isLoading }: Props) {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[400px] bg-emperial-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-white mb-2"
            >
              Explore Games
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-400"
            >
              Choose your battlefield and dominate
            </motion.p>
          </div>
          <Link to="/catalog" className="hidden md:flex items-center gap-1 text-emperial-400 hover:text-emperial-300 transition-colors font-medium">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <GameCardSkeleton key={i} />)
            : games.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/catalog?game=${game.slug}`} className="block group">
                    <div className="relative h-64 rounded-2xl overflow-hidden border border-white/10 bg-slate-900/50">
                      {game.imageUrl ? (
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                          style={{ backgroundImage: `url(${game.imageUrl})` }}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-slate-800" />
                      )}

                      <div className={`absolute inset-0 bg-gradient-to-t ${CARD_COLORS[index % CARD_COLORS.length]} opacity-80`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                            <GameIcon name={game.icon} />
                          </div>
                          <span className="text-xs font-medium text-white/70 bg-white/10 backdrop-blur-sm px-2 py-1 rounded">
                            {game.countServices} Services
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emperial-300 transition-colors">
                          {game.name}
                        </h3>
                        {game.tags.length > 0 && (
                          <p className="text-sm text-slate-300">{game.tags.slice(0, 3).join(' • ')}</p>
                        )}
                      </div>

                      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <ChevronRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
          }
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link to="/catalog" className="inline-flex items-center gap-1 text-emperial-400 hover:text-emperial-300 transition-colors font-medium">
            View All Games <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
