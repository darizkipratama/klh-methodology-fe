import React, { type ReactNode } from 'react';
import { useAuthStore } from '../../domain/store/authStore';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import srnLogo from '../../../public/logo.png';

interface ExternalLayoutProps {
  children: ReactNode;
}

const ExternalLayout: React.FC<ExternalLayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* Top Header */}
      <header className="bg-white px-8 py-4 flex justify-between items-center border-b-4 border-[#1e7e45] shrink-0 sticky top-0 z-10 shadow-sm">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <img src={srnLogo} alt="SRN Logo" className="h-9 w-auto object-contain" />
          <div className="border-l border-gray-200 pl-4">
            <h1 className="text-base font-black text-[#1a385f] tracking-wide leading-tight">
              APLIKASI PENGAJUAN METODOLOGI
            </h1>
            <p className="text-[9px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest">
              Sistem Registri Nasional Pengendalian Perubahan Iklim
            </p>
          </div>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-bold text-[#1a385f]">
              {user ? user.username : 'N/A'}
            </p>
            <p className="text-[10px] font-bold text-[#1e7e45] tracking-widest mt-0.5 uppercase">
              {user ? user.companyName : 'N/A'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Keluar"
            className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold text-red-500 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 rounded-lg transition-all tracking-wide group"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 flex flex-col">
        {children}

        {/* Footer */}
        <footer className="mt-auto px-8 py-3 flex justify-between items-center text-[9px] font-bold text-gray-300 uppercase tracking-widest border-t border-gray-100">
          <div>© 2025 Kementerian Lingkungan Hidup / Badan Pengendalian Lingkungan Hidup</div>
          <div>SRN-Methodology-V1.0</div>
        </footer>
      </main>
    </div>
  );
};

export default ExternalLayout;
