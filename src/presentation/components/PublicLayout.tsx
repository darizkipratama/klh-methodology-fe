import React, { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Menu } from 'lucide-react';
import srnLogo from '../../../public/logo.png';

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4f8] font-sans selection:bg-[#1a385f] selection:text-white">
      {/* Top Header */}
      <header className="bg-white shadow-[0px_4px_25px_0px_rgba(141,141,141,0.05)] sticky top-0 z-[995]">
        <div className="max-w-[1277px] mx-auto px-4 sm:px-6 py-1 sm:py-2">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="w-[90px] sm:w-[120px] h-[35px] sm:h-[42px] bg-white rounded-xl overflow-hidden shadow flex items-center justify-center px-3 sm:px-4 hover:shadow-md transition-all duration-200">
              <img src={srnLogo} alt="SRN Logo" className="max-h-[24px] sm:max-h-[30px] w-auto object-contain" />
            </a>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 mr-6">
              <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="text-sm transition-colors text-[#404852] hover:text-[#0D5B6C] font-semibold">Home</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-sm transition-colors text-[#404852] hover:text-[#0D5B6C] font-semibold">Map</a>
              <div className="relative group cursor-pointer">
                <button className="flex items-center gap-1 text-sm transition-colors text-[#404852] group-hover:text-[#0D5B6C] font-semibold">
                  About <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <div className="relative group cursor-pointer">
                <button className="flex items-center gap-1 text-sm transition-colors text-[#0D5B6C] font-bold">
                  Instruments <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-sm transition-colors text-[#404852] hover:text-[#0D5B6C] font-semibold">NDC Achievement</a>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={() => navigate('/login')}
                className="hidden lg:flex h-[42px] bg-black rounded-xl px-6 items-center justify-center text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                Register
              </button>
              <button
                onClick={() => navigate('/login')}
                className="hidden lg:flex h-[42px] bg-white rounded-xl px-6 items-center justify-center border border-gray-200 text-sm font-semibold hover:bg-[#F8FAFC] transition-colors"
              >
                Login
              </button>
              
              {/* Mobile Menu Button */}
              <button className="lg:hidden p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 flex flex-col relative w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-6 md:px-12 bg-white flex flex-col md:flex-row justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-widest border-t border-gray-100 mt-auto">
        <div className="mb-2 md:mb-0 text-center md:text-left">© 2026 KEMENTERIAN LINGKUNGAN HIDUP / BADAN PENGENDALIAN LINGKUNGAN HIDUP</div>
        <div>SRN-Methodology-V2.0</div>
      </footer>
    </div>
  );
};

export default PublicLayout;
