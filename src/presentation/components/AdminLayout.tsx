import React, { type ReactNode } from 'react';
import Sidebar from './Sidebar';
import { Bell } from 'lucide-react';
import { useAuthStore } from '../../domain/store/authStore';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Sidebar Component */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-[280px] flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white px-8 py-5 flex justify-between items-center border-b-4 border-[#1e7e45] shrink-0 sticky top-0 z-0 shadow-sm">
          <div>
            <h1 className="text-xl font-black text-[#1a385f] tracking-wide">KLASIFIKASI & SERTIFIKASI</h1>
            <p className="text-[10px] font-bold text-gray-400 mt-1.5 uppercase tracking-widest">Sistem Registri Nasional Pengendalian Perubahan Iklim</p>
          </div>
          <div className="flex items-center">
            <div className="text-right mr-5">
              <p className="text-xs font-bold text-[#1a385f]">
                {user ? `${user.username}` : 'N/A'}
              </p>
              <p className="text-[10px] font-bold text-[#1e7e45] tracking-widest mt-0.5 uppercase">
                {user ? user.role.replace('_', ' ') : 'N/A'}
              </p>
            </div>
            <div className="w-10 h-10 bg-[#f0f4f8] rounded-full flex items-center justify-center relative cursor-pointer hover:bg-gray-200 transition-colors">
              <Bell className="w-4 h-4 text-[#1a385f]" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-[#f0f4f8]"></span>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 p-8 flex flex-col">
          {children}

          {/* Footer */}
          <footer className="mt-auto pt-8 pb-2 flex justify-between items-center text-[9px] font-bold text-gray-300 uppercase tracking-widest">
            <div>© 2025 KEMENTERIAN LINGKUNGAN HIDUP / BADAN PENGENDALIAN LINGKUNGAN HIDUP</div>
            <div>SRN-ADMIN-V1.0</div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
