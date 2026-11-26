import { randomBytes } from "node:crypto";
import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  use: { baseURL, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run e2e:server",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 240_000,
    env: {
      DATABASE_PATH: "./data/e2e.sqlite",
      BETTER_AUTH_URL: baseURL,
      BETTER_AUTH_SECRET: randomBytes(32).toString("hex"),
    },
  },
});
