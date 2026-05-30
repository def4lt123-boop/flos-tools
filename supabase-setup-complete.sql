-- Complete Supabase Setup for flos-tools
-- Run this in your Supabase SQL Editor

-- 1. Create posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  file_url TEXT,
  category TEXT DEFAULT 'program',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- 3. Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON posts;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON posts;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON posts;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON posts;

-- 5. Create policies for public read access
CREATE POLICY "Enable read access for all users" 
ON posts FOR SELECT 
USING (true);

-- 6. Create policies for authenticated users (admin)
CREATE POLICY "Enable insert for authenticated users only" 
ON posts FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" 
ON posts FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only" 
ON posts FOR DELETE 
TO authenticated 
USING (true);

-- 7. Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('files', 'files', true)
ON CONFLICT (id) DO NOTHING;

-- 8. Drop existing storage policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete files" ON storage.objects;

-- 9. Create storage policies for images bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images' OR bucket_id = 'files');

CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'files');

CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can delete files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'files');

-- 10. Grant necessary permissions
GRANT ALL ON posts TO authenticated;
GRANT ALL ON posts TO anon;
GRANT USAGE, SELECT ON SEQUENCE posts_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE posts_id_seq TO anon;

-- Done! Your Supabase setup is complete.