import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronLeft, ChevronRight, Lock } from 'lucide-react'
import type { GameDto } from '../../../types/reference.types'

interface Props {
  games: GameDto[]
  isLoading: boolean
  selectedGameId: number | null
  onSelectGame: (game: GameDto) => void
}

function GameCardSkeleton() {
  return <div className="shrink-0 w-[200px] lg:w-auto h-28 rounded-2xl bg-slate-800/50 animate-pulse border border-white/5" />
}

export function GameSelector({ games, isLoading, selectedGameId, onSelectGame }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const scroll = (direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: direction === 'left' ? -220 : 220, behavior: 'smooth' })
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-white">Select Realm</h2>
        <div className="flex items-center gap-2 lg:hidden">
          <button onClick={() => scroll('left')} className="w-8 h-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll('right')} className="w-8 h-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:overflow-visible lg:pb-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <GameCardSkeleton key={i} />)
          : games.map((game) => {
              const isSelected = selectedGameId === game.id
              const isComingSoon = game.isComingSoon ?? false
              return (
                <motion.button
                  key={game.id}
                  onClick={() => !isComingSoon && onSelectGame(game)}
                  className={`relative snap-start shrink-0 w-[200px] lg:w-auto h-28 rounded-2xl overflow-hidden border transition-all duration-300 outline-none ${isComingSoon ? 'cursor-not-allowed opacity-60 border-white/5' : isSelected ? 'border-emperial-500 shadow-[0_0_24px_-4px_rgba(59,130,246,0.4)]' : 'border-white/10 hover:border-white/25'}`}
                  whileHover={isComingSoon ? {} : { scale: 1.03 }}
                  whileTap={isComingSoon ? {} : { scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  {game.imageUrl
                    ? <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500" style={{ backgroundImage: `url(${game.imageUrl})` }} />
                    : <div className="absolute inset-0 bg-slate-800" />
                  }

                  <div className={`absolute inset-0 transition-opacity duration-300 ${isSelected ? 'bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-emperial-900/30' : 'bg-gradient-to-t from-slate-900/80 via-slate-900/50 to-slate-900/30'}`} />

                  {isSelected && !isComingSoon && (
                    <motion.div layoutId="gameSelectorGlow" className="absolute inset-0 rounded-2xl ring-2 ring-emperial-500 ring-inset pointer-events-none" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                  )}

                  <div className="relative z-10 h-full flex flex-col justify-end p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold tracking-wide text-white" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}>
                        {game.name}
                      </span>
                      <AnimatePresence>
                        {isComingSoon ? (
                          <span className="flex items-center gap-1 text-[10px] font-medium text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-sm">
                            <Lock className="w-2.5 h-2.5" /> Soon
                          </span>
                        ) : isSelected && (
                          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 25 }} className="w-6 h-6 rounded-full bg-emperial-500 flex items-center justify-center shadow-lg shadow-emperial-500/40">
                            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.button>
              )
            })
        }
      </div>
    </div>
  )
}
