import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, ArrowLeft, Briefcase } from "lucide-react";
import { Link } from "wouter";

export default function Jobs() {
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
              <Briefcase className="h-5 w-5 text-slate-500" />
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
              Job Opportunities
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Discover personalized job matches powered by AI
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>
                Job browsing functionality is being developed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Briefcase className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Job Search Feature Coming Soon
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  We're working on bringing you AI-powered job matching and recommendations.
                </p>
                <Link href="/">
                  <Button>Return to Dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}