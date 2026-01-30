import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, UserPlus, Mail, Lock, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AdminSetup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [adminExists, setAdminExists] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminExists();
  }, []);

  const checkAdminExists = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("create-admin", {
        body: { checkOnly: true },
      });
      // If we get an error about admin existing, set adminExists to true
      if (data?.error === "An admin account already exists") {
        setAdminExists(true);
      }
    } catch {
      // Continue with setup if check fails
    } finally {
      setIsChecking(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-admin", {
        body: { email: email.trim(), password },
      });

      if (error) {
        toast({
          title: "Setup failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (!data?.success) {
        toast({
          title: "Setup failed",
          description: data?.error || "Failed to create admin account.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Admin account created!",
        description: "You can now login with your credentials.",
      });
      navigate("/admin");
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen gradient-subtle flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (adminExists) {
    return (
      <div className="min-h-screen gradient-subtle flex flex-col">
        <header className="w-full py-6 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
            <div className="w-10 h-10 gradient-glossy rounded-xl flex items-center justify-center shadow-glossy border border-white/10">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif font-semibold text-xl text-foreground">ZST-iMerit Admin</span>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
              Admin Already Exists
            </h1>
            <p className="text-muted-foreground mb-6">
              An admin account has already been created.
            </p>
            <Button
              variant="hero"
              size="xl"
              onClick={() => navigate("/admin")}
            >
              Go to Login
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-subtle flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          <div className="w-10 h-10 gradient-glossy rounded-xl flex items-center justify-center shadow-glossy border border-white/10">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="font-serif font-semibold text-xl text-foreground">ZST-iMerit Admin</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8 animate-fade-up">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
              Create Admin Account
            </h1>
            <p className="text-muted-foreground">
              Set up your administrator account to manage assessment results
            </p>
          </div>

          <div className="gradient-card rounded-2xl p-6 sm:p-8 shadow-medium animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <form onSubmit={handleSetup} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="xl"
                className="w-full"
                disabled={isLoading || !email || !password || !confirmPassword}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Admin Account"
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
