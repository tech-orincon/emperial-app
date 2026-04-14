import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Hero } from './components/Hero';
import { GameShowcase } from './components/GameShowcase';
import { FeaturedDeals } from './components/FeaturedDeals';
import { KeyFeatures } from './components/KeyFeatures';
import { HowItWorks } from './components/HowItWorks';
import { BoosterRecruitment } from './components/BoosterRecruitment';
import { Testimonials } from './components/Testimonials';

export function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 selection:bg-emperial-500/30 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        {/*<TrustSection /> */}
        <GameShowcase />
        <FeaturedDeals />
        <KeyFeatures />
        {/*<Services /> */}
        <HowItWorks />
        <BoosterRecruitment />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
