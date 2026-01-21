import { useState, useEffect } from "react";
import { LandingPage, TestType } from "@/components/assessment/LandingPage";
import { AssessmentPage } from "@/components/assessment/AssessmentPage";
import { ResultsPage } from "@/components/assessment/ResultsPage";
import { supabase } from "@/integrations/supabase/client";
import type { Question } from "@/lib/questionGenerator";

type AppState = 
  | { stage: 'landing' }
  | { stage: 'assessment'; username: string; testType: TestType; customQuestions?: Question[] }
  | { stage: 'results'; username: string; testType: TestType; answers: Record<string, number>; customQuestions?: Question[] };

const Index = () => {
  const [state, setState] = useState<AppState>({ stage: 'landing' });
  const [importedQuestions, setImportedQuestions] = useState<{ english: Question[]; interview: Question[] }>({
    english: [],
    interview: [],
  });
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  // Load saved questions on mount
  useEffect(() => {
    const loadSavedQuestions = async () => {
      try {
        // Load English questions
        const { data: englishData, error: englishError } = await supabase.functions.invoke('get-questions', {
          body: { testType: 'english' }
        });
        
        if (englishError) {
          console.error('Error loading English questions:', englishError);
        } else if (englishData?.success && englishData?.useCustomQuestions && englishData?.questions?.length > 0) {
          console.log(`Loaded ${englishData.questions.length} saved English questions`);
          setImportedQuestions(prev => ({ ...prev, english: englishData.questions }));
        }

        // Load Interview questions
        const { data: interviewData, error: interviewError } = await supabase.functions.invoke('get-questions', {
          body: { testType: 'interview' }
        });
        
        if (interviewError) {
          console.error('Error loading Interview questions:', interviewError);
        } else if (interviewData?.success && interviewData?.useCustomQuestions && interviewData?.questions?.length > 0) {
          console.log(`Loaded ${interviewData.questions.length} saved Interview questions`);
          setImportedQuestions(prev => ({ ...prev, interview: interviewData.questions }));
        }
      } catch (err) {
        console.error('Failed to load saved questions:', err);
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    loadSavedQuestions();
  }, []);

  const handleImportQuestions = async (questions: Question[], testType: TestType) => {
    setImportedQuestions(prev => ({ ...prev, [testType]: questions }));
    
    // Save questions to database
    try {
      const { data, error } = await supabase.functions.invoke('save-questions', {
        body: { questions, replaceExisting: true, testType }
      });
      
      if (error) {
        console.error('Error saving questions:', error);
      } else {
        console.log(`Saved ${data?.savedCount} ${testType} questions as default`);
      }
    } catch (err) {
      console.error('Failed to save questions:', err);
    }
  };

  const handleStart = (username: string, testType: TestType) => {
    const questionsForType = importedQuestions[testType];
    setState({ 
      stage: 'assessment', 
      username,
      testType,
      customQuestions: questionsForType.length > 0 ? questionsForType : undefined 
    });
  };

  const handleComplete = (answers: Record<string, number>) => {
    if (state.stage === 'assessment') {
      setState({ 
        stage: 'results', 
        username: state.username,
        testType: state.testType,
        answers,
        customQuestions: state.customQuestions 
      });
    }
  };

  const handleRestart = () => {
    setState({ stage: 'landing' });
  };

  switch (state.stage) {
    case 'landing':
      return (
        <LandingPage 
          onStart={handleStart} 
          onImportQuestions={handleImportQuestions}
          importedCounts={{
            english: importedQuestions.english.length,
            interview: importedQuestions.interview.length,
          }}
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
