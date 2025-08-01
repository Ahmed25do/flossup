/*
  # FlossUp Dental Professional Platform Database Schema

  ## Overview
  This migration creates the complete database schema for FlossUp, a comprehensive dental professional platform.

  ## New Tables
  1. **profiles** - User profiles with professional information
  2. **posts** - Social media posts with images/videos
  3. **comments** - Comments on posts with threading support
  4. **likes** - Like system for posts and comments
  5. **courses** - Educational courses and content
  6. **course_enrollments** - User course enrollments and progress
  7. **videos** - Educational videos and reels
  8. **video_views** - Video view tracking
  9. **video_comments** - Comments on videos
  10. **products** - Dental products and equipment
  11. **orders** - Purchase orders
  12. **order_items** - Individual items in orders
  13. **labs** - Dental laboratory information
  14. **lab_services** - Services offered by labs
  15. **lab_requests** - Lab service requests
  16. **conversations** - Chat conversations
  17. **conversation_participants** - Conversation participants
  18. **messages** - Chat messages
  19. **notifications** - User notifications

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Optimized policies using (select auth.uid()) pattern
  - Proper access control for all user data
  - Public read access for published content
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  specialization text,
  license_number text,
  years_experience integer,
  location text,
  bio text,
  avatar_url text,
  website text,
  university text,
  graduation_year integer,
  phone text,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  images text[],
  video_url text,
  is_sponsored boolean DEFAULT false,
  sponsored_link text,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  shares_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT likes_target_check CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR 
    (post_id IS NULL AND comment_id IS NOT NULL)
  ),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, comment_id)
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  instructor_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  price decimal(10,2) DEFAULT 0,
  duration_hours integer,
  level text CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  category text NOT NULL,
  thumbnail_url text,
  is_published boolean DEFAULT false,
  enrollment_count integer DEFAULT 0,
  rating decimal(3,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Course enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  enrolled_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  UNIQUE(user_id, course_id)
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  instructor_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  video_url text NOT NULL,
  thumbnail_url text,
  duration_seconds integer,
  type text CHECK (type IN ('lecture', 'reel')) DEFAULT 'lecture',
  category text NOT NULL,
  views_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Video views table
CREATE TABLE IF NOT EXISTS video_views (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  viewed_at timestamptz DEFAULT now(),
  watch_duration integer DEFAULT 0,
  UNIQUE(user_id, video_id)
);

-- Video comments table
CREATE TABLE IF NOT EXISTS video_comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  parent_id uuid REFERENCES video_comments(id) ON DELETE CASCADE,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  category text NOT NULL,
  subcategory text,
  brand text,
  sku text UNIQUE,
  stock_quantity integer DEFAULT 0,
  images text[],
  specifications jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  total_amount decimal(10,2) NOT NULL,
  shipping_address jsonb,
  billing_address jsonb,
  payment_method text,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Labs table
CREATE TABLE IF NOT EXISTS labs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  location text,
  phone text,
  email text,
  website text,
  rating decimal(3,2) DEFAULT 0,
  reviews_count integer DEFAULT 0,
  turnaround_days text,
  specialties text[],
  certifications text[],
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Lab services table
CREATE TABLE IF NOT EXISTS lab_services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lab_id uuid REFERENCES labs(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  price decimal(10,2),
  turnaround_days text,
  category text
);

-- Lab requests table
CREATE TABLE IF NOT EXISTS lab_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  lab_id uuid REFERENCES labs(id) ON DELETE CASCADE NOT NULL,
  service_id uuid REFERENCES lab_services(id) ON DELETE CASCADE NOT NULL,
  patient_name text NOT NULL,
  tooth_numbers text,
  shade text,
  special_instructions text,
  files text[],
  requested_delivery_date date,
  priority text DEFAULT 'standard' CHECK (priority IN ('standard', 'rush', 'emergency')),
  status text DEFAULT 'submitted' CHECK (status IN ('submitted', 'in_queue', 'in_progress', 'ready', 'completed', 'cancelled')),
  stage text,
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  total_cost decimal(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text,
  is_group boolean DEFAULT false,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Conversation participants table
CREATE TABLE IF NOT EXISTS conversation_participants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  joined_at timestamptz DEFAULT now(),
  last_read_at timestamptz DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'video')),
  file_url text,
  file_name text,
  created_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id);

-- Posts policies
CREATE POLICY "Anyone can view posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = author_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = author_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = author_id);

-- Comments policies
CREATE POLICY "Anyone can view comments"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = author_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = author_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = author_id);

-- Likes policies
CREATE POLICY "Users can view and manage likes"
  ON likes FOR ALL
  TO authenticated
  USING ((select auth.uid()) = user_id OR true)
  WITH CHECK ((select auth.uid()) = user_id);

-- Courses policies
CREATE POLICY "Users can view published courses and manage own courses"
  ON courses FOR SELECT
  TO authenticated
  USING (is_published = true OR (select auth.uid()) = instructor_id);

CREATE POLICY "Users can create courses"
  ON courses FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = instructor_id);

CREATE POLICY "Instructors can manage own courses"
  ON courses FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = instructor_id);

CREATE POLICY "Instructors can delete own courses"
  ON courses FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = instructor_id);

-- Course enrollments policies
CREATE POLICY "Users can view own enrollments"
  ON course_enrollments FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can enroll in courses"
  ON course_enrollments FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own enrollments"
  ON course_enrollments FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Videos policies
CREATE POLICY "Users can view published videos and manage own videos"
  ON videos FOR SELECT
  TO authenticated
  USING (is_published = true OR (select auth.uid()) = instructor_id);

CREATE POLICY "Users can create videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = instructor_id);

CREATE POLICY "Instructors can manage own videos"
  ON videos FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = instructor_id);

CREATE POLICY "Instructors can delete own videos"
  ON videos FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = instructor_id);

-- Video views policies
CREATE POLICY "Users can manage own video views"
  ON video_views FOR ALL
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- Video comments policies
CREATE POLICY "Anyone can view video comments"
  ON video_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create video comments"
  ON video_comments FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = author_id);

CREATE POLICY "Users can update own video comments"
  ON video_comments FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = author_id);

CREATE POLICY "Users can delete own video comments"
  ON video_comments FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = author_id);

-- Products policies
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Orders policies
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Order items policies
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = (select auth.uid())
  ));

-- Labs policies
CREATE POLICY "Anyone can view active labs"
  ON labs FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Lab services policies
CREATE POLICY "Anyone can view lab services"
  ON lab_services FOR SELECT
  TO authenticated
  USING (true);

-- Lab requests policies
CREATE POLICY "Users can view own lab requests"
  ON lab_requests FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create lab requests"
  ON lab_requests FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own lab requests"
  ON lab_requests FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Conversations policies
CREATE POLICY "Users can view conversations they participate in"
  ON conversations FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM conversation_participants 
    WHERE conversation_participants.conversation_id = conversations.id 
    AND conversation_participants.user_id = (select auth.uid())
  ));

CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = created_by);

-- Conversation participants policies
CREATE POLICY "Users can view participants in their conversations"
  ON conversation_participants FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM conversation_participants cp2 
    WHERE cp2.conversation_id = conversation_participants.conversation_id 
    AND cp2.user_id = (select auth.uid())
  ));

CREATE POLICY "Users can add participants to conversations they created"
  ON conversation_participants FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = conversation_participants.conversation_id 
    AND conversations.created_by = (select auth.uid())
  ));

-- Messages policies
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM conversation_participants 
    WHERE conversation_participants.conversation_id = messages.conversation_id 
    AND conversation_participants.user_id = (select auth.uid())
  ));

CREATE POLICY "Users can send messages to conversations they participate in"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.uid()) = sender_id AND
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_participants.conversation_id = messages.conversation_id 
      AND conversation_participants.user_id = (select auth.uid())
    )
  );

-- Notifications policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_instructor_id ON videos(instructor_id);
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_lab_requests_user_id ON lab_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lab_requests_updated_at BEFORE UPDATE ON lab_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for labs
INSERT INTO labs (name, description, location, phone, email, rating, reviews_count, turnaround_days, specialties, certifications, image_url) VALUES
('ProDental Laboratory', 'Leading dental laboratory with over 15 years of experience in precision dental work.', '123 Lab Street, Dental City', '(555) 123-4567', 'orders@prodental.com', 4.9, 1247, '3-7 days', ARRAY['Crown & Bridge', 'Implant Restoration', 'Orthodontics'], ARRAY['ISO 13485', 'FDA Registered', 'CE Marked'], 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=400'),
('Precision Dental Lab', 'State-of-the-art digital laboratory specializing in CAD/CAM technology and cosmetic restorations.', '456 Tech Avenue, Innovation District', '(555) 234-5678', 'info@precisionlab.com', 4.8, 892, '2-6 days', ARRAY['Digital Dentistry', 'CAD/CAM', 'Cosmetic Work'], ARRAY['ISO 9001', 'Digital Certified', 'Quality Assured'], 'https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg?auto=compress&cs=tinysrgb&w=400'),
('Elite Dental Solutions', 'Premium laboratory focusing on complex prosthodontic cases and full mouth reconstructions.', '789 Premium Plaza, Luxury District', '(555) 345-6789', 'service@elitedental.com', 4.7, 654, '4-8 days', ARRAY['Prosthodontics', 'Full Mouth Reconstruction', 'Dentures'], ARRAY['Premium Certified', 'Prosthodontic Specialist', 'Quality Excellence'], 'https://images.pexels.com/photos/3786249/pexels-photo-3786249.jpeg?auto=compress&cs=tinysrgb&w=400'),
('Express Dental Lab', 'Fast-turnaround laboratory specializing in emergency and rush dental work.', '321 Speed Street, Fast Track City', '(555) 456-7890', 'rush@expresslab.com', 4.6, 423, '1-4 days', ARRAY['Rush Orders', 'Emergency Cases', 'Same Day Service'], ARRAY['Speed Certified', 'Emergency Ready', 'Rush Specialist'], 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400');

-- Insert sample lab services
INSERT INTO lab_services (lab_id, name, description, price, turnaround_days, category) VALUES
((SELECT id FROM labs WHERE name = 'ProDental Laboratory'), 'Crown & Bridge', 'High-quality crowns and bridges', 350.00, '5-7 days', 'Restorative'),
((SELECT id FROM labs WHERE name = 'ProDental Laboratory'), 'Implant Restoration', 'Custom implant crowns and abutments', 450.00, '7-10 days', 'Implantology'),
((SELECT id FROM labs WHERE name = 'ProDental Laboratory'), 'Orthodontic Appliance', 'Custom orthodontic appliances', 200.00, '3-5 days', 'Orthodontics'),
((SELECT id FROM labs WHERE name = 'ProDental Laboratory'), 'Night Guard', 'Custom night guards', 150.00, '3-5 days', 'Protective'),
((SELECT id FROM labs WHERE name = 'Precision Dental Lab'), 'Crown & Bridge', 'Digital crowns and bridges', 380.00, '4-6 days', 'Restorative'),
((SELECT id FROM labs WHERE name = 'Precision Dental Lab'), 'Porcelain Veneers', 'Cosmetic porcelain veneers', 520.00, '6-8 days', 'Cosmetic'),
((SELECT id FROM labs WHERE name = 'Precision Dental Lab'), 'Inlays & Onlays', 'Precision inlays and onlays', 290.00, '4-6 days', 'Restorative'),
((SELECT id FROM labs WHERE name = 'Precision Dental Lab'), 'Implant Restoration', 'Digital implant restorations', 480.00, '6-8 days', 'Implantology');