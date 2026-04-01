import React, { useState, useMemo } from 'react';
import { Filter, Search, Eye, Download, Plus } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../components/DataTable';

// Types and mock data mapping to Domain/Models later
interface Metodologi {
  id: string;
  name: string;
  sektor: string;
  sumber: string;
  status: string;
}

const mockTableData: Metodologi[] = [
  { id: '01', name: 'Metodologi Efisiensi Energi pada Industri Semen', sektor: 'Energi', sumber: 'Dirjen PPI', status: 'Aktif' },
  { id: '02', name: 'Restorasi Ekosistem Gambut (AR-ACM0001)', sektor: 'FOLU', sumber: 'UNFCCC', status: 'Aktif' },
  { id: '03', name: 'Pengelolaan Limbah Cair Domestik Terpadu', sektor: 'Limbah', sumber: 'BSN (SNI)', status: 'Aktif' },
];

const ExternalDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'spe-grk' | 'apresiasi'>('spe-grk');

  // TanStack Table Column Definition
  const columns = useMemo<ColumnDef<Metodologi>[]>(
    () => [
      {
        accessorKey: 'id',
        header: () => <div className="text-center w-8">No</div>,
        cell: (info) => (
          <div className="text-center text-gray-400 font-medium">
            {info.getValue() as string}
          </div>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Nama Metodologi',
        cell: (info) => (
          <span className="font-bold text-[#0a2558] tracking-wide">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: 'sektor',
        header: 'Sektor',
        cell: (info) => <span className="text-gray-500">{info.getValue() as string}</span>,
      },
      {
        accessorKey: 'sumber',
        header: 'Sumber',
        cell: (info) => <span className="text-gray-500">{info.getValue() as string}</span>,
      },
      {
        accessorKey: 'status',
        header: () => <div className="text-center">Status</div>,
        cell: (info) => (
          <div className="text-center">
            <span className={`inline-flex font-bold text-[11px] tracking-widest ${(info.getValue() as string) === 'Aktif' ? 'text-[#1e7845]' : 'text-gray-400'}`}>
              {info.getValue() as string}
            </span>
          </div>
        ),
      },
      {
        id: 'actions',
        header: () => <div className="text-center">Aksi</div>,
        cell: () => (
          <div className="flex items-center justify-center gap-4">
            <button className="text-[#0a2558] text-opacity-80 hover:text-opacity-100 transition-colors" title="Lihat">
              <Eye className="w-4 h-4" />
            </button>
            <button className="text-[#1e7845] text-opacity-80 hover:text-opacity-100 transition-colors" title="Unduh">
              <Download className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* Breadcrumb Header */}
      <div className="w-full px-8 py-3 bg-[#fafcfd] border-b border-gray-100 flex items-center">
        <div className="text-[11px] font-medium text-gray-400">
          Beranda / Instrumen / <span className="text-gray-600">Metodologi yang Disetujui</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto p-6 md:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
        
        {/* Left Sidebar */}
        <div className="w-full lg:w-[270px] flex-shrink-0 flex flex-col gap-5">
          
          {/* Filter Card */}
          <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
            <div className="px-5 py-4 bg-[#fafcfd] border-b border-gray-100 flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#0a2558]" />
              <h2 className="font-bold text-[#0a2558] text-[13px]">Filter Metodologi</h2>
            </div>
            
            <div className="p-5 space-y-5">
              <div>
                <label className="block mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kategori Sektor</label>
                <div className="relative">
                  <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-[#0a2558] outline-none text-gray-600 bg-white appearance-none cursor-pointer">
                    <option>Semua Sektor</option>
                    <option>Energi</option>
                    <option>FOLU</option>
                    <option>Limbah</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</label>
                <div className="relative">
                  <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-[#0a2558] outline-none text-gray-600 bg-white appearance-none cursor-pointer">
                    <option>Semua Status</option>
                    <option>Aktif</option>
                    <option>Tidak Aktif</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Pencarian</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Cari nama metodologi..." 
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-[#0a2558] focus:border-[#0a2558] outline-none placeholder:text-gray-300 pr-9 transition-colors"
                  />
                  <Search className="w-[15px] h-[15px] text-gray-300 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <button className="w-full py-2.5 mt-2 text-[13px] font-bold text-white bg-[#0a2558] rounded hover:bg-[#081c44] transition-colors shadow-sm tracking-wide">
                Terapkan Filter
              </button>
            </div>
          </div>

          {/* Total Card */}
          <div className="bg-[#183161] rounded-lg p-5 text-white shadow-md relative overflow-hidden">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8ba2ca] mb-1">Total Metodologi</h3>
            <div className="text-[44px] tracking-tight font-bold mb-8">142</div>
            
            <div className="border-t border-[#2d497e]/60 h-px w-full mb-3"></div>
            
            <div className="flex justify-between items-center text-[11px] font-medium text-[#8ba2ca]">
              <span>SPE-GRK: <strong className="text-white">128</strong></span>
              <span>Apresiasi: <strong className="text-white">14</strong></span>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 w-full flex flex-col min-w-0">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl text-gray-400 tracking-tight">Daftar <span className="font-bold text-[#0a2558]">Metodologi</span></h1>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1e7845] text-white text-[13px] font-bold rounded-lg hover:bg-[#165a34] transition-colors shadow-sm tracking-wide">
              <Plus className="w-[16px] h-[16px] stroke-[3]" />
              Usulkan Baru
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 mb-6">
            <button
              onClick={() => setActiveTab('spe-grk')}
              className={`pb-4 px-6 font-bold text-[13px] transition-all relative ${
                activeTab === 'spe-grk' ? 'text-[#0a2558]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Metodologi SPE-GRK
              {activeTab === 'spe-grk' && (
                <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-[#0a2558]"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('apresiasi')}
              className={`pb-4 px-6 font-bold text-[13px] transition-all relative ${
                activeTab === 'apresiasi' ? 'text-[#0a2558]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Metodologi Apresiasi
              {activeTab === 'apresiasi' && (
                <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-[#0a2558]"></div>
              )}
            </button>
          </div>

          {/* Replaced raw HTML table with modular TanStack Data Table component */}
          <DataTable columns={columns} data={mockTableData} />

        </div>
      </div>
    </div>
  );
};

export default ExternalDashboardPage;
