import React from 'react';
import { Toaster } from 'sonner';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useCheckout } from './hooks/useCheckout';
import { CheckoutSuccessView } from './views/CheckoutSuccessView';
import { CheckoutFailedView } from './views/CheckoutFailedView';
import { ProcessingOverlay } from './components/ProcessingOverlay';
import { CharacterDetailsForm } from './components/CharacterDetailsForm';
import { PaymentForm } from './components/PaymentForm';
import { OrderSummary } from './components/OrderSummary';

export function CheckoutPage() {
  const { paymentState, countdown, orderId, formData, simulatePayment, handleRetry, updateFormData } =
    useCheckout();

  if (paymentState === 'success') {
    return (
      <>
        <Toaster theme="dark" position="top-right" richColors />
        <CheckoutSuccessView orderId={orderId} countdown={countdown} />
      </>
    );
  }

  if (paymentState === 'failed') {
    return (
      <>
        <Toaster theme="dark" position="top-right" richColors />
        <CheckoutFailedView onRetry={handleRetry} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <Toaster theme="dark" position="top-right" richColors />
      <ProcessingOverlay paymentState={paymentState} />
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <CharacterDetailsForm formData={formData} onUpdate={updateFormData} />
              <PaymentForm formData={formData} onUpdate={updateFormData} />
            </div>

            <div className="space-y-6">
              <OrderSummary paymentState={paymentState} onPay={simulatePayment} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
