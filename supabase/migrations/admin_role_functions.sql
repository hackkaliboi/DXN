-- Admin Role Management Functions
-- This file contains only the new functions for managing admin roles
-- Run this file to add admin role management capabilities to your existing database

-- Function to grant admin role to a user
CREATE OR REPLACE FUNCTION public.grant_admin_role(_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE id = _user_id) THEN
    -- Insert admin role for the user if not already exists
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    RAISE EXCEPTION 'User with ID % does not exist', _user_id;
  END IF;
END;
$$;

-- Function to revoke admin role from a user
CREATE OR REPLACE FUNCTION public.revoke_admin_role(_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete admin role for the user
  DELETE FROM public.user_roles
  WHERE user_id = _user_id AND role = 'admin';
END;
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = 'admin'
  )
$$;