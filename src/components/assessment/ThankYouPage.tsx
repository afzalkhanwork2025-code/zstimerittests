import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, Home } from "lucide-react";

interface ThankYouPageProps {
  username: string;
  onRestart: () => void;
}

export function ThankYouPage({ username, onRestart }: ThankYouPageProps) {
  return (
    <div className="min-h-screen gradient-subtle flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-4 border-b border-border/50">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          <div className="w-10 h-10 gradient-glossy rounded-xl flex items-center justify-center shadow-glossy border border-white/10">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="font-serif font-semibold text-xl text-foreground">ZST-iMerit</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg mx-auto text-center animate-fade-up">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Thank You, {username}!
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            Your assessment has been completed and submitted successfully. 
            Your results have been recorded for review.
          </p>

          <div className="gradient-card rounded-2xl p-6 mb-8 shadow-medium">
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span>Assessment submitted successfully</span>
            </div>
          </div>

          <Button
            variant="hero"
            size="xl"
            onClick={onRestart}
            className="w-full sm:w-auto"
          >
            <Home className="w-5 h-5 mr-2" />
            Return to Home
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 text-center">
        <p className="text-sm text-muted-foreground">
          Thank you for completing the assessment
        </p>
      </footer>
    </div>
  );
}
