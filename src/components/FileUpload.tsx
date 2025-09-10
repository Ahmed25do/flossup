import React, { useState, useRef } from 'react';
import { Upload, X, File, Image, Video, FileText } from 'lucide-react';
import { uploadFile, UploadOptions, UploadResult } from '../lib/storage';

interface FileUploadProps {
  onUpload: (result: UploadResult) => void;
  onError?: (error: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  bucket: string;
  folder?: string;
  className?: string;
  children?: React.ReactNode;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  onError,
  accept = '*/*',
  maxSize = 10,
  multiple = false,
  bucket,
  folder,
  className = '',
  children,
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0]; // Handle single file for now
    
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      const error = `File size must be less than ${maxSize}MB`;
      onError?.(error);
      return;
    }

    uploadFileToStorage(file);
  };

  const uploadFileToStorage = async (file: File) => {
    setUploading(true);
    
    try {
      const options: UploadOptions = {
        bucket,
        folder,
      };

      const result = await uploadFile(file, options);
      
      if (result.success) {
        onUpload(result);
      } else {
        onError?.(result.error || 'Upload failed');
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return <Image className="h-8 w-8 text-blue-500" />;
    }
    
    if (['mp4', 'avi', 'mov', 'wmv'].includes(ext || '')) {
      return <Video className="h-8 w-8 text-purple-500" />;
    }
    
    if (['pdf', 'doc', 'docx', 'txt'].includes(ext || '')) {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    
    return <File className="h-8 w-8 text-gray-500" />;
  };

  if (children) {
    return (
      <div className={className}>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer"
        >
          {children}
        </div>
        {uploading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>Uploading...</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
      
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${dragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        {uploading ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              Max file size: {maxSize}MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;