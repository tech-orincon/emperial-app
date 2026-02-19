import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { Check } from 'lucide-react';
interface GameSelectorProps {
  selectedGame: string;
  onSelectGame: (game: string) => void;
}
const games = [
{
  id: 'wow',
  name: 'World of Warcraft',
  image:
  'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=1000',
  active: true
},
{
  id: 'diablo',
  name: 'Diablo IV',
  image:
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000',
  active: false
},
{
  id: 'lol',
  name: 'League of Legends',
  image:
  'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?auto=format&fit=crop&q=80&w=1000',
  active: false
}];

export function GameSelector({
  selectedGame,
  onSelectGame
}: GameSelectorProps) {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-white mb-6">Select Realm</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map((game) =>
        <div
          key={game.id}
          onClick={() => game.active && onSelectGame(game.id)}
          className={`relative group cursor-pointer ${!game.active ? 'opacity-50 cursor-not-allowed' : ''}`}>

            <GlassCard
            className={`h-32 flex items-center justify-center overflow-hidden transition-all duration-300 ${selectedGame === game.id ? 'ring-2 ring-emperial-500 shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]' : 'hover:ring-1 hover:ring-white/20'}`}>

              <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{
                backgroundImage: `url(${game.image})`
              }} />

              <div
              className={`absolute inset-0 bg-slate-900/60 ${selectedGame === game.id ? 'bg-slate-900/40' : ''}`} />


              <div className="relative z-10 flex items-center gap-3">
                <span className="text-lg font-bold text-white tracking-wide">
                  {game.name}
                </span>
                {selectedGame === game.id &&
              <div className="bg-emperial-500 rounded-full p-1">
                    <Check className="w-3 h-3 text-white" />
                  </div>
              }
              </div>

              {!game.active &&
            <div className="absolute top-2 right-2 bg-slate-800/90 text-slate-400 text-xs px-2 py-1 rounded border border-white/10">
                  Coming Soon
                </div>
            }
            </GlassCard>
          </div>
        )}
      </div>
    </div>);

}