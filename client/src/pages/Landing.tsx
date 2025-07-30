import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, Target, Zap, Users, ArrowRight, CheckCircle, Settings } from "lucide-react";
import { AIConfigModal } from "@/components/ai-config-modal";
import { useAIConfig } from "@/hooks/useAIConfig";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Landing() {
  const [showAIConfig, setShowAIConfig] = useState(false);
  const { config, isConfigured, saveConfig } = useAIConfig();

  const handleLogin = () => {
    if (!isConfigured) {
      setShowAIConfig(true);
    }
  };

  const handleAIConfigSave = (aiConfig: { provider: string; apiKey: string; saveLocally: boolean }) => {
    saveConfig({ provider: aiConfig.provider, apiKey: aiConfig.apiKey }, aiConfig.saveLocally);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BrainCircuit className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">JobPilot AI</span>
          </div>
          <div className="flex items-center space-x-2">
            {isConfigured && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAIConfig(true)}
              >
                <Settings className="h-4 w-4 mr-1" />
                AI Settings
              </Button>
            )}
            <Button onClick={handleLogin} size="lg" className="bg-blue-600 hover:bg-blue-700">
              {isConfigured ? "Sign in with Google" : "Configure AI & Sign in"}
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            AI-Powered Job Search Platform
          </Badge>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Land Your Dream Job with
            <span className="text-blue-600"> AI-Powered </span>
            Resume Optimization
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Automatically tailor your resume for each job application, discover matching opportunities, 
            and track your progress with intelligent insights powered by advanced AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleLogin} size="lg" className="bg-blue-600 hover:bg-blue-700">
              {isConfigured ? "Get Started Free" : "Configure AI & Get Started"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Supercharge Your Job Search
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Our AI-powered platform streamlines every aspect of your job search process
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Smart Job Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Discover relevant opportunities with AI-powered job matching based on your skills, 
                experience, and career preferences.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>AI Resume Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Automatically tailor your resume for each job application using GPT-4 to maximize 
                your chances of getting interviews.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Application Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Track all your applications in one place with status updates, interview scheduling, 
                and performance analytics.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white dark:bg-slate-900 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
              Why Choose JobPilot AI?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      Save 10+ Hours Per Week
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Automate resume customization and job matching to focus on what matters most.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      3x Higher Interview Rate
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      AI-optimized resumes significantly improve your application success rate.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      Personalized Insights
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Get intelligent feedback on job compatibility and application strategy.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      Always Up-to-Date
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Stay current with the latest job market trends and requirements.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      Secure & Private
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Your data is encrypted and protected with enterprise-grade security.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      Expert Support
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Get help from career coaches and technical support when you need it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to Transform Your Job Search?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            Join thousands of professionals who have accelerated their careers with JobPilot AI
          </p>
          {isConfigured ? (
            <SignInButton mode="modal">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </SignInButton>
          ) : (
            <Button onClick={handleLogin} size="lg" className="bg-blue-600 hover:bg-blue-700">
              Configure AI & Start Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BrainCircuit className="h-6 w-6" />
            <span className="text-xl font-bold">JobPilot AI</span>
          </div>
          <p className="text-slate-400">
            Empowering careers with artificial intelligence
          </p>
        </div>
      </footer>

      <AIConfigModal
        open={showAIConfig}
        onOpenChange={setShowAIConfig}
        onSave={handleAIConfigSave}
        currentConfig={config}
      />
    </div>
  );
}