-- Tighten analytics insert policy
DROP POLICY IF EXISTS "Anyone can insert analytics" ON public.analytics_events;

CREATE POLICY "Anon can insert anonymous analytics"
ON public.analytics_events FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

CREATE POLICY "Users can insert their own analytics"
ON public.analytics_events FOR INSERT
TO authenticated
WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- Lock down SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM PUBLIC, anon, authenticated;