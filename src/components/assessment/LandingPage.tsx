import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Users, CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import { ImportQuestionsDialog } from "./ImportQuestionsDialog";
import type { Question } from "@/lib/questionGenerator";

export type TestType = 'english' | 'interview';

interface LandingPageProps {
  onStart: (username: string, testType: TestType) => void;
  onImportQuestions?: (questions: Question[], testType: TestType) => void;
  importedCounts?: { english: number; interview: number };
  isLoading?: boolean;
}

export function LandingPage({ onStart, onImportQuestions, importedCounts = { english: 0, interview: 0 }, isLoading = false }: LandingPageProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [selectedTest, setSelectedTest] = useState<TestType | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTest) return;
    
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setError("Please enter a valid name (at least 2 characters)");
      return;
    }
    if (trimmedName.length > 50) {
      setError("Name must be less than 50 characters");
      return;
    }
    setError("");
    onStart(trimmedName, selectedTest);
  };

  const handleBack = () => {
    setSelectedTest(null);
    setName("");
    setError("");
  };

  const testOptions = [
    {
      type: 'english' as TestType,
      icon: BookOpen,
      title: "English Assessment Test",
      description: "Comprehensive English grammar assessment designed to evaluate your language proficiency through carefully crafted questions.",
      importedCount: importedCounts.english,
    },
    {
      type: 'interview' as TestType,
      icon: Users,
      title: "Interview Test",
      description: "Prepare for your interviews with questions designed to assess your communication skills and professional readiness.",
      importedCount: importedCounts.interview,
    },
  ];

  return (
    <div className="min-h-screen gradient-subtle flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          <div className="w-10 h-10 gradient-glossy rounded-xl flex items-center justify-center shadow-glossy border border-white/10">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="font-serif font-semibold text-xl text-foreground">ZST-iMerit</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl mx-auto">
          {selectedTest === null ? (
            <>
              {/* Hero section */}
              <div className="text-center mb-10 animate-fade-up">
                <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
                  Choose Your
                  <span className="block text-muted-foreground">Assessment</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  Select the type of assessment you'd like to take today.
                </p>
              </div>

              {/* Test options */}
              <div className="grid sm:grid-cols-2 gap-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                {testOptions.map((option) => (
                  <button
                    key={option.type}
                    onClick={() => setSelectedTest(option.type)}
                    className="gradient-card rounded-2xl p-6 shadow-medium text-left transition-all duration-200 hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <div className="w-12 h-12 gradient-glossy rounded-xl flex items-center justify-center shadow-glossy border border-white/10 mb-4">
                      <option.icon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="font-serif text-xl font-semibold text-foreground mb-2">
                      {option.title}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      {option.description}
                    </p>
                    {isLoading ? (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Loading...
                      </span>
                    ) : option.importedCount > 0 ? (
                      <span className="flex items-center gap-1 text-xs text-primary">
                        <CheckCircle className="w-3 h-3" />
                        {option.importedCount} custom questions saved
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Click to begin
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Back button */}
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 animate-fade-in"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to test selection</span>
              </button>

              {/* Selected test hero */}
              <div className="text-center mb-10 animate-fade-up">
                <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
                  {testOptions.find(t => t.type === selectedTest)?.title}
                </h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  {testOptions.find(t => t.type === selectedTest)?.description}
                </p>
              </div>

              {/* Start form */}
              <div className="gradient-card rounded-2xl p-6 sm:p-8 shadow-medium mb-10 animate-fade-up max-w-xl mx-auto" style={{ animationDelay: '0.1s' }}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground">
                      Enter your name to begin
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (error) setError("");
                      }}
                      className="text-center text-lg"
                      autoComplete="name"
                      maxLength={50}
                    />
                    {error && (
                      <p className="text-sm text-destructive animate-fade-in">{error}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    variant="hero"
                    size="xl"
                    className="w-full"
                    disabled={!name.trim()}
                  >
                    Start Assessment
                  </Button>
                </form>

                {/* Import section */}
                {onImportQuestions && (
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-foreground">Custom Questions</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {importedCounts[selectedTest] > 0 ? "Saved as default for all users" : "Import from URL or document"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isLoading ? (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Loading...
                          </span>
                        ) : importedCounts[selectedTest] > 0 ? (
                          <span className="flex items-center gap-1 text-xs text-primary">
                            <CheckCircle className="w-3 h-3" />
                            {importedCounts[selectedTest]} saved
                          </span>
                        ) : null}
                        <ImportQuestionsDialog onImport={(questions) => onImportQuestions(questions, selectedTest)} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 text-center">
        <p className="text-sm text-muted-foreground">
          Your personalized assessment awaits
        </p>
      </footer>
    </div>
  );
}
