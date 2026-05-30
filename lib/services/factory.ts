import { AIService } from "./types";
import { GeminiService } from "./gemini-service";
import { OllamaService } from "./ollama-service";

export function createAIService(provider: string): AIService {
  switch (provider) {
    case "google":
      return new GeminiService();
    case "ollama":
      return new OllamaService();
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}
