import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Home } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <BrainCircuit className="h-12 w-12 text-blue-600" />
            <span className="text-3xl font-bold text-slate-900 dark:text-white">JobPilot AI</span>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-6xl font-bold text-slate-900 dark:text-white mb-4">
                404
              </CardTitle>
              <CardDescription className="text-xl">
                Page Not Found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <Link href="/">
                <Button className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}