import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Lock } from 'lucide-react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { PaymentState } from '../hooks/useCheckout';

interface ProcessingOverlayProps {
  paymentState: PaymentState;
}

export function ProcessingOverlay({ paymentState }: ProcessingOverlayProps) {
  return (
    <AnimatePresence>
      {(paymentState === 'processing' || paymentState === 'pending') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}>
            <GlassCard className="p-8 text-center max-w-sm">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0">
                  <Loader2 className="w-16 h-16 text-emperial-500" />
                </motion.div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {paymentState === 'processing' ? 'Processing Payment' : 'Verifying Payment'}
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                {paymentState === 'processing'
                  ? 'Please wait while we process your order...'
                  : 'Almost there! Confirming with your bank...'}
              </p>

              <div className="flex items-center justify-center gap-2 mt-4">
                <div
                  className={`w-2 h-2 rounded-full ${
                    paymentState === 'processing' ? 'bg-emperial-500 animate-pulse' : 'bg-green-500'
                  }`}
                />
                <div
                  className={`w-8 h-0.5 ${
                    paymentState === 'pending' ? 'bg-emperial-500' : 'bg-slate-700'
                  }`}
                />
                <div
                  className={`w-2 h-2 rounded-full ${
                    paymentState === 'pending' ? 'bg-emperial-500 animate-pulse' : 'bg-slate-700'
                  }`}
                />
                <div className="w-8 h-0.5 bg-slate-700" />
                <div className="w-2 h-2 rounded-full bg-slate-700" />
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-2 px-2">
                <span>Processing</span>
                <span>Verifying</span>
                <span>Complete</span>
              </div>

              <p className="text-xs text-slate-500 mt-6">
                <Lock className="w-3 h-3 inline mr-1" />
                Secure payment powered by Stripe
              </p>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
