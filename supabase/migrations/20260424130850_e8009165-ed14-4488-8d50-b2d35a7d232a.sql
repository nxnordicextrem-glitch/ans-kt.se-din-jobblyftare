-- Cover letters table
CREATE TABLE public.cover_letters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Nytt personligt brev',
  language TEXT NOT NULL DEFAULT 'sv',
  job_ad TEXT NOT NULL DEFAULT '',
  job_title TEXT,
  company TEXT,
  tone TEXT NOT NULL DEFAULT 'professionell',
  focus TEXT NOT NULL DEFAULT 'erfarenhet',
  length TEXT NOT NULL DEFAULT 'standard',
  voice_sample TEXT NOT NULL DEFAULT '',
  cv_id UUID,
  content TEXT NOT NULL DEFAULT '',
  match_score INT,
  match_feedback JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cover letters"
  ON public.cover_letters FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cover letters"
  ON public.cover_letters FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cover letters"
  ON public.cover_letters FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cover letters"
  ON public.cover_letters FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER cover_letters_updated_at
  BEFORE UPDATE ON public.cover_letters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX idx_cover_letters_user ON public.cover_letters(user_id, updated_at DESC);