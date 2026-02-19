import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { SkeletonOrderRow } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Search, Filter } from 'lucide-react';
import { Toaster, toast } from 'sonner';
type PageState = 'loading' | 'success' | 'error' | 'empty';
export function OrdersPage() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>('loading');
  const [showEmpty, setShowEmpty] = useState(false);
  const orders = [
  {
    id: 'EMP-12345',
    service: 'Mythic+ 20 Timed Run',
    status: 'In Progress',
    provider: 'Shadowblade',
    progress: 60,
    date: 'Oct 24, 2023'
  },
  {
    id: 'EMP-12346',
    service: 'Amirdrassil Heroic Clear',
    status: 'Completed',
    provider: 'Frostmage',
    progress: 100,
    date: 'Oct 20, 2023'
  },
  {
    id: 'EMP-12347',
    service: '1 Million Gold',
    status: 'Queued',
    provider: 'Pending',
    progress: 0,
    date: 'Oct 25, 2023'
  }];

  useEffect(() => {
    setPageState('loading');
    const timer = setTimeout(() => {
      if (showEmpty) {
        setPageState('empty');
      } else {
        setPageState('success');
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [showEmpty]);
  const handleRetry = () => {
    setPageState('loading');
    toast.loading('Loading orders...', {
      id: 'retry'
    });
    setTimeout(() => {
      setPageState('success');
      toast.success('Orders loaded', {
        id: 'retry'
      });
    }, 1200);
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'In Progress':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Queued':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      default:
        return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <Toaster theme="dark" position="top-right" richColors />
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl font-bold text-white">My Orders</h1>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="bg-slate-800 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emperial-500 w-64" />

              </div>
              <Button
                variant="secondary"
                size="sm"
                className="flex items-center gap-2">

                <Filter className="w-4 h-4" /> Filter
              </Button>
            </div>
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
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {[1, 2, 3].map((i) =>
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

                    <SkeletonOrderRow />
                  </motion.div>
              )}
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
                title="Unable to load orders"
                description="We couldn't fetch your order history. Please try again."
                onRetry={handleRetry} />

              </motion.div>
            }

            {pageState === 'empty' &&
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
                variant="orders"
                title="No quests in your journal"
                description="You haven't placed any orders yet. Browse our services and start your adventure!"
                primaryAction={{
                  label: 'Browse Services',
                  onClick: () => navigate('/catalog')
                }} />

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
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {orders.map((order, index) =>
              <motion.div
                key={order.id}
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
                }}>

                    <GlassCard hoverEffect className="p-6 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div
                      className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(order.status)}`}>

                          {order.status}
                        </div>
                        <span className="text-xs text-slate-500">
                          {order.date}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-1">
                        {order.service}
                      </h3>
                      <p className="text-sm text-slate-400 mb-6">
                        Order #{order.id}
                      </p>

                      <div className="mt-auto">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-white font-bold">
                            {order.progress}%
                          </span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-6">
                          <motion.div
                        className="h-full bg-emperial-500"
                        initial={{
                          width: 0
                        }}
                        animate={{
                          width: `${order.progress}%`
                        }}
                        transition={{
                          duration: 1,
                          delay: index * 0.1
                        }} />

                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white">
                              {order.provider.charAt(0)}
                            </div>
                            <span className="text-sm text-slate-300">
                              {order.provider}
                            </span>
                          </div>
                          <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                        navigate(`/account/orders/${order.id}`)
                        }>

                            View Details
                          </Button>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
              )}
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>);

}