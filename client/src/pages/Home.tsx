import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, User, Briefcase, Target, Settings, LogOut } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isLoading } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (isLoading) {
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
            <div className="flex items-center space-x-2">
              <BrainCircuit className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900 dark:text-white">JobPilot AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={user?.profileImageUrl || ""} />
                <AvatarFallback>
                  {user?.firstName?.[0] || user?.email?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="font-medium text-slate-900 dark:text-white">
                  {user?.firstName || user?.email}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Welcome back!
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your job search and track your progress
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/profile">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <User className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <CardTitle>Complete Profile</CardTitle>
                <CardDescription>
                  Set up your job preferences and skills to get personalized job matches
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/jobs">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Briefcase className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <CardTitle>Browse Jobs</CardTitle>
                <CardDescription>
                  Discover relevant job opportunities with AI-powered matching
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/applications">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Target className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                <CardTitle>My Applications</CardTitle>
                <CardDescription>
                  Track your job applications and see their status
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
              <Settings className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Incomplete</div>
              <Badge variant="secondary" className="mt-2">Setup Required</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <Briefcase className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-slate-500">
                Start applying to jobs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interviews</CardTitle>
              <Target className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-slate-500">
                No interviews scheduled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <BrainCircuit className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <p className="text-xs text-slate-500">
                Start applying to track
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Complete these steps to optimize your job search experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">1</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">Complete your profile</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Add your skills, experience, and job preferences
                  </p>
                </div>
                <Link href="/profile">
                  <Button size="sm">Complete</Button>
                </Link>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <span className="text-slate-500 font-semibold text-sm">2</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">Browse and apply to jobs</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Discover matching opportunities and apply with AI-optimized resumes
                  </p>
                </div>
                <Button size="sm" variant="outline" disabled>
                  Browse Jobs
                </Button>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <span className="text-slate-500 font-semibold text-sm">3</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">Track your progress</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Monitor applications and get insights to improve your success rate
                  </p>
                </div>
                <Button size="sm" variant="outline" disabled>
                  View Analytics
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}