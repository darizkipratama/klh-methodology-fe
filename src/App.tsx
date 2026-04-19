import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './domain/store/authStore';

// Page Imports
import LoginPage from './presentation/pages/auth/LoginPage';
import ExternalDashboardPage from './presentation/pages/publisher/ExternalDashboardPage';
import ExternalProposalPage from './presentation/pages/publisher/ExternalProposalPage';
import ExternalDocumentDetailPage from './presentation/pages/publisher/ExternalDocumentDetailPage';
import AdminDashboardPage from './presentation/pages/internal/dashboard/AdminDashboardPage';
import DocumentDetailPage from './presentation/pages/internal/dashboard/DocumentDetailPage';
import AdminUserManagementPage from './presentation/pages/internal/dashboard/AdminUserManagementPage';
import AdminMetadataBuilderPage from './presentation/pages/internal/dashboard/AdminMetadataBuilderPage';
import DocumentUploadPage from './presentation/pages/publisher/DocumentUploadPage';
import PublicDocumentDetailPage from './presentation/pages/public/PublicDocumentDetailPage';
import PublicMethodologyPage from './presentation/pages/public/PublicMethodologyPage';

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
        <Route path="/metodologi" element={<PublicMethodologyPage />} />
        <Route path="/metodologi/:id" element={<PublicDocumentDetailPage />} />
        <Route path="/login" element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        } />
        
        {/* Protected Routes */}
        <Route path="/dashboard/external" element={
          <ProtectedRoute allowedRoles={['PUBLISHER']}>
            <ExternalDashboardPage />
          </ProtectedRoute>
        } />

        <Route path="/dashboard/external/propose" element={
          <ProtectedRoute allowedRoles={['PUBLISHER']}>
            <ExternalProposalPage />
          </ProtectedRoute>
        } />

        <Route path="/dashboard/external/document/:id" element={
          <ProtectedRoute allowedRoles={['PUBLISHER']}>
            <ExternalDocumentDetailPage />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/admin" element={
          <ProtectedRoute allowedRoles={['INTERNAL']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/admin/document/:id" element={
          <ProtectedRoute allowedRoles={['INTERNAL']}>
            <DocumentDetailPage />
          </ProtectedRoute>
        } />

        <Route path="/dashboard/admin/users" element={
          <ProtectedRoute allowedRoles={['INTERNAL']}>
            <AdminUserManagementPage />
          </ProtectedRoute>
        } />

        <Route path="/dashboard/admin/metadata" element={
          <ProtectedRoute allowedRoles={['INTERNAL']}>
            <AdminMetadataBuilderPage />
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
