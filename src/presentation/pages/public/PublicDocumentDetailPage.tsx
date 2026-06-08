import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Share2, Printer, Info, FileText, History, Calendar, ChevronLeft, Home, Loader2 } from 'lucide-react';
import PublicLayout from '../../components/PublicLayout';
import { openkmService } from '../../../services/openkm.service';
import type { OpenKmMetadata } from '../../../domain/models/Public';

const DownloadButton: React.FC<{ documentId: string }> = ({ documentId }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleClick = async () => {
    setIsDownloading(true);
    try {
      const blob = await openkmService.downloadMethodology(documentId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `-assessment-report-${documentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download file:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDownloading}
      className="flex items-center gap-2 text-sm font-bold text-[#1a385f] hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isDownloading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Memuat file...
        </>
      ) : (
        <>
          <FileText className="w-4 h-4" />
          Lihat Assessment Report Lengkap (PDF)
        </>
      )}
    </button>
  );
};

const PublicDocumentDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<OpenKmMetadata[]>([]);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await openkmService.getMethodologyDetail(id);
        setMetadata(data);
      } catch (err) {
        console.error('Failed to fetch methodology detail:', err);
        setError('Gagal memuat data metodologi.');
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [id]);

  const getValue = (name: string): string => {
    const item = metadata.find((m) => m.NPG_NAME === name);
    return item?.NPG_VALUE || '';
  };

  const methodologyName = getValue('okp:methodology.name');
  const methodologyNumber = getValue('okp:methodology.nomor');
  const methodologyStatus = getValue('okp:methodology.isactive').replace(/^\["|"\]$/g, '');
  const methodologyApproval = getValue('okp:methodology.approval').replace(/^\["|"\]$/g, '');
  const methodologyCdmUrl = getValue('okp:methodology.cdm_url');
  const methodologyStatusDate = getValue('okp:methodology.statusdate');

  const formatDate = (dateStr: string): string => {
    if (!dateStr || dateStr.length < 8) return '';
    const year = dateStr.slice(0, 4);
    const month = dateStr.slice(4, 6);
    const day = dateStr.slice(6, 8);
    return `${day}/${month}/${year}`;
  };

  const formattedStatusDate = formatDate(methodologyStatusDate);

  const isoStatus = methodologyStatus === 'TRUE' || methodologyStatus === 'true' || methodologyStatus === '1';

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex flex-col justify-center items-center py-32">
          <Loader2 className="w-12 h-12 text-[#1a385f] animate-spin mb-4" />
          <p className="text-gray-500 font-medium animate-pulse">Sedang memuat data metodologi...</p>
        </div>
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout>
        <div className="flex flex-col justify-center items-center py-32">
          <p className="text-red-500 font-medium mb-4">{error}</p>
          <button
            onClick={() => navigate('/metodologi')}
            className="px-4 py-2 bg-[#1a385f] text-white rounded-lg hover:bg-[#12284a] transition-colors"
          >
            Kembali ke Daftar
          </button>
        </div>
      </PublicLayout>
    );
  }

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
          <span className="text-[#1a385f]">Detail: {methodologyNumber || id}</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto w-full p-6 md:p-8 space-y-6 lg:mt-4">
        
        {/* Navigation Back */}
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
            <span className={`${isoStatus ? 'bg-[#e8f5ed] text-[#16a34a]' : 'bg-amber-50 text-amber-600'} text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider`}>
              {isoStatus ? 'Berhasil Publikasi' : 'Menunggu Publikasi'}
            </span>
            <span className="text-[11px] font-bold text-gray-400">ID: {id}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h1 className="text-[1.6rem] font-bold text-[#1a385f] leading-tight mb-3">
                {methodologyName || 'Metodologi'}
              </h1>
              <div className="flex items-center text-gray-500 text-xs">
                <Calendar className="w-4 h-4 mr-2" />
                {formattedStatusDate ? `Terakhir diperbarui: ${formattedStatusDate}` : 'Tanggal tidak tersedia'}
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
                      <span className="block text-xs text-gray-500 mb-1">Nomor Metodologi</span>
                      <span className="block text-sm font-bold text-[#1a385f]">{methodologyNumber || '-'}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Nama Metodologi</span>
                      <span className="block text-sm font-bold text-[#1a385f]">{methodologyName || '-'}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Status</span>
                      <span className={`block text-sm font-bold ${isoStatus ? 'text-[#16a34a]' : 'text-amber-600'}`}>
                        {isoStatus ? 'Aktif' : 'Non-Aktif'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Sumber / Approval</span>
                      <span className="block text-sm font-bold text-[#1a385f]">{methodologyApproval || '-'}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Tanggal Update</span>
                      <span className="block text-sm font-bold text-[#1a385f]">{methodologyStatusDate || '-'}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Link CDM UNFCCC</span>
                      {methodologyCdmUrl ? (
                        <a
                          href={methodologyCdmUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm font-bold text-[#1e7e45] hover:underline"
                        >
                          {methodologyCdmUrl}
                        </a>
                      ) : (
                        <span className="block text-sm font-bold text-[#1a385f]">-</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Assessment Report Ringkasan */}
                <div className="mt-8 bg-[#f8f9fa] border border-gray-100 rounded-lg p-5">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                    ASSESSMENT REPORT (RINGKASAN)
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    Berdasarkan hasil asesmen Tim Panel Metodologi, dokumen ini dinyatakan memenuhi kriteria ketelurusan (traceability) dan konservatisme dalam perhitungan baseline emisi. Rekomendasi teknis telah diintegrasikan pada sub-bab 4.2 terkait parameter monitoring.
                  </p>
                  {methodologyApproval === 'CDM' && methodologyCdmUrl ? (
                    <a
                      href={methodologyCdmUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-bold text-[#1a385f] hover:underline"
                    >
                      <FileText className="w-4 h-4" />
                      Buka di CDM UNFCCC
                    </a>
                  ) : (
                    <DownloadButton documentId={id || ''} />
                  )}
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
            {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6">
              <h3 className="text-xs font-bold text-[#1a385f] uppercase tracking-widest mb-6">
                STATUS PENGAJUAN
              </h3>
              
              <div className="space-y-0"> */}
                {/* Step 1 */}
                {/* <div className="flex gap-4 pb-6 relative">
                  <div className="absolute left-[15px] top-[32px] bottom-[-8px] w-[2px] bg-[#16a34a]"></div>
                  <div className="w-8 h-8 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 z-10">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="pt-1.5 flex flex-col">
                    <span className="text-[13px] font-bold text-[#16a34a]">Penerimaan Sekretariat</span>
                    <span className="text-[10px] text-gray-400">Selesai: 20 Juni 2024</span>
                  </div>
                </div> */}

                {/* Step 2 */}
                {/* <div className="flex gap-4 pb-6 relative">
                  <div className="absolute left-[15px] top-[32px] bottom-[-8px] w-[2px] bg-[#16a34a]"></div>
                  <div className="w-8 h-8 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 z-10">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="pt-1.5 flex flex-col">
                    <span className="text-[13px] font-bold text-[#16a34a]">Dalam Pembahasan</span>
                    <span className="text-[10px] text-gray-400">Selesai: 15 Desember 2024</span>
                  </div>
                </div> */}

                {/* Step 3 */}
                {/* <div className="flex gap-4 relative">
                  <div className="w-8 h-8 rounded-full bg-[#8ba2ca] text-white flex items-center justify-center shrink-0 z-10 border border-white shadow-sm overflow-hidden">
                    <div className="w-full h-full opacity-60 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent bg-[length:3px_3px]"></div>
                  </div>
                  <div className="pt-1.5 flex flex-col">
                    <span className="text-[13px] font-bold text-[#1a385f]">Berhasil Publikasi</span>
                    <span className="text-[10px] text-gray-400 italic">Aktif di Repository</span>
                  </div>
                </div>
              </div>
            </div> */}

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