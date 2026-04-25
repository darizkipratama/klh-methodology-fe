import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

import AdminDashboardPage from './internal/dashboard/AdminDashboardPage';
import ExternalDashboardPage from './publisher/ExternalDashboardPage';
import { submissionService } from '../../services/submission.service';
import { openKmClient } from '../../services/api/apiClient';

// Mock the services to prevent actual API calls
vi.mock('../../services/submission.service', () => ({
  submissionService: {
    getSubmissions: vi.fn().mockResolvedValue({ data: [] }),
  },
}));

vi.mock('../../services/api/apiClient', () => ({
  openKmClient: {
    get: vi.fn().mockResolvedValue({ data: [] }),
  },
}));

// We also need to mock useAuthStore if the Layouts depend on it
vi.mock('../../domain/store/authStore', () => ({
  useAuthStore: vi.fn().mockReturnValue({
    user: { username: 'testuser', role: 'ADMIN' },
    isAuthenticated: true,
    logout: vi.fn(),
  }),
}));

describe('Dashboard Pages', () => {
  it('should load AdminDashboardPage without crashing', async () => {
    render(
      <BrowserRouter>
        <AdminDashboardPage />
      </BrowserRouter>
    );

    // Verify loading of static content specific to the page
    expect(screen.getByText(/MASTER DATA PENGAJUAN DOKUMEN METODOLOGI/i)).toBeInTheDocument();
    
    // Wait for async operations to complete
    await waitFor(() => {
      expect(submissionService.getSubmissions).toHaveBeenCalled();
    });
  });

  it('should load ExternalDashboardPage without crashing', async () => {
    render(
      <BrowserRouter>
        <ExternalDashboardPage />
      </BrowserRouter>
    );

    // ExternalDashboardPage has a loader initially, then displays data
    expect(screen.getByText(/Beranda/i)).toBeInTheDocument();
    
    // Wait for the loader to disappear and static text to show
    await waitFor(() => {
      expect(screen.getByText(/Daftar Metodologi yang Diajukan/i)).toBeInTheDocument();
      expect(submissionService.getSubmissions).toHaveBeenCalled();
      expect(openKmClient.get).toHaveBeenCalled();
    });
  });
});
