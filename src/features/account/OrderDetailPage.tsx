import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { Modal } from '../../components/ui/Modal';
import { Skeleton, SkeletonTimeline } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import {
  ChevronRight,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Shield } from
'lucide-react';
import { Toaster, toast } from 'sonner';
type PageState = 'loading' | 'success' | 'error';
export function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>('loading');
  // Modal states
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  // Form states
  const [issueType, setIssueType] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [refundConfirmed, setRefundConfirmed] = useState(false);
  // Order states
  const [issueReported, setIssueReported] = useState(false);
  const [refundRequested, setRefundRequested] = useState(false);
  useEffect(() => {
    setPageState('loading');
    const timer = setTimeout(() => {
      if (id === 'error') {
        setPageState('error');
        toast.error('Failed to load order details');
      } else {
        setPageState('success');
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [id]);
  const handleRetry = () => {
    setPageState('loading');
    toast.loading('Loading order...', {
      id: 'retry'
    });
    setTimeout(() => {
      setPageState('success');
      toast.success('Order loaded', {
        id: 'retry'
      });
    }, 1200);
  };
  const handleReportIssue = () => {
    if (!issueType || !issueDescription.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setIssueReported(true);
    setIsReportModalOpen(false);
    toast.success('Issue successfully reported');
    // Reset form
    setIssueType('');
    setIssueDescription('');
  };
  const handleRequestRefund = () => {
    if (!refundReason || !refundConfirmed) {
      toast.error('Please complete all fields');
      return;
    }
    setRefundRequested(true);
    setIsRefundModalOpen(false);
    toast.success('Refund request submitted');
    // Reset form
    setRefundReason('');
    setRefundConfirmed(false);
  };
  // Loading Skeleton
  const LoadingSkeleton = () =>
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <GlassCard className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <Skeleton height={28} className="mb-2" />
              <Skeleton width="60%" height={18} />
            </div>
            <Skeleton width={100} height={28} className="rounded-full" />
          </div>
          <div className="border-t border-white/10 py-6">
            <Skeleton width={100} height={20} className="mb-4" />
            <SkeletonTimeline />
          </div>
        </GlassCard>
      </div>
      <div className="space-y-6">
        <GlassCard className="p-6">
          <Skeleton width={150} height={20} className="mb-4" />
          <div className="flex items-center gap-4 mb-6">
            <Skeleton variant="circular" width={48} height={48} />
            <div className="flex-1">
              <Skeleton width={100} height={18} className="mb-1" />
              <Skeleton width={80} height={14} />
            </div>
          </div>
          <Skeleton height={44} className="rounded-lg" />
        </GlassCard>
      </div>
    </div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <Toaster theme="dark" position="top-right" richColors />
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-slate-400 mb-8">
            <span
              className="hover:text-white cursor-pointer"
              onClick={() => navigate('/account/orders')}>
              
              My Orders
            </span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-white font-medium">Order #{id}</span>
          </div>

          <AnimatePresence mode="wait">
            {pageState === 'loading' &&
            <motion.div
              key="loading"
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              exit={{
                opacity: 0
              }}>
              
                <LoadingSkeleton />
              </motion.div>
            }

            {pageState === 'error' &&
            <motion.div
              key="error"
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0
              }}
              className="py-16">
              
                <ErrorState
                title="Unable to load order details"
                description="We couldn't fetch the details for this order. Please try again."
                onRetry={handleRetry} />
              
              </motion.div>
            }

            {pageState === 'success' &&
            <motion.div
              key="content"
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              exit={{
                opacity: 0
              }}>
              
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Details */}
                  <div className="lg:col-span-2 space-y-6">
                    <GlassCard className="p-6">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h1 className="text-2xl font-bold text-white mb-2">
                            Mythic+ 20 Timed Run
                          </h1>
                          <p className="text-slate-400">
                            Order #{id} • Placed on Oct 24, 2023
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div
                          className={`px-3 py-1 rounded-full font-bold text-sm ${refundRequested ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'}`}>
                          
                            {refundRequested ?
                          'Refund Requested' :
                          'In Progress'}
                          </div>
                          {issueReported &&
                        <div className="px-2 py-0.5 rounded text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-400">
                              Issue Reported
                            </div>
                        }
                        </div>
                      </div>

                      <div className="border-t border-white/10 py-6">
                        <h3 className="font-bold text-white mb-4">Timeline</h3>
                        <div className="space-y-6 relative pl-4 border-l-2 border-slate-800 ml-2">
                          <motion.div
                          className="relative"
                          initial={{
                            opacity: 0,
                            x: -10
                          }}
                          animate={{
                            opacity: 1,
                            x: 0
                          }}
                          transition={{
                            delay: 0.1
                          }}>
                          
                            <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-green-500 border-2 border-slate-900" />
                            <h4 className="text-white font-medium">
                              Order Placed
                            </h4>
                            <p className="text-sm text-slate-500">
                              Oct 24, 10:30 AM
                            </p>
                          </motion.div>
                          <motion.div
                          className="relative"
                          initial={{
                            opacity: 0,
                            x: -10
                          }}
                          animate={{
                            opacity: 1,
                            x: 0
                          }}
                          transition={{
                            delay: 0.2
                          }}>
                          
                            <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-green-500 border-2 border-slate-900" />
                            <h4 className="text-white font-medium">
                              Booster Assigned
                            </h4>
                            <p className="text-sm text-slate-500">
                              Oct 24, 10:45 AM
                            </p>
                          </motion.div>
                          <motion.div
                          className="relative"
                          initial={{
                            opacity: 0,
                            x: -10
                          }}
                          animate={{
                            opacity: 1,
                            x: 0
                          }}
                          transition={{
                            delay: 0.3
                          }}>
                          
                            <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-blue-500 border-2 border-slate-900 animate-pulse" />
                            <h4 className="text-white font-medium">
                              Service In Progress
                            </h4>
                            <p className="text-sm text-slate-500">
                              Currently active
                            </p>
                          </motion.div>
                          <motion.div
                          className="relative opacity-50"
                          initial={{
                            opacity: 0,
                            x: -10
                          }}
                          animate={{
                            opacity: 0.5,
                            x: 0
                          }}
                          transition={{
                            delay: 0.4
                          }}>
                          
                            <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-slate-700 border-2 border-slate-900" />
                            <h4 className="text-white font-medium">
                              Completion
                            </h4>
                            <p className="text-sm text-slate-500">
                              Estimated: Oct 24, 2:00 PM
                            </p>
                          </motion.div>
                        </div>
                      </div>

                      <div className="border-t border-white/10 pt-6">
                        <h3 className="font-bold text-white mb-4">
                          Order Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="block text-slate-500 mb-1">
                              Character
                            </span>
                            <span className="text-white">
                              Arthas - Illidan (US)
                            </span>
                          </div>
                          <div>
                            <span className="block text-slate-500 mb-1">
                              Package
                            </span>
                            <span className="text-white">Standard</span>
                          </div>
                          <div>
                            <span className="block text-slate-500 mb-1">
                              Add-ons
                            </span>
                            <span className="text-white">Loot Funnel</span>
                          </div>
                          <div>
                            <span className="block text-slate-500 mb-1">
                              Total Paid
                            </span>
                            <span className="text-white">$106.50</span>
                          </div>
                        </div>
                      </div>
                    </GlassCard>

                    <GlassCard className="p-6">
                      <h3 className="font-bold text-white mb-4">
                        Notes & Requirements
                      </h3>
                      <div className="bg-slate-800/50 rounded-lg p-4 text-sm text-slate-300">
                        "I'm available after 6PM EST. Please message me on
                        Discord before starting."
                      </div>
                    </GlassCard>
                  </div>

                  {/* Right Column - Provider & Actions */}
                  <div className="space-y-6">
                    <GlassCard className="p-6">
                      <h3 className="font-bold text-white mb-4">
                        Assigned Provider
                      </h3>
                      <div className="flex items-center gap-4 mb-6">
                        <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Shadowblade"
                        alt="Provider"
                        className="w-12 h-12 rounded-full bg-slate-800" />
                      
                        <div className="flex-1">
                          <div className="font-bold text-white flex items-center gap-1">
                            Shadowblade
                            <Shield className="w-4 h-4 text-purple-400" />
                          </div>
                          <div className="text-xs text-slate-400">
                            Top 500 Booster
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Button className="w-full flex items-center justify-center gap-2">
                          <MessageSquare className="w-4 h-4" /> Chat with
                          Provider
                        </Button>
                        <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => navigate('/provider/shadowblade')}>
                        
                          View Profile
                        </Button>
                      </div>
                    </GlassCard>

                    <div className="space-y-3">
                      <Button
                      variant="outline"
                      className={`w-full flex items-center justify-center gap-2 ${issueReported ? 'text-slate-500 border-slate-700 cursor-not-allowed' : 'text-slate-300 border-slate-700 hover:bg-slate-800'}`}
                      onClick={() =>
                      !issueReported && setIsReportModalOpen(true)
                      }
                      disabled={issueReported}>
                      
                        {issueReported ?
                      <>
                            <CheckCircle2 className="w-4 h-4" /> Issue Reported
                          </> :

                      <>
                            <AlertTriangle className="w-4 h-4" /> Report Issue
                          </>
                      }
                      </Button>
                      <Button
                      variant="ghost"
                      className={`w-full ${refundRequested ? 'text-slate-500 cursor-not-allowed' : 'text-slate-500 hover:text-red-400'}`}
                      onClick={() =>
                      !refundRequested && setIsRefundModalOpen(true)
                      }
                      disabled={refundRequested}>
                      
                        {refundRequested ?
                      'Refund Pending Review' :
                      'Request Refund'}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </main>

      <Footer />

      {/* Report Issue Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Report an Issue">
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Issue Type
            </label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500">
              
              <option value="">Select issue type...</option>
              <option value="delay">Delay</option>
              <option value="wrong-service">Wrong Service</option>
              <option value="communication">Communication Issue</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Description
            </label>
            <textarea
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="Please describe the issue in detail..."
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500 h-32 resize-none" />
            
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setIsReportModalOpen(false)}>
              
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleReportIssue}>
              Submit Report
            </Button>
          </div>
        </div>
      </Modal>

      {/* Request Refund Modal */}
      <Modal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        title="Request Refund">
        
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-sm text-amber-300">
              <strong>Refund Policy:</strong> Refunds are reviewed on a
              case-by-case basis. If service has already begun, partial refunds
              may apply based on completion percentage.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Reason for Refund
            </label>
            <select
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500">
              
              <option value="">Select reason...</option>
              <option value="not-delivered">Service not delivered</option>
              <option value="quality">Quality issue</option>
              <option value="other">Other</option>
            </select>
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={refundConfirmed}
              onChange={(e) => setRefundConfirmed(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-slate-600 text-emperial-500 focus:ring-emperial-500 bg-slate-700" />
            
            <span className="text-sm text-slate-300">
              I understand this request will be reviewed by the support team and
              may take 3-5 business days to process.
            </span>
          </label>
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setIsRefundModalOpen(false)}>
              
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-500 hover:bg-red-400"
              onClick={handleRequestRefund}
              disabled={!refundReason || !refundConfirmed}>
              
              Submit Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>);

}