import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Clock,
  ShieldCheck,
  Check,
  ChevronRight,
  PackageX } from
'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { Toaster, toast } from 'sonner';
type PageState = 'loading' | 'success' | 'error' | 'unavailable';
export function ServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>('loading');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPackage, setSelectedPackage] = useState('standard');
  const [addons, setAddons] = useState<string[]>([]);
  // Simulate loading
  useEffect(() => {
    setPageState('loading');
    const timer = setTimeout(() => {
      // Check for special demo IDs
      if (id === 'unavailable') {
        setPageState('unavailable');
      } else if (id === 'error') {
        setPageState('error');
        toast.error('Failed to load service details');
      } else {
        setPageState('success');
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [id]);
  // Mock data
  const service = {
    title: 'Mythic+ 20 Timed Run',
    rating: 4.9,
    reviews: 1240,
    deliveryTime: '45 min',
    image:
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1000',
    badges: ['Verified', 'Top Seller', 'Instant Delivery'],
    provider: {
      name: 'Shadowblade',
      rating: 5.0,
      completedJobs: 2400,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shadowblade'
    },
    packages: [
    {
      id: 'basic',
      name: 'Basic',
      price: 49,
      features: ['Key completion', 'Standard loot']
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 89,
      features: [
      'Timed guarantee',
      'Loot funnel (1 trader)',
      'Priority start']

    },
    {
      id: 'premium',
      name: 'Premium',
      price: 149,
      features: [
      'Timed guarantee',
      'Loot funnel (2 traders)',
      'VIP priority',
      'Stream included']

    }],

    addonsList: [
    {
      id: 'loot',
      name: 'Extra Loot Trader',
      price: 15
    },
    {
      id: 'exclusive',
      name: 'Exclusive Run (No other buyers)',
      price: 25
    },
    {
      id: 'timed',
      name: 'Specific Key Selection',
      price: 10
    },
    {
      id: 'extra',
      name: 'Live Stream',
      price: 20
    }]

  };
  const toggleAddon = (addonId: string) => {
    if (addons.includes(addonId)) {
      setAddons(addons.filter((a) => a !== addonId));
    } else {
      setAddons([...addons, addonId]);
    }
  };
  const currentPackage =
  service.packages.find((p) => p.id === selectedPackage) ||
  service.packages[0];
  const addonsTotal = addons.reduce((sum, addonId) => {
    const addon = service.addonsList.find((a) => a.id === addonId);
    return sum + (addon ? addon.price : 0);
  }, 0);
  const totalPrice = currentPackage.price + addonsTotal;
  const handleRetry = () => {
    setPageState('loading');
    toast.loading('Retrying...', {
      id: 'retry'
    });
    setTimeout(() => {
      setPageState('success');
      toast.success('Service loaded', {
        id: 'retry'
      });
    }, 1200);
  };
  // Loading Skeleton
  const LoadingSkeleton = () =>
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {/* Header skeleton */}
        <div>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((i) =>
          <Skeleton key={i} width={80} height={24} className="rounded" />
          )}
          </div>
          <Skeleton height={40} className="mb-4" />
          <div className="flex gap-6">
            <Skeleton width={100} height={20} />
            <Skeleton width={120} height={20} />
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="border-b border-white/10 pb-4">
          <div className="flex gap-8">
            {[1, 2, 3].map((i) =>
          <Skeleton key={i} width={80} height={20} />
          )}
          </div>
        </div>

        {/* Content skeleton */}
        <div className="space-y-4">
          <Skeleton height={20} />
          <Skeleton height={20} width="90%" />
          <Skeleton height={20} width="80%" />
          <div className="grid grid-cols-2 gap-4 mt-6">
            {[1, 2, 3, 4].map((i) =>
          <Skeleton key={i} height={24} />
          )}
          </div>
        </div>

        {/* Provider skeleton */}
        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6">
          <Skeleton width={150} height={24} className="mb-4" />
          <div className="flex items-center gap-4">
            <Skeleton variant="circular" width={48} height={48} />
            <div className="flex-1">
              <Skeleton width={120} height={20} className="mb-2" />
              <Skeleton width={180} height={16} />
            </div>
            <Skeleton width={100} height={36} className="rounded-lg" />
          </div>
        </div>
      </div>

      {/* Sidebar skeleton */}
      <div>
        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sticky top-24">
          <Skeleton width={150} height={24} className="mb-6" />
          <Skeleton width={100} height={16} className="mb-3" />
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[1, 2, 3].map((i) =>
          <Skeleton key={i} height={60} className="rounded-lg" />
          )}
          </div>
          <Skeleton width={80} height={16} className="mb-3" />
          {[1, 2, 3, 4].map((i) =>
        <Skeleton key={i} height={48} className="rounded-lg mb-2" />
        )}
          <div className="border-t border-white/10 pt-6 mt-6">
            <div className="flex justify-between mb-6">
              <Skeleton width={80} height={20} />
              <Skeleton width={60} height={32} />
            </div>
            <Skeleton height={48} className="rounded-lg mb-3" />
            <Skeleton height={48} className="rounded-lg" />
          </div>
        </div>
      </div>
    </div>;

  // Unavailable State
  const UnavailableState = () =>
  <div className="flex items-center justify-center min-h-[60vh]">
      <GlassCard className="max-w-md p-8 text-center border-purple-500/20">
        <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-6">
          <PackageX className="w-10 h-10 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Service Unavailable
        </h2>
        <p className="text-slate-400 mb-8">
          This legendary service is currently unavailable. Our champions are
          preparing for the next season.
        </p>
        <div className="space-y-3">
          <Button className="w-full" onClick={() => navigate('/catalog')}>
            View Similar Services
          </Button>
          <Button
          variant="ghost"
          className="w-full"
          onClick={() => navigate('/')}>

            Return to Home
          </Button>
        </div>
      </GlassCard>
    </div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <Toaster theme="dark" position="top-right" richColors />
      <Navbar />

      <main className="pt-24 pb-24">
        {/* Hero Background */}
        <div className="absolute top-0 left-0 right-0 h-[500px] overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 via-slate-900/80 to-slate-900" />
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: `url(${service.image})`
            }} />

        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-slate-400 mb-8">
            <span
              className="hover:text-white cursor-pointer"
              onClick={() => navigate('/catalog')}>

              Services
            </span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-white">Mythic+ Dungeons</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-white font-medium">{service.title}</span>
          </div>

          <AnimatePresence mode="wait">
            {pageState === 'loading' &&
            <motion.div
              key="loading"
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              exit={{
                opacity: 0
              }}>

                <LoadingSkeleton />
              </motion.div>
            }

            {pageState === 'error' &&
            <motion.div
              key="error"
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0
              }}
              className="py-16">

                <ErrorState
                title="Unable to load service"
                description="We couldn't fetch the service details. Please try again."
                onRetry={handleRetry}
                onSupport={() => toast.info('Opening support...')} />

              </motion.div>
            }

            {pageState === 'unavailable' &&
            <motion.div
              key="unavailable"
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0
              }}>

                <UnavailableState />
              </motion.div>
            }

            {pageState === 'success' &&
            <motion.div
              key="content"
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              exit={{
                opacity: 0
              }}>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* Header */}
                    <div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {service.badges.map((badge) =>
                      <span
                        key={badge}
                        className="bg-emperial-500/20 text-emperial-300 text-xs font-bold px-2 py-1 rounded border border-emperial-500/20">

                            {badge}
                          </span>
                      )}
                      </div>
                      <h1 className="text-4xl font-bold text-white mb-4">
                        {service.title}
                      </h1>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1 text-amber-400">
                          <Star className="w-4 h-4 fill-amber-400" />
                          <span className="font-bold">{service.rating}</span>
                          <span className="text-slate-500">
                            ({service.reviews} reviews)
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span>ETA: {service.deliveryTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-white/10">
                      <div className="flex gap-8">
                        {['Overview', 'Requirements', 'Reviews'].map((tab) =>
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === tab.toLowerCase() ? 'text-white' : 'text-slate-400 hover:text-white'}`}>

                            {tab}
                            {activeTab === tab.toLowerCase() &&
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-emperial-500" />

                        }
                          </button>
                      )}
                      </div>
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[300px]">
                      {activeTab === 'overview' &&
                    <motion.div
                      initial={{
                        opacity: 0
                      }}
                      animate={{
                        opacity: 1
                      }}
                      className="space-y-8">

                          <div className="prose prose-invert max-w-none">
                            <p className="text-slate-300 leading-relaxed">
                              Conquer the toughest dungeons in Azeroth with our
                              elite Mythic+ team. Whether you need a specific
                              key level for your weekly vault or are pushing for
                              Keystone Master, our veteran players will ensure a
                              smooth, timed run.
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                              {[
                          'Guaranteed Timed Run',
                          'Specific Dungeon Choice',
                          'Loot Trading Available',
                          'Self-play or Pilot'].
                          map((feature) =>
                          <li
                            key={feature}
                            className="flex items-center gap-2 text-slate-300">

                                  <Check className="w-4 h-4 text-emperial-500" />
                                  {feature}
                                </li>
                          )}
                            </ul>
                          </div>

                          <GlassCard className="p-6">
                            <h3 className="text-lg font-bold text-white mb-4">
                              Service Provider
                            </h3>
                            <div className="flex items-center gap-4">
                              <img
                            src={service.provider.avatar}
                            alt={service.provider.name}
                            className="w-12 h-12 rounded-full bg-slate-800" />

                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-white">
                                    {service.provider.name}
                                  </span>
                                  <ShieldCheck className="w-4 h-4 text-green-500" />
                                </div>
                                <div className="text-sm text-slate-400">
                                  {service.provider.completedJobs}+ jobs
                                  completed • {service.provider.rating} rating
                                </div>
                              </div>
                              <Button
                            variant="secondary"
                            size="sm"
                            className="ml-auto">

                                View Profile
                              </Button>
                            </div>
                          </GlassCard>
                        </motion.div>
                    }

                      {activeTab === 'requirements' &&
                    <motion.div
                      initial={{
                        opacity: 0
                      }}
                      animate={{
                        opacity: 1
                      }}>

                          <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-400">
                                1
                              </div>
                              <div>
                                <h4 className="font-bold text-white">
                                  Level 70 Character
                                </h4>
                                <p className="text-slate-400 text-sm">
                                  Must be max level on Dragonflight expansion.
                                </p>
                              </div>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-400">
                                2
                              </div>
                              <div>
                                <h4 className="font-bold text-white">
                                  Active Subscription
                                </h4>
                                <p className="text-slate-400 text-sm">
                                  World of Warcraft account must have active
                                  game time.
                                </p>
                              </div>
                            </li>
                          </ul>
                        </motion.div>
                    }

                      {activeTab === 'reviews' &&
                    <motion.div
                      initial={{
                        opacity: 0
                      }}
                      animate={{
                        opacity: 1
                      }}
                      className="space-y-4">

                          {[1, 2, 3].map((i) =>
                      <GlassCard key={i} className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                                    U{i}
                                  </div>
                                  <span className="font-bold text-white">
                                    User{i}
                                  </span>
                                </div>
                                <div className="flex text-amber-400">
                                  {[1, 2, 3, 4, 5].map((s) =>
                            <Star
                              key={s}
                              className="w-3 h-3 fill-amber-400" />

                            )}
                                </div>
                              </div>
                              <p className="text-slate-300 text-sm">
                                "Fast, efficient, and friendly. Got my loot and
                                rating in no time. Highly recommended!"
                              </p>
                            </GlassCard>
                      )}
                        </motion.div>
                    }
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    <GlassCard className="p-6 sticky top-24">
                      <h3 className="text-lg font-bold text-white mb-6">
                        Configure Order
                      </h3>

                      {/* Package Selection */}
                      <div className="space-y-3 mb-8">
                        <label className="text-sm font-medium text-slate-400">
                          Select Tier
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {service.packages.map((pkg) =>
                        <button
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg.id)}
                          className={`p-3 rounded-lg border text-center transition-all ${selectedPackage === pkg.id ? 'bg-emperial-500/20 border-emperial-500 text-white' : 'bg-slate-800/50 border-white/10 text-slate-400 hover:bg-slate-800'}`}>

                              <div className="text-sm font-bold">
                                {pkg.name}
                              </div>
                              <div className="text-xs opacity-80">
                                ${pkg.price}
                              </div>
                            </button>
                        )}
                        </div>
                        <ul className="text-xs text-slate-400 space-y-1 mt-2 pl-1">
                          {currentPackage.features.map((f) =>
                        <li key={f} className="flex items-center gap-1">
                              <Check className="w-3 h-3 text-emperial-500" />{' '}
                              {f}
                            </li>
                        )}
                        </ul>
                      </div>

                      {/* Add-ons */}
                      <div className="space-y-3 mb-8">
                        <label className="text-sm font-medium text-slate-400">
                          Add-ons
                        </label>
                        {service.addonsList.map((addon) =>
                      <label
                        key={addon.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-white/5 cursor-pointer hover:bg-slate-800/50 transition-colors">

                            <div className="flex items-center gap-3">
                              <input
                            type="checkbox"
                            checked={addons.includes(addon.id)}
                            onChange={() => toggleAddon(addon.id)}
                            className="w-4 h-4 rounded border-slate-600 text-emperial-500 focus:ring-emperial-500 bg-slate-700" />

                              <span className="text-sm text-slate-300">
                                {addon.name}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-white">
                              +${addon.price}
                            </span>
                          </label>
                      )}
                      </div>

                      {/* Total & CTA */}
                      <div className="border-t border-white/10 pt-6">
                        <div className="flex items-center justify-between mb-6">
                          <span className="text-slate-400">Total Price</span>
                          <span className="text-3xl font-bold text-white">
                            ${totalPrice}
                          </span>
                        </div>
                        <div className="space-y-3">
                          <Button
                          className="w-full"
                          size="lg"
                          onClick={() => navigate('/checkout')}>

                            Buy Now
                          </Button>
                          <Button
                          variant="secondary"
                          className="w-full"
                          size="lg">

                            Reserve Slot
                          </Button>
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500">
                          <ShieldCheck className="w-3 h-3" />
                          Secure Payment & Money-back Guarantee
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                </div>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>);

}