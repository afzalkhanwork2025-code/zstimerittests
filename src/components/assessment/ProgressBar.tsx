import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentLevel: number;
  currentQuestion: number;
  totalQuestions: number;
}

const levels = ['Basic', 'Intermediate', 'Advanced', 'Upper-Advanced'];

export function ProgressBar({ currentLevel, currentQuestion, totalQuestions }: ProgressBarProps) {
  const overallProgress = ((currentLevel * 10) + currentQuestion) / 40 * 100;
  
  return (
    <div className="w-full max-w-2xl mx-auto mb-8 animate-fade-up">
      {/* Level indicators */}
      <div className="flex justify-between mb-3">
        {levels.map((level, index) => (
          <div
            key={level}
            className={cn(
              "flex flex-col items-center transition-all duration-300",
              index <= currentLevel ? "opacity-100" : "opacity-40"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300",
                index < currentLevel
                  ? "bg-foreground text-background"
                  : index === currentLevel
                  ? "gradient-glossy text-white shadow-glossy border border-white/10"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {index < currentLevel ? "✓" : index + 1}
            </div>
            <span
              className={cn(
                "text-xs mt-1 font-medium hidden sm:block",
                index === currentLevel ? "text-primary" : "text-muted-foreground"
              )}
            >
              {level}
            </span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-foreground rounded-full transition-all duration-500 ease-out"
          style={{ width: `${overallProgress}%` }}
        />
      </div>

      {/* Question counter */}
      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
        <span>Question {currentQuestion + 1} of {totalQuestions}</span>
        <span>{Math.round(overallProgress)}% Complete</span>
      </div>
    </div>
  );
}
