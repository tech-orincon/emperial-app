import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Sword, Coins, Skull, Crown, Package, ArrowRight } from 'lucide-react';
interface CategoryGridProps {
  onSelectCategory: (category: string) => void;
}
const categories = [
{
  id: 'mythic-plus',
  name: 'Mythic+ Dungeons',
  description: 'Keystone Master, timed runs, and weekly vault rewards.',
  icon: Skull,
  count: 24
},
{
  id: 'raids',
  name: 'Raid Carries',
  description: 'Full clear runs for Amirdrassil on all difficulties.',
  icon: Crown,
  count: 12
},
{
  id: 'gold',
  name: 'Gold & Currency',
  description: 'Instant delivery across all realms and factions.',
  icon: Coins,
  count: 8
},
{
  id: 'leveling',
  name: 'Power Leveling',
  description: 'Reach max level quickly with our efficient routes.',
  icon: Sword,
  count: 6
},
{
  id: 'items',
  name: 'Items & Mounts',
  description: 'Rare drops, crafted gear, and profession kits.',
  icon: Package,
  count: 45
}];

export function CategoryGrid({ onSelectCategory }: CategoryGridProps) {
  return (
    <div className="w-full">
      <motion.h2
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="text-3xl font-bold text-white mb-2">
        
        Choose Your Path
      </motion.h2>
      <motion.p
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: 0.1
        }}
        className="text-slate-400 mb-10">
        
        Select a category to browse our available services and products.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) =>
        <motion.div
          key={category.id}
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: index * 0.1
          }}
          onClick={() => onSelectCategory(category.id)}
          className="cursor-pointer group">
          
            <GlassCard hoverEffect className="h-full p-8 flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 rounded-xl bg-emperial-500/10 text-emperial-400 group-hover:bg-emperial-500 group-hover:text-white transition-colors duration-300">
                  <category.icon className="w-8 h-8" />
                </div>
                <span className="text-xs font-medium text-slate-500 bg-slate-800/50 px-2 py-1 rounded-full border border-white/5">
                  {category.count} Services
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emperial-400 transition-colors">
                {category.name}
              </h3>
              <p className="text-slate-400 text-sm mb-6 flex-1">
                {category.description}
              </p>

              <div className="flex items-center text-sm font-medium text-emperial-400 group-hover:translate-x-1 transition-transform">
                Browse Category <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>);

}