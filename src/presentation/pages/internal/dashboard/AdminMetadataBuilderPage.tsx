/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from 'react';
import { Search, Plus, X } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../../components/DataTable';
import AdminLayout from '../../../components/AdminLayout';
import { metadataService } from '../../../../services/metadata.service';
import type { MetadataField, MetadataCreatePayload } from '../../../../domain/models/Metadata';

const AdminMetadataBuilderPage: React.FC = () => {
  const [metadataFields, setMetadataFields] = useState<MetadataField[]>([]);
  const [filteredFields, setFilteredFields] = useState<MetadataField[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Client-side pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const totalPages = Math.ceil(filteredFields.length / limit);
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * limit;
    return filteredFields.slice(startIndex, startIndex + limit);
  }, [filteredFields, page]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [key, setKey] = useState('');
  const [label, setLabel] = useState('');
  const [dataType, setDataType] = useState('STRING');
  const [isRequired, setIsRequired] = useState(true);
  const [order, setOrder] = useState<number>(1);
  const [optionsStr, setOptionsStr] = useState(''); // Comma separated for SELECT

  const fetchMetadata = async () => {
    setLoading(true);
    try {
      const res = await metadataService.getMetadata();
      if (res.data) {
        setMetadataFields(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    // Client-side search and sort (if we need to make sure order is maintained)
    let filtered = metadataFields;
    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = metadataFields.filter(
        f => f.key.toLowerCase().includes(lowerSearch) || f.label.toLowerCase().includes(lowerSearch)
      );
    }
    // Sort by order
    filtered.sort((a, b) => a.order - b.order);
    
    setFilteredFields(filtered);
    setPage(1); // reset to page 1 on search change
  }, [metadataFields, search]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const payload: MetadataCreatePayload = {
        key,
        label,
        dataType,
        isRequired,
        order
      };

      if (dataType === 'SELECT') {
        payload.options = optionsStr.split(',').map(o => o.trim()).filter(Boolean);
      }

      await metadataService.createMetadata(payload);
      setIsModalOpen(false);
      
      // Reset form
      setKey('');
      setLabel('');
      setDataType('STRING');
      setIsRequired(true);
      setOrder(1);
      setOptionsStr('');
      
      fetchMetadata();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || "Gagal membuat metadata.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = useMemo<ColumnDef<MetadataField>[]>(() => [
    {
      accessorKey: 'key',
      header: 'Key / Nama Field',
      cell: ({ row }) => (
        <div>
          <div className="text-sm font-bold text-[#1a385f]">{row.original.label}</div>
          <div className="text-[10px] font-medium text-gray-400 mt-0.5">{row.original.key}</div>
        </div>
      ),
    },
    {
      accessorKey: 'dataType',
      header: 'Tipe Data',
      cell: ({ row }) => (
        <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
          {row.original.dataType}
        </span>
      ),
    },
    {
      accessorKey: 'isRequired',
      header: 'Wajib',
      cell: ({ row }) => (
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${row.original.isRequired ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
          {row.original.isRequired ? 'Ya' : 'Tidak'}
        </span>
      ),
    },
    {
      accessorKey: 'order',
      header: 'Urutan',
      cell: ({ row }) => (
        <span className="text-sm font-bold text-gray-600">{row.original.order}</span>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${row.original.isActive ? 'bg-[#dcfce7] text-[#166534]' : 'bg-red-50 text-red-600'}`}>
          {row.original.isActive ? 'Aktif' : 'Non-Aktif'}
        </span>
      ),
    }
  ], []);

  return (
    <AdminLayout>
      {/* Header section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200/60 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[#1a385f] leading-tight tracking-tight">
            Integrasi Metadata
          </h1>
          <p className="text-xs text-gray-400 mt-1">Konfigurasi field dinamis untuk dokumen metodologi</p>
        </div>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari metadata..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7e45] focus:border-transparent w-64"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-5 py-2.5 bg-[#1e7e45] hover:bg-[#156133] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Metadata
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 flex-1 mb-6 flex flex-col overflow-hidden">
        {loading ? (
          <div className="flex-1 flex justify-center items-center h-64">
            <div className="w-8 h-8 rounded-full border-4 border-[#1e7e45] border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="overflow-x-auto flex-1">
              <DataTable columns={columns} data={paginatedData} />
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
                <span className="text-xs text-gray-500 font-medium">Halaman {page} dari {totalPages}</span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 border border-gray-300 rounded text-xs font-bold disabled:opacity-50 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Mundur
                  </button>
                  <button 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 border border-gray-300 rounded text-xs font-bold disabled:opacity-50 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Maju
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Tambah Metadata */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#1a385f]">Tambah Field Metadata</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit}>
              <div className="p-6 space-y-4">
                {errorMsg && (
                  <div className="p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg">
                    {errorMsg}
                  </div>
                )}
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Label / Nama Field</label>
                  <input 
                    type="text" required
                    value={label} onChange={(e) => setLabel(e.target.value)}
                    placeholder="Contoh: Tanggal Persetujuan"
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7e45] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Key Identifikator</label>
                  <input 
                    type="text" required
                    value={key} onChange={(e) => setKey(e.target.value)}
                    placeholder="Contoh: approval_date"
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1e7e45] focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tipe Data</label>
                    <select 
                      value={dataType} onChange={(e) => setDataType(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7e45] focus:border-transparent"
                    >
                      <option value="STRING">Teks Singkat (STRING)</option>
                      <option value="DATE">Tanggal (DATE)</option>
                      <option value="SELECT">Pilihan (SELECT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Urutan (Order)</label>
                    <input 
                      type="number" required min="1"
                      value={order} onChange={(e) => setOrder(parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7e45] focus:border-transparent"
                    />
                  </div>
                </div>

                {dataType === 'SELECT' && (
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pilihan Options (Pisahkan dgn Koma)</label>
                    <input 
                      type="text" required
                      value={optionsStr} onChange={(e) => setOptionsStr(e.target.value)}
                      placeholder="Baru, Revisi, Lain-lain"
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7e45] focus:border-transparent"
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2 pt-2">
                  <input 
                    type="checkbox" id="isRequired"
                    checked={isRequired} onChange={(e) => setIsRequired(e.target.checked)}
                    className="w-4 h-4 text-[#1e7e45] focus:ring-[#1e7e45] border-gray-300 rounded"
                  />
                  <label htmlFor="isRequired" className="text-sm font-medium text-gray-700">Wajib Diisi (Required)</label>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)} 
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting || !key || !label}
                  className="bg-[#1e7e45] hover:bg-[#156133] text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center cursor-pointer"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Metadata'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminMetadataBuilderPage;
