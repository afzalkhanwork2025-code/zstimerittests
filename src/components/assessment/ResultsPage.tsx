import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { calculateScore, getProficiencyLabel, generateQuestionsForUser } from "@/lib/questionGenerator";
import { BookOpen, CheckCircle2, XCircle, RotateCcw, Trophy, Target, TrendingUp, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultsPageProps {
  username: string;
  answers: Record<string, number>;
  onRestart: () => void;
}

const levelLabels: Record<string, string> = {
  'basic': 'Basic',
  'intermediate': 'Intermediate',
  'advanced': 'Advanced',
  'upper-advanced': 'Upper-Advanced'
};

export function ResultsPage({ username, answers, onRestart }: ResultsPageProps) {
  const questions = useMemo(() => generateQuestionsForUser(username), [username]);
  const results = useMemo(() => calculateScore(questions, answers), [questions, answers]);
  const proficiency = useMemo(() => getProficiencyLabel(results.total), [results.total]);

  const percentage = Math.round((results.total / 40) * 100);

  const proficiencyColors = {
    basic: 'from-neutral-400 to-neutral-500',
    intermediate: 'from-neutral-500 to-neutral-600',
    advanced: 'from-neutral-700 to-neutral-800',
    proficient: 'from-neutral-900 to-black'
  };

  const optionLabels = ['A', 'B', 'C'];

  return (
    <div className="min-h-screen gradient-subtle">
      {/* Header */}
      <header className="w-full py-6 px-4 border-b border-border/50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-glossy rounded-xl flex items-center justify-center shadow-glossy border border-white/10">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif font-semibold text-xl text-foreground">ZST-iMerit</span>
          </div>
          <Button variant="ghost" onClick={onRestart} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Start Over
          </Button>
        </div>
      </header>

      <main className="px-4 py-8 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Hero result */}
          <div className="text-center mb-12 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              Assessment Complete
            </div>
            
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Well done, {username}!
            </h1>
            <p className="text-muted-foreground">Here's your detailed grammar assessment results</p>
          </div>

          {/* Main score card */}
          <div className="gradient-card rounded-2xl p-6 sm:p-8 shadow-medium mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Score circle */}
              <div className="relative">
                <div className={cn(
                  "w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-br shadow-glow",
                  proficiencyColors[proficiency.color]
                )}>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white">{results.total}</div>
                    <div className="text-sm text-white/80">/40</div>
                  </div>
                </div>
              </div>

              {/* Proficiency info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <Trophy className="w-6 h-6 text-secondary" />
                  <span className={cn(
                    "text-2xl font-serif font-bold bg-gradient-to-r bg-clip-text text-transparent",
                    proficiencyColors[proficiency.color]
                  )}>
                    {proficiency.label}
                  </span>
                </div>
                <p className="text-muted-foreground mb-4">{proficiency.description}</p>
                <div className="flex items-center gap-4 justify-center sm:justify-start text-sm">
                  <div className="flex items-center gap-1 text-success">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{results.total} correct</span>
                  </div>
                  <div className="flex items-center gap-1 text-destructive">
                    <XCircle className="w-4 h-4" />
                    <span>{40 - results.total} incorrect</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Level breakdown */}
          <div className="gradient-card rounded-2xl p-6 shadow-medium mb-8 animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-primary" />
              <h2 className="font-serif text-xl font-semibold">Level Breakdown</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(results.levelScores).map(([level, score]) => (
                <div key={level} className="p-4 rounded-xl bg-muted/50 text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">{score}/10</div>
                  <div className="text-xs text-muted-foreground capitalize">{levelLabels[level]}</div>
                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-hero rounded-full transition-all duration-500"
                      style={{ width: `${(score / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incorrect answers review */}
          {results.incorrectAnswers.length > 0 && (
            <div className="gradient-card rounded-2xl p-6 shadow-medium animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-xl font-semibold">Areas for Improvement</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Review these questions to strengthen your grammar skills
              </p>

              <div className="space-y-6">
                {results.incorrectAnswers.map(({ question, userAnswer }, index) => (
                  <div
                    key={question.id}
                    className="p-4 rounded-xl border border-border bg-card"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-destructive/10 text-destructive">
                        #{index + 1}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground capitalize">
                        {levelLabels[question.level]}
                      </span>
                    </div>

                    <p className="font-medium text-foreground mb-4">{question.question}</p>

                    <div className="space-y-2 mb-4">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg text-sm",
                            optIndex === question.correctAnswer
                              ? "bg-success/10 text-success border border-success/30"
                              : optIndex === userAnswer
                              ? "bg-destructive/10 text-destructive border border-destructive/30"
                              : "bg-muted/50 text-muted-foreground"
                          )}
                        >
                          <span className={cn(
                            "w-6 h-6 rounded flex items-center justify-center text-xs font-semibold",
                            optIndex === question.correctAnswer
                              ? "bg-success text-success-foreground"
                              : optIndex === userAnswer
                              ? "bg-destructive text-destructive-foreground"
                              : "bg-muted"
                          )}>
                            {optionLabels[optIndex]}
                          </span>
                          <span>{option}</span>
                          {optIndex === question.correctAnswer && (
                            <CheckCircle2 className="w-4 h-4 ml-auto" />
                          )}
                          {optIndex === userAnswer && optIndex !== question.correctAnswer && (
                            <XCircle className="w-4 h-4 ml-auto" />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-lg bg-accent/50 border border-accent">
                      <p className="text-sm text-accent-foreground">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Restart button */}
          <div className="mt-12 text-center animate-fade-up" style={{ animationDelay: '0.25s' }}>
            <Button variant="hero" size="xl" onClick={onRestart} className="gap-2">
              <RotateCcw className="w-5 h-5" />
              Take Assessment Again
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
