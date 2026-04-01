import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './domain/store/authStore';

// Page Imports
import LoginPage from './presentation/pages/auth/LoginPage';
import ExternalDashboardPage from './presentation/pages/dashboard/ExternalDashboardPage';
import AdminDashboardPage from './presentation/pages/dashboard/AdminDashboardPage';
import DocumentUploadPage from './presentation/pages/document/DocumentUploadPage';

// Component Imports
import { ProtectedRoute } from './presentation/components/ProtectedRoute';

// Basic wrapper to prevent logged-in users from returning to login
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user) {
    return <Navigate to={user.role === 'INTERNAL' ? '/dashboard/admin' : '/dashboard/external'} replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        } />
        
        {/* Protected Routes */}
        <Route path="/dashboard/external" element={
          <ProtectedRoute allowedRoles={['EXTERNAL']}>
            <ExternalDashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/admin" element={
          <ProtectedRoute allowedRoles={['INTERNAL']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path="/upload" element={
          <ProtectedRoute>
            <DocumentUploadPage />
          </ProtectedRoute>
        } />
        
        {/* Default catch-all route redirects to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
