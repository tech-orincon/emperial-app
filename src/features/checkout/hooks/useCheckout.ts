import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export type PaymentState = 'idle' | 'processing' | 'pending' | 'success' | 'failed';

export interface CheckoutFormData {
  characterName: string;
  realm: string;
  region: string;
  faction: string;
  notes: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

export function useCheckout() {
  const navigate = useNavigate();
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [countdown, setCountdown] = useState(10);
  const [orderId] = useState(`EMP-${Math.floor(10000 + Math.random() * 90000)}`);
  const [formData, setFormData] = useState<CheckoutFormData>({
    characterName: '',
    realm: '',
    region: 'North America (US)',
    faction: '',
    notes: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  useEffect(() => {
    if (paymentState === 'success' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (paymentState === 'success' && countdown === 0) {
      navigate(`/account/orders/${orderId}`);
    }
  }, [paymentState, countdown, navigate, orderId]);

  const simulatePayment = () => {
    if (paymentState === 'processing' || paymentState === 'pending') return;
    setPaymentState('processing');
    toast.loading('Processing your payment...', { id: 'payment' });

    setTimeout(() => {
      setPaymentState('pending');
      toast.loading('Verifying payment...', { id: 'payment' });

      setTimeout(() => {
        const success = Math.random() > 0.3;
        if (success) {
          setPaymentState('success');
          toast.success('Payment successful! Order confirmed.', { id: 'payment' });
        } else {
          setPaymentState('failed');
          toast.error('Payment failed. Please try again.', { id: 'payment' });
        }
      }, 2000);
    }, 2000);
  };

  const handleRetry = () => {
    setPaymentState('idle');
    toast.dismiss();
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    paymentState,
    countdown,
    orderId,
    formData,
    simulatePayment,
    handleRetry,
    updateFormData,
  };
}
