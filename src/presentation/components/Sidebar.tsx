import React from 'react';
import { Layers, Users, Code, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../domain/store/authStore';
import srnLogo from '../../../public/logo.png';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const path = location.pathname;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isDashboardActive = path === '/dashboard/admin' || path.includes('/document/');
  const isUsersActive = path === '/dashboard/admin/users';
  const isEndpointActive = path === '/dashboard/admin/endpoints';
  return (
    <aside className="w-[280px] bg-[#1e7e45] min-h-screen flex flex-col text-white fixed left-0 top-0 bottom-0 select-none z-10">
      <div className="p-8 flex flex-col items-center border-b border-[#288c52]">
        <div className="w-full bg-white/10 rounded-xl p-4 flex items-center justify-center mb-4 border border-white/20 backdrop-blur-sm">
          <img src={srnLogo} alt="SRN Logo" className="w-full h-auto object-contain" />
        </div>
        <h2 className="text-center text-sm font-bold tracking-widest mt-1">ADMIN PORTAL</h2>
        <p className="text-center text-[9px] opacity-80 uppercase tracking-widest mt-1.5">SRN PPI INDONESIA</p>
      </div>

      <nav className="flex-1 mt-6">
        <ul className="space-y-1">
          <li>
            <Link 
              to="/dashboard/admin" 
              className={`flex items-center px-8 py-4 font-medium transition-colors ${isDashboardActive ? 'bg-[#239050] border-l-4 border-white text-white' : 'hover:bg-[#239050] border-l-4 border-transparent text-gray-100'}`}
            >
              <Layers className="w-5 h-5 mr-4" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/dashboard/admin/users" 
              className={`flex items-center px-8 py-4 font-medium transition-colors ${isUsersActive ? 'bg-[#239050] border-l-4 border-white text-white' : 'hover:bg-[#239050] border-l-4 border-transparent text-gray-100'}`}
            >
              <Users className="w-5 h-5 mr-4" />
              Manajemen Pengguna
            </Link>
          </li>
          <li>
            <Link 
              to="#" 
              className={`flex items-center px-8 py-4 font-medium transition-colors ${isEndpointActive ? 'bg-[#239050] border-l-4 border-white text-white' : 'hover:bg-[#239050] border-l-4 border-transparent text-gray-100'}`}
            >
              <Code className="w-5 h-5 mr-4" />
              Integrasi Endpoint
            </Link>
          </li>
          <li>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center px-8 py-4 hover:bg-red-600/20 transition-colors font-medium border-l-4 border-transparent text-red-100 mt-4 group"
            >
              <LogOut className="w-5 h-5 mr-4 group-hover:text-white" />
              <span className="group-hover:text-white">Keluar Sistem</span>
            </button>
          </li>
        </ul>
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-[#1b7140] rounded-lg p-3.5 flex flex-col items-center border border-[#2e8f55]">
          <span className="text-[10px] font-semibold mb-1 tracking-wider">STATUS SERVER</span>
          <div className="flex items-center text-xs font-medium">
            <span className="w-2 h-2 bg-[#4ade80] rounded-full mr-2"></span>
            Terkoneksi
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
