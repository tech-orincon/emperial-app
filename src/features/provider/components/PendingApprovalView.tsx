import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { GlassCard } from '../../../components/ui/GlassCard'
import { AlertCircle, Shield, MessageSquare } from 'lucide-react'

export function PendingApprovalView() {
  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <GlassCard className="max-w-md w-full p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-amber-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">Account Under Review</h1>
        <p className="text-slate-400 mb-8">
          Your provider application is currently being reviewed by our team. This process usually
          takes 24-48 hours. We will notify you via email once a decision has been made.
        </p>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-slate-800/50 border border-white/5 flex items-start gap-3 text-left">
            <Shield className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-white">Why the review?</h3>
              <p className="text-xs text-slate-400 mt-1">
                We verify all boosters to maintain the highest quality of service for our customers.
              </p>
            </div>
          </div>

          <Button
            className="w-full bg-purple-600 hover:bg-purple-500"
            onClick={() => {
              const event = new CustomEvent('openChat')
              window.dispatchEvent(event)
            }}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Contact Support
          </Button>

          <Link to="/">
            <Button variant="ghost" className="w-full mt-2">
              Return to Home
            </Button>
          </Link>
        </div>
      </GlassCard>
    </div>
  )
}
