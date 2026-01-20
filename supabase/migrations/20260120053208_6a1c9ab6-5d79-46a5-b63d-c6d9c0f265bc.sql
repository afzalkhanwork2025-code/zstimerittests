-- Create table for storing imported questions
CREATE TABLE public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer INTEGER NOT NULL,
    explanation TEXT,
    difficulty TEXT DEFAULT 'intermediate',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active questions (public assessment)
CREATE POLICY "Anyone can read active questions"
ON public.questions
FOR SELECT
USING (is_active = true);

-- Create a settings table to track if custom questions are enabled
CREATE TABLE public.assessment_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    use_custom_questions BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.assessment_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read settings
CREATE POLICY "Anyone can read settings"
ON public.assessment_settings
FOR SELECT
USING (true);

-- Insert default settings
INSERT INTO public.assessment_settings (use_custom_questions) VALUES (false);