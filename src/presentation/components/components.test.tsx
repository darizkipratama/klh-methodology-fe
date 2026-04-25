import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import AdminLayout from './AdminLayout';
import ExternalLayout from './ExternalLayout';
import PublicLayout from './PublicLayout';
import Sidebar from './Sidebar';
import { ProtectedRoute } from './ProtectedRoute';
import { DataTable } from './DataTable';
import { useAuthStore } from '../../domain/store/authStore';

// Mock the Auth Store globally for the components
vi.mock('../../domain/store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

describe('Layout Components', () => {
  beforeEach(() => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { username: 'AdminUser', role: 'INTERNAL', companyName: 'KLH' },
      isAuthenticated: true,
      logout: vi.fn(),
    });
  });

  it('renders AdminLayout correctly', () => {
    render(
      <BrowserRouter>
        <AdminLayout>
          <div>Admin Content Area</div>
        </AdminLayout>
      </BrowserRouter>
    );

    expect(screen.getByText('KLASIFIKASI & SERTIFIKASI')).toBeInTheDocument();
    expect(screen.getByText('AdminUser')).toBeInTheDocument();
    expect(screen.getByText('Admin Content Area')).toBeInTheDocument();
  });

  it('renders ExternalLayout correctly', () => {
    render(
      <BrowserRouter>
        <ExternalLayout>
          <div>External Content Area</div>
        </ExternalLayout>
      </BrowserRouter>
    );

    expect(screen.getByText('APLIKASI PENGAJUAN METODOLOGI')).toBeInTheDocument();
    expect(screen.getByText('AdminUser')).toBeInTheDocument();
    expect(screen.getByText('External Content Area')).toBeInTheDocument();
  });

  it('renders PublicLayout correctly', () => {
    render(
      <BrowserRouter>
        <PublicLayout>
          <div>Public Content Area</div>
        </PublicLayout>
      </BrowserRouter>
    );

    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByText('Public Content Area')).toBeInTheDocument();
  });

  it('renders Sidebar correctly', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    expect(screen.getByText('ADMIN PORTAL')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Manajemen Pengguna')).toBeInTheDocument();
  });
});

describe('ProtectedRoute Component', () => {
  it('redirects to login if not authenticated', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders content if authenticated and role is allowed', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { username: 'test', role: 'PUBLISHER' },
      isAuthenticated: true,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute allowedRoles={['PUBLISHER']}>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to respective dashboard if authenticated but role is not allowed', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { username: 'test', role: 'PUBLISHER' },
      isAuthenticated: true,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/admin-protected']}>
        <Routes>
          <Route path="/dashboard/external" element={<div>External Dashboard</div>} />
          <Route
            path="/admin-protected"
            element={
              <ProtectedRoute allowedRoles={['INTERNAL']}>
                <div>Admin Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('External Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Admin Protected Content')).not.toBeInTheDocument();
  });
});

describe('DataTable Component', () => {
  it('renders data correctly', () => {
    const columns = [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'name', header: 'Name' },
    ];
    const data = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ];

    render(<DataTable columns={columns} data={data} />);

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('renders empty state if no data', () => {
    const columns = [
      { accessorKey: 'id', header: 'ID' },
    ];

    render(<DataTable columns={columns} data={[]} />);

    expect(screen.getByText('Tidak ada hasil')).toBeInTheDocument();
  });
});
