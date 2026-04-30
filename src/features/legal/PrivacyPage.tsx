import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { ChevronLeft } from 'lucide-react';
export function PrivacyPage() {
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

          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>

          <div className="prose prose-invert prose-slate max-w-none">
            <p className="text-slate-400 text-lg mb-8">
              Last updated: October 24, 2023
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                1. Information We Collect
              </h2>
              <p className="text-slate-300 leading-relaxed">
                We collect information you provide directly, including email
                address, payment information, and gaming account details
                necessary to provide our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Your information is used to provide and improve our services,
                process transactions, communicate with you, and ensure account
                security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                3. Data Security
              </h2>
              <p className="text-slate-300 leading-relaxed">
                We implement industry-standard security measures to protect your
                personal information. All sensitive data is encrypted in transit
                and at rest.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                4. Data Sharing
              </h2>
              <p className="text-slate-300 leading-relaxed">
                We do not sell your personal information. Data is only shared
                with service providers necessary to deliver our services
                (payment processors, etc.).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                5. Your Rights
              </h2>
              <p className="text-slate-300 leading-relaxed">
                You have the right to access, correct, or delete your personal
                information. Contact our support team to exercise these rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">6. Contact</h2>
              <p className="text-slate-300 leading-relaxed">
                For privacy-related inquiries, please contact us at
                privacy@emperial.gg
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