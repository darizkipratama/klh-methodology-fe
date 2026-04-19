import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../../components/DataTable';
import { submissionService } from '../../../../services/submission.service';
import type { Submission } from '../../../../domain/models/Submission';
import AdminLayout from '../../../components/AdminLayout';

const columns: ColumnDef<Submission>[] = [
  {
    accessorKey: 'title',
    header: 'Nama Dokumen',
    cell: ({ row }) => (
      <div>
        <div className="text-sm font-bold text-[#1a385f]">{row.original.title}</div>
        <div className="text-[10px] font-medium text-gray-400 mt-1.5">Diajukan Pada Tanggal: {new Date(row.original.createdAt).toLocaleDateString('id-ID')}</div>
      </div>
    ),
  },
  {
    accessorKey: 'submissionType',
    header: () => <div className="text-center">Tipe Dokumen</div>,
    cell: ({ row }) => {
      const type = row.original.metadata?.document_type || row.original.submissionType;
      const isPolicy = type === 'Policy';
      const bgStyle = isPolicy ? 'bg-[#e6efff] text-[#1a385f]' : 'bg-[#e6faee] text-[#1e7e45]';
      return (
        <div className="text-center">
          <span className={`inline-block px-2.5 py-1 text-[9px] font-bold rounded uppercase tracking-wider ${bgStyle}`}>
            {type}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: 'openKmPath',
    header: 'OpenKM Path',
    cell: ({ row }) => (
      <code className="text-[11px] text-gray-400 font-mono">{row.original.openKmPath || '-'}</code>
    ),
  },
  {
    accessorKey: 'internalReviewStatus',
    header: 'Status Review',
    cell: ({ row }) => (
      <div className="flex items-center text-xs font-bold text-[#1e7e45]">
        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 fill-[#1e7e45] text-white" />
        {row.original.internalReviewStatus}
      </div>
    ),
  },
  {
    id: 'aksi',
    header: () => <div className="text-right">Aksi</div>,
    cell: ({ row }) => (
      <div className="flex justify-end items-center space-x-4">
        <Link to={`/dashboard/admin/document/${row.original._id}`} className="text-[10px] font-bold text-[#1a385f] hover:text-[#1e7e45] transition-colors tracking-wider">DETAIL</Link>
        <button className="text-[10px] font-bold text-red-600 hover:text-red-700 transition-colors tracking-wider">HAPUS</button>
      </div>
    ),
  },
];


const AdminDashboardPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    let mounted = true;
    submissionService.getSubmissions(1, 10)
      .then(res => {
        if (mounted) setSubmissions(res.data);
      })
      .catch(console.error);
    return () => { mounted = false; };
  }, []);

  return (
    <AdminLayout>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 pb-5 rounded-xl shadow-sm border border-gray-200/60 flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-wider">Kategori NEK</span>
              <div className="text-3xl font-black text-[#1a385f]">12 Skema</div>
              <div className="w-8 h-[3px] bg-[#1e7e45] mt-5 rounded-full"></div>
            </div>
            <div className="bg-white p-6 pb-5 rounded-xl shadow-sm border border-gray-200/60 flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-wider">Apresiasi Aktif</span>
              <div className="text-3xl font-black text-[#1a385f]">08 Jenis</div>
              <div className="w-8 h-[3px] bg-[#1a385f] mt-5 rounded-full"></div>
            </div>
            <div className="bg-white p-6 pb-5 rounded-xl shadow-sm border border-gray-200/60 flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-wider">Sertifikasi Akhir</span>
              <div className="text-3xl font-black text-[#1a385f]">04 Tipe</div>
              <div className="w-8 h-[3px] bg-gray-300 mt-5 rounded-full"></div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 flex-1 mb-6 flex flex-col overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-0">
              <h2 className="text-xs font-bold text-[#1a385f] tracking-wide">MASTER DATA PENGAJUAN DOKUMEN METODOLOGI</h2>
            </div>
            
            <div className="overflow-x-auto">
              <DataTable columns={columns} data={submissions} />
            </div>
          </div>

    </AdminLayout>
  );
};

export default AdminDashboardPage;
