import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { PaymentState } from '../hooks/useCheckout';

interface OrderSummaryProps {
  paymentState: PaymentState;
  onPay: () => void;
}

export function OrderSummary({ paymentState, onPay }: OrderSummaryProps) {
  return (
    <GlassCard className="p-6 sticky top-24">
      <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>

      <div className="flex items-start gap-4 mb-6 pb-6 border-b border-white/10">
        <img
          src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=200"
          alt="Service"
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div>
          <h4 className="font-bold text-white text-sm">Mythic+ 20 Timed Run</h4>
          <p className="text-slate-400 text-xs">Standard Package</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Base Price</span>
          <span className="text-white">$89.00</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Loot Funnel</span>
          <span className="text-white">$15.00</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Service Fee</span>
          <span className="text-white">$2.50</span>
        </div>
        <div className="pt-3 border-t border-white/10 flex justify-between font-bold">
          <span className="text-white">Total</span>
          <span className="text-emperial-400">$106.50</span>
        </div>
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={onPay}
        disabled={paymentState !== 'idle'}>
        {paymentState === 'idle' ? 'Pay Now' : 'Processing...'}
      </Button>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="w-3 h-3" />
        100% Money-back Guarantee
      </div>
    </GlassCard>
  );
}
