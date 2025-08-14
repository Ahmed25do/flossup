import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we have valid Supabase credentials
const hasValidCredentials = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  supabaseUrl !== 'https://your-project-ref.supabase.co' && 
  supabaseAnonKey !== 'your-anon-key-here' &&
  supabaseAnonKey.length > 20;

if (!hasValidCredentials) {
  console.warn('Supabase credentials not configured. Using mock client.');
}

// Create Supabase client or mock client
export const supabase = hasValidCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper function to check if Supabase is available
export const isSupabaseConfigured = () => hasValidCredentials;

// Database types
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  specialization?: string;
  license_number?: string;
  years_experience?: number;
  location?: string;
  bio?: string;
  avatar_url?: string;
  website?: string;
  university?: string;
  graduation_year?: number;
  phone?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  content: string;
  images?: string[];
  video_url?: string;
  is_sponsored: boolean;
  sponsored_link?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  parent_id?: string;
  likes_count: number;
  created_at: string;
  profiles?: Profile;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  instructor_id?: string;
  price: number;
  duration_hours?: number;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  thumbnail_url?: string;
  is_published: boolean;
  enrollment_count: number;
  rating: number;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  instructor_id: string;
  video_url: string;
  thumbnail_url?: string;
  duration_seconds?: number;
  type: 'lecture' | 'reel';
  category: string;
  views_count: number;
  likes_count: number;
  comments_count: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  subcategory?: string;
  brand?: string;
  sku?: string;
  stock_quantity: number;
  images?: string[];
  specifications?: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lab {
  id: string;
  name: string;
  description?: string;
  location?: string;
  phone?: string;
  email?: string;
  website?: string;
  rating: number;
  reviews_count: number;
  turnaround_days?: string;
  specialties?: string[];
  certifications?: string[];
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface LabService {
  id: string;
  lab_id: string;
  name: string;
  description?: string;
  price?: number;
  turnaround_days?: string;
  category?: string;
}

export interface LabRequest {
  id: string;
  user_id: string;
  lab_id: string;
  service_id: string;
  patient_name: string;
  tooth_numbers?: string;
  shade?: string;
  special_instructions?: string;
  files?: string[];
  requested_delivery_date?: string;
  priority: 'standard' | 'rush' | 'emergency';
  status: 'submitted' | 'in_queue' | 'in_progress' | 'ready' | 'completed' | 'cancelled';
  stage?: string;
  progress: number;
  total_cost?: number;
  created_at: string;
  updated_at: string;
  labs?: Lab;
  lab_services?: LabService;
}

// Authentication helpers
export const signUp = async (email: string, password: string, userData: Partial<Profile>) => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your Supabase credentials.');
  }
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
      emailRedirectTo: undefined
    }
  });
  
  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your Supabase credentials.');
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your Supabase credentials.');
  }
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  if (!supabase) {
    return null;
  }
  
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Database helpers
export const createProfile = async (profileData: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([profileData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Posts
export const getPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (
        id,
        full_name,
        avatar_url,
        specialization
      )
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createPost = async (postData: Partial<Post>) => {
  const { data, error } = await supabase
    .from('posts')
    .insert([postData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Videos
export const getVideos = async (type?: 'lecture' | 'reel') => {
  let query = supabase
    .from('videos')
    .select(`
      *,
      profiles (
        id,
        full_name,
        avatar_url,
        specialization
      )
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false });
  
  if (type) {
    query = query.eq('type', type);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
};

// Products
export const getProducts = async (category?: string) => {
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
};

// Labs
export const getLabs = async () => {
  const { data, error } = await supabase
    .from('labs')
    .select(`
      *,
      lab_services (*)
    `)
    .eq('is_active', true)
    .order('rating', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getLabServices = async (labId: string) => {
  const { data, error } = await supabase
    .from('lab_services')
    .select('*')
    .eq('lab_id', labId);
  
  if (error) throw error;
  return data;
};

export const createLabRequest = async (requestData: Partial<LabRequest>) => {
  const { data, error } = await supabase
    .from('lab_requests')
    .insert([requestData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getLabRequests = async (userId: string) => {
  const { data, error } = await supabase
    .from('lab_requests')
    .select(`
      *,
      labs (name),
      lab_services (name)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Courses
export const getCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      profiles (
        id,
        full_name,
        avatar_url,
        specialization
      )
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Books
export const getBooks = async (category?: string) => {
  let query = supabase
    .from('books')
    .select(`
      *,
      profiles (
        id,
        full_name,
        avatar_url,
        specialization
      )
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false });
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
};

// Articles
export const getArticles = async (category?: string) => {
  let query = supabase
    .from('articles')
    .select(`
      *,
      profiles (
        id,
        full_name,
        avatar_url,
        specialization
      )
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false });
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
};

// Live Events
export const getLiveEvents = async (category?: string) => {
  let query = supabase
    .from('live_events')
    .select(`
      *,
      profiles (
        id,
        full_name,
        avatar_url,
        specialization
      )
    `)
    .eq('is_published', true)
    .order('start_time', { ascending: true });
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
};

// Book purchases
export const purchaseBook = async (bookId: string, transactionId: string) => {
  const { data, error } = await supabase
    .from('book_purchases')
    .insert([{
      book_id: bookId,
      transaction_id: transactionId,
      price_paid: 0 // This should be set from the transaction
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Event registrations
export const registerForEvent = async (eventId: string) => {
  const { data, error } = await supabase
    .from('event_registrations')
    .insert([{
      event_id: eventId
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Article interactions
export const trackArticleView = async (articleId: string) => {
  const { data, error } = await supabase
    .from('article_views')
    .upsert([{
      article_id: articleId,
      viewed_at: new Date().toISOString()
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const likeArticle = async (articleId: string) => {
  const { data, error } = await supabase
    .from('article_likes')
    .insert([{
      article_id: articleId
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};