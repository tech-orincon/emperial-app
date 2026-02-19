import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Sword, Shield, Coins, Crosshair } from 'lucide-react';
const games = [
{
  id: 'wow',
  title: 'World of Warcraft',
  subtitle: 'Mythic+ • Raids • Gold',
  image:
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800',
  color: 'from-amber-500/20 to-orange-600/20',
  accent: 'amber',
  icon: Sword,
  services: 45
},
{
  id: 'mmo',
  title: 'MMO Services',
  subtitle: 'FFXIV • ESO • GW2',
  image:
  'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=800',
  color: 'from-purple-500/20 to-pink-600/20',
  accent: 'purple',
  icon: Shield,
  services: 32
},
{
  id: 'arpg',
  title: 'Action RPG',
  subtitle: 'Diablo IV • PoE • Lost Ark',
  image:
  'https://images.unsplash.com/photo-1552820728-8b83bb6b2b0e?auto=format&fit=crop&q=80&w=800',
  color: 'from-red-500/20 to-rose-600/20',
  accent: 'red',
  icon: Coins,
  services: 28
},
{
  id: 'shooters',
  title: 'Competitive Shooters',
  subtitle: 'Valorant • CS2 • Apex',
  image:
  'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?auto=format&fit=crop&q=80&w=800',
  color: 'from-cyan-500/20 to-blue-600/20',
  accent: 'cyan',
  icon: Crosshair,
  services: 24
}];

export function GameShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[400px] bg-emperial-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <motion.h2
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              className="text-3xl md:text-4xl font-bold text-white mb-2">

              Explore Games
            </motion.h2>
            <motion.p
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: 0.1
              }}
              className="text-slate-400">

              Choose your battlefield and dominate
            </motion.p>
          </div>
          <Link
            to="/catalog"
            className="hidden md:flex items-center gap-1 text-emperial-400 hover:text-emperial-300 transition-colors font-medium">

            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Game Cards Grid */}
        <div
          ref={scrollRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {games.map((game, index) =>
          <motion.div
            key={game.id}
            initial={{
              opacity: 0,
              y: 30
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              delay: index * 0.1
            }}>

              <Link to="/catalog" className="block group">
                <div className="relative h-64 rounded-2xl overflow-hidden border border-white/10 bg-slate-900/50">
                  {/* Background Image */}
                  <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${game.image})`
                  }} />


                  {/* Gradient Overlay */}
                  <div
                  className={`absolute inset-0 bg-gradient-to-t ${game.color} opacity-80`} />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                      className={`w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20`}>

                        <game.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs font-medium text-white/70 bg-white/10 backdrop-blur-sm px-2 py-1 rounded">
                        {game.services} Services
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emperial-300 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-sm text-slate-300">{game.subtitle}</p>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <ChevronRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 text-center md:hidden">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1 text-emperial-400 hover:text-emperial-300 transition-colors font-medium">

            View All Games <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>);

}