/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Search, Eye, MessageSquare, Loader2, FileText, Activity } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../components/DataTable';
import PublicLayout from '../../components/PublicLayout';
import { submissionService } from '../../../services/submission.service';
import { openkmService } from '../../../services/openkm.service';
import type { Submission } from '../../../domain/models/Submission';
import { openKmClient } from '../../../services/api/apiClient';
import type { PublicMethodologyColumn } from '../../../domain/models/Public';
// import { PublicMethodologyColumns, type PublicMethodologyColumn } from '../../../domain/models/Public';
interface SektorOption {
  id: string;
  name: string;
}

const PublicMethodologyPage: React.FC = () => {
  const navigate = useNavigate();
  // Tabs: IGRK-SPE and APRESIASI
  const [activeTab, setActiveTab] = useState<'nek' | 'apresiasi'>('apresiasi');
  
  // State for original list from API
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [publicMethodologies, setPublicMethodologies] = useState<PublicMethodologyColumn[]>([]);
  const [isOpenKmLoading, setIsOpenKmLoading] = useState(true);
  const [isSubmissionsLoading, setIsSubmissionsLoading] = useState(true);
  
  // Filtering states
  const [sektorOptions, setSektorOptions] = useState<SektorOption[]>([]);
  const [selectedSektor, setSelectedSektor] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSumber, setSelectedSumber] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  useEffect(() => {
    const fetchOpenKmData = async () => {
        setIsOpenKmLoading(true);
        console.log('Selected Sektor for OpenKM fetch:', selectedSektor); // Debug log to check selectedSektor value
        if(selectedSektor !== '') {
          try {
            const res = await openkmService.getMethodology(selectedSektor, '553f2bcb-397d-4c50-8e13-5f312b27fedc');
            const reducedRes = res.map(entry => {
                const flattenItems:PublicMethodologyColumn = {
                    number: '',
                    name: '',
                    source: '',
                    status: '',
                    klasifikasi: '',
                    nbs_uuid: entry.nbs_uuid,
                    nbs_name: entry.nbs_name,
                    nbs_category: entry.nbs_category,
                };
                entry.items.forEach(item => {
                  // console.log('Processing item:', item); // Debug log to check each item
                  if(item.npg_name == "okp:methodology.name") {
                    flattenItems.name = item.npg_value;
                  } else if(item.npg_name == "okp:methodology.isactive") {
                    flattenItems.status = item.npg_value;
                  } else if(item.npg_name == "okp:methodology.nomor") {
                    flattenItems.number = item.npg_value;
                  }  else if(item.npg_name == "okp:methodology.approval") {
                    flattenItems.source = item.npg_value;
                  } else if(item.npg_name == "okp:methodology.classification") {
                    flattenItems.klasifikasi = item.npg_value;
                  }
                });
              return {
                  ...flattenItems
              } ;
            });
          setPublicMethodologies(reducedRes);
          console.log('Reduced OpenKM Data:', reducedRes); // Debug log to check the transformed data structure
        } catch (error) {
          console.error('Failed to fetch OpenKM categories', error);
        } finally {
          setIsOpenKmLoading(false);
        }
      }
    };

    fetchOpenKmData();
  }, [selectedSektor]); // Re-fetch if selectedSektor changes, adjust as needed

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsSubmissionsLoading(true);
        const res = await submissionService.getSubmissions(1, 100);
        setSubmissions(res.data);
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
      } finally {
        setIsSubmissionsLoading(false);
      }
    };

    const fetchSektorOptions = async () => {
      try {
        const response = await openKmClient.get('/documents/list/category');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options = response.data.map((item: any) => ({
          id: item.NBS_UUID,
          name: item.NBS_NAME
        })).sort((a: any, b: any  ) => {
          const matchA = a.name.match(/^(\d+)/);
          const matchB = b.name.match(/^(\d+)/);
          
          if (matchA && matchB) {
            return parseInt(matchA[1], 10) - parseInt(matchB[1], 10);
          }
          if (matchA) return -1;
          if (matchB) return 1;
          return a.name.localeCompare(b.name);
        });
        setSektorOptions(options);
        if (options.length > 0) {
          setSelectedSektor(options[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch sektor options', error);
      }
    };

    fetchSubmissions();
    fetchSektorOptions();
  }, []);

  // Filter public methodologies based on Tab and Search
  // (Note: Sektor filtering is handled by the API call, so we only filter by search and tab here)
  const filteredPublicMethodologies = useMemo(() => {
    return publicMethodologies.filter(item => {
      // Filter by Search Query
      const q = searchQuery.toLowerCase();
      const searchMatch = !q || 
        (item.name && item.name.toLowerCase().includes(q)) || 
        (item.number && item.number.toLowerCase().includes(q));
      
      // Filter by Tab (NEK vs APRESIASI)
      let tabMatch = true;
      const klasifikasi = (item.klasifikasi || '').toLowerCase();
      if (activeTab === 'nek') {
        tabMatch = klasifikasi.includes('nek');
      }

      // Filter by Sumber
      let sumberMatch = true;
      if (selectedSumber) {
        const itemSource = (item.source || '').replace(/^\["|"\]$/g, '');
        sumberMatch = itemSource === selectedSumber;
      }

      // Filter by Status
      let statusMatch = true;
      if (selectedStatus) {
        const itemStatus = (item.status || '');
        const isActive = itemStatus.replace(/^\["|"\]$/g, '') === 'TRUE' || itemStatus === '1';
        if (selectedStatus === 'Aktif') statusMatch = isActive;
        if (selectedStatus === 'Non-Aktif') statusMatch = !isActive;
      }
      
      return searchMatch && tabMatch && sumberMatch && statusMatch;
    });
  }, [publicMethodologies, searchQuery, activeTab, selectedSumber, selectedStatus]);

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

   // Column definitions for PublicMethodologyColumn from OpenKM
   const publicMethodologyColumns = useMemo<ColumnDef<PublicMethodologyColumn>[]>(
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
         accessorKey: 'number',
         header: () => <div className="text-[#1a385f]">Nomor</div>,
         cell: (info) => (
           <span className="font-bold text-[#1a385f]">
             {info.getValue() as string}
           </span>
         ),
       },
       {
         accessorKey: 'name',
         header: () => <div className="text-[#1a385f]">Nama Metodologi</div>,
         cell: (info) => (
           <span className="font-bold text-[#1a385f] hover:text-[#1e7e45] cursor-pointer transition-colors block leading-tight max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
             {info.getValue() as string}
           </span>
         ),
       },
       {
         accessorKey: 'nbs_name',
         header: () => <div className="text-[#1a385f]">Nama Dokumen</div>,
         cell: (info) => (
           <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#e6f4ea] text-[#1e7e45]">
             {info.getValue() as string}
           </span>
         ),
       },
       {
         accessorKey: 'klasifikasi',
         header: () => <div className="text-[#1a385f]">Klasifikasi</div>,
         cell: (info) => {
            const source = info.getValue() as string;
            const dataSource = source.replace(/^\["|"\]$/g, '');
            return (
              <span className="text-gray-600 font-medium text-sm">{dataSource.toUpperCase()}</span>
            );
         },
       },
       {
         accessorKey: 'source',
         header: () => <div className="text-center text-[#1a385f]">Sumber</div>,
         cell: (info) => {
           const source = info.getValue() as string;
           const dataSource = source.replace(/^\["|"\]$/g, '');
           return (
             <div className="flex justify-center">
               <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm border ${
                 dataSource === 'SK-DIRJEN'
                   ? 'bg-linear-to-r from-[#1e7e45] to-[#259755] text-white border-transparent'
                   : 'bg-amber-50 text-amber-600 border-amber-200'
               }`}>
                 {dataSource || '-'}
               </span>
             </div>
           );
         }
       },
       {
         accessorKey: 'status',
         header: () => <div className="text-center text-[#1a385f]">Status</div>,
         cell: (info) => {
           const status = info.getValue() as string;
           const isActive = status.replace(/^\["|"\]$/g, '') === 'TRUE' || status === '1'; // Adjust based on actual values
           
           return (
             <div className="flex justify-center">
               <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm border ${
                 isActive 
                   ? 'bg-gradient-to-r from-[#1e7e45] to-[#259755] text-white border-transparent'
                   : 'bg-amber-50 text-amber-600 border-amber-200'
               }`}>
                 {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                 {status.replace(/^\["|"\]$/g, '') || '-'}
               </span>
             </div>
           );
         }
       },
       {
         id: 'actions',
         header: () => <div className="text-center text-[#1a385f]">Aksi</div>,
         cell: (info) => (
           <div className="flex items-center justify-center gap-3">
             <button 
               onClick={() => navigate(`/metodologi/${info.row.original.nbs_uuid}`)}
               className="p-2 text-[#1a385f] bg-[#f0f4f8] rounded-md hover:bg-[#e1eaf3] hover:text-[#12284a] transition-all" 
               title="Lihat Detail"
             >
               <Eye className="w-4 h-4" />
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
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 flex flex-col gap-8 w-full -mt-8 relative z-20 pb-16">
        
          <div className="space-y-10">
            {/* Filter and Table 1 Container */}
            <div className="flex flex-col lg:flex-row gap-6 items-stretch">
              
              {/* Left Sidebar Filter - Specific to Table 1 */}
              <div className="w-full lg:w-[320px] flex-shrink-0 flex flex-col">
                <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 h-full flex flex-col overflow-hidden">
                  <div className="p-5 bg-gradient-to-r from-[#f8f9fa] to-white border-b border-gray-100 flex items-center gap-3 shrink-0">
                    <div className="p-2 bg-[#e6f4ea] text-[#1e7e45] rounded-lg">
                      <Filter className="w-4 h-4" />
                    </div>
                    <h2 className="font-bold text-[#1a385f] text-[14px]">Filter Tabel OpenKM</h2>
                  </div>

                  <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                    {/* Sektor Field */}
                    <div>
                      <label className="block mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kategori Sektor</label>
                      <div className="relative group">
                        <select 
                          value={selectedSektor}
                          onChange={(e) => setSelectedSektor(e.target.value)}
                          className="w-full px-4 py-2.5 text-sm border-2 border-gray-100 rounded-lg focus:ring-4 focus:ring-[#1a385f]/10 focus:border-[#1a385f] outline-none text-gray-700 bg-[#f8f9fa] group-hover:bg-white appearance-none cursor-pointer transition-all"
                        >
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

                    {/* Status Filter */}
                    <div>
                      <label className="block mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sumber</label>
                      <div className="relative group">
                        <select 
                          value={selectedSumber}
                          onChange={(e) => setSelectedSumber(e.target.value)}
                          className="w-full px-4 py-2.5 text-sm border-2 border-gray-100 rounded-lg focus:ring-4 focus:ring-[#1a385f]/10 focus:border-[#1a385f] outline-none text-gray-700 bg-[#f8f9fa] group-hover:bg-white appearance-none cursor-pointer transition-all"
                        >
                          <option value="">Semua Sumber</option>
                          <option value="CDM">CDM</option>
                          <option value="SK-DIRJEN">SK-DIRJEN</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                          <svg className="h-4 w-4 text-gray-400 group-focus-within:text-[#1a385f] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</label>
                      <div className="relative group">
                        <select 
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="w-full px-4 py-2.5 text-sm border-2 border-gray-100 rounded-lg focus:ring-4 focus:ring-[#1a385f]/10 focus:border-[#1a385f] outline-none text-gray-700 bg-[#f8f9fa] group-hover:bg-white appearance-none cursor-pointer transition-all"
                        >
                          <option value="">Semua Status</option>
                          <option value="Aktif">Aktif</option>
                          <option value="Non-Aktif">Non-Aktif</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                          <svg className="h-4 w-4 text-gray-400 group-focus-within:text-[#1a385f] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

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
                  </div>

                  <div className="p-6 pt-5 shrink-0 border-t border-gray-100 bg-gray-50/80">
                    {/* <button className="w-full py-3 text-[13px] font-bold text-white bg-[#1e7e45] rounded-lg hover:bg-[#186a39] hover:shadow-lg hover:-translate-y-0.5 transition-all outline-none">
                      Terapkan Filter
                    </button> */}
                    <button 
                      onClick={() => { setSearchQuery(''); setSelectedSektor(sektorOptions.length > 0 ? sektorOptions[0].id : ''); setSelectedSumber(''); setSelectedStatus(''); }}
                      className="w-full mt-3 py-2.5 text-[12px] font-bold text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all outline-none"
                    >
                      Reset Filter
                    </button>
                  </div>
                </div>
              </div>

              {/* Table 1: Metodologi Disetujui/Aktif */}
              <div className="flex-1 min-w-0 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden" style={{ minHeight: '450px' }}>
                <div className="px-6 py-5 border-b-2 border-gray-50 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-gradient-to-r from-white to-[#f0f4f8]/30 shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-[#e8f6ed] text-[#1e7e45] rounded-xl shadow-sm shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-[#1a385f] tracking-tight">Daftar Metodologi Yang Sudah Disetujui</h2>
                      <p className="text-[11px] font-bold text-[#1e7e45] mt-0.5 uppercase tracking-widest bg-[#e8f6ed] inline-block px-2 py-0.5 rounded">
                        Terkoneksi dengan Filter
                      </p>
                    </div>
                  </div>

                  {/* Table Tabs */}
                  <div className="bg-[#eaf1f8] p-1 rounded-lg flex items-center shadow-inner border border-blue-50 shrink-0 self-start xl:self-auto">
                    <button
                      onClick={() => setActiveTab('nek')}
                      className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${
                        activeTab === 'nek' 
                          ? 'bg-white text-[#1a385f] shadow-sm' 
                          : 'text-gray-500 hover:text-[#1a385f] hover:bg-white/50'
                      }`}
                    >
                      METODOLOGI NEK
                    </button>
                    <button
                      onClick={() => setActiveTab('apresiasi')}
                      className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${
                        activeTab === 'apresiasi' 
                          ? 'bg-white text-[#1a385f] shadow-sm' 
                          : 'text-gray-500 hover:text-[#1a385f] hover:bg-white/50'
                      }`}
                    >
                      METODOLOGI APRESIASI
                    </button>
                  </div>
                </div>
                {/* Overflow container forces the table area to be scrollable rather than stretching the whole card infinitely */}
                <div className="p-0 flex-1 overflow-auto bg-gray-50/30">
                  <div className="p-6 min-w-full h-full flex flex-col">
                    {isOpenKmLoading ? (
                      <div className="flex flex-col justify-center items-center py-24 m-auto">
                        <Loader2 className="w-10 h-10 text-[#1a385f] animate-spin mb-4" />
                        <p className="text-gray-500 font-medium animate-pulse">Sedang Proses Mengambil Data...</p>
                      </div>
                    ) : (
                      <DataTable columns={publicMethodologyColumns} data={filteredPublicMethodologies} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Table 2: Metodologi Dalam Proses Pengajuan */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full">
              <div className="px-6 py-5 border-b-2 border-gray-50 flex items-center gap-4 bg-gradient-to-r from-white to-[#fef6e6]/30">
                <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl shadow-sm">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#1a385f] tracking-tight">Metodologi dalam Proses Pengajuan</h2>
                  <p className="text-[11px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest">
                    Sedang Dalam Tahap Persetujuan & Panel Diskusi
                  </p>
                </div>
              </div>
              <div className="p-6">
                {isSubmissionsLoading ? (
                  <div className="flex flex-col justify-center items-center py-16">
                    <Loader2 className="w-8 h-8 text-[#1a385f] animate-spin mb-4" />
                    <p className="text-gray-500 font-medium animate-pulse">Memuat pengajuan metodologi...</p>
                  </div>
                ) : (
                  <DataTable columns={columns} data={submissions} />
                )}
              </div>
            </div>
          </div>

          {/* Methodology Submission CTA */}
          <div className="mt-8 bg-gradient-to-br from-[#1a385f] to-[#12284a] rounded-2xl shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#1e7e45]/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
            
            <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-4 text-[#e8f6ed]">
                  <Activity className="w-4 h-4" />
                  <span>Partisipasi Anda Dibutuhkan</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-3 text-white leading-tight">
                  Punya Inovasi Metodologi Pengurangan Emisi?
                </h3>
                <p className="text-blue-100/80 text-sm md:text-base leading-relaxed mb-6 max-w-2xl">
                  Berdasarkan Peraturan Menteri LHK No. 21/2022, Anda dapat berkontribusi dalam aksi iklim dengan mengusulkan metodologi baru. Mari berkolaborasi menciptakan standar pengukuran kinerja penurunan emisi GRK yang lebih baik untuk Indonesia.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => setShowProsedur(!showProsedur)}
                    className="px-6 py-3 bg-white text-[#1a385f] hover:bg-gray-50 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    <span>Lihat Prosedur Pengusulan</span>
                  </button>
                  <a 
                    href="mailto:srnindonesia@kemenlh.go.id"
                    className="px-6 py-3 bg-transparent border-2 border-white/20 text-white hover:bg-white/10 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Hubungi Tim Panel</span>
                  </a>
                </div>
              </div>
              
              <div className="hidden lg:block flex-shrink-0 relative">
                <div className="w-40 h-40 bg-gradient-to-tr from-[#1e7e45] to-[#4caf50] rounded-full opacity-20 animate-pulse absolute -inset-4 blur-xl"></div>
                <div className="w-32 h-32 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-2xl relative z-10 rotate-3 hover:rotate-0 transition-transform duration-500">
                  <FileText className="w-16 h-16 text-white/90" />
                </div>
              </div>
            </div>

            {/* Expandable Procedure Section */}
            <div className={`transition-all duration-500 ease-in-out border-t border-white/10 bg-black/20 backdrop-blur-sm ${showProsedur ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              <div className="p-8 md:p-10 text-blue-50/90 text-sm leading-relaxed">
                <div className="max-w-3xl">
                  <p className="mb-6 text-base">
                    Penerbitan SPE-GRK dari Offset emisi mensyaratkan metodologi pengukuran capaian kinerja yang memenuhi kriteria:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col items-center text-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1e7e45]/30 text-[#4caf50] flex items-center justify-center font-black text-lg">1</div>
                      <span className="font-semibold text-white">Ditetapkan oleh Direktur Jenderal</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col items-center text-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1e7e45]/30 text-[#4caf50] flex items-center justify-center font-black text-lg">2</div>
                      <span className="font-semibold text-white">Ditetapkan oleh Badan Standardisasi Nasional</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col items-center text-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1e7e45]/30 text-[#4caf50] flex items-center justify-center font-black text-lg">3</div>
                      <span className="font-semibold text-white">Disetujui oleh UNFCCC</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-6 items-start bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="flex-1">
                      <h4 className="font-bold text-white mb-2">Layanan Bantuan Metodologi</h4>
                      <p className="text-blue-100/70 mb-4">Direktorat Inventarisasi GRK dan MPV<br/>Deputi Bidang PPI dan TKNEK</p>
                      <div className="flex flex-col gap-3">
                        <a href="mailto:srnindonesia@kemenlh.go.id" className="inline-flex items-center gap-3 text-white hover:text-[#4caf50] transition-colors">
                          <div className="p-2 rounded-lg bg-white/10"><MessageSquare className="w-4 h-4" /></div>
                          <span className="font-medium">srnindonesia@kemenlh.go.id</span>
                        </a>
                        <a href="tel:+62215730144" className="inline-flex items-center gap-3 text-white hover:text-[#4caf50] transition-colors">
                          <div className="p-2 rounded-lg bg-white/10"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg></div>
                          <span className="font-medium">+62 (21) 5730144</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </PublicLayout>
  );
};

export default PublicMethodologyPage;
