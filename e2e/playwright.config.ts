import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir: '.', timeout: 90_000, workers: 1, reporter: [['list']], use: { baseURL: 'http://localhost:8090', headless: true, viewport: { width: 1360, height: 900 } } });
