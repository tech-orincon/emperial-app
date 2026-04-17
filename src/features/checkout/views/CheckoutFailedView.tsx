import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, AlertTriangle } from 'lucide-react';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { Button } from '../../../components/ui/Button';
import { GlassCard } from '../../../components/ui/GlassCard';

interface CheckoutFailedViewProps {
  onRetry: () => void;
}

export function CheckoutFailedView({ onRetry }: CheckoutFailedViewProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <Navbar />
      <main className="pt-32 pb-24 flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20 }}>
          <GlassCard className="max-w-md w-full p-8 text-center border-red-500/30">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-500" />
            </motion.div>

            <h1 className="text-2xl font-bold text-white mb-2">Payment Failed</h1>
            <p className="text-slate-400 mb-6">
              We couldn't process your payment. Please check your card details and try again.
            </p>

            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-6 text-left">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-red-300 font-medium mb-1">Common issues:</p>
                  <ul className="text-slate-400 space-y-1">
                    <li>• Insufficient funds</li>
                    <li>• Incorrect card details</li>
                    <li>• Card declined by bank</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full" onClick={onRetry}>
                Try Again
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => navigate('/catalog')}>
                Cancel Order
              </Button>
            </div>

            <p className="mt-6 text-xs text-slate-500">
              Your information has been saved. Need help?{' '}
              <a href="#" className="text-emperial-400 hover:underline">
                Contact support
              </a>
            </p>
          </GlassCard>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
