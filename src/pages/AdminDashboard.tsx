import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  LogOut, 
  Users, 
  Trophy, 
  TrendingUp, 
  Calendar,
  Loader2,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AssessmentResult {
  id: string;
  username: string;
  user_number: number;
  total_score: number;
  total_questions: number;
  level_scores: Record<string, number> | null;
  proficiency_label: string;
  completed_at: string;
}

export default function AdminDashboard() {
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchResults = async (showRefreshToast = false) => {
    if (showRefreshToast) setIsRefreshing(true);
    
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        navigate("/admin");
        return;
      }

      const { data, error } = await supabase
        .from("assessment_results")
        .select("*")
        .order("completed_at", { ascending: false });

      if (error) {
        if (error.code === "42501") {
          toast({
            title: "Access denied",
            description: "You don't have permission to view results.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          navigate("/admin");
          return;
        }
        throw error;
      }

      setResults((data || []) as AssessmentResult[]);
      if (showRefreshToast) {
        toast({
          title: "Refreshed",
          description: "Results updated successfully.",
        });
      }
    } catch (err) {
      console.error("Error fetching results:", err);
      toast({
        title: "Error",
        description: "Failed to load results.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  // Calculate stats
  const totalAssessments = results.length;
  const averageScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + (r.total_score / r.total_questions) * 100, 0) / results.length)
    : 0;
  const proficientCount = results.filter(r => r.proficiency_label === "Proficient").length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProficiencyColor = (label: string) => {
    switch (label) {
      case "Proficient": return "text-emerald-600 bg-emerald-50";
      case "Advanced": return "text-blue-600 bg-blue-50";
      case "Intermediate": return "text-amber-600 bg-amber-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-subtle flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-subtle">
      {/* Header */}
      <header className="w-full py-4 px-4 border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-glossy rounded-xl flex items-center justify-center shadow-glossy border border-white/10">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif font-semibold text-xl text-foreground">Admin Dashboard</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="gradient-card rounded-xl p-6 shadow-soft">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Assessments</p>
                <p className="text-3xl font-bold text-foreground">{totalAssessments}</p>
              </div>
            </div>
          </div>

          <div className="gradient-card rounded-xl p-6 shadow-soft">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-3xl font-bold text-foreground">{averageScore}%</p>
              </div>
            </div>
          </div>

          <div className="gradient-card rounded-xl p-6 shadow-soft">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <Trophy className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Proficient Users</p>
                <p className="text-3xl font-bold text-foreground">{proficientCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="gradient-card rounded-xl shadow-medium overflow-hidden">
          <div className="p-4 border-b border-border/50 flex items-center justify-between">
            <h2 className="font-semibold text-lg text-foreground">Assessment Results</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => fetchResults(true)}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {results.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No assessments completed yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>User #</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Proficiency</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.username}</TableCell>
                      <TableCell>{result.user_number}</TableCell>
                      <TableCell>
                        {result.total_score}/{result.total_questions}
                        <span className="text-muted-foreground ml-1">
                          ({Math.round((result.total_score / result.total_questions) * 100)}%)
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getProficiencyColor(result.proficiency_label)}`}>
                          {result.proficiency_label}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(result.completed_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
