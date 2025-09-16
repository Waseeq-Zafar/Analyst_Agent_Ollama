import React, { useRef, useState } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';
import { ApiService } from '../services/api';

export interface FileUploadProps {
  onUploadComplete: () => void;
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  isProcessing,
  setIsProcessing,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsProcessing(true);
    try {
      const result = await ApiService.uploadFiles(selectedFiles);

      if (result.success) {
        setSelectedFiles([]);
        onUploadComplete();
      } else {
        alert(result.error || 'Upload failed');
      }
    } catch (err) {
      alert('Server error occurred during upload.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Cloud Upload Card */}
      <div
        className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 shadow-sm"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files) {
            setSelectedFiles(Array.from(e.dataTransfer.files));
          }
        }}
      >
        <UploadCloud className="w-12 h-12 text-blue-500 mb-3" />
        {selectedFiles.length === 0 ? (
          <p className="text-gray-500 text-center">
            Click or drag files here to upload
          </p>
        ) : (
          <div className="w-full max-h-48 overflow-y-auto">
            {selectedFiles.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between p-2 mb-1 bg-gray-100 rounded-lg"
              >
                <span className="text-gray-700 text-sm truncate">{file.name}</span>
                <span className="text-gray-400 text-xs">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hidden Input */}
      <input
        type="file"
        multiple
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={isProcessing || selectedFiles.length === 0}
        className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 transition-colors shadow-md"
      >
        {isProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <UploadCloud className="w-5 h-5" />
        )}
        <span className="font-medium">Upload</span>
      </button>
    </div>
  );
};

export default FileUpload;
