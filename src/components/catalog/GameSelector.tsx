import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
interface GameSelectorProps {
  selectedGame: string;
  onSelectGame: (game: string) => void;
}
const games = [
{
  id: 'wow',
  name: 'World of Warcraft',
  shortName: 'WoW',
  image:
  'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=600&h=400',
  active: true
},
{
  id: 'diablo',
  name: 'Diablo IV',
  shortName: 'D4',
  image:
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600&h=400',
  active: false
},
{
  id: 'lol',
  name: 'League of Legends',
  shortName: 'LoL',
  image:
  'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?auto=format&fit=crop&q=80&w=600&h=400',
  active: false
},
{
  id: 'ffxiv',
  name: 'Final Fantasy XIV',
  shortName: 'FFXIV',
  image:
  'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=600&h=400',
  active: false
},
{
  id: 'valorant',
  name: 'Valorant',
  shortName: 'VAL',
  image:
  'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?auto=format&fit=crop&q=80&w=600&h=400',
  active: false
},
{
  id: 'poe',
  name: 'Path of Exile 2',
  shortName: 'PoE2',
  image:
  'https://images.unsplash.com/photo-1552820728-8b83bb6b2b0e?auto=format&fit=crop&q=80&w=600&h=400',
  active: false
}];

export function GameSelector({
  selectedGame,
  onSelectGame
}: GameSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 220;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth'
      });
    }
  };
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-white">Select Realm</h2>
        {/* Scroll arrows — visible on mobile, hidden on wide desktop */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-colors">
            
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-colors">
            
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile: horizontal scroll | Desktop: responsive grid */}
      <div
        ref={scrollRef}
        className="
          flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide
          lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:overflow-visible lg:pb-0
        "



        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
        
        {games.map((game) => {
          const isSelected = selectedGame === game.id;
          const isDisabled = !game.active;
          return (
            <motion.button
              key={game.id}
              onClick={() => game.active && onSelectGame(game.id)}
              disabled={isDisabled}
              className={`
                relative snap-start shrink-0 w-[200px] lg:w-auto
                h-28 rounded-2xl overflow-hidden
                border transition-all duration-300 outline-none
                ${isDisabled ? 'cursor-not-allowed border-white/5' : isSelected ? 'border-emperial-500 shadow-[0_0_24px_-4px_rgba(59,130,246,0.4)]' : 'border-white/10 hover:border-white/25'}
              `}
              whileHover={
              !isDisabled ?
              {
                scale: 1.03
              } :
              undefined
              }
              whileTap={
              !isDisabled ?
              {
                scale: 0.98
              } :
              undefined
              }
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25
              }}>
              
              {/* Background image — full cover, no crop issues */}
              <div
                className={`
                  absolute inset-0 bg-cover bg-center
                  transition-transform duration-500
                  ${!isDisabled ? 'group-hover:scale-110' : ''}
                  ${isDisabled ? 'blur-[2px] saturate-0' : ''}
                `}
                style={{
                  backgroundImage: `url(${game.image})`
                }} />
              

              {/* Gradient overlay for readability */}
              <div
                className={`
                  absolute inset-0 transition-opacity duration-300
                  ${isSelected ? 'bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-emperial-900/30' : isDisabled ? 'bg-slate-900/75' : 'bg-gradient-to-t from-slate-900/80 via-slate-900/50 to-slate-900/30'}
                `} />
              

              {/* Selected glow edge */}
              {isSelected &&
              <motion.div
                layoutId="gameSelectorGlow"
                className="absolute inset-0 rounded-2xl ring-2 ring-emperial-500 ring-inset pointer-events-none"
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30
                }} />

              }

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-end p-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`
                      text-base font-bold tracking-wide
                      ${isDisabled ? 'text-slate-400' : 'text-white'}
                    `}
                    style={{
                      textShadow: '0 1px 8px rgba(0,0,0,0.6)'
                    }}>
                    
                    {game.name}
                  </span>

                  {/* Selected check */}
                  <AnimatePresence>
                    {isSelected &&
                    <motion.div
                      initial={{
                        scale: 0,
                        opacity: 0
                      }}
                      animate={{
                        scale: 1,
                        opacity: 1
                      }}
                      exit={{
                        scale: 0,
                        opacity: 0
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 25
                      }}
                      className="w-6 h-6 rounded-full bg-emperial-500 flex items-center justify-center shadow-lg shadow-emperial-500/40">
                      
                        <Check
                        className="w-3.5 h-3.5 text-white"
                        strokeWidth={3} />
                      
                      </motion.div>
                    }
                  </AnimatePresence>
                </div>
              </div>

              {/* Coming Soon badge */}
              {isDisabled &&
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-sm text-slate-300 text-xs font-medium px-2.5 py-1 rounded-lg border border-white/10">
                  <Lock className="w-3 h-3" />
                  Coming Soon
                </div>
              }
            </motion.button>);

        })}
      </div>
    </div>);

}