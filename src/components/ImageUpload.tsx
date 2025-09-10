import React, { useState } from 'react';
import { Camera, X, Upload } from 'lucide-react';
import FileUpload from './FileUpload';
import { UploadResult } from '../lib/storage';

interface ImageUploadProps {
  onUpload: (result: UploadResult) => void;
  onError?: (error: string) => void;
  currentImage?: string;
  bucket: string;
  folder?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'square' | 'circle' | 'rectangle';
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  onError,
  currentImage,
  bucket,
  folder,
  className = '',
  size = 'md',
  shape = 'square',
}) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const shapeClasses = {
    square: 'rounded-lg',
    circle: 'rounded-full',
    rectangle: 'rounded-lg aspect-video',
  };

  const handleUpload = (result: UploadResult) => {
    if (result.success && result.url) {
      setPreview(result.url);
    }
    onUpload(result);
  };

  const handleFileSelect = (file: File) => {
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPreview(null);
    // You might want to call a delete function here
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`
        ${sizeClasses[size]} ${shapeClasses[shape]}
        border-2 border-dashed border-gray-300 
        flex items-center justify-center
        overflow-hidden
        relative
        group
      `}>
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={removeImage}
                className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors mr-2"
              >
                <X className="h-4 w-4" />
              </button>
              <FileUpload
                onUpload={handleUpload}
                onError={onError}
                accept="image/*"
                maxSize={5}
                bucket={bucket}
                folder={folder}
              >
                <button className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </FileUpload>
            </div>
          </>
        ) : (
          <FileUpload
            onUpload={handleUpload}
            onError={onError}
            accept="image/*"
            maxSize={5}
            bucket={bucket}
            folder={folder}
            className="w-full h-full"
          >
            <div className="flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
              <Camera className="h-6 w-6 mb-1" />
              <span className="text-xs">Upload</span>
            </div>
          </FileUpload>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;