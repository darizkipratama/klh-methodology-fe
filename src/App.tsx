import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './domain/store/authStore';

// Page Imports
import LoginPage from './presentation/pages/auth/LoginPage';
import ExternalDashboardPage from './presentation/pages/dashboard/ExternalDashboardPage';
import ExternalProposalPage from './presentation/pages/dashboard/ExternalProposalPage';
import AdminDashboardPage from './presentation/pages/dashboard/AdminDashboardPage';
import DocumentDetailPage from './presentation/pages/dashboard/DocumentDetailPage';
import AdminUserManagementPage from './presentation/pages/dashboard/AdminUserManagementPage';
import AdminMetadataBuilderPage from './presentation/pages/dashboard/AdminMetadataBuilderPage';
import DocumentUploadPage from './presentation/pages/document/DocumentUploadPage';
import PublicDocumentDetailPage from './presentation/pages/document/DocumentDetailPage';

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
            <PublicDocumentDetailPage />
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
