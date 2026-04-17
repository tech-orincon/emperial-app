import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { Button } from '../../../components/ui/Button';
import { GlassCard } from '../../../components/ui/GlassCard';

interface CheckoutSuccessViewProps {
  orderId: string;
  countdown: number;
}

export function CheckoutSuccessView({ orderId, countdown }: CheckoutSuccessViewProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <Navbar />
      <main className="pt-32 pb-24 flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20 }}>
          <GlassCard className="max-w-md w-full p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15, delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10, delay: 0.4 }}>
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}>
              <h1 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h1>
              <p className="text-slate-400 mb-2">Your order has been placed successfully.</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emperial-500/10 border border-emperial-500/20 text-emperial-300 text-sm font-mono mb-6">
                {orderId}
              </div>
              <p className="text-slate-500 text-sm mb-8">
                A booster will be assigned shortly. You'll receive a notification when they're ready.
              </p>
            </motion.div>

            <div className="space-y-3">
              <Button className="w-full group" onClick={() => navigate(`/account/orders/${orderId}`)}>
                View My Orders
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => navigate('/catalog')}>
                Return to Catalog
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                <span>Redirecting to orders in {countdown}s</span>
              </div>
              <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emperial-500"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 10, ease: 'linear' }}
                />
              </div>
            </motion.div>
          </GlassCard>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
