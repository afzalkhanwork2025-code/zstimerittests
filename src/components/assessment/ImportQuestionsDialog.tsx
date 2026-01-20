import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link, FileText, Loader2, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Question } from "@/lib/questionGenerator";

interface ImportQuestionsDialogProps {
  onImport: (questions: Question[]) => void;
}

export function ImportQuestionsDialog({ onImport }: ImportQuestionsDialogProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [textContent, setTextContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ count: number } | null>(null);

  const handleExtract = async (source: 'url' | 'text') => {
    setIsLoading(true);
    setError("");
    setSuccess(null);

    try {
      const payload = source === 'url' 
        ? { url: url.trim() }
        : { textContent: textContent.trim() };

      const { data, error: fnError } = await supabase.functions.invoke('extract-questions', {
        body: payload,
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to extract questions');
      }

      if (data.questions.length === 0) {
        throw new Error('No valid questions found in the content');
      }

      setSuccess({ count: data.questions.length });
      onImport(data.questions);
      
      // Reset form after success
      setTimeout(() => {
        setUrl("");
        setTextContent("");
        setOpen(false);
        setSuccess(null);
      }, 2000);

    } catch (err) {
      console.error('Import error:', err);
      setError(err instanceof Error ? err.message : 'Failed to extract questions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Upload className="w-4 h-4" />
          Import Questions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Import Questions
          </DialogTitle>
          <DialogDescription>
            Extract questions from a URL or paste document content. Questions will be automatically parsed and added to your assessment.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="url" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url" className="gap-2">
              <Link className="w-4 h-4" />
              From URL
            </TabsTrigger>
            <TabsTrigger value="text" className="gap-2">
              <FileText className="w-4 h-4" />
              Paste Content
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium">
                Website or Document URL
              </label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/quiz"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Enter a URL containing quiz questions. We'll extract them automatically.
              </p>
            </div>
            <Button
              onClick={() => handleExtract('url')}
              disabled={!url.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Extracting...
                </>
              ) : (
                'Extract from URL'
              )}
            </Button>
          </TabsContent>

          <TabsContent value="text" className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Document Content
              </label>
              <Textarea
                id="content"
                placeholder="Paste your quiz content here...

Example format:
1. What is 2 + 2?
   a) 3
   b) 4
   c) 5
   Answer: b

2. The capital of France is:
   a) London
   b) Paris
   c) Berlin
   Answer: b"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                disabled={isLoading}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
            <Button
              onClick={() => handleExtract('text')}
              disabled={!textContent.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Extracting...
                </>
              ) : (
                'Extract Questions'
              )}
            </Button>
          </TabsContent>
        </Tabs>

        {/* Status messages */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 text-primary text-sm">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            Successfully imported {success.count} questions!
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
