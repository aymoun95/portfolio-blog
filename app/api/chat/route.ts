import { env } from "@/lib/env";
import { systemPrompt } from "@/lib/rag/prompt";
import { searchSimilar } from "@/lib/rag/vectorStore";
import { createAIService } from "@/lib/services/factory";
import { checkRateLimit } from "@vercel/firewall";

const isDev = env.NODE_ENV === "development";

export async function POST(req: Request) {
  if (!isDev) {
    const { rateLimited } = await checkRateLimit("update-object", {
      request: req,
    });
    if (rateLimited) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  }
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    const provider = env.LLM_PROVIDER;
    const llmModel = env.LLM_MODEL;
    const embeddingModel = env.EMBEDDING_MODEL;

    const service = createAIService(provider);
    service.setGenerationModel(llmModel);
    service.setEmbeddingModel(embeddingModel);

    const questionEmbedding = await service.embedText(message);
    const results = searchSimilar(questionEmbedding, 3);
    const context = results.map((r) => r.text);

    const answer = await service.generateText(systemPrompt, context, message);

    return new Response(answer, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Internal server error";

    if (msg.includes("vectors.json")) {
      return Response.json(
        {
          error: "Knowledge base not initialized. Run the ingest script first.",
        },
        { status: 500 },
      );
    }

    return Response.json({ error: msg }, { status: 500 });
  }
}
