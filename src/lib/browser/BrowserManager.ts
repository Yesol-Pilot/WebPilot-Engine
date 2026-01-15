import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { addExtra } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Use the stealth plugin
const chromiumExtra = addExtra(chromium);
chromiumExtra.use(StealthPlugin());

export class BrowserManager {
    private static instance: BrowserManager;
    private browser: Browser | null = null;
    private isInitializing: boolean = false;

    private constructor() { }

    public static getInstance(): BrowserManager {
        if (!BrowserManager.instance) {
            BrowserManager.instance = new BrowserManager();
        }
        return BrowserManager.instance;
    }

    /**
     * Initializes the browser instance if not already initialized.
     */
    public async init(): Promise<void> {
        if (this.browser) return;

        // Prevent race conditions during initialization
        if (this.isInitializing) {
            while (this.isInitializing) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            if (this.browser) return;
        }

        this.isInitializing = true;
        try {
            console.log('[BrowserManager] Initializing Playwright browser...');
            this.browser = await chromiumExtra.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage', // Helpful for Docker environments
                    '--disable-gpu',
                ],
            });
            console.log('[BrowserManager] Browser initialized successfully.');
        } catch (error) {
            console.error('[BrowserManager] Failed to initialize browser:', error);
            throw error;
        } finally {
            this.isInitializing = false;
        }
    }

    /**
     * Creates a new isolated browser context with stealth settings.
     */
    public async newContext(): Promise<BrowserContext> {
        if (!this.browser) {
            await this.init();
        }

        // Create context with standard User-Agent to blend in
        const context = await this.browser!.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        });

        return context;
    }

    /**
     * Helper to get a new page from a new context directly.
     */
    public async newPage(): Promise<Page> {
        const context = await this.newContext();
        return context.newPage();
    }

    /**
     * Closes the browser instance.
     */
    public async close(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            console.log('[BrowserManager] Browser closed.');
        }
    }
}
