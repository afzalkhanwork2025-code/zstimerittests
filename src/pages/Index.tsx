import { useState } from "react";
import { LandingPage } from "@/components/assessment/LandingPage";
import { AssessmentPage } from "@/components/assessment/AssessmentPage";
import { ResultsPage } from "@/components/assessment/ResultsPage";

type AppState = 
  | { stage: 'landing' }
  | { stage: 'assessment'; username: string }
  | { stage: 'results'; username: string; answers: Record<string, number> };

const Index = () => {
  const [state, setState] = useState<AppState>({ stage: 'landing' });

  const handleStart = (username: string) => {
    setState({ stage: 'assessment', username });
  };

  const handleComplete = (answers: Record<string, number>) => {
    if (state.stage === 'assessment') {
      setState({ stage: 'results', username: state.username, answers });
    }
  };

  const handleRestart = () => {
    setState({ stage: 'landing' });
  };

  switch (state.stage) {
    case 'landing':
      return <LandingPage onStart={handleStart} />;
    case 'assessment':
      return <AssessmentPage username={state.username} onComplete={handleComplete} />;
    case 'results':
      return <ResultsPage username={state.username} answers={state.answers} onRestart={handleRestart} />;
  }
};

export default Index;
