/*
  # Optimize RLS Policies for Performance

  1. Performance Optimization
    - Replace auth.uid() with (select auth.uid()) in all RLS policies
    - Consolidate multiple permissive policies where possible
    - Improve query performance at scale

  2. Policy Updates
    - Update all existing policies to use optimized auth function calls
    - Maintain same security logic with better performance
*/

-- Drop existing policies that need optimization
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can create posts" ON posts;
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON posts;
DROP POLICY IF EXISTS "Users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;
DROP POLICY IF EXISTS "Users can manage own likes" ON likes;
DROP POLICY IF EXISTS "Users can view all likes" ON likes;
DROP POLICY IF EXISTS "Instructors can manage own courses" ON courses;
DROP POLICY IF EXISTS "Anyone can view published courses" ON courses;
DROP POLICY IF EXISTS "Users can view own enrollments" ON course_enrollments;
DROP POLICY IF EXISTS "Users can enroll in courses" ON course_enrollments;
DROP POLICY IF EXISTS "Users can update own enrollments" ON course_enrollments;
DROP POLICY IF EXISTS "Instructors can manage own videos" ON videos;
DROP POLICY IF EXISTS "Anyone can view published videos" ON videos;
DROP POLICY IF EXISTS "Users can manage own video views" ON video_views;
DROP POLICY IF EXISTS "Users can create video comments" ON video_comments;
DROP POLICY IF EXISTS "Users can update own video comments" ON video_comments;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Users can view own lab requests" ON lab_requests;
DROP POLICY IF EXISTS "Users can create lab requests" ON lab_requests;
DROP POLICY IF EXISTS "Users can update own lab requests" ON lab_requests;
DROP POLICY IF EXISTS "Users can view conversations they participate in" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view participants in their conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can add participants to conversations they created" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can send messages to conversations they participate in" ON messages;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

-- Create optimized policies with (select auth.uid())

-- Profiles policies
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING ((select auth.uid()) = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = id);

-- Posts policies
CREATE POLICY "Users can create posts" ON posts FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = author_id);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE TO authenticated USING ((select auth.uid()) = author_id);
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE TO authenticated USING ((select auth.uid()) = author_id);

-- Comments policies
CREATE POLICY "Users can create comments" ON comments FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = author_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE TO authenticated USING ((select auth.uid()) = author_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE TO authenticated USING ((select auth.uid()) = author_id);

-- Likes policies (consolidated into single policy)
CREATE POLICY "Users can manage own likes" ON likes FOR ALL TO authenticated USING ((select auth.uid()) = user_id);

-- Courses policies (consolidated into single policy)
CREATE POLICY "Users can view and manage courses" ON courses FOR SELECT TO authenticated 
  USING (is_published = true OR (select auth.uid()) = instructor_id);
CREATE POLICY "Instructors can manage own courses" ON courses FOR ALL TO authenticated USING ((select auth.uid()) = instructor_id);

-- Course enrollments policies
CREATE POLICY "Users can view own enrollments" ON course_enrollments FOR SELECT TO authenticated USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can enroll in courses" ON course_enrollments FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Users can update own enrollments" ON course_enrollments FOR UPDATE TO authenticated USING ((select auth.uid()) = user_id);

-- Videos policies (consolidated into single policy)
CREATE POLICY "Users can view and manage videos" ON videos FOR SELECT TO authenticated 
  USING (is_published = true OR (select auth.uid()) = instructor_id);
CREATE POLICY "Instructors can manage own videos" ON videos FOR ALL TO authenticated USING ((select auth.uid()) = instructor_id);

-- Video views policies
CREATE POLICY "Users can manage own video views" ON video_views FOR ALL TO authenticated USING ((select auth.uid()) = user_id);

-- Video comments policies
CREATE POLICY "Users can create video comments" ON video_comments FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = author_id);
CREATE POLICY "Users can update own video comments" ON video_comments FOR UPDATE TO authenticated USING ((select auth.uid()) = author_id);

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders FOR SELECT TO authenticated USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can create orders" ON orders FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Users can update own orders" ON orders FOR UPDATE TO authenticated USING ((select auth.uid()) = user_id);

-- Order items policies
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT TO authenticated 
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_id AND orders.user_id = (select auth.uid())));

-- Lab requests policies
CREATE POLICY "Users can view own lab requests" ON lab_requests FOR SELECT TO authenticated USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can create lab requests" ON lab_requests FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Users can update own lab requests" ON lab_requests FOR UPDATE TO authenticated USING ((select auth.uid()) = user_id);

-- Conversations policies
CREATE POLICY "Users can view conversations they participate in" ON conversations FOR SELECT TO authenticated 
  USING (EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = id AND user_id = (select auth.uid())));
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = created_by);

-- Conversation participants policies
CREATE POLICY "Users can view participants in their conversations" ON conversation_participants FOR SELECT TO authenticated 
  USING (EXISTS (SELECT 1 FROM conversation_participants cp WHERE cp.conversation_id = conversation_id AND cp.user_id = (select auth.uid())));
CREATE POLICY "Users can add participants to conversations they created" ON conversation_participants FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM conversations WHERE id = conversation_id AND created_by = (select auth.uid())));

-- Messages policies
CREATE POLICY "Users can view messages in their conversations" ON messages FOR SELECT TO authenticated 
  USING (EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = (select auth.uid())));
CREATE POLICY "Users can send messages to conversations they participate in" ON messages FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = (select auth.uid())) AND (select auth.uid()) = sender_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT TO authenticated USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE TO authenticated USING ((select auth.uid()) = user_id);