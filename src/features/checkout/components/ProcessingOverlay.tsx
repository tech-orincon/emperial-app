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
      {paymentState === 'processing' && (
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

              <h3 className="text-xl font-bold text-white mb-2">Processing Order</h3>
              <p className="text-slate-400 text-sm mb-4">
                Please wait while we place your order...
              </p>

              <p className="text-xs text-slate-500 mt-6">
                <Lock className="w-3 h-3 inline mr-1" />
                Secure connection
              </p>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
