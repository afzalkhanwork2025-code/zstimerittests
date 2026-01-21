-- Add test_type column to questions table
ALTER TABLE public.questions 
ADD COLUMN test_type TEXT NOT NULL DEFAULT 'english';

-- Add test_type column to assessment_settings table  
ALTER TABLE public.assessment_settings
ADD COLUMN test_type TEXT NOT NULL DEFAULT 'english';

-- Remove unique constraint if exists and add new one with test_type
ALTER TABLE public.assessment_settings
DROP CONSTRAINT IF EXISTS assessment_settings_pkey CASCADE;

ALTER TABLE public.assessment_settings
ADD PRIMARY KEY (id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_questions_test_type ON public.questions(test_type);
CREATE INDEX IF NOT EXISTS idx_questions_active_type ON public.questions(is_active, test_type);

-- Insert default settings for interview type if not exists
INSERT INTO public.assessment_settings (test_type, use_custom_questions)
VALUES ('interview', false)
ON CONFLICT DO NOTHING;