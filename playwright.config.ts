import { defineConfig, devices } from "@playwright/test";

/** Match the base baked into `dist` by `VITE_BASE`. Demo default is `/par2play-demo/`. Production is `/`. */
export const basePath = (process.env.PLAYWRIGHT_BASE ?? "/par2play-demo/").replace(/\/?$/, "/");

export default defineConfig({
  testDir: "tests",
  timeout: 60_000,
  use: {
    baseURL: `http://127.0.0.1:4180${basePath}`,
    ...devices["Desktop Chrome"],
    channel: "chrome",
  },
  webServer: {
    command: `VITE_BASE=${basePath} npm run preview -- --host 127.0.0.1 --port 4180 --strictPort`,
    port: 4180,
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
