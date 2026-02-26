import { defineConfig } from '@playwright/test'

export default defineConfig({
    testDir: './test.playwright',
    timeout: 60000,
    expect: {
        timeout: 10000
    },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:5176',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'on-first-retry'
    },
    projects: [
        {
            name: 'chromium',
            use: { browserName: 'chromium' }
        }
    ],
    webServer: {
        command: 'pnpm dev',
        url: 'http://localhost:5176',
        reuseExistingServer: !process.env.CI,
        timeout: 180000
    }
})