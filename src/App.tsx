import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { TopNav } from './components/TopNav';
import { Notification } from './components/Notification';
import { LoginPage } from './pages/login';
import { SignupPage } from './pages/signup';
import { ForgotPasswordPage } from './pages/forgot-password';
import { ResetPasswordPage } from './pages/reset-password';
import { DashboardPage } from './pages/dashboard';
import { ProfilePage } from './pages/profile';
import { ReceiptsListPage } from './pages/operations/receipts/index';
import { NewReceiptPage } from './pages/operations/receipts/new';
import { ReceiptDetailPage } from './pages/operations/receipts/[id]';
import { DeliveryListPage } from './pages/operations/delivery/index';
import { NewDeliveryPage } from './pages/operations/delivery/new';
import { DeliveryDetailPage } from './pages/operations/delivery/[id]';
import { AdjustmentsPage } from './pages/operations/adjustments';
import { StockPage } from './pages/stock/index';
import { ProductsPage } from './pages/stock/products';
import { CategoriesPage } from './pages/stock/categories';
import { ReorderingRulesPage } from './pages/stock/rules';
import { StockByLocationPage } from './pages/stock/locations';
import { StockAlertsPage } from './pages/stock/alerts';
import { MoveHistoryPage } from './pages/move-history';
import { WarehousePage } from './pages/settings/warehouse';
import { LocationPage } from './pages/settings/location';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF9F7' }}>
      <TopNav />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      <Notification />
    </div>
  );
};

function App() {
  const { initialize, loading } = useAuthStore();

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF9F7' }}>
        <div style={{ color: '#1E293B' }}>Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Layout>
                <ProfilePage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/operations/receipts"
          element={
            <PrivateRoute>
              <Layout>
                <ReceiptsListPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/operations/receipts/new"
          element={
            <PrivateRoute>
              <Layout>
                <NewReceiptPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/operations/receipts/:id"
          element={
            <PrivateRoute>
              <Layout>
                <ReceiptDetailPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/operations/delivery"
          element={
            <PrivateRoute>
              <Layout>
                <DeliveryListPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/operations/delivery/new"
          element={
            <PrivateRoute>
              <Layout>
                <NewDeliveryPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/operations/delivery/:id"
          element={
            <PrivateRoute>
              <Layout>
                <DeliveryDetailPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/operations/adjustments"
          element={
            <PrivateRoute>
              <Layout>
                <AdjustmentsPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/stock"
          element={
            <PrivateRoute>
              <Layout>
                <StockPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/stock/products"
          element={
            <PrivateRoute>
              <Layout>
                <ProductsPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/stock/categories"
          element={
            <PrivateRoute>
              <Layout>
                <CategoriesPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/stock/rules"
          element={
            <PrivateRoute>
              <Layout>
                <ReorderingRulesPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/stock/locations"
          element={
            <PrivateRoute>
              <Layout>
                <StockByLocationPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/stock/alerts"
          element={
            <PrivateRoute>
              <Layout>
                <StockAlertsPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/move-history"
          element={
            <PrivateRoute>
              <Layout>
                <MoveHistoryPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/warehouse"
          element={
            <PrivateRoute>
              <Layout>
                <WarehousePage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/location"
          element={
            <PrivateRoute>
              <Layout>
                <LocationPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/locations"
          element={
            <PrivateRoute>
              <Layout>
                <LocationPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
