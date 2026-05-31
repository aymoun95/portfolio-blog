import { z } from "zod";

const envSchema = z
  .object({
    GOOGLE_API_KEY: z.string().min(1).optional(),

    LLM_PROVIDER: z.enum(["google", "openai", "ollama"]).default("google"),
    LLM_MODEL: z.string().default("gemini-2.0-flash-lite"),
    EMBEDDING_MODEL: z.string().default("text-embedding-004"),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),

    RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
    EMAIL: z.email("Invalid email address").min(1, "Email is required"),
    METABASE_URL: z.url("Invalid URL").min(1, "METABASE_URL is required"),
  })
  .superRefine((data, ctx) => {
    if (data.LLM_PROVIDER === "google" && !data.GOOGLE_API_KEY) {
      ctx.addIssue({
        code: "invalid_type",
        expected: "string",
        path: ["GOOGLE_API_KEY"],
        message: "GOOGLE_API_KEY is required when LLM_PROVIDER is 'google'",
      });
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables. Check your .env.local file.");
}

export const env = parsed.data;

export const {
  GOOGLE_API_KEY,
  LLM_PROVIDER,
  LLM_MODEL,
  EMBEDDING_MODEL,
  NODE_ENV,
} = env;
