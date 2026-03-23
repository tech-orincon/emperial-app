import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  AlertTriangle,
  ArrowRight } from
'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { Toaster, toast } from 'sonner';
type PaymentState = 'idle' | 'processing' | 'pending' | 'success' | 'failed';
export function CheckoutPage() {
  const navigate = useNavigate();
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [countdown, setCountdown] = useState(10);
  const [orderId] = useState(`EMP-${Math.floor(10000 + Math.random() * 90000)}`);
  // Form state (preserved on failure)
  const [formData, setFormData] = useState({
    characterName: '',
    realm: '',
    region: 'North America (US)',
    faction: '',
    notes: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });
  // Countdown timer for success state
  useEffect(() => {
    if (paymentState === 'success' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (paymentState === 'success' && countdown === 0) {
      navigate(`/account/orders/${orderId}`);
    }
  }, [paymentState, countdown, navigate, orderId]);
  const simulatePayment = () => {
    // Prevent multiple submissions
    if (paymentState === 'processing' || paymentState === 'pending') return;
    setPaymentState('processing');
    toast.loading('Processing your payment...', {
      id: 'payment'
    });
    // Simulate processing delay
    setTimeout(() => {
      setPaymentState('pending');
      toast.loading('Verifying payment...', {
        id: 'payment'
      });
      // Simulate verification (randomly succeed or fail for demo)
      setTimeout(() => {
        const success = Math.random() > 0.3; // 70% success rate for demo
        if (success) {
          setPaymentState('success');
          toast.success('Payment successful! Order confirmed.', {
            id: 'payment'
          });
        } else {
          setPaymentState('failed');
          toast.error('Payment failed. Please try again.', {
            id: 'payment'
          });
        }
      }, 2000);
    }, 2000);
  };
  const handleRetry = () => {
    setPaymentState('idle');
    toast.dismiss();
  };
  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  // Success State
  if (paymentState === 'success') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-50">
        <Toaster theme="dark" position="top-right" richColors />
        <Navbar />
        <main className="pt-32 pb-24 flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              type: 'spring',
              damping: 20
            }}>
            
            <GlassCard className="max-w-md w-full p-8 text-center">
              <motion.div
                initial={{
                  scale: 0
                }}
                animate={{
                  scale: 1
                }}
                transition={{
                  type: 'spring',
                  damping: 15,
                  delay: 0.2
                }}
                className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                
                <motion.div
                  initial={{
                    scale: 0
                  }}
                  animate={{
                    scale: 1
                  }}
                  transition={{
                    type: 'spring',
                    damping: 10,
                    delay: 0.4
                  }}>
                  
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: 0.3
                }}>
                
                <h1 className="text-2xl font-bold text-white mb-2">
                  Order Confirmed!
                </h1>
                <p className="text-slate-400 mb-2">
                  Your order has been placed successfully.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emperial-500/10 border border-emperial-500/20 text-emperial-300 text-sm font-mono mb-6">
                  {orderId}
                </div>
                <p className="text-slate-500 text-sm mb-8">
                  A booster will be assigned shortly. You'll receive a
                  notification when they're ready.
                </p>
              </motion.div>

              <div className="space-y-3">
                <Button
                  className="w-full group"
                  onClick={() => navigate(`/account/orders/${orderId}`)}>
                  
                  View My Orders
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate('/catalog')}>
                  
                  Return to Catalog
                </Button>
              </div>

              {/* Auto-redirect countdown */}
              <motion.div
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: 1
                }}
                transition={{
                  delay: 0.5
                }}
                className="mt-6 pt-6 border-t border-white/10">
                
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                  <Clock className="w-4 h-4" />
                  <span>Redirecting to orders in {countdown}s</span>
                </div>
                <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-emperial-500"
                    initial={{
                      width: '100%'
                    }}
                    animate={{
                      width: '0%'
                    }}
                    transition={{
                      duration: 10,
                      ease: 'linear'
                    }} />
                  
                </div>
              </motion.div>
            </GlassCard>
          </motion.div>
        </main>
        <Footer />
      </div>);

  }
  // Failed State
  if (paymentState === 'failed') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-50">
        <Toaster theme="dark" position="top-right" richColors />
        <Navbar />
        <main className="pt-32 pb-24 flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              type: 'spring',
              damping: 20
            }}>
            
            <GlassCard className="max-w-md w-full p-8 text-center border-red-500/30">
              <motion.div
                initial={{
                  scale: 0
                }}
                animate={{
                  scale: 1
                }}
                transition={{
                  type: 'spring',
                  damping: 15
                }}
                className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                
                <XCircle className="w-10 h-10 text-red-500" />
              </motion.div>

              <h1 className="text-2xl font-bold text-white mb-2">
                Payment Failed
              </h1>
              <p className="text-slate-400 mb-6">
                We couldn't process your payment. Please check your card details
                and try again.
              </p>

              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-6 text-left">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-red-300 font-medium mb-1">
                      Common issues:
                    </p>
                    <ul className="text-slate-400 space-y-1">
                      <li>• Insufficient funds</li>
                      <li>• Incorrect card details</li>
                      <li>• Card declined by bank</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full" onClick={handleRetry}>
                  Try Again
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate('/catalog')}>
                  
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
      </div>);

  }
  // Processing/Pending Overlay
  const ProcessingOverlay = () =>
  <AnimatePresence>
      {(paymentState === 'processing' || paymentState === 'pending') &&
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      exit={{
        opacity: 0
      }}
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
      
          <motion.div
        initial={{
          scale: 0.9,
          opacity: 0
        }}
        animate={{
          scale: 1,
          opacity: 1
        }}
        exit={{
          scale: 0.9,
          opacity: 0
        }}>
        
            <GlassCard className="p-8 text-center max-w-sm">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <motion.div
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear'
              }}
              className="absolute inset-0">
              
                  <Loader2 className="w-16 h-16 text-emperial-500" />
                </motion.div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {paymentState === 'processing' ?
            'Processing Payment' :
            'Verifying Payment'}
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                {paymentState === 'processing' ?
            'Please wait while we process your order...' :
            'Almost there! Confirming with your bank...'}
              </p>

              {/* Progress steps */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <div
              className={`w-2 h-2 rounded-full ${paymentState === 'processing' ? 'bg-emperial-500 animate-pulse' : 'bg-green-500'}`} />
            
                <div
              className={`w-8 h-0.5 ${paymentState === 'pending' ? 'bg-emperial-500' : 'bg-slate-700'}`} />
            
                <div
              className={`w-2 h-2 rounded-full ${paymentState === 'pending' ? 'bg-emperial-500 animate-pulse' : 'bg-slate-700'}`} />
            
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
    }
    </AnimatePresence>;

  // Main Checkout Form (idle state)
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <Toaster theme="dark" position="top-right" richColors />
      <ProcessingOverlay />
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Character Details */}
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-emperial-500/20 flex items-center justify-center text-emperial-400 font-bold">
                    1
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Character Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">
                      Character Name
                    </label>
                    <input
                      type="text"
                      value={formData.characterName}
                      onChange={(e) =>
                      updateFormData('characterName', e.target.value)
                      }
                      className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500"
                      placeholder="e.g. Arthas" />
                    
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">
                      Realm
                    </label>
                    <select
                      value={formData.realm}
                      onChange={(e) => updateFormData('realm', e.target.value)}
                      className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500">
                      
                      <option value="">Select Realm</option>
                      <option value="illidan">Illidan (US)</option>
                      <option value="stormrage">Stormrage (US)</option>
                      <option value="area52">Area 52 (US)</option>
                      <option value="kazzak">Kazzak (EU)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">
                      Region
                    </label>
                    <select
                      value={formData.region}
                      onChange={(e) => updateFormData('region', e.target.value)}
                      className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500">
                      
                      <option>North America (US)</option>
                      <option>Europe (EU)</option>
                      <option>Asia (KR/TW)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">
                      Faction
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="faction"
                          value="horde"
                          checked={formData.faction === 'horde'}
                          onChange={(e) =>
                          updateFormData('faction', e.target.value)
                          }
                          className="text-emperial-500 focus:ring-emperial-500 bg-slate-800" />
                        
                        <span className="text-slate-300">Horde</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="faction"
                          value="alliance"
                          checked={formData.faction === 'alliance'}
                          onChange={(e) =>
                          updateFormData('faction', e.target.value)
                          }
                          className="text-emperial-500 focus:ring-emperial-500 bg-slate-800" />
                        
                        <span className="text-slate-300">Alliance</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">
                    Preferred Schedule / Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => updateFormData('notes', e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500 h-24"
                    placeholder="When are you available? Any specific requests?" />
                  
                </div>
              </GlassCard>

              {/* Payment */}
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-emperial-500/20 flex items-center justify-center text-emperial-400 font-bold">
                    2
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Payment Method
                  </h2>
                </div>

                <div className="p-4 rounded-lg border border-emperial-500/30 bg-emperial-500/5 mb-6">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-emperial-500" />
                    <span className="text-sm text-slate-300">
                      Payments are secure and encrypted.
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">
                      Card Information
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="text"
                        value={formData.cardNumber}
                        onChange={(e) =>
                        updateFormData('cardNumber', e.target.value)
                        }
                        className="w-full bg-slate-800 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500"
                        placeholder="Card number" />
                      
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={formData.expiry}
                      onChange={(e) => updateFormData('expiry', e.target.value)}
                      className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500"
                      placeholder="MM / YY" />
                    
                    <input
                      type="text"
                      value={formData.cvc}
                      onChange={(e) => updateFormData('cvc', e.target.value)}
                      className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500"
                      placeholder="CVC" />
                    
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Right Column - Summary */}
            <div className="space-y-6">
              <GlassCard className="p-6 sticky top-24">
                <h3 className="text-lg font-bold text-white mb-6">
                  Order Summary
                </h3>

                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=200"
                    alt="Service"
                    className="w-16 h-16 rounded-lg object-cover" />
                  
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      Mythic+ 20 Timed Run
                    </h4>
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
                  onClick={simulatePayment}
                  disabled={paymentState !== 'idle'}>
                  
                  {paymentState === 'idle' ? 'Pay Now' : 'Processing...'}
                </Button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-3 h-3" />
                  100% Money-back Guarantee
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>);

}