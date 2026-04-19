-- ==========================================
-- PILOT ROLE: Additional RLS Policies
-- Run these in your Supabase SQL Editor
-- ==========================================

-- Pilots can view bookings assigned to them
CREATE POLICY "Pilots can view assigned bookings"
  ON public.bookings
  FOR SELECT
  USING (
    auth.uid() = pilot_id
  );

-- Pilots can update status on their own assigned bookings
CREATE POLICY "Pilots can update assigned booking status"
  ON public.bookings
  FOR UPDATE
  USING (
    auth.uid() = pilot_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'pilot'
    )
  )
  WITH CHECK (
    status IN ('active', 'completed')
  );

-- Admins can update pilot_id and status on all bookings
CREATE POLICY "Admins can assign pilots"
  ON public.bookings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Pilots can read their own profile
CREATE POLICY "Pilots can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Admins can read all profiles (needed for pilot list)
CREATE POLICY "Admins can read all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
