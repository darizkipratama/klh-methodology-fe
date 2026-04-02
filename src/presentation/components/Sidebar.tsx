import React from 'react';
import { Layers, Users, Code } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-[280px] bg-[#1e7e45] min-h-screen flex flex-col text-white fixed left-0 top-0 bottom-0 select-none z-10">
      <div className="p-8 flex flex-col items-center border-b border-[#288c52]">
        <div className="w-24 h-24 bg-[#1b7140] rounded-xl flex items-center justify-center mb-4 border border-[#2e8f55]">
          {/* Logo Placeholder */}
          <div className="text-center">
            <span className="text-3xl font-bold italic font-serif leading-none tracking-tighter">srn</span>
            <div className="w-3 h-3 bg-white rounded-full mt-1 mx-auto"></div>
          </div>
        </div>
        <h2 className="text-center text-sm font-bold tracking-widest mt-1">ADMIN PORTAL</h2>
        <p className="text-center text-[9px] opacity-80 uppercase tracking-widest mt-1.5">SRN PPI INDONESIA</p>
      </div>

      <nav className="flex-1 mt-6">
        <ul className="space-y-1">
          <li>
            <a href="/dashboard/admin" className="flex items-center px-8 py-4 bg-[#239050] border-l-4 border-white font-medium">
              <Layers className="w-5 h-5 mr-4" />
              Dashboard
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center px-8 py-4 hover:bg-[#239050] transition-colors font-medium border-l-4 border-transparent text-gray-100">
              <Users className="w-5 h-5 mr-4" />
              Manajemen Pengguna
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center px-8 py-4 hover:bg-[#239050] transition-colors font-medium border-l-4 border-transparent text-gray-100">
              <Code className="w-5 h-5 mr-4" />
              Integrasi Endpoint
            </a>
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
