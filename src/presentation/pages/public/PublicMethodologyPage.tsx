import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Search, Eye, MessageSquare, Loader2, FileText, Activity } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../components/DataTable';
import PublicLayout from '../../components/PublicLayout';
import { submissionService } from '../../../services/submission.service';
import type { Submission } from '../../../domain/models/Submission';
import { openKmClient } from '../../../services/api/apiClient';

interface SektorOption {
  id: string;
  name: string;
}

const PublicMethodologyPage: React.FC = () => {
  const navigate = useNavigate();
  // Tabs: IGRK-SPE and APRESIASI
  const [activeTab, setActiveTab] = useState<'igrk-spe' | 'apresiasi'>('igrk-spe');
  
  // State for original list from API
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtering states
  const [sektorOptions, setSektorOptions] = useState<SektorOption[]>([]);
  const [selectedSektor, setSelectedSektor] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);
        const res = await submissionService.getSubmissions(1, 100);
        setSubmissions(res.data);
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSektorOptions = async () => {
      try {
        const response = await openKmClient.get('/documents/list/category');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options = response.data.map((item: any) => ({
          id: item.NBS_UUID,
          name: item.NBS_NAME
        }));
        setSektorOptions(options);
      } catch (error) {
        console.error('Failed to fetch sektor options', error);
      }
    };

    fetchSubmissions();
    fetchSektorOptions();
  }, []);

  // Filter Submissions based on Tab, Sektor, and Search
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
      // Very basic local filtering mockup for Tab (IGRK-SPE vs APRESIASI) 
      // Assumption: document_type or some metadata distinction. 
      // For now we allow all if we can't strict verify.
      
      const searchMatch = sub.title?.toLowerCase().includes(searchQuery.toLowerCase());
      
      let sektorMatch = true;
      if (selectedSektor) {
         // This assumes sub.metadata.document_type maps to NBS_NAME or UUID, 
         // Adjust this based on actual data if needed.
         sektorMatch = true; 
      }
      
      return searchMatch && sektorMatch;
    });
  }, [submissions, searchQuery, selectedSektor, activeTab]);

  // Split into dua kategori: Disetujui / Aktif dan Dalam Proses
  const approvedMethodologies = useMemo(() => {
    return filteredSubmissions.filter(sub => 
      ['APPROVED', 'PUBLISHED'].includes(sub.internalReviewStatus || '')
    );
  }, [filteredSubmissions]);

  const inProcessMethodologies = useMemo(() => {
    return filteredSubmissions.filter(sub => 
      !['APPROVED', 'PUBLISHED'].includes(sub.internalReviewStatus || '')
    );
  }, [filteredSubmissions]);

  // State for expanded info
  const [showProsedur, setShowProsedur] = useState(false);

  // Column definitions remain exactly the same as previously defined...
  const columns = useMemo<ColumnDef<Submission>[]>(
    () => [
      {
        id: 'no',
        header: () => <div className="text-center w-12 text-[#1a385f]">No</div>,
        cell: (info) => (
          <div className="text-center text-gray-500 font-medium">
            {info.row.index + 1}
          </div>
        ),
      },
      {
        accessorKey: 'title',
        header: () => <div className="text-[#1a385f]">Nama Metodologi</div>,
        cell: (info) => (
          <span className="font-bold text-[#1a385f] hover:text-[#1e7e45] cursor-pointer transition-colors block leading-tight">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorFn: (row) => row.metadata?.document_type || '-',
        id: 'sektor',
        header: () => <div className="text-[#1a385f]">Jenis Dokumen</div>,
        cell: (info) => (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#e6f4ea] text-[#1e7e45]">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorFn: (row) => row.publisherId?.username || '-',
        id: 'sumber',
        header: () => <div className="text-[#1a385f]">Pengusul</div>,
        cell: (info) => <span className="text-gray-600 font-medium text-sm">{info.getValue() as string}</span>,
      },
      {
        accessorKey: 'internalReviewStatus',
        header: () => <div className="text-center text-[#1a385f]">Status</div>,
        cell: (info) => {
          const status = info.getValue() as string;
          const isActive = status === 'APPROVED' || status === 'PUBLISHED';
          
          return (
            <div className="flex justify-center">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm border ${
                isActive 
                  ? 'bg-gradient-to-r from-[#1e7e45] to-[#259755] text-white border-transparent' 
                  : 'bg-amber-50 text-amber-600 border-amber-200'
              }`}>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                {status || 'DRAFT'}
              </span>
            </div>
          );
        }
      },
      {
        id: 'actions',
        header: () => <div className="text-center text-[#1a385f]">Aksi</div>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        cell: (info) => (
          <div className="flex items-center justify-center gap-3">
            <button 
              onClick={() => navigate(`/metodologi/${info.row.original._id}`)}
              className="p-2 text-[#1a385f] bg-[#f0f4f8] rounded-md hover:bg-[#e1eaf3] hover:text-[#12284a] transition-all" 
              title="Lihat Detail"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button className="p-2 text-[#2c65a6] bg-[#eaf1f8] rounded-md hover:bg-[#dbe6f4] transition-all" title="Komentar Publik">
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <PublicLayout>
      {/* Decorative Hero Banner */}
      <div className="w-full bg-[#1a385f] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#1e7e45] to-transparent opacity-20 rounded-bl-full translate-x-20 -translate-y-20 blur-3xl"></div>
        
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-16 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 drop-shadow-md">
              Daftar <span className="text-[#4caf50]">Metodologi</span> <br/> Perubahan Iklim
            </h1>
            <p className="text-gray-300 text-sm md:text-base font-medium leading-relaxed">
              Jelajahi berbagai metodologi yang telah disetujui maupun yang sedang dalam proses pengajuan untuk program pengurangan emisi GRK di sistem registri nasional.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 flex flex-col lg:flex-row gap-8 w-full -mt-8 relative z-20">

        {/* Left Sidebar Filter */}
        <div className="w-full lg:w-[300px] flex-shrink-0 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-gray-100">
            <div className="p-5 bg-gradient-to-r from-[#f8f9fa] to-white border-b border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-[#e6f4ea] text-[#1e7e45] rounded-lg">
                <Filter className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-[#1a385f] text-[14px]">Filter Pencarian</h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Search Field */}
              <div>
                <label className="block mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Pencarian Kata Kunci</label>
                <div className="relative group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Contoh: Energi Baru..."
                    className="w-full px-4 py-2.5 text-sm border-2 border-gray-100 rounded-lg focus:ring-4 focus:ring-[#1a385f]/10 focus:border-[#1a385f] outline-none placeholder:text-gray-400 pr-10 transition-all bg-[#f8f9fa] group-hover:bg-white"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5 pointer-events-none group-focus-within:text-[#1a385f] transition-colors" />
                </div>
              </div>

              {/* Sektor Field */}
              <div>
                <label className="block mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kategori Sektor</label>
                <div className="relative group">
                  <select 
                    value={selectedSektor}
                    onChange={(e) => setSelectedSektor(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border-2 border-gray-100 rounded-lg focus:ring-4 focus:ring-[#1a385f]/10 focus:border-[#1a385f] outline-none text-gray-700 bg-[#f8f9fa] group-hover:bg-white appearance-none cursor-pointer transition-all"
                  >
                    <option value="">Semua Sektor Metodologi</option>
                    {sektorOptions.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <svg className="h-4 w-4 text-gray-400 group-focus-within:text-[#1a385f] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Status Filter (Optional for future, we currently split tables) */}
              <div>
                <label className="block mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ruang Lingkup</label>
                <div className="relative group">
                  <select className="w-full px-4 py-2.5 text-sm border-2 border-gray-100 rounded-lg focus:ring-4 focus:ring-[#1a385f]/10 focus:border-[#1a385f] outline-none text-gray-700 bg-[#f8f9fa] group-hover:bg-white appearance-none cursor-pointer transition-all">
                    <option>Semua Ruang Lingkup</option>
                    <option>Nasional</option>
                    <option>Internasional</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <svg className="h-4 w-4 text-gray-400 group-focus-within:text-[#1a385f] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button className="w-full py-3 text-[13px] font-bold text-white bg-[#1e7e45] rounded-lg hover:bg-[#186a39] hover:shadow-lg hover:-translate-y-0.5 transition-all outline-none">
                  Terapkan Filter
                </button>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedSektor(''); }}
                  className="w-full mt-3 py-2.5 text-[12px] font-bold text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all outline-none"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 w-full flex flex-col min-w-0 pb-16">

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-1 flex">
            <button
              onClick={() => setActiveTab('igrk-spe')}
              className={`flex-1 py-3.5 px-6 font-bold text-[14px] rounded-lg transition-all flex justify-center items-center gap-2 ${
                activeTab === 'igrk-spe' 
                  ? 'bg-[#1a385f] text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              METODOLOGI IGRK-SPE
            </button>
            <button
              onClick={() => setActiveTab('apresiasi')}
              className={`flex-1 py-3.5 px-6 font-bold text-[14px] rounded-lg transition-all flex justify-center items-center gap-2 ${
                activeTab === 'apresiasi' 
                  ? 'bg-[#1a385f] text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              METODOLOGI APRESIASI
            </button>
          </div>

          {/* Prosedur Pengusulan Info Widget */}
          <div className="bg-[#f4f7fb] border border-[#e1eaf3] rounded-xl mb-8 overflow-hidden transition-all duration-300">
            <button 
              onClick={() => setShowProsedur(!showProsedur)}
              className="w-full px-6 py-4 flex justify-between items-center bg-white hover:bg-[#fafcfe] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#eaf1f8] text-[#2c65a6] rounded-full">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h3 className="font-extrabold text-[#1a385f] text-[14px]">Prosedur Pengusulan Metodologi</h3>
                  <p className="text-[11px] text-gray-500 font-medium">Berdasarkan Peraturan Menteri LHK No. 21/2022</p>
                </div>
              </div>
              <div className={`p-2 rounded-full transition-transform duration-300 ${showProsedur ? 'rotate-180 bg-gray-100' : 'bg-white border border-gray-100 shadow-sm'}`}>
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            {/* Expandable Content Area */}
            <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${showProsedur ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="overflow-hidden">
                <div className="p-6 border-t border-[#e1eaf3] text-sm text-[#404852] leading-relaxed">
                  <p className="mb-4">
                    Dalam <strong>Peraturan Menteri LHK No. 21/2022, Pasal 60 ayat (2) huruf f</strong> disebutkan bahwa penerbitan SPE-GRK dari Offset emisi persyaratan metodologi yang digunakan untuk mengukur capaian kinerja Pengurangan emisi GRK harus memenuhi salah satu kriteria yaitu:
                  </p>
                  
                  <ul className="space-y-2 mb-6 ml-2">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1e7e45]/10 text-[#1e7e45] flex items-center justify-center font-bold text-xs mt-0.5">1</span>
                      <span>Ditetapkan oleh <strong>Direktur Jenderal</strong>;</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1e7e45]/10 text-[#1e7e45] flex items-center justify-center font-bold text-xs mt-0.5">2</span>
                      <span>Ditetapkan oleh <strong>Badan Standardisasi Nasional</strong>; atau</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1e7e45]/10 text-[#1e7e45] flex items-center justify-center font-bold text-xs mt-0.5">3</span>
                      <span>Disetujui oleh <strong>UNFCCC</strong>.</span>
                    </li>
                  </ul>
                  
                  <p className="mb-6 p-4 bg-white rounded-lg border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                    Guna memfasilitasi persyaratan dimaksud, melalui <strong>Keputusan Direktur Jenderal PPI No. 22/ PPI/GASP/PPI.2/6/2017</strong>, telah dibentuk Tim Panel Metodologi yang bertugas menetapkan metodologi yang dapat diusulkan dan digunakan oleh penanggungjawab aksi.
                  </p>

                  <div className="pt-5 border-t border-gray-200/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-[#1a385f] text-xs mb-1 uppercase tracking-wider">Layanan Bantuan Terkait Metodologi</h4>
                      <p className="text-[11px] text-gray-500 leading-tight">Direktorat Inventarisasi GRK dan MPV<br/>Deputi Bidang PPI dan TKNEK</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <a href="mailto:srnindonesia@kemenlh.go.id" className="inline-flex items-center gap-2 text-xs font-semibold text-[#0D5B6C] hover:text-[#1a385f] transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        srnindonesia@kemenlh.go.id
                      </a>
                      <div className="flex items-center gap-4 text-xs font-semibold text-[#0D5B6C]">
                        <a href="tel:+62215730144" className="inline-flex items-center gap-2 hover:text-[#1a385f] transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                          +62 (21) 5730144
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-32 bg-white rounded-xl shadow-sm border border-gray-100">
              <Loader2 className="w-10 h-10 text-[#1a385f] animate-spin mb-4" />
              <p className="text-gray-500 font-medium animate-pulse">Memuat data metodologi...</p>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Table 1: Metodologi Disetujui/Aktif */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b-2 border-gray-50 flex items-center gap-4 bg-gradient-to-r from-white to-[#f0f4f8]/30">
                  <div className="p-2.5 bg-[#e8f6ed] text-[#1e7e45] rounded-xl shadow-sm">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-[#1a385f] tracking-tight">Daftar Metodologi Tersedia</h2>
                    <p className="text-[11px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest">
                      Metodologi Terpublikasi & Disetujui
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <DataTable columns={columns} data={approvedMethodologies} />
                </div>
              </div>

              {/* Table 2: Metodologi Dalam Proses Pengajuan */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b-2 border-gray-50 flex items-center gap-4 bg-gradient-to-r from-white to-[#fef6e6]/30">
                  <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl shadow-sm">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-[#1a385f] tracking-tight">Metodologi dalam Proses Pengajuan</h2>
                    <p className="text-[11px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest">
                      Sedang Dalam Tahap Reviu & Panel
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <DataTable columns={columns} data={inProcessMethodologies} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default PublicMethodologyPage;
