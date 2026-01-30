import { useState, useEffect } from "react";
import { LandingPage } from "@/components/assessment/LandingPage";
import { AssessmentPage } from "@/components/assessment/AssessmentPage";
import { ThankYouPage } from "@/components/assessment/ThankYouPage";
import { supabase } from "@/integrations/supabase/client";
import { calculateScore, getProficiencyLabel } from "@/lib/questionGenerator";
import type { Question } from "@/lib/questionGenerator";

type AppState = 
  | { stage: 'landing' }
  | { stage: 'assessment'; username: string; userNumber: number; customQuestions?: Question[] }
  | { stage: 'thankyou'; username: string };

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

  const handleStart = (username: string, userNumber: number) => {
    setState({ 
      stage: 'assessment', 
      username,
      userNumber,
      customQuestions: importedQuestions.length > 0 ? importedQuestions : undefined 
    });
  };

  const handleComplete = async (answers: Record<string, number>, questions: Question[]) => {
    if (state.stage === 'assessment') {
      // Calculate scores
      const { total, levelScores } = calculateScore(questions, answers);
      const proficiency = getProficiencyLabel(total);

      // Save results to database
      try {
        await supabase.from("assessment_results").insert({
          username: state.username,
          user_number: state.userNumber,
          total_score: total,
          total_questions: questions.length,
          level_scores: levelScores,
          answers: answers,
          proficiency_label: proficiency.label,
        });
        console.log("Results saved successfully");
      } catch (err) {
        console.error("Failed to save results:", err);
      }

      setState({ 
        stage: 'thankyou', 
        username: state.username 
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
          userNumber={state.userNumber}
          onComplete={handleComplete}
          customQuestions={state.customQuestions}
        />
      );
    case 'thankyou':
      return (
        <ThankYouPage 
          username={state.username} 
          onRestart={handleRestart}
        />
      );
  }
};

export default Index;
