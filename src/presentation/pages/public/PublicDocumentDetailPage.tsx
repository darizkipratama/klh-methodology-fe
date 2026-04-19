import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Share2, Printer, Info, CheckCircle2, FileText, History, Calendar, ChevronLeft, Home } from 'lucide-react';
import PublicLayout from '../../components/PublicLayout';

const PublicDocumentDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Using ID from route if needed for API fetch

  return (
    <PublicLayout>
      {/* Breadcrumb Navigation Area */}
      <div className="bg-white border-b border-gray-100 py-3 px-6 md:px-12 shadow-sm sticky top-[74px] z-40">
        <div className="max-w-[1200px] mx-auto flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
          <button onClick={() => navigate('/')} className="hover:text-[#1a385f] transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" /> Beranda
          </button>
          <span>/</span>
          <button onClick={() => navigate('/metodologi')} className="hover:text-[#1a385f] transition-colors">
            Metodologi
          </button>
          <span>/</span>
          <span className="text-[#1a385f]">Detail: MET-ENE-001</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto w-full p-6 md:p-8 space-y-6 lg:mt-4">
        
        {/* Navigation Back */}
        <button 
          onClick={() => navigate('/metodologi')}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#1a385f] transition-colors group mb-2"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Daftar Metodologi
        </button>

        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6 md:p-8 relative">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#e8f5ed] text-[#16a34a] text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
              Berhasil Publikasi
            </span>
            <span className="text-[11px] font-bold text-gray-400">ID: {id || 'MET-ENE-001'}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h1 className="text-[1.6rem] font-bold text-[#1a385f] leading-tight mb-3">
                Metodologi Efisiensi Energi pada Sistem Pembangkit Listrik Tenaga Uap (PLTU)
              </h1>
              <div className="flex items-center text-gray-500 text-xs">
                <Calendar className="w-4 h-4 mr-2" />
                Terakhir diperbarui: 15 Januari 2025
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-[#1a385f] transition-colors shadow-sm">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-[#1a385f] transition-colors shadow-sm">
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column (Main details) */}
          <div className="flex-1 space-y-6">
            
            {/* Informasi Metadata */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 bg-[#1a385f] rounded-full flex items-center justify-center text-white">
                    <Info className="w-3.5 h-3.5" />
                  </div>
                  <h2 className="text-lg font-bold text-[#1a385f]">Informasi Metadata</h2>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Sektor</span>
                      <span className="block text-sm font-bold text-[#1a385f]">Energi (Efisiensi Energi)</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Nama Pengembang Metodologi</span>
                      <span className="block text-sm font-bold text-[#1a385f]">PT. Inovasi Hijau Indonesia</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Mitigasi Outcome (Gas Rumah Kaca)</span>
                      <span className="block text-sm font-bold text-[#1a385f]">CO2, CH4, N2O</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Sumber Acuan</span>
                      <span className="block text-sm font-bold text-[#1a385f]">UNFCCC ACM0002 / SNI ISO 14064-2</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Tanggal Konsultasi Publik</span>
                      <span className="block text-sm font-bold text-[#1a385f]">12 November 2024</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Nomor Versi Saat Ini</span>
                      <span className="block text-sm font-bold text-[#1a385f]">v2.1.0 (<span className="text-[#16a34a]">Stabil</span>)</span>
                    </div>
                  </div>
                </div>

                {/* Assessment Report Ringkasan */}
                <div className="mt-8 bg-[#f8f9fa] border border-gray-100 rounded-lg p-5">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                    ASSESSMENT REPORT (RINGKASAN)
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    Berdasarkan hasil asesmen Tim Panel Metodologi, dokumen ini dinyatakan memenuhi kriteria ketelusuran (traceability) dan konservatisme dalam perhitungan baseline emisi. Rekomendasi teknis telah diintegrasikan pada sub-bab 4.2 terkait parameter monitoring.
                  </p>
                  <button className="flex items-center gap-2 text-sm font-bold text-[#1a385f] hover:underline">
                    <FileText className="w-4 h-4" />
                    Lihat Assessment Report Lengkap (PDF)
                  </button>
                </div>
              </div>
            </div>

            {/* Riwayat Versi & Perubahan */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 text-[#1a385f] flex items-center justify-center">
                    <History className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-[#1a385f]">Riwayat Versi & Perubahan</h2>
                </div>

                <div className="space-y-0 pl-3">
                  
                  {/* Item 1 */}
                  <div className="relative pl-6 pb-8 border-l-[3px] border-[#1a385f]">
                    <div className="absolute w-3 h-3 bg-[#1a385f] rounded-full -left-[1.5px] top-1 transform -translate-x-1/2"></div>
                    <div className="flex justify-between items-start mb-1 -mt-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#1a385f]">Versi 2.1.0 (Terbaru)</span>
                      </div>
                      <span className="bg-[#1a385f] text-white text-[10px] font-bold px-2 py-0.5 rounded">Aktif</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-800 mt-2 mb-1">Pembaruan Parameter Emisi Grid</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Perubahan pada faktor emisi grid sesuai data RUPTL 2024-2033 dan penyesuaian rumus perhitungan kebocoran (leakage).
                    </p>
                  </div>

                  {/* Item 2 */}
                  <div className="relative pl-6 pb-8 border-l-[3px] border-gray-200">
                    <div className="absolute w-3 h-3 bg-gray-200 rounded-full -left-[1.5px] top-1 transform -translate-x-1/2"></div>
                    <div className="flex justify-between items-start mb-1 -mt-1">
                      <span className="font-bold text-gray-700">Versi 2.0.0</span>
                      <span className="text-[11px] text-gray-400 font-medium italic">10 Oktober 2024</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-800 mt-2 mb-1">Restrukturisasi Dokumen</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Penyelarasan format sesuai Peraturan Menteri LHK No. 21 Tahun 2022.
                    </p>
                  </div>

                  {/* Item 3 */}
                  <div className="relative pl-6 border-l-[3px] border-transparent">
                    <div className="absolute w-3 h-3 bg-gray-200 rounded-full -left-[1.5px] top-1 transform -translate-x-1/2"></div>
                    <div className="flex justify-between items-start mb-1 -mt-1">
                      <span className="font-bold text-gray-700">Versi 1.0.0</span>
                      <span className="text-[11px] text-gray-400 font-medium italic">05 Juni 2024</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-800 mt-2 mb-1">Draft Awal (Baseline)</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Pengajuan pertama kali untuk peninjauan Sekretariat.
                    </p>
                  </div>

                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Sidebar metrics) */}
          <div className="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-6">
            
            {/* Status Pengajuan */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6">
              <h3 className="text-xs font-bold text-[#1a385f] uppercase tracking-widest mb-6">
                STATUS PENGAJUAN
              </h3>
              
              <div className="space-y-0">
                {/* Step 1 */}
                <div className="flex gap-4 pb-6 relative">
                  <div className="absolute left-[15px] top-[32px] bottom-[-8px] w-[2px] bg-[#16a34a]"></div>
                  <div className="w-8 h-8 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 z-10">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="pt-1.5 flex flex-col">
                    <span className="text-[13px] font-bold text-[#16a34a]">Penerimaan Sekretariat</span>
                    <span className="text-[10px] text-gray-400">Selesai: 20 Juni 2024</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4 pb-6 relative">
                  <div className="absolute left-[15px] top-[32px] bottom-[-8px] w-[2px] bg-[#16a34a]"></div>
                  <div className="w-8 h-8 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 z-10">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="pt-1.5 flex flex-col">
                    <span className="text-[13px] font-bold text-[#16a34a]">Dalam Pembahasan</span>
                    <span className="text-[10px] text-gray-400">Selesai: 15 Desember 2024</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4 relative">
                  <div className="w-8 h-8 rounded-full bg-[#8ba2ca] text-white flex items-center justify-center shrink-0 z-10 border border-white shadow-sm overflow-hidden">
                    {/* Tiny grid pattern effect matching mockup */}
                    <div className="w-full h-full opacity-60 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent bg-[length:3px_3px]"></div>
                  </div>
                  <div className="pt-1.5 flex flex-col">
                    <span className="text-[13px] font-bold text-[#1a385f]">Berhasil Publikasi</span>
                    <span className="text-[10px] text-gray-400 italic">Aktif di Repository</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bantuan Teknis */}
            <div className="bg-[#1e7e45] rounded-xl shadow-md p-6 text-white relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
              <h3 className="text-sm font-bold mb-2 relative z-10">Bantuan Teknis</h3>
              <p className="text-[11px] text-[#e8f5ed] leading-relaxed mb-5 relative z-10">
                Hubungi administrator terkait metodologi ini untuk informasi teknis lebih lanjut.
              </p>
              <button 
                onClick={() => navigate('/login')}
                className="w-full py-2.5 bg-white text-[#1e7e45] text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-sm relative z-10"
              >
                Masuk untuk Diskusi
              </button>
            </div>

          </div>

        </div>
      </div>
    </PublicLayout>
  );
};

export default PublicDocumentDetailPage;
