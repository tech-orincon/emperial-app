import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustSection } from './components/TrustSection';
import { GameShowcase } from './components/GameShowcase';
import { FeaturedDeals } from './components/FeaturedDeals';
import { KeyFeatures } from './components/KeyFeatures';
import { Services } from './components/Services';
import { HowItWorks } from './components/HowItWorks';
import { BoosterRecruitment } from './components/BoosterRecruitment';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { CatalogPage } from './pages/CatalogPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProfilePage } from './pages/account/ProfilePage';
import { OrdersPage } from './pages/account/OrdersPage';
import { OrderDetailPage } from './pages/account/OrderDetailPage';
import { ProviderLoginPage } from './pages/provider/ProviderLoginPage';
import { ProviderDashboardPage } from './pages/provider/ProviderDashboardPage';
import { ProviderProfilePage } from './pages/provider/ProviderProfilePage';
import { TermsPage } from './pages/legal/TermsPage';
import { PrivacyPage } from './pages/legal/PrivacyPage';
import { RefundPolicyPage } from './pages/legal/RefundPolicyPage';
import { ChatCenter } from './components/ChatCenter';
import { AuthPage } from './pages/auth/AuthPage';
import { Navigate } from 'react-router-dom';
function HomePage() {
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
    </div>);

}
export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/service/:id" element={<ServiceDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/account/profile" element={<ProfilePage />} />
        <Route path="/account/orders" element={<OrdersPage />} />
        <Route path="/account/orders/:id" element={<OrderDetailPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/provider/login"
          element={<Navigate to="/auth" replace />} />
        
        <Route path="/provider/dashboard" element={<ProviderDashboardPage />} />
        <Route path="/provider/:id" element={<ProviderProfilePage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />
      </Routes>
      <ChatCenter />
    </Router>);

}