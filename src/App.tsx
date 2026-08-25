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
import { ChatProvider } from './context/ChatContext';
import { useAuth } from './context/AuthContext';
import type { ReactNode } from 'react';

/** Only providers can access this route. Others are redirected to /. */
function RequireProvider({ children }: { children: ReactNode }) {
  const { role, isLoading } = useAuth();
  if (isLoading) return null;
  if (role !== 'PROVIDER') return <Navigate to="/" replace />;
  return <>{children}</>;
}

/** Requires a session. Guests are sent to /auth. */
function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

export function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ChatProvider>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/service/:id" element={<ServiceDetailPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />

        {/* Customer — require a session */}
        <Route path="/checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
        <Route path="/account/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/account/orders" element={<RequireAuth><OrdersPage /></RequireAuth>} />
        <Route path="/account/orders/:id" element={<RequireAuth><OrderDetailPage /></RequireAuth>} />

        {/* Provider-only */}
        <Route path="/provider/dashboard" element={<RequireProvider><ProviderDashboardPage /></RequireProvider>} />
        <Route path="/provider/:id" element={<ProviderProfilePage />} />
      </Routes>

      {/* Global chat overlay */}
      <ChatCenter />
      </ChatProvider>
    </Router>
  );
}
