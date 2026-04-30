import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { Modal } from '../../components/ui/Modal';
import { ErrorState } from '../../components/ui/ErrorState';
import { Skeleton } from '../../components/ui/Skeleton';
import { ChevronRight, MessageSquare, AlertTriangle, CheckCircle2, Shield } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { useOrderDetail } from './hooks/useOrderDetail';
import type { OrderDto, OrderStatus } from '../../types/orders.types';

// ─── Timeline ─────────────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Order Placed', activeAt: ['QUEUED', 'IN_PROGRESS', 'COMPLETED'] },
  { label: 'Booster Assigned', activeAt: ['IN_PROGRESS', 'COMPLETED'] },
  { label: 'Service In Progress', activeAt: ['IN_PROGRESS', 'COMPLETED'] },
  { label: 'Completion', activeAt: ['COMPLETED'] },
];

function Timeline({ status, createdAt }: { status: OrderStatus; createdAt: string }) {
  const date = new Date(createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  return (
    <div className="space-y-6 relative pl-4 border-l-2 border-slate-800 ml-2">
      {STEPS.map((step, i) => {
        const isDone = (step.activeAt as string[]).includes(status);
        const isActive = status === 'IN_PROGRESS' && step.label === 'Service In Progress';
        const dotColor = isDone ? (isActive ? 'bg-blue-500 animate-pulse' : 'bg-green-500') : 'bg-slate-700';
        return (
          <motion.div key={step.label} className={`relative ${!isDone ? 'opacity-50' : ''}`}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: isDone ? 1 : 0.5, x: 0 }}
            transition={{ delay: i * 0.1 }}>
            <div className={`absolute -left-[21px] w-4 h-4 rounded-full border-2 border-slate-900 ${dotColor}`} />
            <h4 className="text-white font-medium">{step.label}</h4>
            <p className="text-sm text-slate-500">{i === 0 ? date : isDone ? 'Completed' : 'Pending'}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<OrderStatus, string> = {
  QUEUED: 'bg-amber-500/10 border border-amber-500/20 text-amber-400',
  IN_PROGRESS: 'bg-blue-500/10 border border-blue-500/20 text-blue-400',
  COMPLETED: 'bg-green-500/10 border border-green-500/20 text-green-400',
  CANCELLED: 'bg-slate-500/10 border border-slate-500/20 text-slate-400',
  REFUNDED: 'bg-amber-500/10 border border-amber-500/20 text-amber-400',
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  QUEUED: 'Queued', IN_PROGRESS: 'In Progress', COMPLETED: 'Completed',
  CANCELLED: 'Cancelled', REFUNDED: 'Refunded',
};

const STATUS_TEXT: Record<OrderStatus, string> = {
  QUEUED: 'text-amber-400', IN_PROGRESS: 'text-blue-400', COMPLETED: 'text-green-400',
  CANCELLED: 'text-slate-400', REFUNDED: 'text-slate-400',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const stateOrder = location.state as OrderDto | null;
  const { data: fetchedOrder, isLoading, error, retry } = useOrderDetail(id);

  // Use fetched data when available; fall back to navigation state while loading
  const order = fetchedOrder ?? stateOrder;
  const showLoading = isLoading && !stateOrder;
  const showError = error && !order;

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [issueType, setIssueType] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [refundConfirmed, setRefundConfirmed] = useState(false);
  const [issueReported, setIssueReported] = useState(false);
  const [refundRequested, setRefundRequested] = useState(false);

  const handleReportIssue = () => {
    if (!issueType || !issueDescription.trim()) { toast.error('Please fill in all fields'); return; }
    setIssueReported(true);
    setIsReportModalOpen(false);
    toast.success('Issue successfully reported');
    setIssueType(''); setIssueDescription('');
  };

  const handleRequestRefund = () => {
    if (!refundReason || !refundConfirmed) { toast.error('Please complete all fields'); return; }
    setRefundRequested(true);
    setIsRefundModalOpen(false);
    toast.success('Refund request submitted');
    setRefundReason(''); setRefundConfirmed(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <Toaster theme="dark" position="top-right" richColors />
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-sm text-slate-400 mb-8">
            <span className="hover:text-white cursor-pointer" onClick={() => navigate('/account/orders')}>My Orders</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-white font-medium">Order #{id}</span>
          </div>

          <AnimatePresence mode="wait">
            {showLoading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <Skeleton height={28} width="60%" />
                  <Skeleton height={18} width="40%" />
                  <Skeleton height={200} className="rounded-2xl mt-4" />
                </div>
                <div><Skeleton height={260} className="rounded-2xl" /></div>
              </motion.div>
            )}

            {showError && (
              <motion.div key="error" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="py-16">
                <ErrorState
                  title="Unable to load order"
                  description="We couldn't fetch the details for this order."
                  onRetry={retry}
                />
              </motion.div>
            )}

            {!showLoading && !showError && order && (
              <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <GlassCard className="p-6">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h1 className="text-2xl font-bold text-white mb-2">{order.service.title}</h1>
                          <p className="text-slate-400">
                            Order #{order.id} · Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className={`px-3 py-1 rounded-full font-bold text-sm ${refundRequested ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' : STATUS_STYLE[order.status]}`}>
                            {refundRequested ? 'Refund Requested' : STATUS_LABEL[order.status]}
                          </div>
                          {issueReported && (
                            <div className="px-2 py-0.5 rounded text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-400">
                              Issue Reported
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-white/10 py-6">
                        <h3 className="font-bold text-white mb-4">Timeline</h3>
                        <Timeline status={order.status} createdAt={order.createdAt} />
                      </div>

                      <div className="border-t border-white/10 pt-6">
                        <h3 className="font-bold text-white mb-4">Order Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="block text-slate-500 mb-1">Package</span>
                            <span className="text-white">{order.package.name}</span>
                          </div>
                          <div>
                            <span className="block text-slate-500 mb-1">Add-ons</span>
                            <span className="text-white">
                              {order.addons.length > 0 ? order.addons.map((a) => a.name).join(', ') : 'None'}
                            </span>
                          </div>
                          <div>
                            <span className="block text-slate-500 mb-1">Total Paid</span>
                            <span className="text-white">${order.totalPrice}</span>
                          </div>
                          <div>
                            <span className="block text-slate-500 mb-1">Status</span>
                            <span className={`font-medium ${STATUS_TEXT[order.status] ?? 'text-slate-400'}`}>
                              {STATUS_LABEL[order.status] ?? order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </div>

                  <div className="space-y-6">
                    <GlassCard className="p-6">
                      <h3 className="font-bold text-white mb-4">Assigned Provider</h3>
                      {order.provider ? (
                        <>
                          <div className="flex items-center gap-4 mb-6">
                            {order.provider.avatarUrl
                              ? <img src={order.provider.avatarUrl} alt={order.provider.username} className="w-12 h-12 rounded-full bg-slate-800 object-cover" />
                              : <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-400">
                                  {order.provider.username.slice(0, 2).toUpperCase()}
                                </div>
                            }
                            <div className="flex-1">
                              <div className="font-bold text-white flex items-center gap-1">
                                {order.provider.username}
                                <Shield className="w-4 h-4 text-purple-400" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Button className="w-full flex items-center justify-center gap-2">
                              <MessageSquare className="w-4 h-4" /> Chat with Provider
                            </Button>
                            <Button variant="secondary" className="w-full" onClick={() => navigate(`/provider/${order.provider!.id}`)}>
                              View Profile
                            </Button>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-slate-500">A booster will be assigned shortly.</p>
                      )}
                    </GlassCard>

                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className={`w-full flex items-center justify-center gap-2 ${issueReported ? 'text-slate-500 border-slate-700 cursor-not-allowed' : 'text-slate-300 border-slate-700 hover:bg-slate-800'}`}
                        onClick={() => !issueReported && setIsReportModalOpen(true)}
                        disabled={issueReported}>
                        {issueReported ? <><CheckCircle2 className="w-4 h-4" /> Issue Reported</> : <><AlertTriangle className="w-4 h-4" /> Report Issue</>}
                      </Button>
                      <Button
                        variant="ghost"
                        className={`w-full ${refundRequested ? 'text-slate-500 cursor-not-allowed' : 'text-slate-500 hover:text-red-400'}`}
                        onClick={() => !refundRequested && setIsRefundModalOpen(true)}
                        disabled={refundRequested}>
                        {refundRequested ? 'Refund Pending Review' : 'Request Refund'}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />

      <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="Report an Issue">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Issue Type</label>
            <select value={issueType} onChange={(e) => setIssueType(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500">
              <option value="">Select issue type...</option>
              <option value="delay">Delay</option>
              <option value="wrong-service">Wrong Service</option>
              <option value="communication">Communication Issue</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
            <textarea value={issueDescription} onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="Please describe the issue in detail..."
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500 h-32 resize-none" />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" className="flex-1" onClick={() => setIsReportModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleReportIssue}>Submit Report</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isRefundModalOpen} onClose={() => setIsRefundModalOpen(false)} title="Request Refund">
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-sm text-amber-300">
              <strong>Refund Policy:</strong> Refunds are reviewed on a case-by-case basis. If service has already begun, partial refunds may apply based on completion percentage.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Reason for Refund</label>
            <select value={refundReason} onChange={(e) => setRefundReason(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500">
              <option value="">Select reason...</option>
              <option value="not-delivered">Service not delivered</option>
              <option value="quality">Quality issue</option>
              <option value="other">Other</option>
            </select>
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={refundConfirmed} onChange={(e) => setRefundConfirmed(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-slate-600 text-emperial-500 focus:ring-emperial-500 bg-slate-700" />
            <span className="text-sm text-slate-300">
              I understand this request will be reviewed by the support team and may take 3-5 business days to process.
            </span>
          </label>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" className="flex-1" onClick={() => setIsRefundModalOpen(false)}>Cancel</Button>
            <Button className="flex-1 bg-red-500 hover:bg-red-400" onClick={handleRequestRefund} disabled={!refundReason || !refundConfirmed}>
              Submit Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
