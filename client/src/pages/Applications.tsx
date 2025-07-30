import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, ArrowLeft, Target } from "lucide-react";
import { Link } from "wouter";

export default function Applications() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <BrainCircuit className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold text-slate-900 dark:text-white">JobPilot AI</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-slate-500" />
              <span className="text-slate-900 dark:text-white">
                {user?.firstName || user?.email}
              </span>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              My Applications
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Track your job applications and their progress
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Application Tracking</CardTitle>
              <CardDescription>
                Monitor your job applications and interview progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No Applications Yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Start applying to jobs to track your progress here.
                </p>
                <div className="space-x-4">
                  <Link href="/jobs">
                    <Button>Browse Jobs</Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline">Back to Dashboard</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}