import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Breadcrumb } from './components/Breadcrumb';
import { GameSelector } from './components/GameSelector';
import { CategoryGrid } from './components/CategoryGrid';
import { ServiceGrid } from './components/ServiceGrid';
import {
  Skeleton,
  SkeletonCategoryCard,
  SkeletonServiceCard } from
'../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
type LoadingState = 'loading' | 'success' | 'error' | 'empty';
export function CatalogPage() {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState('wow');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [showEmptyDemo, setShowEmptyDemo] = useState(false);
  // Simulate loading on mount and category change
  useEffect(() => {
    setLoadingState('loading');
    const timer = setTimeout(() => {
      // Simulate random states for demo (90% success, 5% error, 5% empty when filtered)
      const random = Math.random();
      if (random < 0.05) {
        setLoadingState('error');
        toast.error('Failed to load services');
      } else {
        setLoadingState('success');
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [selectedCategory]);
  const handleReset = () => {
    setSelectedGame('wow');
    setSelectedCategory(null);
    setShowEmptyDemo(false);
  };
  const handleRetry = () => {
    setLoadingState('loading');
    toast.loading('Retrying...', {
      id: 'retry'
    });
    setTimeout(() => {
      setLoadingState('success');
      toast.success('Services loaded successfully', {
        id: 'retry'
      });
    }, 1500);
  };
  const handleResetFilters = () => {
    setShowEmptyDemo(false);
    setLoadingState('loading');
    setTimeout(() => setLoadingState('success'), 800);
  };
  // Loading skeleton grid
  const LoadingSkeleton = () =>
  <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton width={200} height={32} className="mb-2" />
          <Skeleton width={150} height={20} />
        </div>
        <div className="flex gap-3">
          <Skeleton width={100} height={40} className="rounded-lg" />
          <Skeleton width={140} height={40} className="rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) =>
      <motion.div
        key={i}
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: i * 0.1
        }}>
        
            {selectedCategory ?
        <SkeletonServiceCard /> :

        <SkeletonCategoryCard />
        }
          </motion.div>
      )}
      </div>
    </div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 selection:bg-emperial-500/30 selection:text-white">
      <Toaster theme="dark" position="top-right" richColors />
      <Navbar />

      <main className="pt-24 pb-24 min-h-screen">
        {/* Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emperial-500/5 rounded-full blur-[120px] opacity-30" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            game="World of Warcraft"
            category={
            selectedCategory ?
            selectedCategory === 'mythic-plus' ?
            'Mythic+ Dungeons' :
            selectedCategory === 'raids' ?
            'Raid Carries' :
            selectedCategory === 'gold' ?
            'Gold & Currency' :
            'Services' :
            null
            }
            onReset={handleReset}
            onClearCategory={() => setSelectedCategory(null)} />
          

          <GameSelector
            selectedGame={selectedGame}
            onSelectGame={setSelectedGame} />
          

          <AnimatePresence mode="wait">
            {loadingState === 'loading' &&
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

            {loadingState === 'error' &&
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
                title="Unable to load services"
                description="We couldn't fetch the available services. This might be a temporary issue."
                onRetry={handleRetry}
                onSupport={() => toast.info('Opening support chat...')} />
              
              </motion.div>
            }

            {loadingState === 'success' && showEmptyDemo &&
            <motion.div
              key="empty"
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
              
                <EmptyState
                variant="search"
                title="No quests found in this realm"
                description="Your search filters returned no results. Try adjusting your criteria or explore all available services."
                primaryAction={{
                  label: 'Reset Filters',
                  onClick: handleResetFilters
                }}
                secondaryAction={{
                  label: 'Browse All Services',
                  onClick: () => {
                    setSelectedCategory(null);
                    setShowEmptyDemo(false);
                  }
                }} />
              
              </motion.div>
            }

            {loadingState === 'success' &&
            !showEmptyDemo &&
            !selectedCategory &&
            <motion.div
              key="categories"
              initial={{
                opacity: 0,
                x: -20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              exit={{
                opacity: 0,
                x: 20
              }}
              transition={{
                duration: 0.3
              }}>
              
                  <CategoryGrid onSelectCategory={setSelectedCategory} />
                </motion.div>
            }

            {loadingState === 'success' &&
            !showEmptyDemo &&
            selectedCategory &&
            <motion.div
              key="services"
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              exit={{
                opacity: 0,
                x: -20
              }}
              transition={{
                duration: 0.3
              }}>
              
                  <ServiceGrid category={selectedCategory} />
                </motion.div>
            }
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>);

}