
const { BrowserManager } = require('../src/lib/browser/BrowserManager');

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

// Check if run directly
if (require.main === module) {
    // Note: This script requires ts-node or transpilation to run because BrowserManager is TS.
    // For simple testing without compilation, we might need a JS version or use ts-node.
    console.log('This script requires ts-node execution environment.');
}
