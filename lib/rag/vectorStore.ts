import fs from "fs";
import path from "path";

export interface VectorEntry {
  text: string;
  embedding: number[];
  metadata?: {
    page?: number;
    chunkIndex?: number;
  };
}

let cachedVectors: VectorEntry[] | null = null;

export function loadVectors(): VectorEntry[] {
  if (cachedVectors) return cachedVectors;

  try {
    const filePath = path.join(process.cwd(), "public", "vectors.json");

    if (!fs.existsSync(filePath)) {
      throw new Error(
        "vectors.json not found. Run `npx tsx scripts/ingest.ts` first.",
      );
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    cachedVectors = JSON.parse(raw);
    return cachedVectors!;
  } catch (error) {
    if (error instanceof Error && error.message.includes("vectors.json")) {
      throw error;
    }
    throw new Error(
      "vectors.json not found. Run `npx tsx scripts/ingest.ts` first.",
    );
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function searchSimilar(
  queryEmbedding: number[],
  topK: number = 3,
): { text: string; score: number }[] {
  const vectors = loadVectors();

  const scored = vectors.map((entry) => ({
    text: entry.text,
    score: cosineSimilarity(queryEmbedding, entry.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}
