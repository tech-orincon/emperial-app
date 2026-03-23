import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { Button } from '../../components/ui/Button';
import { ChevronLeft } from 'lucide-react';
export function RefundPolicyPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
            
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </button>

          <h1 className="text-4xl font-bold text-white mb-8">Refund Policy</h1>

          <div className="prose prose-invert prose-slate max-w-none">
            <p className="text-slate-400 text-lg mb-8">
              Last updated: October 24, 2023
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                1. Refund Eligibility
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Refunds may be requested if the service has not been started.
                Once a provider has begun work on your order, partial refunds
                may be available based on completion percentage.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                2. Full Refund Conditions
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Full refunds are granted when: the service cannot be completed
                due to our error, the order has not been assigned to a provider,
                or within 24 hours of purchase if work has not begun.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                3. Partial Refunds
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Partial refunds are calculated based on the percentage of
                service completed. If 50% of the service is complete, you may be
                eligible for a 50% refund of the remaining amount.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                4. Non-Refundable Cases
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Refunds are not available for: completed services, account bans
                resulting from user actions, or services cancelled due to user
                unavailability.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                5. How to Request a Refund
              </h2>
              <p className="text-slate-300 leading-relaxed">
                To request a refund, use the "Request Refund" button on your
                order page or contact our support team. Refund requests are
                typically processed within 3-5 business days.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">6. Contact</h2>
              <p className="text-slate-300 leading-relaxed">
                For refund inquiries, please contact refunds@emperial.gg or use
                our support chat.
              </p>
            </section>
          </div>

          <div className="mt-12">
            <Button onClick={() => navigate('/')}>Return to Home</Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>);

}