
import { useState, useEffect } from "react";

interface AIConfig {
  provider: string;
  apiKey: string;
}

const AI_CONFIG_KEY = "jobpilot_ai_config";

// Simple encryption for local storage (not production-grade)
function encrypt(text: string): string {
  return btoa(text);
}

function decrypt(text: string): string {
  try {
    return atob(text);
  } catch {
    return "";
  }
}

export function useAIConfig() {
  const [config, setConfig] = useState<AIConfig | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = () => {
    try {
      const saved = localStorage.getItem(AI_CONFIG_KEY);
      if (saved) {
        const decrypted = decrypt(saved);
        const parsed = JSON.parse(decrypted);
        setConfig(parsed);
        setIsConfigured(true);
      }
    } catch (error) {
      console.error("Failed to load AI config:", error);
    }
  };

  const saveConfig = (newConfig: AIConfig, saveLocally: boolean) => {
    setConfig(newConfig);
    setIsConfigured(true);

    if (saveLocally) {
      try {
        const encrypted = encrypt(JSON.stringify(newConfig));
        localStorage.setItem(AI_CONFIG_KEY, encrypted);
      } catch (error) {
        console.error("Failed to save AI config:", error);
      }
    }
  };

  const clearConfig = () => {
    setConfig(null);
    setIsConfigured(false);
    localStorage.removeItem(AI_CONFIG_KEY);
  };

  const updateConfig = (updates: Partial<AIConfig>) => {
    if (config) {
      const newConfig = { ...config, ...updates };
      setConfig(newConfig);
      
      // Update localStorage if it exists
      try {
        const saved = localStorage.getItem(AI_CONFIG_KEY);
        if (saved) {
          const encrypted = encrypt(JSON.stringify(newConfig));
          localStorage.setItem(AI_CONFIG_KEY, encrypted);
        }
      } catch (error) {
        console.error("Failed to update AI config:", error);
      }
    }
  };

  return {
    config,
    isConfigured,
    saveConfig,
    clearConfig,
    updateConfig,
    loadConfig
  };
}
