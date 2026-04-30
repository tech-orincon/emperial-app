import { motion } from 'framer-motion'
import { Star, ShieldCheck, Check, MessageSquare } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Skeleton } from '../../../components/ui/Skeleton'
import type { ServiceProviderDto, ServiceRequirementDto, ReviewsResponse } from '../../../types/catalog.types'

interface Props {
  activeTab: string
  setActiveTab: (tab: string) => void
  description: string
  features: string[]
  requirements: ServiceRequirementDto[]
  provider: ServiceProviderDto | null
  reviews: ReviewsResponse | null
  isLoadingReviews: boolean
}

const TABS = ['Overview', 'Requirements', 'Reviews']

export function ServiceTabs({
  activeTab, setActiveTab, description, features,
  requirements, provider, reviews, isLoadingReviews,
}: Props) {
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
            <div>
              <p className="text-slate-300 leading-relaxed">{description}</p>
              {features.length > 0 && (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-slate-300">
                      <Check className="w-4 h-4 text-emperial-500 shrink-0" /> {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {provider && (
              <GlassCard className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Service Provider</h3>
                <div className="flex items-center gap-4">
                  {provider.avatarUrl
                    ? <img src={provider.avatarUrl} alt={provider.username} className="w-12 h-12 rounded-full bg-slate-800 object-cover" />
                    : <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-400">{provider.username.slice(0, 2).toUpperCase()}</div>
                  }
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{provider.username}</span>
                      {provider.isVerified && <ShieldCheck className="w-4 h-4 text-green-500" />}
                    </div>
                    <div className="text-sm text-slate-400">
                      {provider.completedJobs}+ jobs completed · {provider.ratingAvg.toFixed(1)} rating
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" className="ml-auto">View Profile</Button>
                </div>
              </GlassCard>
            )}
          </motion.div>
        )}

        {activeTab === 'requirements' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {requirements.length === 0
              ? <p className="text-slate-500 text-sm py-8">No specific requirements for this service.</p>
              : (
                <ul className="space-y-4">
                  {requirements.map((req, i) => (
                    <li key={req.id} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-400 shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{req.title}</h4>
                        <p className="text-slate-400 text-sm">{req.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )
            }
          </motion.div>
        )}

        {activeTab === 'reviews' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {isLoadingReviews
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-slate-900/40 border border-white/10 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton width={100} height={16} />
                    </div>
                    <Skeleton height={14} />
                    <Skeleton height={14} width="80%" />
                  </div>
                ))
              : !reviews || reviews.data.length === 0
                ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800/60 flex items-center justify-center mb-3">
                      <MessageSquare className="w-6 h-6 text-slate-500" />
                    </div>
                    <p className="text-slate-400 font-medium">No reviews yet</p>
                    <p className="text-sm text-slate-600 mt-1">Be the first to review this service.</p>
                  </div>
                )
                : reviews.data.map((review) => (
                  <GlassCard key={review.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {review.customerAvatarUrl
                          ? <img src={review.customerAvatarUrl} alt={review.customerUsername} className="w-8 h-8 rounded-full object-cover" />
                          : <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">{review.customerAvatarInitials}</div>
                        }
                        <span className="font-bold text-white text-sm">{review.customerUsername}</span>
                      </div>
                      <div className="flex text-amber-400">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm">{review.comment}</p>
                    <p className="text-xs text-slate-600 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </GlassCard>
                ))
            }
          </motion.div>
        )}
      </div>
    </>
  )
}
