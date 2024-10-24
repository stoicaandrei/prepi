import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables from .env file
dotenv.config();

// For some reason this validation is not working with nextjs app router

// Define a schema for environment variables
// const envSchema = z.object({
//   KV_URL: z.string().url(),
//   KV_REST_API_URL: z.string().min(1),
// });

// // Validate and extract environment
// const env = envSchema.parse(process.env);

export const config = {
  KV_URL: process.env.KV_URL,
  KV_REST_API_URL: process.env.KV_REST_API_URL,
};
