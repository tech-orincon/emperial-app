import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Star, Clock, Zap } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'
import { ErrorState } from '../../components/ui/ErrorState'
import { ServiceLoadingSkeleton } from './components/ServiceLoadingSkeleton'
import { ServiceUnavailableView } from './components/ServiceUnavailableView'
import { ServiceTabs } from './components/ServiceTabs'
import { ServiceSidebar } from './components/ServiceSidebar'
import { useServiceDetail } from './hooks/useServiceDetail'
import { useServiceReviews } from './hooks/useServiceReviews'
import type { CreateOrderPayload } from '../../types/catalog.types'

type PageState = 'loading' | 'success' | 'error' | 'unavailable'

const DELIVERY_LABELS: Record<string, string> = {
  FIXED: 'Fixed time',
  RANGE: 'Est. range',
  FLEXIBLE: 'Flexible',
  SCHEDULED: 'Scheduled',
}

const REVIEWS_LIMIT = 10

export function ServiceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('overview')
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null)
  const [selectedAddonIds, setSelectedAddonIds] = useState<number[]>([])
  const [reviewPage] = useState(1)

  const { data: service, isLoading, error } = useServiceDetail(id)
  const { data: reviews, isLoading: isLoadingReviews } = useServiceReviews(
    activeTab === 'reviews' ? id : undefined,
    reviewPage,
    REVIEWS_LIMIT,
  )

  // Auto-select the first popular package, or just the first
  useEffect(() => {
    if (!service || service.packages.length === 0) return
    const popular = service.packages.find((p) => p.isPopular)
    setSelectedPackageId(popular?.id ?? service.packages[0].id)
  }, [service])

  const pageState: PageState = isLoading
    ? 'loading'
    : error
      ? 'error'
      : !service
        ? 'error'
        : service.status === 'INACTIVE'
          ? 'unavailable'
          : 'success'

  const toggleAddon = (addonId: number) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((a) => a !== addonId) : [...prev, addonId],
    )
  }

  const handleBuyNow = () => {
    if (!service || selectedPackageId === null) return
    const pkg = service.packages.find((p) => p.id === selectedPackageId) ?? service.packages[0]
    const pkgPrice = parseFloat(pkg.price)
    const basePrice = service.activeOffer?.discountPct
      ? pkgPrice * (1 - service.activeOffer.discountPct / 100)
      : pkgPrice
    const addonsTotal = selectedAddonIds.reduce((sum, addonId) => {
      const addon = service.addons.find((a) => a.id === addonId)
      return sum + (addon ? parseFloat(addon.price) : 0)
    }, 0)

    const payload: CreateOrderPayload = {
      serviceId: service.id,
      packageId: pkg.id,
      addons: selectedAddonIds,
      totalPrice: basePrice + addonsTotal,
    }
    console.log('[CreateOrder]', payload)
    navigate('/checkout')
  }

  const handleRetry = () => {
    toast.loading('Retrying...', { id: 'retry' })
    navigate(0)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <Toaster theme="dark" position="top-right" richColors />
      <Navbar />

      <main className="pt-24 pb-24">
        {/* Hero background */}
        <div className="absolute top-0 left-0 right-0 h-[500px] overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 via-slate-900/80 to-slate-900" />
          {service?.imageUrl && (
            <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${service.imageUrl})` }} />
          )}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-slate-400 mb-8 flex-wrap gap-1">
            <span className="hover:text-white cursor-pointer" onClick={() => navigate('/catalog')}>Services</span>
            {service && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-slate-300">{service.category.name}</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white font-medium">{service.title}</span>
              </>
            )}
          </div>

          <AnimatePresence mode="wait">
            {pageState === 'loading' && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ServiceLoadingSkeleton />
              </motion.div>
            )}

            {pageState === 'error' && (
              <motion.div key="error" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="py-16">
                <ErrorState
                  title="Unable to load service"
                  description="We couldn't fetch the service details. Please try again."
                  onRetry={handleRetry}
                  onSupport={() => toast.info('Opening support...')}
                />
              </motion.div>
            )}

            {pageState === 'unavailable' && (
              <motion.div key="unavailable" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <ServiceUnavailableView
                  onViewSimilar={() => navigate('/catalog')}
                  onReturnHome={() => navigate('/')}
                />
              </motion.div>
            )}

            {pageState === 'success' && service && (
              <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Service header */}
                <div className="mb-8">
                  {service.badges.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.badges.map((badge) => (
                        <span key={badge} className="bg-emperial-500/20 text-emperial-300 text-xs font-bold px-2 py-1 rounded border border-emperial-500/20">
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                  <h1 className="text-4xl font-bold text-white mb-4">{service.title}</h1>
                  <div className="flex items-center gap-6 text-sm flex-wrap">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span className="font-bold">{service.ratingAvg.toFixed(1)}</span>
                      <span className="text-slate-500">({service.reviewsCount} reviews)</span>
                    </div>
                    {service.deliveryTime && (
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span>{DELIVERY_LABELS[service.deliveryType] ?? service.deliveryType}: {service.deliveryTime}</span>
                      </div>
                    )}
                    {service.activeOffer && (
                      <div className="flex items-center gap-1 text-emerald-400">
                        <Zap className="w-4 h-4" />
                        <span className="font-medium">From ${service.activeOffer.finalPrice}</span>
                        {service.activeOffer.originalPrice && (
                          <span className="text-slate-500 line-through">${service.activeOffer.originalPrice}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <ServiceTabs
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      description={service.description}
                      features={service.features}
                      requirements={service.requirements}
                      provider={service.provider}
                      reviews={reviews}
                      isLoadingReviews={isLoadingReviews}
                    />
                  </div>
                  <div>
                    <ServiceSidebar
                      packages={service.packages}
                      addons={service.addons}
                      activeOffer={service.activeOffer}
                      selectedPackageId={selectedPackageId}
                      setSelectedPackageId={setSelectedPackageId}
                      selectedAddonIds={selectedAddonIds}
                      toggleAddon={toggleAddon}
                      onBuyNow={handleBuyNow}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  )
}
