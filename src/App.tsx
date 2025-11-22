import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { TopNav } from './components/TopNav';
import { Notification } from './components/Notification';
import { LoginPage } from './pages/login';
import { SignupPage } from './pages/signup';
import { DashboardPage } from './pages/dashboard';
import { ProfilePage } from './pages/profile';
import { ReceiptsListPage } from './pages/operations/receipts/index';
import { ReceiptDetailPage } from './pages/operations/receipts/[id]';
import { DeliveryListPage } from './pages/operations/delivery/index';
import { DeliveryDetailPage } from './pages/operations/delivery/[id]';
import { StockPage } from './pages/stock';
import { MoveHistoryPage } from './pages/move-history';
import { WarehousePage } from './pages/settings/warehouse';
import { LocationPage } from './pages/settings/location';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <TopNav />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      <Notification />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
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
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
