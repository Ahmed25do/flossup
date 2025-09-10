/*
  # FlossUp Storage System Setup

  1. Storage Buckets
    - `profiles` - User avatars and profile images (public)
    - `posts` - Social media post images and videos (public)
    - `courses` - Course materials, PDFs, videos (private)
    - `products` - Product images for shop (public)
    - `labs` - Lab service files and documents (private)
    - `messages` - Chat attachments (private)
    - `books` - Digital book files (private)
    - `articles` - Article images and attachments (public)
    - `events` - Event cover images and materials (public)

  2. Security
    - RLS policies for each bucket
    - Proper access control based on user roles
    - Public access for marketing content
    - Private access for user-specific content
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('profiles', 'profiles', true),
  ('posts', 'posts', true),
  ('courses', 'courses', false),
  ('products', 'products', true),
  ('labs', 'labs', false),
  ('messages', 'messages', false),
  ('books', 'books', false),
  ('articles', 'articles', true),
  ('events', 'events', true)
ON CONFLICT (id) DO NOTHING;

-- ===============================
-- Storage Policies
-- ===============================

-- PROFILES BUCKET
CREATE POLICY "Users can upload their own profile images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profiles' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own profile images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'profiles' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own profile images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'profiles' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Anyone can view profile images"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'profiles');

-- POSTS BUCKET
CREATE POLICY "Users can upload post media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'posts' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own post media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'posts' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own post media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'posts' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Anyone can view post media"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'posts');

-- COURSES BUCKET
CREATE POLICY "Course instructors can upload course materials"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'courses' AND
    EXISTS (
      SELECT 1 FROM courses 
      WHERE instructor_id = auth.uid() 
      AND id::text = (storage.foldername(name))[1]
    )
  );

CREATE POLICY "Course instructors can manage their course materials"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'courses' AND
    EXISTS (
      SELECT 1 FROM courses 
      WHERE instructor_id = auth.uid() 
      AND id::text = (storage.foldername(name))[1]
    )
  );

CREATE POLICY "Course instructors can delete their course materials"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'courses' AND
    EXISTS (
      SELECT 1 FROM courses 
      WHERE instructor_id = auth.uid() 
      AND id::text = (storage.foldername(name))[1]
    )
  );

CREATE POLICY "Enrolled users can view course materials"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'courses' AND
    (
      EXISTS (
        SELECT 1 FROM courses 
        WHERE instructor_id = auth.uid() 
        AND id::text = (storage.foldername(name))[1]
      ) OR
      EXISTS (
        SELECT 1 FROM course_enrollments ce
        JOIN courses c ON c.id = ce.course_id
        WHERE ce.user_id = auth.uid() 
        AND c.id::text = (storage.foldername(name))[1]
      )
    )
  );

-- PRODUCTS BUCKET
CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'products');

CREATE POLICY "Admins can update product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'products');

CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'products');

CREATE POLICY "Anyone can view product images"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'products');

-- LABS BUCKET
CREATE POLICY "Users can upload lab request files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'labs' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their lab files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'labs' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their lab files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'labs' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view their own lab files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'labs' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- MESSAGES BUCKET
CREATE POLICY "Users can upload message attachments"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'messages' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their message attachments"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'messages' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their message attachments"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'messages' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Conversation participants can view message attachments"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'messages' AND
    EXISTS (
      SELECT 1 FROM messages m
      JOIN conversation_participants cp ON cp.conversation_id = m.conversation_id
      WHERE cp.user_id = auth.uid()
      AND m.id::text = (storage.foldername(name))[2]
    )
  );

-- BOOKS BUCKET
CREATE POLICY "Authors can upload book files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'books' AND
    EXISTS (
      SELECT 1 FROM books 
      WHERE author_id = auth.uid() 
      AND id::text = (storage.foldername(name))[1]
    )
  );

CREATE POLICY "Authors can manage their book files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'books' AND
    EXISTS (
      SELECT 1 FROM books 
      WHERE author_id = auth.uid() 
      AND id::text = (storage.foldername(name))[1]
    )
  );

CREATE POLICY "Authors can delete their book files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'books' AND
    EXISTS (
      SELECT 1 FROM books 
      WHERE author_id = auth.uid() 
      AND id::text = (storage.foldername(name))[1]
    )
  );

CREATE POLICY "Book purchasers can download book files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'books' AND
    (
      EXISTS (
        SELECT 1 FROM books 
        WHERE author_id = auth.uid() 
        AND id::text = (storage.foldername(name))[1]
      ) OR
      EXISTS (
        SELECT 1 FROM book_purchases bp
        JOIN books b ON b.id = bp.book_id
        WHERE bp.user_id = auth.uid() 
        AND b.id::text = (storage.foldername(name))[1]
      )
    )
  );

-- ARTICLES BUCKET
CREATE POLICY "Authors can upload article media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'articles' AND
    EXISTS (
      SELECT 1 FROM articles 
      WHERE author_id = auth.uid() 
      AND id::text = (storage.foldername(name))[1]
    )
  );

CREATE POLICY "Authors can manage their article media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'articles' AND
    EXISTS (
      SELECT 1 FROM articles 
      WHERE author_id = auth.uid() 
      AND id::text = (storage.foldername(name))[1]
    )
  );

CREATE POLICY "Authors can delete their article media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'articles' AND
    EXISTS (
      SELECT 1 FROM articles 
      WHERE author_id = auth.uid() 
      AND id::text = (storage.foldername(name))[1]
    )
  );

CREATE POLICY "Anyone can view article media"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'articles');

-- EVENTS BUCKET
CREATE POLICY "Event hosts can upload event media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'events' AND
    EXISTS (
      SELECT 1 FROM live_events 
      WHERE host_id = auth.uid() 
      AND id::text = (storage.foldername(name))[1]
    )
  );

CREATE POLICY "Event hosts can manage their event media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'events' AND
    EXISTS (
      SELECT 1 FROM live_events 
      WHERE host_id = auth.uid() 
      AND id::text = (storage.foldername(name))[1]
    )
  );

CREATE POLICY "Event hosts can delete their event media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'events' AND
    EXISTS (
      SELECT 1 FROM live_events 
      WHERE host_id = auth.uid() 
      AND id::text = (storage.foldername(name))[1]
    )
  );

CREATE POLICY "Anyone can view event media"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'events');