import React from 'react';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar Placeholder */}
      <aside className="w-64 bg-gray-900 min-h-screen p-6 hidden md:block">
        <h2 className="text-white text-xl font-bold mb-8">Admin Portal</h2>
        <div className="space-y-4">
          <div className="h-8 bg-gray-800 rounded"></div>
          <div className="h-8 bg-gray-800 rounded"></div>
          <div className="h-8 bg-gray-800 rounded"></div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Internal Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Overview of all system activity.</p>
        </header>
        
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-sm font-semibold text-gray-600">User</th>
                <th className="pb-3 text-sm font-semibold text-gray-600">Role</th>
                <th className="pb-3 text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-4 text-gray-800">Jane Doe</td>
                <td className="py-4 text-gray-600">External</td>
                <td className="py-4"><span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
