import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_PATH: z.string().min(1, "DATABASE_PATH не задан"),
  BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET: минимум 32 символа"),
  BETTER_AUTH_URL: z.url("BETTER_AUTH_URL должен быть полным URL"),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  throw new Error(`Некорректные переменные окружения:\n${z.prettifyError(parsed.error)}`);
}

export const env = parsed.data;
