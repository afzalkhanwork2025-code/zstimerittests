import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Brain, Target, Trophy } from "lucide-react";

interface LandingPageProps {
  onStart: (username: string) => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    onStart(trimmedName);
  };

  const features = [
    { icon: BookOpen, title: "40 Questions", description: "Comprehensive assessment across 4 levels" },
    { icon: Brain, title: "Adaptive Difficulty", description: "From basic to upper-advanced" },
    { icon: Target, title: "Personalized", description: "Unique questions based on your name" },
    { icon: Trophy, title: "Detailed Results", description: "See your strengths and areas to improve" },
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
        <div className="w-full max-w-xl mx-auto">
          {/* Hero section */}
          <div className="text-center mb-10 animate-fade-up">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
            English Assessment
            <span className="block text-muted-foreground">Test</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            A comprehensive English grammar assessment designed to evaluate your language proficiency through 40 carefully crafted questions.
          </p>
        </div>

          {/* Start form */}
          <div className="gradient-card rounded-2xl p-6 sm:p-8 shadow-medium mb-10 animate-fade-up" style={{ animationDelay: '0.1s' }}>
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
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="p-4 rounded-xl bg-card border border-border/50 shadow-soft hover:shadow-medium transition-all duration-200"
              >
                <feature.icon className="w-8 h-8 text-primary mb-2" />
                <h3 className="font-semibold text-sm text-foreground">{feature.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 text-center">
        <p className="text-sm text-muted-foreground">
          Your personalized grammar assessment awaits
        </p>
      </footer>
    </div>
  );
}
