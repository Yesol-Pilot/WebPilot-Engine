
import { BrowserManager } from '../src/lib/browser/BrowserManager';

async function testBrowser() {
    console.log('Starting Browser Verification Test...');
    const browserManager = BrowserManager.getInstance();

    try {
        console.log('1. Initializing BrowserManager...');
        await browserManager.init();
        console.log('✅ BrowserManager initialized.');

        console.log('2. Creating New Context...');
        const context = await browserManager.newContext();
        console.log('✅ Context created.');

        console.log('3. Creating New Page...');
        const page = await context.newPage();
        console.log('✅ Page created.');

        const targetUrl = 'https://example.com';
        console.log(`4. Navigating to ${targetUrl}...`);
        await page.goto(targetUrl);

        const title = await page.title();
        console.log(`✅ Page Title: ${title}`);

        if (title.includes('Example Domain')) {
            console.log('✅ Verification SUCCEEDED: Title matched.');
        } else {
            console.error('❌ Verification FAILED: Title did not match.');
            console.error(`Expected: "Example Domain", Got: "${title}"`);
        }

        await page.close();
        await context.close();

    } catch (error) {
        console.error('❌ Verification FAILED with error:', error);
    } finally {
        console.log('5. Closing BrowserManager...');
        await browserManager.close();
        console.log('✅ BrowserManager closed.');
    }
}

// execute
testBrowser();
