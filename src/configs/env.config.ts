import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    POSTGRES_PORT: z.string().regex(/^\d+$/, "POSTGRES_PORT must be a number").transform(Number),
    POSTGRES_USER: z.string().min(1, "POSTGRES_USER is required"),
    POSTGRES_PASSWORD: z.string().min(1, "POSTGRES_PASSWORD is required"),
    POSTGRES_DB: z.string().min(1, "POSTGRES_DB is required"),
    POSTGRES_HOST: z.string().min(1, "POSTGRES_HOST is required"),
    PORT: z.string().regex(/^\d+$/, "PORT must be a number").transform(Number),
    JWT_SECRET_KEY: z.string().min(1, "JWT_SECRET_KEY is required"),
    AWS_ACCESS_KEY_ID: z.string().min(1, "AWS_ACCESS_KEY_ID is required"),
    AWS_SECRET_ACCESS_KEY: z.string().min(1, "AWS_SECRET_ACCESS_KEY is required"),
    AWS_REGION: z.string().min(1, "AWS_REGION is required"),
    REDIS_PASSWORD: z.string().min(1, "REDIS_PASSWORD is required"),
    REDIS_HOST: z.string().min(1, "REDIS_HOST is required"),
    REDIS_HOST_PORT: z.string().regex(/^\d+$/, "REDIS_HOST_PORT must be a number").transform(Number),
    OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
    AWS_SES_SOURCE_EMAIL: z.string().email("AWS_SES_SOURCE_EMAIL must be a valid email address")
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error("Invalid environment variables:", parsedEnv.error.format());
}

export const envConfig = parsedEnv.data;
