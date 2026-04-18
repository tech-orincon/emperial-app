import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Features
import { HomePage } from './features/home/HomePage';
import { CatalogPage } from './features/catalog/CatalogPage';
import { ServiceDetailPage } from './features/catalog/ServiceDetailPage';
import { CheckoutPage } from './features/checkout/CheckoutPage';
import { ProfilePage } from './features/account/ProfilePage';
import { OrdersPage } from './features/account/OrdersPage';
import { OrderDetailPage } from './features/account/OrderDetailPage';
import { AuthPage } from './features/auth/AuthPage';
import { ProviderDashboardPage } from './features/provider/ProviderDashboardPage';
import { ProviderProfilePage } from './features/provider/ProviderProfilePage';
import { TermsPage } from './features/legal/TermsPage';
import { PrivacyPage } from './features/legal/PrivacyPage';
import { RefundPolicyPage } from './features/legal/RefundPolicyPage';
import { ChatCenter } from './features/chat/ChatCenter';
import { useAuth } from './context/AuthContext';
import type { ReactNode } from 'react';

/** Only providers can access this route. Others are redirected to /. */
function RequireProvider({ children }: { children: ReactNode }) {
  const { role, isLoading } = useAuth();
  if (isLoading) return null;
  if (role !== 'provider') return <Navigate to="/" replace />;
  return <>{children}</>;
}

export function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/service/:id" element={<ServiceDetailPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />

        {/* Customer */}
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/account/profile" element={<ProfilePage />} />
        <Route path="/account/orders" element={<OrdersPage />} />
        <Route path="/account/orders/:id" element={<OrderDetailPage />} />

        {/* Provider-only */}
        <Route path="/provider/dashboard" element={<RequireProvider><ProviderDashboardPage /></RequireProvider>} />
        <Route path="/provider/:id" element={<ProviderProfilePage />} />
        <Route path="/provider/login" element={<Navigate to="/auth" replace />} />
      </Routes>

      {/* Global chat overlay */}
      <ChatCenter />
    </Router>
  );
}
