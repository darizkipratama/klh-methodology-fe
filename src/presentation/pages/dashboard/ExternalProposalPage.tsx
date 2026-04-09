import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, CheckCircle2, Loader2 } from 'lucide-react';
import ExternalLayout from '../../components/ExternalLayout';
import { submissionService } from '../../../services/submission.service';
import { useAuthStore } from '../../../domain/store/authStore';
import { openKmClient } from '../../../services/api/apiClient';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProposalFormData {
  submissionType: 'NEW' | 'REVISION';
  parentDocumentId?: string;
  parentDocumentName?: string;
  title: string;
  kategoriSektor: string;
  sumberAcuan: string;
  description: string;
  publisherId: string;
  // Step 2 – Dokumen
  file: File | null;
  metadata: Record<string, string>;
  // Step 3 – Review (read-only, no extra fields)
}

export interface MetadataField {
  _id: string;
  key: string;
  label: string;
  dataType: 'STRING' | 'DATE' | 'SELECT';
  isRequired: boolean;
  options: string[];
  isActive: boolean;
  order: number;
}

const STEPS = [
  { id: 1, label: 'Informasi' },
  { id: 2, label: 'Dokumen' },
  { id: 3, label: 'Review' },
];

export interface SektorOption {
  id: string;
  name: string;
}

const SUMBER_OPTIONS = ['UNFCCC Approved', 'Gold Standard', 'Verra (VCS)', 'Dirjen PPI', 'BSN (SNI)', 'Lainnya'];

// ─── Step Indicator ───────────────────────────────────────────────────────────

const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => (
  <div className="flex items-center gap-0 mb-8">
    {STEPS.map((step, idx) => {
      const done = currentStep > step.id;
      const active = currentStep === step.id;
      return (
        <React.Fragment key={step.id}>
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-black transition-all
                ${done ? 'bg-[#1e7e45] text-white' : active ? 'bg-[#1a385f] text-white' : 'bg-gray-100 text-gray-400'}`}
            >
              {done ? <CheckCircle2 className="w-4 h-4" /> : step.id}
            </div>
            <span
              className={`text-[13px] font-bold transition-colors ${
                active ? 'text-[#1a385f]' : done ? 'text-[#1e7e45]' : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div className={`flex-1 h-px mx-4 min-w-[40px] transition-colors ${done ? 'bg-[#1e7e45]' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ─── Step 1 – Informasi ───────────────────────────────────────────────────────

const StepInformasi: React.FC<{
  data: ProposalFormData;
  sektorOptions: SektorOption[];
  onChange: (field: keyof ProposalFormData, value: string) => void;
  onShowModal: () => void;
}> = ({ data, sektorOptions, onChange, onShowModal }) => (
  <div className="space-y-6">
    {/* Tipe Pengusulan */}
    <div>
      <label className="block mb-2 text-[11px] font-black text-[#1a385f] uppercase tracking-widest">
        Tipe Pengusulan <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <select
          value={data.submissionType}
          onChange={(e) => {
            onChange('submissionType', e.target.value);
            if (e.target.value === 'REVISION') {
              onShowModal();
            } else {
              onChange('parentDocumentId', '');
              onChange('parentDocumentName', '');
            }
          }}
          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-[#1a385f]/30 focus:border-[#1a385f] outline-none text-gray-600 bg-white appearance-none cursor-pointer transition-all"
        >
          <option value="NEW">Baru (New)</option>
          <option value="REVISION">Revisi (Revision)</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {data.submissionType === 'REVISION' && data.parentDocumentName && (
        <div className="mt-3 text-[13px] text-[#1e7e45] font-medium flex items-center gap-2 p-3 bg-[#1e7e45]/10 rounded-lg">
          <CheckCircle2 className="w-4 h-4" />
          <span>Dokumen terpilih: <strong className="text-[#1a385f]">{data.parentDocumentName}</strong></span>
          <button type="button" onClick={onShowModal} className="text-[#1a385f] hover:underline ml-auto font-bold">Ubah</button>
        </div>
      )}
    </div>

    {/* Nama Metodologi */}
    <div>
      <label className="block mb-2 text-[11px] font-black text-[#1a385f] uppercase tracking-widest">
        Nama Metodologi <span className="text-red-500">*</span>
      </label>
      <input
        id="nama-metodologi"
        type="text"
        value={data.title}
        onChange={(e) => onChange('title', e.target.value)}
        placeholder="Contoh: Metodologi Pengurangan Emisi dari Efisiensi Energi"
        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-[#1a385f]/30 focus:border-[#1a385f] outline-none placeholder:text-gray-300 transition-all bg-white"
      />
    </div>

    {/* Kategori Sektor & Sumber Acuan */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label className="block mb-2 text-[11px] font-black text-[#1a385f] uppercase tracking-widest">
          Kategori Sektor
        </label>
        <div className="relative">
          <select
            id="kategori-sektor"
            value={data.kategoriSektor}
            onChange={(e) => onChange('kategoriSektor', e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-[#1a385f]/30 focus:border-[#1a385f] outline-none text-gray-600 bg-white appearance-none cursor-pointer transition-all"
          >
            <option value="">-- Pilih Sektor --</option>
            {sektorOptions.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <label className="block mb-2 text-[11px] font-black text-[#1a385f] uppercase tracking-widest">
          Sumber Acuan
        </label>
        <div className="relative">
          <select
            id="sumber-acuan"
            value={data.sumberAcuan}
            onChange={(e) => onChange('sumberAcuan', e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-[#1a385f]/30 focus:border-[#1a385f] outline-none text-gray-600 bg-white appearance-none cursor-pointer transition-all"
          >
            {SUMBER_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    {/* description */}
    <div>
      <label className="block mb-2 text-[11px] font-black text-[#1a385f] uppercase tracking-widest">
        description Pengusulan
      </label>
      <textarea
        id="description"
        rows={6}
        value={data.description}
        onChange={(e) => onChange('description', e.target.value)}
        placeholder="Uraikan alasan mengapa metodologi ini perlu diusulkan..."
        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-[#1a385f]/30 focus:border-[#1a385f] outline-none placeholder:text-gray-300 resize-none transition-all bg-white"
      />
    </div>
  </div>
);

// ─── Step 2 – Dokumen ─────────────────────────────────────────────────────────

const StepDokumen: React.FC<{
  data: ProposalFormData;
  metadataConfig: MetadataField[];
  onChange: (field: keyof ProposalFormData, value: string | File | null) => void;
  onMetadataChange: (key: string, value: string) => void;
}> = ({ data, metadataConfig, onChange, onMetadataChange }) => (
  <div className="space-y-6">
    {/* File Upload */}
    <div>
      <label className="block mb-2 text-[11px] font-black text-[#1a385f] uppercase tracking-widest">
        Unggah Dokumen <span className="text-red-500">*</span>
        <span className="ml-2 font-medium text-gray-400 normal-case tracking-normal text-[10px]">(PDF, DOCX, maks. 10 MB)</span>
      </label>
      <label
        htmlFor="dokumen-file"
        className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-md cursor-pointer hover:border-[#1a385f] hover:bg-[#1a385f]/5 transition-all group"
      >
        <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-[#1a385f] transition-colors">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          {data.file ? (
            <span className="text-sm font-semibold text-[#1a385f]">{data.file.name}</span>
          ) : (
            <>
              <span className="text-sm font-semibold">Klik untuk memilih file</span>
              <span className="text-[11px]">atau seret dan lepaskan di sini</span>
            </>
          )}
        </div>
        <input
          id="dokumen-file"
          type="file"
          accept=".pdf,.docx,.doc"
          className="hidden"
          onChange={(e) => onChange('file', e.target.files?.[0] ?? null)}
        />
      </label>
    </div>

    {/* Dynamic Metadata Fields */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
      {metadataConfig.map((field) => (
        <div key={field.key}>
          <label className="block mb-2 text-[11px] font-black text-[#1a385f] uppercase tracking-widest">
            {field.label} {field.isRequired && <span className="text-red-500">*</span>}
          </label>
          
          {field.dataType === 'STRING' && (
            <input
              type="text"
              value={data.metadata[field.key] || ''}
              onChange={(e) => onMetadataChange(field.key, e.target.value)}
              placeholder={`Masukkan ${field.label}`}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-[#1a385f]/30 focus:border-[#1a385f] outline-none placeholder:text-gray-300 transition-all bg-white"
            />
          )}

          {field.dataType === 'DATE' && (
            <input
              type="date"
              value={data.metadata[field.key] || ''}
              onChange={(e) => onMetadataChange(field.key, e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-[#1a385f]/30 focus:border-[#1a385f] outline-none text-gray-600 transition-all bg-white"
            />
          )}

          {field.dataType === 'SELECT' && (
            <div className="relative">
              <select
                value={data.metadata[field.key] || ''}
                onChange={(e) => onMetadataChange(field.key, e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-[#1a385f]/30 focus:border-[#1a385f] outline-none text-gray-600 bg-white appearance-none cursor-pointer transition-all"
              >
                <option value="">-- Pilih {field.label} --</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

// ─── Step 3 – Review ──────────────────────────────────────────────────────────

const StepReview: React.FC<{ data: ProposalFormData; metadataConfig: MetadataField[]; sektorOptions: SektorOption[] }> = ({ data, metadataConfig, sektorOptions }) => {
  const selectedSektor = sektorOptions.find((s) => s.id === data.kategoriSektor);
  const baseRows: { label: string; value: string }[] = [
    { label: 'Tipe Pengusulan', value: data.submissionType === 'REVISION' ? `Revisi (${data.parentDocumentName || '—'})` : 'Baru' },
    { label: 'Nama Metodologi', value: data.title || '—' },
    { label: 'Kategori Sektor', value: selectedSektor?.name || data.kategoriSektor || '—' },
    { label: 'Sumber Acuan', value: data.sumberAcuan || '—' },
    { label: 'description Pengusulan', value: data.description || '—' },
    { label: 'Dokumen', value: data.file?.name || '—' },
  ];

  const metadataRows = metadataConfig.map(field => ({
    label: field.label,
    value: data.metadata[field.key] || '—'
  }));

  const rows = [...baseRows, ...metadataRows];

  return (
    <div className="space-y-1">
      <p className="text-sm text-gray-500 mb-5">
        Periksa kembali data di bawah sebelum mengirimkan usulan.
      </p>
      <div className="divide-y divide-gray-100 border border-gray-100 rounded-md overflow-hidden">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex gap-4 px-5 py-3 bg-white hover:bg-[#f8f9fa] transition-colors">
            <span className="w-48 flex-shrink-0 text-[11px] font-black text-gray-400 uppercase tracking-widest pt-0.5">
              {label}
            </span>
            <span className="text-sm text-[#1a385f] font-medium flex-1 break-words">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Revision Modal ───────────────────────────────────────────────────────────

const RevisionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string, name: string) => void;
}> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const mockDocs = [
    { id: '1', name: 'Metodologi Efisiensi Energi pada Industri Semen' },
    { id: '2', name: 'Restorasi Ekosistem Gambut (AR-ACM0001)' },
    { id: '3', name: 'Pengelolaan Limbah Cair Domestik Terpadu' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a385f]/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full max-w-2xl flex flex-col max-h-[85vh] overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#f8f9fa]">
          <div>
            <h3 className="text-lg font-black text-[#1a385f]">Pilih Dokumen</h3>
            <p className="text-xs text-gray-500 mt-1 font-medium">Pilih metodologi yang ingin direvisi dari daftar yang tersedia</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-white p-2 border border-gray-200 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-2 overflow-y-auto flex-1">
          <div className="space-y-1 p-4">
            {mockDocs.map((doc) => (
              <div 
                key={doc.id} 
                onClick={() => onSelect(doc.id, doc.name)}
                className="p-4 border border-gray-100 rounded-lg cursor-pointer hover:bg-green-50 hover:border-[#1e7e45] transition-all flex justify-between items-center group"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-[13px] text-[#1a385f]">{doc.name}</span>
                  <span className="text-[11px] text-gray-400 font-medium mt-1">ID: DOC-{doc.id.padStart(4, '0')}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#1e7e45]" />
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 bg-[#f8f9fa]">
          <button 
            onClick={onClose}
            className="w-full py-2.5 bg-white border border-gray-200 text-gray-600 text-[13px] font-bold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const MOCK_METADATA_RESPONSE: MetadataField[] = [
  { _id: '69cd154fc79c72f0e7a9d369', key: 'author_name', label: 'Nama Penulis', dataType: 'STRING', isRequired: true, options: [], isActive: true, order: 1 },
  { _id: '69cd154fc79c72f0e7a9d36a', key: 'publish_date', label: 'Tanggal Penerbitan', dataType: 'DATE', isRequired: true, options: [], isActive: true, order: 2 },
  { _id: '69cd154fc79c72f0e7a9d36b', key: 'document_type', label: 'Jenis Dokumen', dataType: 'SELECT', isRequired: true, options: ['Policy', 'Manual', 'Report', 'Procedure'], isActive: true, order: 3 }
];

const ExternalProposalPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [sektorOptions, setSektorOptions] = useState<SektorOption[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [metadataConfig, setMetadataConfig] = useState<MetadataField[]>(MOCK_METADATA_RESPONSE);
  const [formData, setFormData] = useState<ProposalFormData>({
    submissionType: 'NEW',
    title: '',
    kategoriSektor: '',
    sumberAcuan: 'UNFCCC Approved',
    description: '',
    publisherId: '',
    file: null,
    metadata: {},
  });

  const { user } = useAuthStore();

  useEffect(() => {
    const fetchSektorOptions = async () => {
      try {
        const response = await openKmClient.get('/documents/list/category');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options = response.data.map((item: any) => ({
          id: item.NBS_UUID,
          name: item.NBS_NAME
        }));
        setSektorOptions(options);
      } catch (error) {
        console.error('Failed to fetch sektor options', error);
      }
    };
    fetchSektorOptions();
  }, []);

  const handleMetadataChange = (key: string, value: string) => {
    setFormData((prev: ProposalFormData) => ({
      ...prev,
      metadata: { ...prev.metadata, [key]: value }
    }));
  };

  const handleChange = (field: keyof ProposalFormData, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      

      const payload = new FormData();
      payload.append('submissionType', formData.submissionType);
      payload.append('title', formData.title);
      payload.append('kategoriSektor', formData.kategoriSektor);
      payload.append('sumberAcuan', formData.sumberAcuan);
      payload.append('description', formData.description);
      payload.append('publisherId', user?.id || '');
      
      if (formData.file) {
        payload.append('file', formData.file);
      }
      if (formData.submissionType === 'REVISION' && formData.parentDocumentId) {
        payload.append('parentDocumentId', formData.parentDocumentId);
      }
      
      // Submit metadata object as a JSON string
      payload.append('metadata', JSON.stringify(formData.metadata));

      await submissionService.createSubmission(payload);
      setSubmitted(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Failed to submit:', error);
      setSubmitError(error.response?.data?.message || 'Gagal mengirim usulan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success screen ──
  if (submitted) {
    return (
      <ExternalLayout>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white border border-gray-100 rounded-xl shadow-[0_4px_24px_rgb(0,0,0,0.06)] p-12 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-[#1e7e45]/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-[#1e7e45]" />
            </div>
            <h2 className="text-xl font-black text-[#1a385f] mb-2">Usulan Terkirim!</h2>
            <p className="text-sm text-gray-500 mb-8">
              Pengusulan metodologi Anda telah berhasil dikirim dan akan ditinjau oleh tim kami.
            </p>
            <button
              id="kembali-ke-daftar-btn"
              onClick={() => navigate('/dashboard/external')}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1a385f] text-white text-sm font-bold rounded-lg hover:bg-[#12284a] transition-colors"
            >
              Kembali ke Daftar
            </button>
          </div>
        </div>
      </ExternalLayout>
    );
  }

  return (
    <ExternalLayout>
      {/* Breadcrumb */}
      <div className="w-full px-8 py-3 bg-white border-b border-gray-100 flex items-center">
        <div className="text-[11px] font-medium text-gray-400">
          Beranda /{' '}
          <button
            className="hover:text-[#1a385f] transition-colors"
            onClick={() => navigate('/dashboard/external')}
          >
            Daftar Metodologi
          </button>{' '}
          / <span className="text-[#1a385f] font-semibold">Pengusulan Baru</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[860px] mx-auto w-full p-6 md:p-8">
        {/* Page Title */}
        <h1 className="text-2xl tracking-tight text-gray-400 mb-6">
          Formulir <span className="font-black text-[#1a385f]">Pengusulan Metodologi</span>
        </h1>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Form Card */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-[0_4px_24px_rgb(0,0,0,0.05)] overflow-hidden">
          <div className="p-7 md:p-8">
            {currentStep === 1 && (
              <StepInformasi data={formData} sektorOptions={sektorOptions} onChange={handleChange} onShowModal={() => setShowRevisionModal(true)} />
            )}
            {currentStep === 2 && (
              <StepDokumen 
                data={formData} 
                metadataConfig={metadataConfig} 
                onChange={handleChange} 
                onMetadataChange={handleMetadataChange}
              />
            )}
            {currentStep === 3 && (
              <StepReview data={formData} metadataConfig={metadataConfig} sektorOptions={sektorOptions} />
            )}
            
            {submitError && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 text-[13px] rounded-md border border-red-100 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {submitError}
              </div>
            )}
          </div>

          {/* Card Footer / Actions */}
          <div className="border-t border-gray-100 px-7 md:px-8 py-5 flex justify-between items-center bg-[#f8f9fa]">
            {/* Back */}
            {currentStep > 1 ? (
              <button
                id="back-btn"
                onClick={handleBack}
                className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-bold text-gray-500 hover:text-[#1a385f] border border-gray-200 hover:border-[#1a385f] rounded-lg transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Kembali
              </button>
            ) : (
              <div /> /* spacer */
            )}

            {/* Next / Submit */}
            {currentStep < 3 ? (
              <button
                id="lanjutkan-btn"
                onClick={handleNext}
                disabled={currentStep === 1 && !formData.title.trim()}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-[#1a385f] text-white text-[13px] font-bold rounded-lg hover:bg-[#12284a] transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Lanjutkan
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="kirim-btn"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-[#1e7e45] text-white text-[13px] font-bold rounded-lg hover:bg-[#1b7140] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {isSubmitting ? 'Mengirim...' : 'Kirim Usulan'}
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Modification Modal */}
      <RevisionModal 
        isOpen={showRevisionModal} 
        onClose={() => setShowRevisionModal(false)} 
        onSelect={(id, name) => {
          handleChange('parentDocumentId', id);
          handleChange('parentDocumentName', name);
          handleChange('submissionType', 'REVISION');
          setShowRevisionModal(false);
        }}
      />
    </ExternalLayout>
  );
};

export default ExternalProposalPage;
