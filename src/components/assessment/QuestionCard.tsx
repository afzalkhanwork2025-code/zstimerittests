import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Question } from "@/lib/questionGenerator";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  onAnswer: (answer: number) => void;
  selectedAnswer?: number;
}

export function QuestionCard({ question, questionNumber, onAnswer, selectedAnswer }: QuestionCardProps) {
  const [hoveredOption, setHoveredOption] = useState<number | null>(null);

  const optionLabels = ['A', 'B', 'C'];

  return (
    <div className="w-full max-w-2xl mx-auto animate-scale-in">
      <div className="gradient-card rounded-2xl p-6 sm:p-8 shadow-medium">
        {/* Question number badge */}
        <div className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1 rounded-full text-xs font-semibold gradient-glossy text-white border border-white/10">
            Question {questionNumber}
          </span>
          <span className="text-xs text-muted-foreground capitalize px-2 py-1 bg-muted rounded-full">
            {question.level.replace('-', ' ')}
          </span>
        </div>

        {/* Question text */}
        <h2 className="text-xl sm:text-2xl font-serif font-semibold text-foreground mb-8 leading-relaxed">
          {question.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswer(index)}
              onMouseEnter={() => setHoveredOption(index)}
              onMouseLeave={() => setHoveredOption(null)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left",
                selectedAnswer === index
                  ? "border-primary bg-primary/10 shadow-glow"
                  : hoveredOption === index
                  ? "border-primary/50 bg-accent shadow-soft"
                  : "border-border bg-card hover:border-primary/30"
              )}
            >
              <span
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm transition-all duration-200",
                  selectedAnswer === index
                    ? "gradient-glossy text-white border border-white/10"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {optionLabels[index]}
              </span>
              <span className="flex-1 font-medium">{option}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
