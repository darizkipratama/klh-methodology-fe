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
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'INTERNAL' | 'PUBLISHER'>('INTERNAL');
  const [newUserType, setNewUserType] = useState('Pemerintah');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
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

  const resetNewUserForm = () => {
    setNewUsername('');
    setNewEmail('');
    setNewPassword('');
    setNewRole('INTERNAL');
    setNewUserType('Pemerintah');
    setNewCompanyName('');
    setCreateError('');
  };

  const handleCreateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateError('');
    if (!newUsername || !newEmail || !newPassword || !newRole) {
      setCreateError('Semua field wajib diisi.');
      return;
    }

    setIsCreating(true);
    try {
      await userService.createUser({
        username: newUsername,
        email: newEmail,
        password: newPassword,
        role: newRole,
        userType: newUserType,
        companyName: newCompanyName || undefined,
      });
      setSuccessMessage('Pengguna baru berhasil dibuat.');
      resetNewUserForm();
      setShowAddModal(false);
      if (page !== 1) {
        setPage(1);
      } else {
        fetchUsers();
      }
    } catch (error: unknown) {
      console.error(error);
      setCreateError('Gagal membuat pengguna. Silakan coba lagi.');
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(''), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

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
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              resetNewUserForm();
              setShowAddModal(true);
            }}
            className="bg-[#1e7e45] hover:bg-[#156133] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            Tambah Pengguna
          </button>
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
      </div>

      {successMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 shadow-lg text-sm font-semibold text-emerald-900">
          {successMessage}
        </div>
      )}

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

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-[#1a385f]">Tambah Pengguna Baru</h3>
                <p className="text-xs text-gray-500 mt-1">Isi data pengguna untuk membuat akun baru.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-6 p-6">
              {createError && (
                <div className="p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  {createError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Nama Pengguna</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Username"
                    required
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7e45] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="email@domain.com"
                    required
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7e45] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Kata Sandi</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 karakter"
                    required
                    minLength={8}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7e45] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Peran</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as 'INTERNAL' | 'PUBLISHER')}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7e45] focus:border-transparent"
                  >
                    <option value="INTERNAL">Internal</option>
                    <option value="PUBLISHER">Publisher</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Jenis Akun</label>
                  <select
                    value={newUserType}
                    onChange={(e) => setNewUserType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7e45] focus:border-transparent"
                  >
                    <option value="Pemerintah">Pemerintah</option>
                    <option value="Swasta">Swasta</option>
                    <option value="Organisasi Kemasyarakatan/Independen">Organisasi Kemasyarakatan/Independen</option>
                    <option value="Individu">Individu</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Nama Instansi / Perusahaan</label>
                  <input
                    type="text"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    placeholder="Opsional"
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7e45] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end items-center gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="bg-[#1e7e45] hover:bg-[#156133] text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? 'Menyimpan...' : 'Simpan Pengguna'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUserManagementPage;
