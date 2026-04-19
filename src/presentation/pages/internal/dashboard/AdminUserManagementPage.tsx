import React, { useEffect, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../../components/DataTable';
import AdminLayout from '../../../components/AdminLayout';
import { userService } from '../../../../services/user.service';
import type { UserData } from '../../../../domain/models/User';

const AdminUserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getUsers(page, limit, search);
      setUsers(res.data);
      if (res.pagination) {
        setTotalPages(res.pagination.totalPages || 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Basic debounce for search
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await userService.toggleUserStatus(id, !currentStatus);
      fetchUsers(); // Refresh data
    } catch (error) {
      console.error(error);
    }
  };

  const columns = useMemo<ColumnDef<UserData>[]>(() => [
    {
      accessorKey: 'username',
      header: 'Pengguna',
      cell: ({ row }) => (
        <div>
          <div className="text-sm font-bold text-[#1a385f]">{row.original.username}</div>
          <div className="text-[10px] font-medium text-gray-400 mt-0.5">{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: 'companyName',
      header: 'Instansi / Perusahaan',
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-600">{row.original.companyName}</span>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Peran',
      cell: ({ row }) => (
        <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
          {row.original.role}
        </span>
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
    },
    {
      id: 'aksi',
      header: () => <div className="text-right">Aksi</div>,
      cell: ({ row }) => (
        <div className="flex justify-end items-center space-x-4">
          <button 
            onClick={() => handleToggleStatus(row.original._id, row.original.isActive)}
            className={`text-[10px] font-bold transition-colors tracking-wider ${row.original.isActive ? 'text-red-600 hover:text-red-700' : 'text-[#1e7e45] hover:text-[#156133]'}`}
          >
            {row.original.isActive ? 'DEAKTIVASI' : 'AKTIVASI'}
          </button>
        </div>
      ),
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [limit]);

  return (
    <AdminLayout>
      {/* Header section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200/60 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[#1a385f] leading-tight tracking-tight">
            Manajemen Pengguna
          </h1>
          <p className="text-xs text-gray-400 mt-1">Kelola akses dan hak akses sistem</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Cari pengguna..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset to page 1 on search
            }}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7e45] focus:border-transparent w-64"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
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
              <DataTable columns={columns} data={users} />
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
                <span className="text-xs text-gray-500 font-medium">Halaman {page} dari {totalPages}</span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 border border-gray-300 rounded text-xs font-bold disabled:opacity-50 hover:bg-gray-100 transition-colors"
                  >
                    Mundur
                  </button>
                  <button 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 border border-gray-300 rounded text-xs font-bold disabled:opacity-50 hover:bg-gray-100 transition-colors"
                  >
                    Maju
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUserManagementPage;
