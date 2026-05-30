-- Add category column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'program';

-- Add created_at column if it doesn't exist
ALTER TABLE posts ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);

-- Update existing posts to have a default category if NULL
UPDATE posts SET category = 'program' WHERE category IS NULL;