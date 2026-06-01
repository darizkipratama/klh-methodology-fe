import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../../domain/store/authStore';
import { authService } from '../../../services/auth.service';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Auth Store Actions & State
  const { login, isLoading, error, clearError } = useAuthStore();

  // Register Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userType, setUserType] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!email || !password) return;

    try {
      await login(email, password);
      // The ProtectedRoute logic in App.tsx maps role to the right dashboard.
      // But we can trigger navigation here explicitly just in case.
      const userRole = useAuthStore.getState().user?.role || 'external';
      navigate(userRole === 'INTERNAL' ? '/dashboard/admin' : '/dashboard/external');
    } catch (err) {
      // Error is caught by the store and displayed in the UI below
      console.error("Login Error:", err);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);

    if (regPassword !== confirmPassword) {
      setRegisterError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (!agreeTerms) {
      setRegisterError("Anda harus menyetujui Syarat & Ketentuan.");
      return;
    }

    setRegisterLoading(true);
    try {
      const payload = {
        username: `${firstName} ${lastName}`.trim(),
        // companyName,
        userType,
        email: regEmail,
        password: regPassword,
        role: "PUBLISHER"
      };

      await authService.register(payload);
      setRegisterSuccess(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setRegisterError(err.response?.data?.message || err.message || "Registrasi gagal.");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8f9fa] p-4 font-sans relative overflow-hidden">
      <div className="absolute bottom-0 right-0 opacity-[0.03] select-none pointer-events-none translate-x-1/4 translate-y-1/4">
        <h1 className="text-[20rem] font-black tracking-tighter text-gray-900 leading-none m-0">SRN</h1>
      </div>

      <div className="w-full max-w-125 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden z-10 transition-all duration-300">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => { setActiveTab('login'); clearError(); }}
            className={`flex-1 py-4 text-sm font-bold text-center uppercase transition-all duration-200 ${
              activeTab === 'login'
                ? 'text-[#0a2558] border-b-[3px] border-[#0a2558]'
                : 'text-gray-400 hover:text-gray-600 border-b-[3px] border-transparent'
            }`}
          >
            Masuk
          </button>
          <button
            onClick={() => { setActiveTab('register'); clearError(); }}
            className={`flex-1 py-4 text-sm font-bold text-center uppercase transition-all duration-200 ${
              activeTab === 'register'
                ? 'text-[#0a2558] border-b-[3px] border-[#0a2558]'
                : 'text-gray-400 hover:text-gray-600 border-b-[3px] border-transparent'
            }`}
          >
            Daftar Akun
          </button>
        </div>

        <div className="p-8 md:p-10 transition-all duration-300">
          {activeTab === 'login' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="mb-8 text-center">
                <h1 className="text-[1.4rem] font-bold text-[#0a2558]">Selamat Datang Kembali</h1>
                <p className="mt-2 text-[13px] text-gray-500">Silakan masuk ke akun SRN Anda</p>
              </div>

              {error && (
                <div className="mb-6 p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleLoginSubmit}>
                <div>
                  <label className="block mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Email / Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <Mail className="w-4.5 h-4.5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full py-3 pl-10 pr-4 text-sm bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#0a2558] focus:border-[#0a2558] outline-none transition-all placeholder:text-gray-300 shadow-sm"
                      placeholder="Masukkan email Anda"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <Lock className="w-4.5 h-4.5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full py-3 pl-10 pr-4 text-sm bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#0a2558] focus:border-[#0a2558] outline-none transition-all placeholder:text-gray-300 shadow-sm"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <a href="#" className="text-[11px] font-bold text-[#1e7845] hover:underline">
                      Lupa Kata Sandi?
                    </a>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 flex justify-center items-center gap-2 text-xs font-bold text-white uppercase tracking-wider bg-[#0a2558] rounded-lg hover:bg-[#071940] transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full"></span>
                    ) : (
                      'Masuk Ke Sistem'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Registration tab remains unchanged for now, mapping omitted for brevity but UI retained */}
          {activeTab === 'register' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              {registerError && (
                <div className="mb-6 p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  {registerError}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleRegisterSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Depan</label>
                    <input 
                      type="text" required
                      value={firstName} onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#0a2558] focus:border-[#0a2558] outline-none transition-all placeholder:text-gray-300 shadow-sm" placeholder="Nama" />
                  </div>
                  <div>
                    <label className="block mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Belakang</label>
                    <input 
                      type="text" required
                      value={lastName} onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#0a2558] focus:border-[#0a2558] outline-none transition-all placeholder:text-gray-300 shadow-sm" placeholder="Belakang" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Jenis Akun</label>
                    <select 
                      required
                      value={userType} onChange={(e) => setUserType(e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#0a2558] focus:border-[#0a2558] outline-none transition-all text-[#0a2558] font-medium shadow-sm">
                      <option value="" className="text-gray-400">Pilih Kategori</option>
                      <option value="Pemerintah">Pemerintah</option>
                      <option value="Swasta">Swasta</option>
                      <option value="Swasta">LSM</option>
                      <option value="Individu">Individu</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</label>
                    <input 
                      type="email" required
                      value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#0a2558] focus:border-[#0a2558] outline-none transition-all placeholder:text-gray-300 shadow-sm" placeholder="email@instansi.id" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kata Sandi</label>
                    <input 
                      type="password" required minLength={8}
                      value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#0a2558] focus:border-[#0a2558] outline-none transition-all placeholder:text-gray-300 shadow-sm" placeholder="Min. 8 Karakter" />
                  </div>
                  <div>
                    <label className="block mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Konfirmasi Sandi</label>
                    <input 
                      type="password" required
                      value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#0a2558] focus:border-[#0a2558] outline-none transition-all placeholder:text-gray-300 shadow-sm" placeholder="Ulangi Sandi" />
                  </div>
                </div>

                <div className="flex items-start mt-6 bg-transparent rounded">
                  <div className="flex items-center h-5 mt-0.5">
                    <input 
                      type="checkbox" required
                      checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-3.5 h-3.5 border-gray-300 rounded text-[#1e7845] focus:ring-[#1e7845]" />
                  </div>
                  <label className="ml-3 text-[10.5px] text-gray-400 leading-relaxed max-w-[90%]">
                    Saya setuju dengan <a href="#" className="font-bold text-[#1e7845] hover:underline">Syarat & Ketentuan</a> serta Kebijakan Privasi yang berlaku di lingkungan SRN PPI Indonesia.
                  </label>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={registerLoading}
                    className="w-full py-3.5 flex justify-center items-center gap-2 text-xs font-bold text-white uppercase tracking-wider bg-[#1e7845] rounded-lg hover:bg-[#155a33] transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {registerLoading ? (
                      <span className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full"></span>
                    ) : (
                      'Buat Akun Baru'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        
        {activeTab === 'login' && (
          <div className="px-8 py-5 bg-[#fafcfd] border-t border-gray-100 text-center animate-in fade-in">
            <p className="text-[11px] font-medium text-gray-400">
              Kendala saat mendaftar? <a href="#" className="font-bold tracking-wide text-[#0a2558] hover:underline">Hubungi Helpdesk</a>
            </p>
          </div>
        )}
      </div>

      <div className="mt-10 text-center text-[9px] font-bold tracking-[0.2em] text-gray-400 uppercase relative z-10 w-full mb-4">
        Kementerian Lingkungan Hidup & Kehutanan
      </div>

      {/* Success Splash / Modal */}
      {registerSuccess && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-white animate-in fade-in duration-500">
          <div className="max-w-md w-full p-10 flex flex-col items-center text-center animate-in zoom-in-95 slide-in-from-bottom-5 duration-700 delay-200">
            <div className="w-24 h-24 bg-[#dcfce7] rounded-full flex items-center justify-center mb-8 shadow-sm">
              <CheckCircle2 className="w-12 h-12 text-[#1e7845]" />
            </div>
            <h2 className="text-2xl font-black text-[#0a2558] mb-4">Registrasi Berhasil!</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-10">
              Akun Anda telah berhasil dibuat. Silakan masuk menggunakan email dan kata sandi yang telah didaftarkan.
            </p>
            <button 
              onClick={() => { setRegisterSuccess(false); setActiveTab('login'); }}
              className="w-full py-4 text-xs font-bold text-white uppercase tracking-wider bg-[#0a2558] rounded-xl hover:bg-[#071940] transition-all transform hover:scale-[1.02] active:scale-100 shadow-xl"
            >
              Masuk Sekarang
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
