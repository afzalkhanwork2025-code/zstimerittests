/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ExtractedQuestion {
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
    const { url, textContent } = await req.json();
    
    let content = textContent;
    
    // If URL provided, scrape it using Firecrawl
    if (url && !textContent) {
      const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
      if (!firecrawlApiKey) {
        console.error('FIRECRAWL_API_KEY not configured');
        return new Response(
          JSON.stringify({ success: false, error: 'Firecrawl connector not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log('Scraping URL:', url);
      
      const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${firecrawlApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          formats: ['markdown'],
          onlyMainContent: true,
        }),
      });
      
      const scrapeData = await scrapeResponse.json();
      
      if (!scrapeResponse.ok) {
        console.error('Firecrawl error:', scrapeData);
        return new Response(
          JSON.stringify({ success: false, error: scrapeData.error || 'Failed to scrape URL' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      content = scrapeData.data?.markdown || scrapeData.markdown;
      console.log('Scraped content length:', content?.length);
    }
    
    if (!content) {
      return new Response(
        JSON.stringify({ success: false, error: 'No content provided or extracted' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Use Lovable AI to extract questions
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Extracting questions using AI...');
    
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: `You are an expert at extracting quiz/assessment questions from educational content. 
Extract questions with EXACTLY 3 answer options each. Determine the correct answer and provide an explanation.
Assign difficulty levels based on complexity: basic, intermediate, advanced, or upper-advanced.

IMPORTANT: Return ONLY valid JSON, no markdown formatting, no code blocks.

Return a JSON object with this exact structure:
{
  "questions": [
    {
      "question": "The question text with a blank shown as ___",
      "options": ["option1", "option2", "option3"],
      "correctAnswer": 0,
      "explanation": "Brief explanation why this is correct",
      "level": "basic"
    }
  ]
}

Notes:
- correctAnswer is the index (0, 1, or 2) of the correct option
- Extract as many valid questions as possible from the content
- If content has questions with more than 3 options, pick the 3 most relevant (including the correct answer)
- If content has questions with fewer than 3 options, generate plausible distractors
- Ensure questions are clear and self-contained`
          },
          {
            role: 'user',
            content: `Extract all quiz/assessment questions from this content:\n\n${content.substring(0, 15000)}`
          }
        ],
        temperature: 0.3,
      }),
    });
    
    if (!aiResponse.ok) {
      const errorData = await aiResponse.text();
      console.error('AI API error:', errorData);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to extract questions from content' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content;
    
    console.log('AI response:', aiContent?.substring(0, 500));
    
    if (!aiContent) {
      return new Response(
        JSON.stringify({ success: false, error: 'No response from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Parse the AI response
    let parsedQuestions: { questions: ExtractedQuestion[] };
    try {
      // Clean up the response - remove markdown code blocks if present
      let cleanContent = aiContent.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7);
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3);
      }
      cleanContent = cleanContent.trim();
      
      parsedQuestions = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw content:', aiContent);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to parse extracted questions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate and clean questions
    const validQuestions = parsedQuestions.questions?.filter((q) => {
      return q.question && 
             Array.isArray(q.options) && 
             q.options.length === 3 &&
             typeof q.correctAnswer === 'number' &&
             q.correctAnswer >= 0 && 
             q.correctAnswer <= 2;
    }).map((q, index) => ({
      id: `imported_${Date.now()}_${index}`,
      question: q.question,
      options: q.options as [string, string, string],
      correctAnswer: q.correctAnswer as 0 | 1 | 2,
      explanation: q.explanation || 'No explanation provided.',
      level: (['basic', 'intermediate', 'advanced', 'upper-advanced'].includes(q.level) 
        ? q.level 
        : 'intermediate') as 'basic' | 'intermediate' | 'advanced' | 'upper-advanced',
    })) || [];
    
    console.log(`Extracted ${validQuestions.length} valid questions`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        questions: validQuestions,
        totalExtracted: validQuestions.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error: unknown) {
    console.error('Error in extract-questions:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
