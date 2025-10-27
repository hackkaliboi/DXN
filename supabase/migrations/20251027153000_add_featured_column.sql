-- Add featured column to blog_posts table
ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add RLS policy for featured column
CREATE POLICY "Anyone can view featured status"
  ON public.blog_posts FOR SELECT
  USING (true);

-- Update existing posts to have featured = false by default
UPDATE public.blog_posts
SET featured = false
WHERE featured IS NULL;