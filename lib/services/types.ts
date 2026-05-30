export abstract class AIService {
  abstract setGenerationModel(model: string): void;
  abstract setEmbeddingModel(model: string): void;
  abstract generateText(
    systemPrompt: string,
    context: string[],
    userMessage: string,
  ): Promise<string>;
  abstract embedText(text: string): Promise<number[]>;
  abstract embedBatch(texts: string[]): Promise<number[][]>;
}
