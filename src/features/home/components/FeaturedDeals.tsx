import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Star, Zap } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import type { HomeOffer, OfferTag } from '../../../types/catalog.types'

interface Props {
  offers: HomeOffer[]
  isLoading: boolean
}

const TAG_LABELS: Record<OfferTag, string> = {
  BEST_VALUE: 'Best Value',
  POPULAR: 'Popular',
  FLASH_SALE: 'Flash Sale',
  LIMITED: 'Limited',
}

function OfferCardSkeleton() {
  return (
    <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-40 bg-slate-800" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-slate-700 rounded w-1/3" />
        <div className="h-4 bg-slate-700 rounded w-3/4" />
        <div className="h-3 bg-slate-700 rounded w-full" />
        <div className="h-8 bg-slate-700 rounded w-1/2" />
      </div>
    </div>
  )
}

export function FeaturedDeals({ offers, isLoading }: Props) {
  // Don't render the section if loaded and no offers
  if (!isLoading && offers.length === 0) return null

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emperial-500/[0.02] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-4"
          >
            <Zap className="w-4 h-4" />
            Limited Time Offers
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Featured Deals
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Grab these exclusive offers before they're gone
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <OfferCardSkeleton key={i} />)
            : offers.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/service/${offer.id}`} className="block group">
                    <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden hover:border-emperial-500/30 transition-all duration-300">
                      <div className="relative h-40 overflow-hidden">
                        {offer.imageUrl ? (
                          <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                            style={{ backgroundImage: `url(${offer.imageUrl})` }}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-slate-800" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />

                        {offer.discountPct && (
                          <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-red-500 text-white text-sm font-bold shadow-lg">
                            -{offer.discountPct}
                          </div>
                        )}

                        {offer.tag && (
                          <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-slate-900/80 backdrop-blur-sm text-xs font-medium text-white border border-white/10">
                            {TAG_LABELS[offer.tag]}
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1 text-amber-400">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span className="text-sm font-medium">{offer.ratingAvg.toFixed(1)}</span>
                          </div>
                          <span className="text-xs text-slate-500">({offer.reviewsCount})</span>
                        </div>

                        <h3 className="font-bold text-white mb-1 group-hover:text-emperial-300 transition-colors">
                          {offer.title ?? offer.description}
                        </h3>
                        <p className="text-sm text-slate-400 mb-4 line-clamp-2">{offer.description}</p>

                        <div className="flex items-end justify-between">
                          <div>
                            {offer.originalPrice && (
                              <span className="text-sm text-slate-500 line-through">${offer.originalPrice}</span>
                            )}
                            <span className="text-2xl font-bold text-white ml-1">${offer.finalPrice}</span>
                          </div>
                          <Button size="sm">View Offer</Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
          }
        </div>
      </div>
    </section>
  )
}
