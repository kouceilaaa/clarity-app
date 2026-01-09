import { z } from "zod";

const ConfigSchema = z.object({
  mongodbUri: z.string().url(),
  nextAuthUrl: z.string().url(),
  nextAuthSecret: z.string().min(32),
  googleClientId: z.string().optional(),
  googleClientSecret: z.string().optional(),
  openrouterApiKey: z.string().optional(),
  nodeEnv: z.enum(["development", "production", "test"]),
});

function validateConfig() {
  const configObj = {
    mongodbUri: process.env.MONGODB_URI,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    nextAuthSecret: process.env.NEXTAUTH_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    openrouterApiKey: process.env.OPENROUTER_API_KEY,
    nodeEnv: process.env.NODE_ENV ?? "development",
  };

  try {
    return ConfigSchema.parse(configObj);
  } catch (error) {
    console.error("❌ Invalid environment variables:", error);
    throw new Error("Invalid environment variables");
  }
}

export const config = validateConfig();

export type Config = z.infer<typeof ConfigSchema>;
