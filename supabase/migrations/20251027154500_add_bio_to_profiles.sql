-- Add bio column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add RLS policy for bio column
CREATE POLICY "Users can view bio"
  ON public.profiles FOR SELECT
  USING (true);