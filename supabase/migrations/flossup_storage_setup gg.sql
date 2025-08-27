
-- 1. Profiles (avatars, covers)
insert into storage.buckets (id, name, public) 
values ('profiles', 'profiles', true);

-- 2. Posts (images, videos)
insert into storage.buckets (id, name, public) 
values ('posts', 'posts', true);

-- 3. Courses (PDFs, videos, docs)
insert into storage.buckets (id, name, public) 
values ('courses', 'courses', false);

-- 4. Products (store images)
insert into storage.buckets (id, name, public) 
values ('products', 'products', true);

-- 5. Labs (services, lab documents)
insert into storage.buckets (id, name, public) 
values ('labs', 'labs', false);

-- 6. Messages (chat attachments)
insert into storage.buckets (id, name, public) 
values ('messages', 'messages', false);

-- ===============================
-- Policies (RLS for storage.objects)
-- ===============================

-- PROFILES
create policy "Users can upload their own profile pics"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'profiles'
);

create policy "Anyone can view profile pics"
on storage.objects for select
using (bucket_id = 'profiles');

-- POSTS
create policy "Users can upload posts media"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'posts'
);

create policy "Anyone can view posts media"
on storage.objects for select
using (bucket_id = 'posts');

-- COURSES
create policy "Admins can upload course files"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'courses'
);

create policy "Anyone can view course files"
on storage.objects for select
using (bucket_id = 'courses');

-- PRODUCTS
create policy "Admins can upload product images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'products'
);

create policy "Anyone can view product images"
on storage.objects for select
using (bucket_id = 'products');

-- LABS
create policy "Admins can upload lab files"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'labs'
);

create policy "Anyone can view lab files"
on storage.objects for select
using (bucket_id = 'labs');

-- MESSAGES
create policy "Users can upload their own message attachments"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'messages'
);

create policy "Users can view message attachments they own"
on storage.objects for select
to authenticated
using (bucket_id = 'messages');
