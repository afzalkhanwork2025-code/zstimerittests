import { useState, useEffect } from "react";
import { LandingPage } from "@/components/assessment/LandingPage";
import { AssessmentPage } from "@/components/assessment/AssessmentPage";
import { ResultsPage } from "@/components/assessment/ResultsPage";
import { supabase } from "@/integrations/supabase/client";
import type { Question } from "@/lib/questionGenerator";

type AppState = 
  | { stage: 'landing' }
  | { stage: 'assessment'; username: string; customQuestions?: Question[] }
  | { stage: 'results'; username: string; answers: Record<string, number>; customQuestions?: Question[] };

const Index = () => {
  const [state, setState] = useState<AppState>({ stage: 'landing' });
  const [importedQuestions, setImportedQuestions] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  // Load saved questions on mount
  useEffect(() => {
    const loadSavedQuestions = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-questions');
        
        if (error) {
          console.error('Error loading saved questions:', error);
          return;
        }

        if (data?.success && data?.useCustomQuestions && data?.questions?.length > 0) {
          console.log(`Loaded ${data.questions.length} saved questions`);
          setImportedQuestions(data.questions);
        }
      } catch (err) {
        console.error('Failed to load saved questions:', err);
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    loadSavedQuestions();
  }, []);

  const handleImportQuestions = async (questions: Question[]) => {
    setImportedQuestions(questions);
    
    // Save questions to database
    try {
      const { data, error } = await supabase.functions.invoke('save-questions', {
        body: { questions, replaceExisting: true }
      });
      
      if (error) {
        console.error('Error saving questions:', error);
      } else {
        console.log(`Saved ${data?.savedCount} questions as default`);
      }
    } catch (err) {
      console.error('Failed to save questions:', err);
    }
  };

  const handleStart = (username: string) => {
    setState({ 
      stage: 'assessment', 
      username, 
      customQuestions: importedQuestions.length > 0 ? importedQuestions : undefined 
    });
  };

  const handleComplete = (answers: Record<string, number>) => {
    if (state.stage === 'assessment') {
      setState({ 
        stage: 'results', 
        username: state.username, 
        answers,
        customQuestions: state.customQuestions 
      });
    }
  };

  const handleRestart = () => {
    setState({ stage: 'landing' });
    // Don't clear imported questions - they're now saved as default
  };

  switch (state.stage) {
    case 'landing':
      return (
        <LandingPage 
          onStart={handleStart} 
          onImportQuestions={handleImportQuestions}
          importedCount={importedQuestions.length}
          isLoading={isLoadingQuestions}
        />
      );
    case 'assessment':
      return (
        <AssessmentPage 
          username={state.username} 
          onComplete={handleComplete}
          customQuestions={state.customQuestions}
        />
      );
    case 'results':
      return (
        <ResultsPage 
          username={state.username} 
          answers={state.answers} 
          onRestart={handleRestart}
          customQuestions={state.customQuestions}
        />
      );
  }
};

export default Index;
