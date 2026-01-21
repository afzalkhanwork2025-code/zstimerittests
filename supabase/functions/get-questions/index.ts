/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Check if custom questions are enabled
    const { data: settings } = await supabase
      .from('assessment_settings')
      .select('use_custom_questions')
      .limit(1)
      .maybeSingle();

    if (!settings?.use_custom_questions) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          useCustomQuestions: false,
          questions: [],
          message: 'Using default question bank'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch active questions
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching questions:', error);
      throw new Error('Failed to fetch questions');
    }

    if (!questions || questions.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          useCustomQuestions: false,
          questions: [],
          message: 'No custom questions found, using default'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Transform to expected format
    const formattedQuestions = questions.map((q, index) => ({
      id: `custom_${q.id}`,
      question: q.question,
      options: q.options as [string, string, string],
      correctAnswer: q.correct_answer as 0 | 1 | 2,
      explanation: q.explanation || '',
      level: (q.difficulty || 'intermediate') as 'basic' | 'intermediate' | 'advanced' | 'upper-advanced',
    }));

    console.log(`Returning ${formattedQuestions.length} custom questions`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        useCustomQuestions: true,
        questions: formattedQuestions,
        totalCount: formattedQuestions.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in get-questions:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
