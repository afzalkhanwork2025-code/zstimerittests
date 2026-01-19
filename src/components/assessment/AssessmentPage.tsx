import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "./ProgressBar";
import { QuestionCard } from "./QuestionCard";
import { generateQuestionsForUser, getQuestionsForLevel } from "@/lib/questionGenerator";
import type { Question } from "@/lib/questionGenerator";
import { ArrowRight, BookOpen } from "lucide-react";

interface AssessmentPageProps {
  username: string;
  onComplete: (answers: Record<string, number>) => void;
}

const levels: Array<'basic' | 'intermediate' | 'advanced' | 'upper-advanced'> = [
  'basic', 'intermediate', 'advanced', 'upper-advanced'
];

const levelTitles: Record<string, string> = {
  'basic': 'Basic Level',
  'intermediate': 'Intermediate Level',
  'advanced': 'Advanced Level',
  'upper-advanced': 'Upper-Advanced Level'
};

const levelDescriptions: Record<string, string> = {
  'basic': 'Foundation grammar concepts and simple sentence structures',
  'intermediate': 'More complex grammar including conditionals and reported speech',
  'advanced': 'Sophisticated structures, subjunctive mood, and formal usage',
  'upper-advanced': 'Nuanced grammar, rare constructions, and academic English'
};

export function AssessmentPage({ username, onComplete }: AssessmentPageProps) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showLevelIntro, setShowLevelIntro] = useState(true);

  const allQuestions = useMemo(() => generateQuestionsForUser(username), [username]);
  
  const currentLevelQuestions = useMemo(() => 
    getQuestionsForLevel(allQuestions, levels[currentLevel]),
    [allQuestions, currentLevel]
  );

  const currentQuestion = currentLevelQuestions[currentQuestionIndex];

  const handleAnswer = (answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentLevelQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentLevel < levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setCurrentQuestionIndex(0);
      setShowLevelIntro(true);
    } else {
      // Assessment complete
      onComplete(answers);
    }
  };

  const isAnswered = currentQuestion && answers[currentQuestion.id] !== undefined;
  const isLastQuestion = currentLevel === levels.length - 1 && currentQuestionIndex === currentLevelQuestions.length - 1;

  if (showLevelIntro) {
    const level = levels[currentLevel];
    return (
      <div className="min-h-screen gradient-subtle flex flex-col">
        {/* Header */}
        <header className="w-full py-6 px-4 border-b border-border/50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-glossy rounded-xl flex items-center justify-center shadow-glossy border border-white/10">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif font-semibold text-xl text-foreground">ZST-iMerit</span>
            </div>
            <span className="text-sm text-muted-foreground">Welcome, {username}</span>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-lg mx-auto text-center animate-fade-up">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                Level {currentLevel + 1} of 4
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {levelTitles[level]}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              {levelDescriptions[level]}
            </p>

            <div className="gradient-card rounded-2xl p-6 mb-8 shadow-medium">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">10</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary">~5</div>
                  <div className="text-sm text-muted-foreground">Minutes</div>
                </div>
              </div>
            </div>

            <Button
              variant="hero"
              size="xl"
              onClick={() => setShowLevelIntro(false)}
              className="w-full sm:w-auto"
            >
              Begin {levelTitles[level]}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-subtle flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-4 border-b border-border/50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-glossy rounded-xl flex items-center justify-center shadow-glossy border border-white/10">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif font-semibold text-xl text-foreground">ZST-iMerit</span>
          </div>
          <span className="text-sm text-muted-foreground">Welcome, {username}</span>
        </div>
      </header>

      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ProgressBar
            currentLevel={currentLevel}
            currentQuestion={currentQuestionIndex}
            totalQuestions={10}
          />

          {currentQuestion && (
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              questionNumber={(currentLevel * 10) + currentQuestionIndex + 1}
              onAnswer={handleAnswer}
              selectedAnswer={answers[currentQuestion.id]}
            />
          )}

          <div className="mt-8 flex justify-center">
            <Button
              variant={isAnswered ? "hero" : "subtle"}
              size="lg"
              onClick={handleNext}
              disabled={!isAnswered}
              className="min-w-[200px]"
            >
              {isLastQuestion ? "Complete Assessment" : "Next Question"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
