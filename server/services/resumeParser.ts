import { aiProviderService, type AIRequest } from "./aiProviders";

// Dynamic import for pdf-parse to avoid startup issues
let pdfParse: any;
try {
  pdfParse = require("pdf-parse");
} catch (error) {
  console.warn("pdf-parse not available:", error.message);
}

export interface ExtractedResumeData {
  jobTitles: string[];
  location: string;
  locationType: string;
  minSalary?: number;
  maxSalary?: number;
  experienceYears: string;
  skills: string;
  workHistory: string;
}

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  if (!pdfParse) {
    throw new Error("PDF parsing not available. Please try uploading a text file instead.");
  }
  
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

export async function parseResumeWithAI(resumeText: string, aiConfig: { provider: string; apiKey: string }): Promise<ExtractedResumeData> {
  if (!aiConfig.apiKey) {
    throw new Error("AI API key not provided");
  }

  try {
    const prompt = `
Extract and structure the following information from this resume text. Return the response as a JSON object with these exact fields:

{
  "jobTitles": ["array of job titles/roles the person has held or is targeting"],
  "location": "preferred work location (city, state or 'Remote' if not specified)",
  "locationType": "remote, onsite, or hybrid (default to 'remote' if unclear)",
  "experienceYears": "0-1, 2-3, 4-6, 7-10, or 10+ based on total work experience",
  "skills": "comma-separated list of technical skills, programming languages, tools, etc.",
  "workHistory": "detailed work experience summary including companies, roles, achievements, and key projects"
}

Guidelines:
- For jobTitles, include both past positions and target roles
- For location, extract city/state or use "Remote" if not specified
- For experienceYears, calculate total years and map to the ranges above
- For skills, focus on technical skills, tools, programming languages, frameworks
- For workHistory, provide a comprehensive summary that would be suitable for job applications

Resume text:
${resumeText}

Return only the JSON object, no additional text.`;

    const aiRequest: AIRequest = {
      provider: aiConfig.provider,
      apiKey: aiConfig.apiKey,
      prompt,
      systemMessage: "You are an expert resume parser. Extract structured information from resumes and return it as valid JSON.",
      responseFormat: "json",
      temperature: 0.1
    };

    const response = await aiProviderService.callAI(aiRequest);

    if (!response.success) {
      throw new Error(response.error);
    }

    const result = JSON.parse(response.content);
    
    // Validate and clean the extracted data
    return {
      jobTitles: Array.isArray(result.jobTitles) ? result.jobTitles : [],
      location: result.location || "Remote",
      locationType: ["remote", "onsite", "hybrid"].includes(result.locationType?.toLowerCase()) 
        ? result.locationType.toLowerCase() 
        : "remote",
      experienceYears: ["0-1", "2-3", "4-6", "7-10", "10+"].includes(result.experienceYears) 
        ? result.experienceYears 
        : "2-3",
      skills: result.skills || "",
      workHistory: result.workHistory || "",
      minSalary: result.minSalary || undefined,
      maxSalary: result.maxSalary || undefined,
    };

  } catch (error) {
    console.error("AI parsing error:", error);
    throw new Error(`Failed to parse resume with AI: ${error.message}`);
  }
}