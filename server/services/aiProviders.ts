
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

export interface AIProvider {
  name: string;
  displayName: string;
  apiKeyUrl: string;
}

export const AI_PROVIDERS: AIProvider[] = [
  {
    name: "openai",
    displayName: "OpenAI",
    apiKeyUrl: "https://platform.openai.com/account/api-keys"
  },
  {
    name: "gemini",
    displayName: "Gemini (Google)",
    apiKeyUrl: "https://aistudio.google.com/app/apikey"
  },
  {
    name: "copilot",
    displayName: "Microsoft Copilot",
    apiKeyUrl: "https://copilot.microsoft.com"
  },
  {
    name: "deepseek",
    displayName: "DeepSeek",
    apiKeyUrl: "https://platform.deepseek.com"
  }
];

export interface AIRequest {
  provider: string;
  apiKey: string;
  prompt: string;
  systemMessage?: string;
  responseFormat?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  content: string;
  success: boolean;
  error?: string;
}

export class AIProviderService {
  async callAI(request: AIRequest): Promise<AIResponse> {
    try {
      switch (request.provider) {
        case "openai":
          return await this.callOpenAI(request);
        case "gemini":
          return await this.callGemini(request);
        case "copilot":
          return await this.callCopilot(request);
        case "deepseek":
          return await this.callDeepSeek(request);
        default:
          throw new Error(`Unsupported AI provider: ${request.provider}`);
      }
    } catch (error) {
      console.error(`AI provider ${request.provider} error:`, error);
      return {
        content: "",
        success: false,
        error: error.message || "AI request failed"
      };
    }
  }

  private async callOpenAI(request: AIRequest): Promise<AIResponse> {
    const openai = new OpenAI({ apiKey: request.apiKey });
    
    const messages: any[] = [];
    if (request.systemMessage) {
      messages.push({ role: "system", content: request.systemMessage });
    }
    messages.push({ role: "user", content: request.prompt });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      response_format: request.responseFormat === "json" ? { type: "json_object" } : undefined,
      temperature: request.temperature || 0.7,
      max_tokens: request.maxTokens || 2000
    });

    return {
      content: completion.choices[0].message.content || "",
      success: true
    };
  }

  private async callGemini(request: AIRequest): Promise<AIResponse> {
    const genAI = new GoogleGenerativeAI(request.apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let prompt = request.prompt;
    if (request.systemMessage) {
      prompt = `${request.systemMessage}\n\n${prompt}`;
    }

    if (request.responseFormat === "json") {
      prompt += "\n\nPlease respond with valid JSON only.";
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return {
      content: response.text(),
      success: true
    };
  }

  private async callCopilot(request: AIRequest): Promise<AIResponse> {
    // Note: Microsoft Copilot doesn't have a direct API like OpenAI
    // This is a placeholder implementation
    // In practice, you might need to use Azure OpenAI Service
    throw new Error("Microsoft Copilot direct API not available. Consider using Azure OpenAI Service instead.");
  }

  private async callDeepSeek(request: AIRequest): Promise<AIResponse> {
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [
          ...(request.systemMessage ? [{ role: "system", content: request.systemMessage }] : []),
          { role: "user", content: request.prompt }
        ],
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 2000
      },
      {
        headers: {
          "Authorization": `Bearer ${request.apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    return {
      content: response.data.choices[0].message.content,
      success: true
    };
  }
}

export const aiProviderService = new AIProviderService();
