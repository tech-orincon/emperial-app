import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { Button } from '../../components/ui/Button';
import { ChevronLeft } from 'lucide-react';
export function TermsPage() {
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

          <h1 className="text-4xl font-bold text-white mb-8">
            Terms of Service
          </h1>

          <div className="prose prose-invert prose-slate max-w-none">
            <p className="text-slate-400 text-lg mb-8">
              Last updated: October 24, 2023
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-slate-300 leading-relaxed">
                By accessing and using Emperial Boosting services, you agree to
                be bound by these Terms of Service. If you do not agree to these
                terms, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                2. Service Description
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Emperial Boosting provides gaming enhancement services including
                but not limited to rank boosting, coaching, and in-game
                assistance. All services are performed by verified professional
                players.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                3. User Responsibilities
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Users are responsible for providing accurate account information
                and ensuring their accounts comply with the respective game's
                terms of service. Emperial Boosting is not responsible for any
                actions taken by game publishers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                4. Payment Terms
              </h2>
              <p className="text-slate-300 leading-relaxed">
                All payments are processed securely through our payment
                partners. Prices are displayed in USD and are subject to change
                without notice. Completed orders are non-refundable unless
                otherwise specified in our Refund Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                5. Privacy & Security
              </h2>
              <p className="text-slate-300 leading-relaxed">
                We take your privacy seriously. Account credentials are handled
                with strict security protocols and are never shared with third
                parties. Please refer to our Privacy Policy for more details.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">6. Contact</h2>
              <p className="text-slate-300 leading-relaxed">
                For questions about these Terms of Service, please contact our
                support team through the Help Center or email us at
                support@emperial.gg
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