import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Share2, Printer, Info, History, Calendar, ChevronLeft, Home, Loader2, MessageSquare } from 'lucide-react';
import PublicLayout from '../../components/PublicLayout';
import { submissionService } from '../../../services/submission.service';
import type { Submission } from '../../../domain/models/Submission';

const PublicProposalPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [comments, setComments] = useState<string>('');

useEffect(() => {
    const fetchSubmission = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await submissionService.getPublicSubmissionById(id);
        setSubmission(response.data);
      } catch (err: unknown) {
        console.error('Failed to fetch submission detail:', err);
        setError('Gagal memuat data usulan metodologi.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [id]);

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusBadge = () => {
    const status = submission?.internalReviewStatus || 'DRAFT';
    const statusMap: Record<string, { label: string; color: string }> = {
      DRAFT: { label: 'Draf', color: 'bg-gray-100 text-gray-600' },
      SUBMITTED: { label: 'Diajukan', color: 'bg-blue-50 text-blue-600' },
      IN_REVIEW: { label: 'Dalam Review', color: 'bg-amber-50 text-amber-600' },
      APPROVED: { label: 'Disetujui', color: 'bg-gradient-to-r from-[#1e7e45] to-[#259755] text-white' },
      PUBLISHED: { label: 'Dipublikasikan', color: 'bg-gradient-to-r from-[#1e7e45] to-[#259755] text-white' },
      REJECTED: { label: 'Ditolak', color: 'bg-red-50 text-red-600' },
    };
    
    const statusInfo = statusMap[status] || statusMap.DRAFT;
    
    return (
      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex flex-col justify-center items-center py-32">
          <Loader2 className="w-12 h-12 text-[#1a385f] animate-spin mb-4" />
          <p className="text-gray-500 font-medium animate-pulse">Sedang memuat data usulan...</p>
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

  if (!submission) {
    return (
      <PublicLayout>
        <div className="flex flex-col justify-center items-center py-32">
          <p className="text-gray-500 font-medium mb-4">Data usulan tidak ditemukan.</p>
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
          <span className="text-[#1a385f]">Detail Usulan</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto w-full p-6 md:p-8 space-y-6 lg:mt-4">
        
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
            {getStatusBadge()}
            <span className="text-[11px] font-bold text-gray-400">ID: {id}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h1 className="text-[1.6rem] font-bold text-[#1a385f] leading-tight mb-3">
                {submission.title || 'Usulan Metodologi'}
              </h1>
              <div className="flex items-center text-gray-500 text-xs">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(submission.createdAt)}
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
                  <h2 className="text-lg font-bold text-[#1a385f]">Informasi Usulan</h2>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Judul Usulan</span>
                      <span className="block text-sm font-bold text-[#1a385f]">{submission.title || '-'}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Sumber</span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#e6f4ea] text-[#1e7e45]">
                        {submission.metadata?.sumberAcuan || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Pengusul</span>
                      <span className="block text-sm font-bold text-[#1a385f]">
                        {submission.publisherId?.username || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Tanggal Pengajuan</span>
                      <span className="block text-sm font-bold text-[#1a385f]">
                        {formatDate(submission.createdAt)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Status Review Internal</span>
                      <span className="block text-sm font-bold text-[#1a385f]">
                        {submission.internalReviewStatus || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Status OpenKM</span>
                      <span className="block text-sm font-bold text-[#1a385f]">
                        {submission.openKmPublishStatus || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Jenis Usulan</span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#eaf1f8] text-[#2c65a6]">
                        {submission.submissionType || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Kategori Sektor</span>
                      <span className="block text-sm font-bold text-[#1a385f]">
                        {submission.metadata?.kategoriSektor || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-8">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Deskripsi</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {submission.description || 'Tidak ada deskripsi untuk usulan ini.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Riwayat Review */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 text-[#1a385f] flex items-center justify-center">
                    <History className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-[#1a385f]">Riwayat Review Usulan</h2>
                </div>

                <div className="space-y-0 pl-3">
                  {/* Item 1 */}
                  <div className="relative pl-6 pb-8 border-l-[3px] border-[#1a385f]">
                    <div className="absolute w-3 h-3 bg-[#1a385f] rounded-full -left-[1.5px] top-1 transform -translate-x-1/2"></div>
                    <div className="flex justify-between items-start mb-1 -mt-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#1a385f]">Usulan Dikirim</span>
                      </div>
                      <span className="bg-[#1a385f] text-white text-[10px] font-bold px-2 py-0.5 rounded">Aktif</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-800 mt-2 mb-1">Pengajuan Metodologi</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Usulan metodologi telah diajukan oleh {submission.publisherId?.username || 'pengguna'} untuk review.
                    </p>
                    <span className="text-[10px] text-gray-400 italic">
                      {formatDate(submission.createdAt)}
                    </span>
                  </div>

                  {/* Item 2 - Current Status */}
                  <div className={`relative pl-6 pb-8 border-l-[3px] ${
                    submission.internalReviewStatus === 'APPROVED' || submission.internalReviewStatus === 'PUBLISHED'
                      ? 'border-[#1a385f]'
                      : 'border-gray-200'
                  }`}>
                    <div className={`absolute w-3 h-3 rounded-full -left-[1.5px] top-1 transform -translate-x-1/2 ${
                      submission.internalReviewStatus === 'APPROVED' || submission.internalReviewStatus === 'PUBLISHED'
                        ? 'bg-[#1a385f]'
                        : 'bg-gray-200'
                    }`}></div>
                    <div className="flex justify-between items-start mb-1 -mt-1">
                      <span className="font-bold text-gray-700">Review Internal</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        submission.internalReviewStatus === 'APPROVED' || submission.internalReviewStatus === 'PUBLISHED'
                          ? 'bg-[#e8f6ed] text-[#16a34a]'
                          : 'bg-amber-50 text-amber-600'
                      }`}>
                        {submission.internalReviewStatus || 'Menunggu'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-800 mt-2 mb-1">
                      {submission.internalReviewStatus === 'APPROVED' || submission.internalReviewStatus === 'PUBLISHED'
                        ? 'Usulan Disetujui'
                        : 'Dalam Proses Review'}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {submission.internalReviewStatus === 'APPROVED' || submission.internalReviewStatus === 'PUBLISHED'
                        ? 'Usulan metodologi telah disetujui dan siap dipublikasikan.'
                        : 'Usulan sedang dalam proses review oleh Tim Panel Metodologi.'}
                    </p>
                    {submission.updatedAt && (
                      <span className="text-[10px] text-gray-400 italic">
                        {formatDate(submission.updatedAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Public Comments Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 text-[#1a385f] flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-[#1a385f]">Komentar Publik</h2>
                </div>

                <div className="space-y-4">
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Tulis komentar publik untuk usulan ini..."
                    className="w-full px-4 py-3 text-sm border-2 border-gray-100 rounded-lg focus:ring-4 focus:ring-[#1a385f]/10 focus:border-[#1a385f] outline-none resize-none"
                    rows={4}
                  />
                  <button
                    onClick={() => {
                      if (comments.trim()) {
                        // TODO: Implement comment submission via submissionService.addComment
                        console.log('Submitting comment:', comments);
                        setComments('');
                      }
                    }}
                    className="px-4 py-2 bg-[#1a385f] text-white text-xs font-bold rounded-lg hover:bg-[#12284a] transition-colors"
                  >
                    Kirim Komentar
                  </button>

                  {/* Existing Comments */}
                  {submission.comments && submission.comments.length > 0 ? (
                    <div className="mt-4 space-y-4">
                      {submission.comments.map((comment, index) => (
                        <div key={comment._id || index} className="border-t border-gray-100 pt-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-[#1a385f]">
                                {comment.commenterId?.username || 'Pengguna'}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">{comment.comment}</p>
                              {comment.createdAt && (
                                <span className="text-[10px] text-gray-400 italic">
                                  {formatDate(comment.createdAt)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic mt-4">Belum ada komentar.</p>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Sidebar metrics) */}
          <div className="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-6">
            
            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6">
              <h3 className="text-xs font-bold text-[#1a385f] uppercase tracking-widest mb-6">
                INFO CEPAT
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-xs text-gray-500">Jenis Usulan</span>
                  <span className="text-xs font-bold text-[#1a385f]">
                    {submission.submissionType || '-'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-xs text-gray-500">Review Status</span>
                  <span className="text-xs font-bold text-[#1a385f]">
                    {submission.internalReviewStatus || '-'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-xs text-gray-500">OpenKM Status</span>
                  <span className="text-xs font-bold text-[#1a385f]">
                    {submission.openKmPublishStatus || '-'}
                  </span>
                </div>
              </div>
            </div>

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

export default PublicProposalPage;