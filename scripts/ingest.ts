import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { VectorEntry } from "../lib/rag/vectorStore";
import { createAIService } from "../lib/services/factory";
dotenv.config({ path: ".env.local" });

async function main() {
  const pdfPath = path.join(process.cwd(), "data", "knowledge.pdf");
  const outputPath = path.join(process.cwd(), "public", "vectors.json");

  if (!fs.existsSync(pdfPath)) {
    console.error(`❌ PDF not found at ${pdfPath}`);
    console.error("   Place your PDF at data/knowledge.pdf and try again.");
    process.exit(1);
  }

  const provider = process.env.LLM_PROVIDER || "google";
  const embeddingModel = process.env.EMBEDDING_MODEL || "text-embedding-004";

  if (!process.env.GOOGLE_API_KEY && provider === "google") {
    console.error("❌ GOOGLE_API_KEY not set in .env.local");
    process.exit(1);
  }

  console.log("🚀 Loading PDF...");
  const { PDFLoader } =
    await import("@langchain/community/document_loaders/fs/pdf");
  const loader = new PDFLoader(pdfPath);
  const docs = await loader.load();
  console.log(`   Loaded ${docs.length} page(s)`);

  console.log("✂️  Chunking text...");
  const { RecursiveCharacterTextSplitter } =
    await import("@langchain/textsplitters");
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  const chunks = await splitter.splitDocuments(docs);
  console.log(`   Created ${chunks.length} chunks`);

  const texts = chunks.map((c) => c.pageContent);
  const metadatas = chunks.map((c) => c.metadata);

  console.log(`🔮 Embedding ${texts.length} chunks with ${embeddingModel}...`);
  const service = createAIService(provider);
  service.setEmbeddingModel(embeddingModel);
  const embeddings = await service.embedBatch(texts);

  console.log("💾 Saving to public/vectors.json...");
  const vectors: VectorEntry[] = texts.map((text, i) => ({
    text,
    embedding: embeddings[i],
    metadata: {
      page: metadatas[i]?.pdf?.totalPages
        ? (metadatas[i]?.loc?.pageNumber as number)
        : undefined,
      chunkIndex: i,
    },
  }));

  fs.writeFileSync(outputPath, JSON.stringify(vectors, null, 2));
  console.log(
    `✅ Done! Saved ${vectors.length} vectors to public/vectors.json`,
  );
}

main().catch((error) => {
  console.error("❌ Ingest failed:", error.message);
  process.exit(1);
});
