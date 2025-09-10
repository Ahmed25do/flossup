import { useState } from 'react';
import { uploadFile, UploadOptions, UploadResult } from '../lib/storage';

interface UseFileUploadOptions extends Omit<UploadOptions, 'fileName'> {
  maxSize?: number; // in MB
  allowedTypes?: string[];
}

export const useFileUpload = (options: UseFileUploadOptions) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadResult[]>([]);

  const validateFile = (file: File): string | null => {
    const { maxSize = 10, allowedTypes } = options;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    // Check file type
    if (allowedTypes && allowedTypes.length > 0) {
      const fileType = file.type;
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      
      const isValidType = allowedTypes.some(type => {
        if (type.includes('/')) {
          return fileType === type;
        }
        return fileExt === type;
      });

      if (!isValidType) {
        return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
      }
    }

    return null;
  };

  const upload = async (file: File, fileName?: string): Promise<UploadResult> => {
    setUploading(true);
    setError(null);

    try {
      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return { success: false, error: validationError };
      }

      // Upload file
      const result = await uploadFile(file, {
        ...options,
        fileName,
      });

      if (result.success) {
        setUploadedFiles(prev => [...prev, result]);
      } else {
        setError(result.error || 'Upload failed');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUploading(false);
    }
  };

  const uploadMultiple = async (files: File[]): Promise<UploadResult[]> => {
    setUploading(true);
    setError(null);

    const results: UploadResult[] = [];

    try {
      for (const file of files) {
        const result = await upload(file);
        results.push(result);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }

    return results;
  };

  const reset = () => {
    setError(null);
    setUploadedFiles([]);
  };

  return {
    upload,
    uploadMultiple,
    uploading,
    error,
    uploadedFiles,
    reset,
  };
};