/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Question {
  question: string;
  options: [string, string, string];
  correctAnswer: 0 | 1 | 2;
  explanation: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'upper-advanced';
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { questions, replaceExisting = true } = await req.json();
    
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No questions provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Saving ${questions.length} questions to database...`);

    // If replacing, deactivate all existing questions
    if (replaceExisting) {
      const { error: deactivateError } = await supabase
        .from('questions')
        .update({ is_active: false })
        .eq('is_active', true);

      if (deactivateError) {
        console.error('Error deactivating existing questions:', deactivateError);
        throw new Error('Failed to deactivate existing questions');
      }
    }

    // Insert new questions
    const questionsToInsert = questions.map((q: Question) => ({
      question: q.question,
      options: q.options,
      correct_answer: q.correctAnswer,
      explanation: q.explanation || '',
      difficulty: q.level || 'intermediate',
      is_active: true,
    }));

    const { data: insertedQuestions, error: insertError } = await supabase
      .from('questions')
      .insert(questionsToInsert)
      .select();

    if (insertError) {
      console.error('Error inserting questions:', insertError);
      throw new Error('Failed to save questions');
    }

    // Update settings to use custom questions
    const { error: settingsError } = await supabase
      .from('assessment_settings')
      .update({ use_custom_questions: true, updated_at: new Date().toISOString() })
      .eq('id', (await supabase.from('assessment_settings').select('id').limit(1).single()).data?.id);

    if (settingsError) {
      console.error('Error updating settings:', settingsError);
      // Non-fatal, continue
    }

    console.log(`Successfully saved ${insertedQuestions?.length} questions`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        savedCount: insertedQuestions?.length || 0,
        message: `${insertedQuestions?.length} questions saved as default for all users`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in save-questions:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
