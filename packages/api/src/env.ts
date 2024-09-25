import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables from .env file
dotenv.config();

// Define a schema for environment variables
const envSchema = z.object({
  KV_URL: z.string().url(),
  KV_REST_API_URL: z.string().min(1),
});

// Validate and extract environment
const env = envSchema.parse(process.env);

export const config = {
  KV_URL: env.KV_URL,
  KV_REST_API_URL: env.KV_REST_API_URL,
};
