import React from 'react';

const DocumentUploadPage: React.FC = () => {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-sm border border-gray-100">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Upload Document</h1>
        <p className="mb-8 text-gray-600">Please select files to securely upload to the system.</p>
        
        <div className="flex flex-col items-center justify-center w-full p-12 mt-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
          <svg className="w-12 h-12 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
          </svg>
          <p className="mb-2 text-sm text-gray-500"><span className="font-semibold text-blue-600">Click to upload</span> or drag and drop</p>
          <p className="text-xs text-gray-500">PDF, DOCX, or XLSX (MAX. 10MB)</p>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button className="px-6 py-2.5 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors font-medium">
            Upload Files
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadPage;
