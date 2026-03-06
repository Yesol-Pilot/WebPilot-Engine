const fs = require('fs');
const { execSync } = require('child_process');

// Parse .env
const localEnv = fs.readFileSync('.env', 'utf8')
    .split('\n')
    .filter(line => line && !line.startsWith('#'))
    .reduce((acc, line) => {
        const idx = line.indexOf('=');
        if (idx > 0) {
            const key = line.substring(0, idx).trim();
            const val = line.substring(idx + 1).trim();
            acc[key] = val;
        }
        return acc;
    }, {});

// Parse .env.vercel.local
let vercelEnv = {};
if (fs.existsSync('.env.vercel.local')) {
    vercelEnv = fs.readFileSync('.env.vercel.local', 'utf8')
        .split('\n')
        .filter(line => line && !line.startsWith('#'))
        .reduce((acc, line) => {
            const idx = line.indexOf('=');
            if (idx > 0) {
                const key = line.substring(0, idx).trim();
                const val = line.substring(idx + 1).trim();
                acc[key] = val;
            }
            return acc;
        }, {});
}

// Keys to bypass or not push
const ignoreKeys = ['PORT', 'VERCEL_OIDC_TOKEN'];

console.log("Starting missing env variable sync to Vercel...");
let addedCount = 0;

for (const [key, val] of Object.entries(localEnv)) {
    if (ignoreKeys.includes(key)) continue;

    if (!(key in vercelEnv)) {
        console.log(`Missing key found: ${key}, pushing to Vercel...`);
        try {
            // Using vercel.cmd with shell: true for Windows
            execSync(`npx vercel env add ${key} production,preview,development`, {
                input: val,
                stdio: ['pipe', 'inherit', 'inherit'],
                shell: true
            });
            addedCount++;
        } catch (e) {
            console.error(`Failed to push ${key}:`, e.message);
        }
    }
}

console.log(`Completed. Added ${addedCount} environment variables.`);
