import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BrainCircuit, User, Briefcase, ArrowLeft, Save, Upload, FileText, Loader2 } from "lucide-react";
import { Link } from "wouter";

import { insertUserProfileSchema } from "@shared/schema";
import { z } from "zod";

const profileFormSchema = insertUserProfileSchema.extend({
  skills: z.string().min(1, "Skills are required"),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

export default function Profile() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showResumeUpload, setShowResumeUpload] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["/api/profile"],
    retry: false,
    enabled: isAuthenticated,
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      jobTitles: [],
      location: "",
      locationType: "remote",
      minSalary: undefined,
      maxSalary: undefined,
      experienceYears: "",
      skills: "",
      workHistory: "",
      resumeUrl: "",
    },
  });

  // Update form when profile data loads
  useEffect(() => {
    if (profile) {
      setIsEditing(false);
      form.reset({
        jobTitles: profile.jobTitles || [],
        location: profile.location || "",
        locationType: profile.locationType || "remote",
        minSalary: profile.minSalary || undefined,
        maxSalary: profile.maxSalary || undefined,
        experienceYears: profile.experienceYears || "",
        skills: profile.skills || "",
        workHistory: profile.workHistory || "",
        resumeUrl: profile.resumeUrl || "",
      });
    } else {
      setIsEditing(true);
      setShowResumeUpload(true);
    }
  }, [profile, form]);

  // Update form when extracted data is available
  useEffect(() => {
    if (extractedData) {
      form.reset({
        jobTitles: extractedData.jobTitles || [],
        location: extractedData.location || "",
        locationType: extractedData.locationType || "remote",
        minSalary: extractedData.minSalary || undefined,
        maxSalary: extractedData.maxSalary || undefined,
        experienceYears: extractedData.experienceYears || "",
        skills: extractedData.skills || "",
        workHistory: extractedData.workHistory || "",
        resumeUrl: "",
      });
      setIsEditing(true);
      setShowResumeUpload(false);
    }
  }, [extractedData, form]);

  const parseResumeMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to parse resume');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setExtractedData(data);
      toast({
        title: "Resume Parsed Successfully",
        description: "Your resume information has been extracted. Please review and confirm the details.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: error.message || "Failed to parse resume. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await fetch("/api/profile", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          jobTitles: data.jobTitles,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create profile');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      setIsEditing(false);
      toast({
        title: "Profile Created",
        description: "Your profile has been successfully created!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<ProfileFormData>) => {
      const response = await fetch("/api/profile", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf' && file.type !== 'text/plain') {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF or text file.",
          variant: "destructive",
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      parseResumeMutation.mutate(file);
    }
  };

  const onSubmit = (data: ProfileFormData) => {
    if (profile) {
      updateProfileMutation.mutate(data);
    } else {
      createProfileMutation.mutate(data);
    }
  };

  const handleSkipResume = () => {
    setShowResumeUpload(false);
    setIsEditing(true);
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isPending = createProfileMutation.isPending || updateProfileMutation.isPending || parseResumeMutation.isPending;

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
              <User className="h-5 w-5 text-slate-500" />
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
              {profile ? "My Profile" : "Complete Your Profile"}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {profile 
                ? "Manage your job preferences and professional information"
                : "Set up your profile to get personalized job recommendations"
              }
            </p>
          </div>

          {/* Resume Upload Section */}
          {showResumeUpload && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  <span>Quick Setup with Resume</span>
                </CardTitle>
                <CardDescription>
                  Upload your resume and let AI automatically extract your information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                  <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    Upload Your Resume
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Supported formats: PDF, Text (.txt)
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-4">
                      <Button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isPending}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {parseResumeMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Choose File
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleSkipResume}
                        disabled={isPending}
                      >
                        Manual Entry
                      </Button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
                {parseResumeMutation.isPending && (
                  <Alert className="mt-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <AlertDescription>
                      Analyzing your resume with AI... This may take a few moments.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Extracted Data Preview */}
          {extractedData && (
            <Alert className="mb-6">
              <BrainCircuit className="h-4 w-4" />
              <AlertDescription>
                Information extracted from your resume! Please review and confirm the details below.
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Professional Information</span>
                {profile && !isEditing && (
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                    Edit Profile
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                {extractedData 
                  ? "Review the information extracted from your resume"
                  : "Tell us about your career goals and experience"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Location</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="e.g., San Francisco, CA" 
                              disabled={!isEditing}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="locationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Work Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={!isEditing}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select work type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="remote">Remote</SelectItem>
                              <SelectItem value="onsite">On-site</SelectItem>
                              <SelectItem value="hybrid">Hybrid</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="minSalary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Salary ($)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number"
                              placeholder="50000"
                              disabled={!isEditing}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxSalary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Salary ($)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number"
                              placeholder="150000"
                              disabled={!isEditing}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="experienceYears"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={!isEditing}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0-1">0-1 years</SelectItem>
                            <SelectItem value="2-3">2-3 years</SelectItem>
                            <SelectItem value="4-6">4-6 years</SelectItem>
                            <SelectItem value="7-10">7-10 years</SelectItem>
                            <SelectItem value="10+">10+ years</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skills</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="React, Node.js, Python, JavaScript, TypeScript, AWS..."
                            className="min-h-20"
                            disabled={!isEditing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="workHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work History</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Describe your work experience, achievements, and key projects..."
                            className="min-h-32"
                            disabled={!isEditing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isEditing && (
                    <div className="flex space-x-4">
                      <Button type="submit" disabled={isPending}>
                        <Save className="h-4 w-4 mr-2" />
                        {isPending ? "Saving..." : profile ? "Update Profile" : "Create Profile"}
                      </Button>
                      {(profile || extractedData) && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            if (profile) {
                              setIsEditing(false);
                            } else {
                              setShowResumeUpload(true);
                              setIsEditing(false);
                              setExtractedData(null);
                            }
                          }}
                          disabled={isPending}
                        >
                          {profile ? "Cancel" : "Back to Upload"}
                        </Button>
                      )}
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}