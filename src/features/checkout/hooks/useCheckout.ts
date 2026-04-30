import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCart } from '../../../context/CartContext';
import { createOrder } from '../../../services/orders.service';

export type PaymentState = 'idle' | 'processing' | 'success' | 'failed';

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
  const { items, clearCart } = useCart();
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [countdown, setCountdown] = useState(10);
  const [orderId, setOrderId] = useState('');
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
      navigate('/account/orders');
    }
  }, [paymentState, countdown, navigate]);

  const simulatePayment = async () => {
    if (paymentState === 'processing' || items.length === 0) return;
    setPaymentState('processing');
    toast.loading('Processing your order...', { id: 'payment' });

    try {
      const results = await Promise.all(
        items.map((item) =>
          createOrder({
            serviceId: item.serviceId,
            packageId: item.packageId,
            addonIds: item.addonIds,
          }),
        ),
      );
      clearCart();
      setOrderId(`#${results[0].id}`);
      setPaymentState('success');
      toast.success('Order confirmed!', { id: 'payment' });
    } catch {
      setPaymentState('failed');
      toast.error('Failed to place order. Please try again.', { id: 'payment' });
    }
  };

  const handleRetry = () => {
    setPaymentState('idle');
    setCountdown(10);
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
