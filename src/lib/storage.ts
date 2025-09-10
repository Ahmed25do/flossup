import { supabase } from './supabase';

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export interface UploadOptions {
  bucket: string;
  folder?: string;
  fileName?: string;
  upsert?: boolean;
}

/**
 * Upload a file to Supabase Storage
 */
export const uploadFile = async (
  file: File,
  options: UploadOptions
): Promise<UploadResult> => {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { bucket, folder = '', fileName, upsert = false } = options;
    
    // Generate file name if not provided
    const fileExt = file.name.split('.').pop();
    const finalFileName = fileName || `${Date.now()}.${fileExt}`;
    const filePath = folder ? `${folder}/${finalFileName}` : finalFileName;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        upsert,
        contentType: file.type,
      });

    if (error) {
      throw error;
    }

    // Get public URL for public buckets
    const publicBuckets = ['profiles', 'posts', 'products', 'articles', 'events'];
    let publicUrl = '';
    
    if (publicBuckets.includes(bucket)) {
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      publicUrl = urlData.publicUrl;
    }

    return {
      success: true,
      path: data.path,
      url: publicUrl || undefined,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
};

/**
 * Delete a file from Supabase Storage
 */
export const deleteFile = async (
  bucket: string,
  path: string
): Promise<{ success: boolean; error?: string }> => {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    };
  }
};

/**
 * Get a signed URL for private files
 */
export const getSignedUrl = async (
  bucket: string,
  path: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<{ success: boolean; url?: string; error?: string }> => {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      throw error;
    }

    return {
      success: true,
      url: data.signedUrl,
    };
  } catch (error) {
    console.error('Signed URL error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get signed URL',
    };
  }
};

/**
 * Get public URL for public buckets
 */
export const getPublicUrl = (bucket: string, path: string): string => {
  if (!supabase) {
    return '';
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
};

/**
 * List files in a bucket folder
 */
export const listFiles = async (
  bucket: string,
  folder?: string,
  limit?: number
) => {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder, {
        limit,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      throw error;
    }

    return {
      success: true,
      files: data,
    };
  } catch (error) {
    console.error('List files error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list files',
    };
  }
};

// Storage bucket configurations
export const STORAGE_BUCKETS = {
  PROFILES: 'profiles',
  POSTS: 'posts',
  COURSES: 'courses',
  PRODUCTS: 'products',
  LABS: 'labs',
  MESSAGES: 'messages',
  BOOKS: 'books',
  ARTICLES: 'articles',
  EVENTS: 'events',
} as const;

// Helper functions for specific use cases

/**
 * Upload profile avatar
 */
export const uploadProfileAvatar = async (
  file: File,
  userId: string
): Promise<UploadResult> => {
  return uploadFile(file, {
    bucket: STORAGE_BUCKETS.PROFILES,
    folder: userId,
    fileName: 'avatar',
    upsert: true,
  });
};

/**
 * Upload post media
 */
export const uploadPostMedia = async (
  file: File,
  userId: string,
  postId: string
): Promise<UploadResult> => {
  return uploadFile(file, {
    bucket: STORAGE_BUCKETS.POSTS,
    folder: `${userId}/${postId}`,
  });
};

/**
 * Upload course material
 */
export const uploadCourseMaterial = async (
  file: File,
  courseId: string
): Promise<UploadResult> => {
  return uploadFile(file, {
    bucket: STORAGE_BUCKETS.COURSES,
    folder: courseId,
  });
};

/**
 * Upload lab request file
 */
export const uploadLabFile = async (
  file: File,
  userId: string,
  requestId: string
): Promise<UploadResult> => {
  return uploadFile(file, {
    bucket: STORAGE_BUCKETS.LABS,
    folder: `${userId}/${requestId}`,
  });
};

/**
 * Upload message attachment
 */
export const uploadMessageAttachment = async (
  file: File,
  userId: string,
  messageId: string
): Promise<UploadResult> => {
  return uploadFile(file, {
    bucket: STORAGE_BUCKETS.MESSAGES,
    folder: `${userId}/${messageId}`,
  });
};

/**
 * Upload book file
 */
export const uploadBookFile = async (
  file: File,
  bookId: string,
  fileType: 'pdf' | 'cover' | 'sample'
): Promise<UploadResult> => {
  return uploadFile(file, {
    bucket: STORAGE_BUCKETS.BOOKS,
    folder: bookId,
    fileName: fileType,
    upsert: true,
  });
};

/**
 * Upload article media
 */
export const uploadArticleMedia = async (
  file: File,
  articleId: string
): Promise<UploadResult> => {
  return uploadFile(file, {
    bucket: STORAGE_BUCKETS.ARTICLES,
    folder: articleId,
  });
};

/**
 * Upload event media
 */
export const uploadEventMedia = async (
  file: File,
  eventId: string,
  mediaType: 'cover' | 'material'
): Promise<UploadResult> => {
  return uploadFile(file, {
    bucket: STORAGE_BUCKETS.EVENTS,
    folder: eventId,
    fileName: mediaType,
    upsert: true,
  });
};