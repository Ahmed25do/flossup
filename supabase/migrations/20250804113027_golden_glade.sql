/*
  # Add Books, Articles, and Live Events to Education System

  1. New Tables
    - `books` - Digital books and publications
    - `articles` - Educational articles and research papers
    - `live_events` - Webinars, conferences, and live sessions
    - `event_registrations` - User registrations for live events
    - `book_purchases` - Track book purchases
    - `article_views` - Track article views

  2. Security
    - Enable RLS on all new tables
    - Proper access control for content and purchases
*/

-- Books table
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  co_authors text[],
  isbn text,
  publisher text,
  publication_date date,
  pages integer,
  language text DEFAULT 'English',
  price decimal(10,2) DEFAULT 0,
  category text NOT NULL,
  subcategory text,
  cover_image_url text,
  pdf_url text,
  sample_pdf_url text,
  tags text[],
  difficulty_level text CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')),
  is_published boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  purchase_count integer DEFAULT 0,
  rating decimal(3,2) DEFAULT 0,
  reviews_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  content text NOT NULL,
  summary text,
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  co_authors text[],
  category text NOT NULL,
  subcategory text,
  tags text[],
  featured_image_url text,
  reading_time integer, -- in minutes
  difficulty_level text CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')),
  is_published boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  is_premium boolean DEFAULT false,
  views_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  shares_count integer DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Live events table
CREATE TABLE IF NOT EXISTS live_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  host_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  co_hosts uuid[],
  event_type text CHECK (event_type IN ('webinar', 'conference', 'workshop', 'seminar', 'panel_discussion')) DEFAULT 'webinar',
  category text NOT NULL,
  subcategory text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  timezone text DEFAULT 'UTC',
  max_attendees integer,
  price decimal(10,2) DEFAULT 0,
  meeting_url text,
  meeting_id text,
  meeting_password text,
  platform text DEFAULT 'zoom', -- zoom, teams, meet, etc.
  cover_image_url text,
  agenda jsonb,
  materials_urls text[],
  tags text[],
  difficulty_level text CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')),
  is_published boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  status text CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')) DEFAULT 'scheduled',
  registration_count integer DEFAULT 0,
  rating decimal(3,2) DEFAULT 0,
  reviews_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Event registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  event_id uuid REFERENCES live_events(id) ON DELETE CASCADE NOT NULL,
  registration_date timestamptz DEFAULT now(),
  attended boolean DEFAULT false,
  feedback_rating integer CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
  feedback_comment text,
  certificate_issued boolean DEFAULT false,
  certificate_url text,
  UNIQUE(user_id, event_id)
);

-- Book purchases table
CREATE TABLE IF NOT EXISTS book_purchases (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  book_id uuid REFERENCES books(id) ON DELETE CASCADE NOT NULL,
  purchase_date timestamptz DEFAULT now(),
  price_paid decimal(10,2) NOT NULL,
  transaction_id uuid REFERENCES transactions(id) ON DELETE SET NULL,
  download_count integer DEFAULT 0,
  last_accessed timestamptz,
  UNIQUE(user_id, book_id)
);

-- Article views table
CREATE TABLE IF NOT EXISTS article_views (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE NOT NULL,
  viewed_at timestamptz DEFAULT now(),
  reading_progress integer DEFAULT 0, -- percentage
  time_spent integer DEFAULT 0, -- in seconds
  UNIQUE(user_id, article_id)
);

-- Article likes table
CREATE TABLE IF NOT EXISTS article_likes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, article_id)
);

-- Enable RLS
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_likes ENABLE ROW LEVEL SECURITY;

-- Books policies
CREATE POLICY "Users can view published books and manage own books"
  ON books FOR SELECT
  TO authenticated
  USING (is_published = true OR (select auth.uid()) = author_id);

CREATE POLICY "Authors can create books"
  ON books FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = author_id);

CREATE POLICY "Authors can manage own books"
  ON books FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = author_id);

CREATE POLICY "Authors can delete own books"
  ON books FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = author_id);

-- Articles policies
CREATE POLICY "Users can view published articles and manage own articles"
  ON articles FOR SELECT
  TO authenticated
  USING (is_published = true OR (select auth.uid()) = author_id);

CREATE POLICY "Authors can create articles"
  ON articles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = author_id);

CREATE POLICY "Authors can manage own articles"
  ON articles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = author_id);

CREATE POLICY "Authors can delete own articles"
  ON articles FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = author_id);

-- Live events policies
CREATE POLICY "Users can view published events and manage own events"
  ON live_events FOR SELECT
  TO authenticated
  USING (is_published = true OR (select auth.uid()) = host_id);

CREATE POLICY "Hosts can create events"
  ON live_events FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = host_id);

CREATE POLICY "Hosts can manage own events"
  ON live_events FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = host_id);

CREATE POLICY "Hosts can delete own events"
  ON live_events FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = host_id);

-- Event registrations policies
CREATE POLICY "Users can view own registrations"
  ON event_registrations FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can register for events"
  ON event_registrations FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own registrations"
  ON event_registrations FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Book purchases policies
CREATE POLICY "Users can view own book purchases"
  ON book_purchases FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can purchase books"
  ON book_purchases FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own purchases"
  ON book_purchases FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Article views policies
CREATE POLICY "Users can manage own article views"
  ON article_views FOR ALL
  TO authenticated
  USING ((select auth.uid()) = user_id OR user_id IS NULL)
  WITH CHECK ((select auth.uid()) = user_id OR user_id IS NULL);

-- Article likes policies
CREATE POLICY "Users can manage own article likes"
  ON article_likes FOR ALL
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_books_author_id ON books(author_id);
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_is_published ON books(is_published);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_is_published ON articles(is_published);
CREATE INDEX IF NOT EXISTS idx_live_events_host_id ON live_events(host_id);
CREATE INDEX IF NOT EXISTS idx_live_events_start_time ON live_events(start_time);
CREATE INDEX IF NOT EXISTS idx_live_events_status ON live_events(status);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_book_purchases_user_id ON book_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_article_views_user_id ON article_views(user_id);
CREATE INDEX IF NOT EXISTS idx_article_views_article_id ON article_views(article_id);

-- Create triggers for updated_at
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_live_events_updated_at BEFORE UPDATE ON live_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO books (title, description, author_id, category, price, cover_image_url, is_published, difficulty_level) VALUES
('Advanced Endodontic Techniques', 'Comprehensive guide to modern endodontic procedures and case management.', NULL, 'endodontics', 89.99, 'https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg?auto=compress&cs=tinysrgb&w=400', true, 'Advanced'),
('Digital Orthodontics Handbook', 'Complete reference for digital orthodontic treatment planning and execution.', NULL, 'orthodontics', 129.99, 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=400', true, 'Intermediate'),
('Cosmetic Dentistry Atlas', 'Visual guide to aesthetic dental procedures with case studies.', NULL, 'cosmetic', 149.99, 'https://images.pexels.com/photos/3786249/pexels-photo-3786249.jpeg?auto=compress&cs=tinysrgb&w=400', true, 'Intermediate');

INSERT INTO articles (title, content, summary, category, is_published, reading_time, featured_image_url, difficulty_level) VALUES
('Latest Advances in Dental Implantology', 'Recent developments in implant materials, techniques, and digital workflows have revolutionized the field...', 'Overview of cutting-edge implant technologies and their clinical applications.', 'implantology', true, 8, 'https://images.pexels.com/photos/3779706/pexels-photo-3779706.jpeg?auto=compress&cs=tinysrgb&w=400', 'Advanced'),
('Pediatric Dental Care Best Practices', 'Effective strategies for managing young patients and creating positive dental experiences...', 'Evidence-based approaches to pediatric dentistry and behavior management.', 'pediatric', true, 6, 'https://images.pexels.com/photos/4269697/pexels-photo-4269697.jpeg?auto=compress&cs=tinysrgb&w=400', 'Beginner'),
('Digital Impression Techniques', 'Comprehensive guide to digital impression systems and their clinical applications...', 'Step-by-step guide to digital impressions and CAD/CAM workflows.', 'digital_dentistry', true, 10, 'https://images.pexels.com/photos/263391/pexels-photo-263391.jpeg?auto=compress&cs=tinysrgb&w=400', 'Intermediate');

INSERT INTO live_events (title, description, event_type, category, start_time, end_time, price, max_attendees, is_published, cover_image_url, difficulty_level) VALUES
('Advanced Endodontics Webinar Series', 'Join leading endodontists for a comprehensive webinar series covering the latest techniques and technologies.', 'webinar', 'endodontics', '2024-12-20 18:00:00+00', '2024-12-20 20:00:00+00', 49.99, 500, true, 'https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg?auto=compress&cs=tinysrgb&w=400', 'Advanced'),
('Digital Dentistry Conference 2024', 'Annual conference showcasing the latest in digital dental technologies and workflows.', 'conference', 'digital_dentistry', '2024-12-25 09:00:00+00', '2024-12-25 17:00:00+00', 199.99, 1000, true, 'https://images.pexels.com/photos/263391/pexels-photo-263391.jpeg?auto=compress&cs=tinysrgb&w=400', 'Intermediate'),
('Cosmetic Dentistry Workshop', 'Hands-on workshop covering aesthetic treatment planning and execution.', 'workshop', 'cosmetic', '2024-12-30 14:00:00+00', '2024-12-30 18:00:00+00', 299.99, 50, true, 'https://images.pexels.com/photos/3786249/pexels-photo-3786249.jpeg?auto=compress&cs=tinysrgb&w=400', 'Intermediate');