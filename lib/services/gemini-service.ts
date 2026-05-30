import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import { createAgent, HumanMessage } from "langchain";
import { AIService } from "./types";

export class GeminiService extends AIService {
  private generationModel: string = "";
  private embeddingModel: string = "";

  setGenerationModel(model: string): void {
    this.generationModel = model;
  }

  setEmbeddingModel(model: string): void {
    this.embeddingModel = model;
  }

  async generateText(
    systemPrompt: string,
    context: string[],
    userMessage: string,
  ): Promise<string> {
    const contextBlock = context.length
      ? `Here is relevant information from my portfolio:\n${context.join("\n\n")}`
      : "";

    const fullMessage = contextBlock
      ? `${contextBlock}\n\nUser question: ${userMessage}`
      : userMessage;

    const llm = new ChatGoogleGenerativeAI({
      model: this.generationModel,
      apiKey: process.env.GOOGLE_API_KEY!,
    });

    const agent = createAgent({
      model: llm,
      systemPrompt,
    });

    const response = await agent.invoke({
      messages: [new HumanMessage(fullMessage)],
    });

    const lastMessage = response.messages[response.messages.length - 1];
    const output = lastMessage?.content || "";

    return output as string;
  }

  async embedText(text: string): Promise<number[]> {
    const embeddings = new GoogleGenerativeAIEmbeddings({
      modelName: this.embeddingModel,
    });
    return embeddings.embedQuery(text);
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    const embeddings = new GoogleGenerativeAIEmbeddings({
      modelName: this.embeddingModel,
    });
    return embeddings.embedDocuments(texts);
  }
}
