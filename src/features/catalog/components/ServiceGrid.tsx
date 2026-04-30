import { useState } from 'react'
import { motion } from 'framer-motion'
import { Filter, ArrowDownUp, PackageSearch } from 'lucide-react'
import { ServiceCard } from './ServiceCard'
import { SkeletonServiceCard } from '../../../components/ui/Skeleton'
import { ErrorState } from '../../../components/ui/ErrorState'
import type { CategoryServiceResponseDto } from '../../../types/catalog.types'

interface Props {
  services: CategoryServiceResponseDto[]
  categoryName: string
  isLoading: boolean
  error: boolean
  onRetry: () => void
}

export function ServiceGrid({ services, categoryName, isLoading, error, onRetry }: Props) {
  const [sortBy, setSortBy] = useState('popular')

  const sorted = [...services].sort((a, b) => {
    if (sortBy === 'price-low') return parseFloat(a.basePrice) - parseFloat(b.basePrice)
    if (sortBy === 'price-high') return parseFloat(b.basePrice) - parseFloat(a.basePrice)
    if (sortBy === 'rating') return b.ratingAvg - a.ratingAvg
    return b.reviewsCount - a.reviewsCount // popular
  })

  if (error) {
    return <ErrorState title="Failed to load services" description="We couldn't fetch the services for this category." onRetry={onRetry} />
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{categoryName}</h2>
          <p className="text-slate-400">
            {isLoading ? 'Loading services...' : `${services.length} service${services.length !== 1 ? 's' : ''} available`}
          </p>
        </div>

        {!isLoading && services.length > 0 && (
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium">
              <Filter className="w-4 h-4" /> Filters
            </button>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emperial-500"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ArrowDownUp className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <SkeletonServiceCard />
            </motion.div>
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/60 flex items-center justify-center mb-4">
            <PackageSearch className="w-7 h-7 text-slate-500" />
          </div>
          <p className="text-slate-400 font-medium mb-1">No services yet</p>
          <p className="text-sm text-slate-600">Check back soon — this category is being stocked.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((service, index) => (
            <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
