import { useState } from "react";
import { LandingPage } from "@/components/assessment/LandingPage";
import { AssessmentPage } from "@/components/assessment/AssessmentPage";
import { ResultsPage } from "@/components/assessment/ResultsPage";
import type { Question } from "@/lib/questionGenerator";

type AppState = 
  | { stage: 'landing' }
  | { stage: 'assessment'; username: string; customQuestions?: Question[] }
  | { stage: 'results'; username: string; answers: Record<string, number>; customQuestions?: Question[] };

const Index = () => {
  const [state, setState] = useState<AppState>({ stage: 'landing' });
  const [importedQuestions, setImportedQuestions] = useState<Question[]>([]);

  const handleImportQuestions = (questions: Question[]) => {
    setImportedQuestions(questions);
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
    setImportedQuestions([]);
  };

  switch (state.stage) {
    case 'landing':
      return (
        <LandingPage 
          onStart={handleStart} 
          onImportQuestions={handleImportQuestions}
          importedCount={importedQuestions.length}
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
