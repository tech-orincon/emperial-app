import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'
import { ErrorState } from '../../components/ui/ErrorState'
import { Toaster, toast } from 'sonner'
import { ServiceLoadingSkeleton } from './components/ServiceLoadingSkeleton'
import { ServiceUnavailableView } from './components/ServiceUnavailableView'
import { ServiceTabs } from './components/ServiceTabs'
import { ServiceSidebar } from './components/ServiceSidebar'

type PageState = 'loading' | 'success' | 'error' | 'unavailable'

const SERVICE = {
  title: 'Mythic+ 20 Timed Run',
  rating: 4.9,
  reviews: 1240,
  deliveryTime: '45 min',
  image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1000',
  badges: ['Verified', 'Top Seller', 'Instant Delivery'],
  provider: { name: 'Shadowblade', rating: 5.0, completedJobs: 2400, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shadowblade' },
  packages: [
    { id: 'basic', name: 'Basic', price: 49, features: ['Key completion', 'Standard loot'] },
    { id: 'standard', name: 'Standard', price: 89, features: ['Timed guarantee', 'Loot funnel (1 trader)', 'Priority start'] },
    { id: 'premium', name: 'Premium', price: 149, features: ['Timed guarantee', 'Loot funnel (2 traders)', 'VIP priority', 'Stream included'] },
  ],
  addonsList: [
    { id: 'loot', name: 'Extra Loot Trader', price: 15 },
    { id: 'exclusive', name: 'Exclusive Run (No other buyers)', price: 25 },
    { id: 'timed', name: 'Specific Key Selection', price: 10 },
    { id: 'extra', name: 'Live Stream', price: 20 },
  ],
}

export function ServiceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pageState, setPageState] = useState<PageState>('loading')
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedPackage, setSelectedPackage] = useState('standard')
  const [addons, setAddons] = useState<string[]>([])

  useEffect(() => {
    setPageState('loading')
    const timer = setTimeout(() => {
      if (id === 'unavailable') setPageState('unavailable')
      else if (id === 'error') { setPageState('error'); toast.error('Failed to load service details') }
      else setPageState('success')
    }, 1200)
    return () => clearTimeout(timer)
  }, [id])

  const toggleAddon = (addonId: string) => {
    setAddons((prev) => prev.includes(addonId) ? prev.filter((a) => a !== addonId) : [...prev, addonId])
  }

  const handleRetry = () => {
    setPageState('loading')
    toast.loading('Retrying...', { id: 'retry' })
    setTimeout(() => { setPageState('success'); toast.success('Service loaded', { id: 'retry' }) }, 1200)
  }

  const currentPackage = SERVICE.packages.find((p) => p.id === selectedPackage) ?? SERVICE.packages[0]
  const addonsTotal = addons.reduce((sum, addonId) => {
    const addon = SERVICE.addonsList.find((a) => a.id === addonId)
    return sum + (addon ? addon.price : 0)
  }, 0)
  const totalPrice = currentPackage.price + addonsTotal

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <Toaster theme="dark" position="top-right" richColors />
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="absolute top-0 left-0 right-0 h-[500px] overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 via-slate-900/80 to-slate-900" />
          <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${SERVICE.image})` }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-sm text-slate-400 mb-8">
            <span className="hover:text-white cursor-pointer" onClick={() => navigate('/catalog')}>Services</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-white">Mythic+ Dungeons</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-white font-medium">{SERVICE.title}</span>
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

            {pageState === 'success' && (
              <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Service header */}
                <div className="mb-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {SERVICE.badges.map((badge) => (
                      <span key={badge} className="bg-emperial-500/20 text-emperial-300 text-xs font-bold px-2 py-1 rounded border border-emperial-500/20">
                        {badge}
                      </span>
                    ))}
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-4">{SERVICE.title}</h1>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1 text-amber-400">
                      <span className="font-bold">{SERVICE.rating}</span>
                      <span className="text-slate-500">({SERVICE.reviews} reviews)</span>
                    </div>
                    <div className="text-slate-400">ETA: {SERVICE.deliveryTime}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <ServiceTabs activeTab={activeTab} setActiveTab={setActiveTab} provider={SERVICE.provider} />
                  </div>
                  <div>
                    <ServiceSidebar
                      packages={SERVICE.packages}
                      addonsList={SERVICE.addonsList}
                      selectedPackage={selectedPackage}
                      setSelectedPackage={setSelectedPackage}
                      addons={addons}
                      toggleAddon={toggleAddon}
                      currentPackage={currentPackage}
                      totalPrice={totalPrice}
                      onBuyNow={() => navigate('/checkout')}
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
