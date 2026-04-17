import React from 'react';
import { Lock, CreditCard } from 'lucide-react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { CheckoutFormData } from '../hooks/useCheckout';

interface PaymentFormProps {
  formData: CheckoutFormData;
  onUpdate: (field: string, value: string) => void;
}

export function PaymentForm({ formData, onUpdate }: PaymentFormProps) {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-emperial-500/20 flex items-center justify-center text-emperial-400 font-bold">
          2
        </div>
        <h2 className="text-xl font-bold text-white">Payment Method</h2>
      </div>

      <div className="p-4 rounded-lg border border-emperial-500/30 bg-emperial-500/5 mb-6">
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-emperial-500" />
          <span className="text-sm text-slate-300">Payments are secure and encrypted.</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Card Information</label>
          <div className="relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={formData.cardNumber}
              onChange={(e) => onUpdate('cardNumber', e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500"
              placeholder="Card number"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={formData.expiry}
            onChange={(e) => onUpdate('expiry', e.target.value)}
            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500"
            placeholder="MM / YY"
          />
          <input
            type="text"
            value={formData.cvc}
            onChange={(e) => onUpdate('cvc', e.target.value)}
            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500"
            placeholder="CVC"
          />
        </div>
      </div>
    </GlassCard>
  );
}
