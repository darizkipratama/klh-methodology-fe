import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AdminLayout from '../../../components/AdminLayout';
import { Download, ArrowLeft, X } from 'lucide-react';
import { submissionService } from '../../../../services/submission.service';
import type { Submission } from '../../../../domain/models/Submission';

const DocumentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleAddComment = async () => {
    if (!commentText.trim() || !id) return;
    setIsSubmitting(true);
    try {
      await submissionService.addComment(id, commentText);
      setCommentText('');
      setIsModalOpen(false);
      const res = await submissionService.getSubmissionById(id);
      setSubmission(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await submissionService.updateStatus(id, status);
      const res = await submissionService.getSubmissionById(id);
      setSubmission(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    
    let mounted = true;
    submissionService.getSubmissionById(id)
      .then(res => {
        if (mounted) {
          setSubmission(res.data);
        }
      })
      .catch(console.error)
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-20 min-h-[50vh]">
          <div className="w-8 h-8 rounded-full border-4 border-[#1e7e45] border-t-transparent animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!submission) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-gray-500 font-bold">Dokumen tidak ditemukan.</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Link to="/dashboard/admin" className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-[#1e7e45] transition-colors mb-4 uppercase tracking-wider">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Dashboard
      </Link>

      {/* Top Header section for Document */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200/60 mb-6 flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <span className="bg-[#1e7e45] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              {submission.internalReviewStatus}
            </span>
            <span className="text-xs font-bold text-gray-400 font-mono tracking-wider">
              {submission.openKmDocumentId || 'DRAFT-001'}
            </span>
          </div>
          <h1 className="text-3xl font-black text-[#1a385f] leading-tight max-w-4xl tracking-tight">
            {submission.title}
          </h1>
        </div>
        <button className="flex items-center px-6 py-2.5 border-2 border-[#1a385f] text-[#1a385f] rounded-lg font-bold text-[12px] uppercase tracking-wider hover:bg-gray-50 transition-colors shrink-0 mt-2">
          <Download className="w-4 h-4 mr-2" />
          Unduh PDF
        </button>
      </div>

      <div className="flex gap-8 items-start">
        {/* Left local navigation */}
        <div className="w-64 shrink-0 flex flex-col space-y-8 sticky top-[100px]">
          <div className="pl-4 border-l border-gray-200 py-2">
            <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-5">Isi Dokumen</h3>
            <ul className="space-y-4">
              <li className="relative group">
                <div className="absolute -left-[17px] top-0 bottom-0 w-[2px] bg-[#1e7e45]"></div>
                <a href="#ringkasan" className="text-[#1e7e45] font-bold text-[13px] block">Ringkasan</a>
              </li>
              <li className="relative group">
                <a href="#metadata" className="text-[#1e7e45] font-bold text-[13px] hover:text-[#156133] transition-colors block">Informasi Metadata</a>
              </li>
              <li className="relative group">
                <a href="#pembahasan" className="text-[#1e7e45] font-bold text-[13px] hover:text-[#156133] transition-colors block">Informasi Pembahasan</a>
              </li> 
              <li className="relative group">
                <a href="#aksi" className="text-[#1e7e45] font-bold text-[13px] hover:text-[#156133] transition-colors block">Proses Pengajuan</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Main detail content */}
        <div className="flex-1 bg-white p-10 py-12 rounded-xl shadow-sm border border-gray-200/60 overflow-hidden">
          <section id="ringkasan" className="mb-14">
            <h2 className="text-2xl font-black text-[#1a385f] mb-6 tracking-tight">Ringkasan Metodologi</h2>
            <p className="text-[#4a5568] text-[15px] leading-relaxed mb-8">
              {submission.description}
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#fafcfd] border border-gray-100 p-6 rounded-xl flex flex-col justify-center relative overflow-hidden group">
                <div className="absolute left-0 top-6 bottom-6 w-[3px] bg-[#1e7e45] rounded-r-md"></div>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-4">Sektor Utama</span>
                <div className="text-[#1a385f] font-bold text-sm ml-4">Energi & Transportasi</div>
              </div>
              <div className="bg-[#fafcfd] border border-gray-100 p-6 rounded-xl flex flex-col justify-center relative overflow-hidden">
                <div className="absolute left-0 top-6 bottom-6 w-[3px] bg-[#1a385f] rounded-r-md"></div>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-4">Tipe Dokumen</span>
                <div className="text-[#1a385f] font-bold text-sm ml-4">{submission.metadata?.document_type || submission.submissionType}</div>
              </div>
            </div>
          </section>

          <section id="metadata">
            <h2 className="text-2xl font-black text-[#1a385f] mb-8 tracking-tight">Informasi Metadata</h2>
            
            <div className="space-y-6">
              <div className="flex border-b border-gray-100 pb-6">
                <div className="w-1/3">
                  <span className="text-xs font-bold text-gray-500">Pengembang</span>
                </div>
                <div className="w-2/3">
                  <span className="text-sm text-[#4a5568] font-medium">{submission.publisherId?.username || submission.metadata?.author_name || '-'}</span>
                </div>
              </div>
              
              <div className="flex border-b border-gray-100 pb-6 items-center">
                <div className="w-1/3">
                  <span className="text-xs font-bold text-gray-500">Gas Rumah Kaca</span>
                </div>
                <div className="w-2/3 flex space-x-2">
                  <span className="bg-[#f0f4f8] text-[#1a385f] text-[10px] font-bold px-2.5 py-1 rounded">CO2</span>
                  <span className="bg-[#f0f4f8] text-[#1a385f] text-[10px] font-bold px-2.5 py-1 rounded">CH4</span>
                  <span className="bg-[#f0f4f8] text-[#1a385f] text-[10px] font-bold px-2.5 py-1 rounded">N2O</span>
                </div>
              </div>
            </div>
          </section>

          <section id="pembahasan">
            <h2 className="text-2xl font-black text-[#1a385f] mb-8 tracking-tight">Informasi Pembahasan</h2>
            {submission.comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-100 pb-6">
                <div className="w-1/3">
                  <span className="text-xs font-bold text-gray-500">{comment.commenterId?.username}</span>
                  <span className="text-xs font-bold text-gray-500">-</span>
                  <span className="text-xs font-bold text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="w-2/3">
                  <span className="text-sm text-[#4a5568] font-medium">{comment.comment}</span>
                </div>
              </div>
            ))}
          </section>

          <section id="aksi">
            <h2 className="text-2xl font-black text-[#1a385f] mb-8 tracking-tight">Proses Pengajuan</h2>
            <div className="space-y-6">
              <div className="flex border-b border-gray-100 pb-6">
                <div className="w-1/3">
                  <span className="text-xs font-bold text-gray-500 pt-2 block">&nbsp;</span>
                </div>
                <div className="w-2/3 flex flex-wrap gap-4">
                  <button onClick={() => setIsModalOpen(true)} className="bg-[#1a385f] hover:bg-[#122846] text-white px-5 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors shadow-sm">
                    Tambah Hasil Pembahasan
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus('APPROVED')}
                    disabled={isSubmitting}
                    className="bg-[#1e7e45] hover:bg-[#156133] text-white px-5 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50"
                  >
                    Dokumen Disetujui
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus('REJECTED')}
                    disabled={isSubmitting}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50"
                  >
                    Dokumen Ditolak
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Modal Tambah Hasil Diskusi */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#1a385f]">Tambah Hasil Pembahasan</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Komentar / Hasil Diskusi</label>
              <textarea 
                rows={4}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a385f] focus:border-transparent resize-none"
                placeholder="Masukkan hasil pembahasan atau catatan..."
              />
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50">
              <button 
                onClick={() => setIsModalOpen(false)} 
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button 
                onClick={handleAddComment} 
                disabled={isSubmitting || !commentText.trim()}
                className="bg-[#1a385f] hover:bg-[#122846] text-white px-5 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center cursor-pointer"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Pembahasan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default DocumentDetailPage;
