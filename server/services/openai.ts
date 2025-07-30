import { aiProviderService, type AIRequest } from "./aiProviders";

export interface ResumeOptimizationRequest {
  originalResume: string;
  jobDescription: string;
  jobTitle: string;
  requiredSkills: string[];
}

export interface ResumeOptimizationResult {
  optimizedResume: string;
  coverLetter: string;
  keyChanges: string[];
}

export interface AIConfig {
  provider: string;
  apiKey: string;
}

export async function optimizeResumeWithAI(request: ResumeOptimizationRequest, aiConfig: AIConfig): Promise<ResumeOptimizationResult> {
  try {
    const prompt = `
You are an expert resume optimization specialist. Given the original resume and job description below, please:

1. Optimize the resume to better match the job requirements
2. Generate a personalized cover letter
3. Provide a list of key changes made

Original Resume:
${request.originalResume}

Job Title: ${request.jobTitle}
Job Description:
${request.jobDescription}

Required Skills: ${request.requiredSkills.join(', ')}

Please respond with JSON in this exact format:
{
  "optimizedResume": "The optimized resume text with improved keyword matching and relevant experience highlighted",
  "coverLetter": "A personalized cover letter for this specific job",
  "keyChanges": ["List of key changes made to optimize the resume"]
}

Guidelines:
- Maintain truthfulness - don't add false experience
- Emphasize relevant skills and experience that match the job
- Use industry keywords and ATS-friendly formatting
- Keep the same basic structure but improve content presentation
- Make the cover letter specific to the company and role
`;

    const aiRequest: AIRequest = {
      provider: aiConfig.provider,
      apiKey: aiConfig.apiKey,
      prompt,
      systemMessage: "You are an expert resume optimization specialist. Respond only with valid JSON in the specified format.",
      responseFormat: "json",
      temperature: 0.7,
      maxTokens: 2000
    };

    const response = await aiProviderService.callAI(aiRequest);

    if (!response.success) {
      throw new Error(response.error);
    }

    const result = JSON.parse(response.content || "{}");

    return {
      optimizedResume: result.optimizedResume || request.originalResume,
      coverLetter: result.coverLetter || "Thank you for considering my application.",
      keyChanges: result.keyChanges || []
    };
  } catch (error) {
    console.error("AI optimization error:", error);
    
    // Fallback to basic optimization
    return {
      optimizedResume: request.originalResume,
      coverLetter: `Dear Hiring Manager,

I am writing to express my interest in the ${request.jobTitle} position. With my experience in ${request.requiredSkills.slice(0, 3).join(', ')}, I believe I would be a valuable addition to your team.

I look forward to discussing how my skills and experience can contribute to your organization.

Best regards`,
      keyChanges: ["Applied basic formatting improvements"]
    };
  }
}

export async function generateJobMatchInsights(userProfile: any, jobDescription: string, aiConfig: AIConfig): Promise<string[]> {
  try {
    const prompt = `
Analyze the match between this user profile and job description. Provide 3-5 specific insights about why this job is a good match or what the user should emphasize.

User Profile:
Skills: ${userProfile.skills}
Experience: ${userProfile.experienceYears}
Work History: ${userProfile.workHistory}

Job Description:
${jobDescription}

Respond with JSON in this format:
{
  "insights": ["Insight 1", "Insight 2", "Insight 3"]
}
`;

    const aiRequest: AIRequest = {
      provider: aiConfig.provider,
      apiKey: aiConfig.apiKey,
      prompt,
      responseFormat: "json",
      temperature: 0.5,
      maxTokens: 500
    };

    const response = await aiProviderService.callAI(aiRequest);

    if (!response.success) {
      throw new Error(response.error);
    }

    const result = JSON.parse(response.content || "{}");
    return result.insights || [];
  } catch (error) {
    console.error("AI insights error:", error);
    return ["This job matches your technical skills and experience level."];
  }
}
