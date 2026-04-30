import { motion } from 'framer-motion'
import { ArrowRight, Lock, Gamepad2, Sword, Shield, Crosshair, Trophy, Zap, Star, Flame, Crown, Swords, Coins, Skull, Package } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Skeleton } from '../../../components/ui/Skeleton'
import type { GameCategoryResponseDto } from '../../../types/catalog.types'

interface Props {
  categories: GameCategoryResponseDto[]
  isLoading: boolean
  onSelectCategory: (slug: string, name: string) => void
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Sword, Shield, Crosshair, Trophy, Zap, Star, Flame, Crown,
  Swords, Coins, Skull, Package, Gamepad2,
}

function CategoryIcon({ name }: { name: string | null | undefined }) {
  const Icon = (name && CATEGORY_ICONS[name]) ? CATEGORY_ICONS[name] : Gamepad2
  return <Icon className="w-8 h-8" />
}

function CategorySkeleton() {
  return (
    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 space-y-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="w-16 h-16 rounded-xl bg-slate-800" />
        <Skeleton width={80} height={24} className="rounded-full" />
      </div>
      <Skeleton height={24} width="60%" />
      <Skeleton height={16} />
      <Skeleton height={16} width="80%" />
    </div>
  )
}

export function CategoryGrid({ categories, isLoading, onSelectCategory }: Props) {
  return (
    <div className="w-full">
      <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-white mb-2">
        Choose Your Path
      </motion.h2>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-slate-400 mb-10">
        Select a category to browse our available services and products.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={i} />)
          : categories.map((category, index) => {
              const isComingSoon = category.isComingSoon
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  onClick={() => !isComingSoon && onSelectCategory(category.slug, category.name)}
                  className={isComingSoon ? 'cursor-not-allowed' : 'cursor-pointer group'}
                >
                  <GlassCard hoverEffect={!isComingSoon} className={`h-full p-8 flex flex-col ${isComingSoon ? 'opacity-60' : ''}`}>
                    <div className="flex items-start justify-between mb-6">
                      <div className={`p-4 rounded-xl transition-colors duration-300 ${isComingSoon ? 'bg-slate-700/50 text-slate-500' : 'bg-emperial-500/10 text-emperial-400 group-hover:bg-emperial-500 group-hover:text-white'}`}>
                        <CategoryIcon name={category.icon} />
                      </div>
                      {isComingSoon ? (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-white/5">
                          <Lock className="w-3 h-3" /> Coming Soon
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-slate-500 bg-slate-800/50 px-2 py-1 rounded-full border border-white/5">
                          {category.countServices} Services
                        </span>
                      )}
                    </div>

                    <h3 className={`text-xl font-bold text-white mb-2 transition-colors ${isComingSoon ? '' : 'group-hover:text-emperial-400'}`}>
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-slate-400 text-sm mb-6 flex-1 line-clamp-2">{category.description}</p>
                    )}

                    {!isComingSoon && (
                      <div className="flex items-center text-sm font-medium text-emperial-400 group-hover:translate-x-1 transition-transform mt-auto">
                        Browse Category <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              )
            })
        }
      </div>
    </div>
  )
}
