const https = require('https');

const API_HOST = 'web-pilot-engine.vercel.app';
const LOG_PATH = '/api/monitor/log';
const USAGE_PATH = '/api/monitor/usage';

async function logUsage(provider, count) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ provider, count });
        const options = {
            hostname: API_HOST,
            path: LOG_PATH,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log(`✅ Logged ${count} usage for ${provider}`);
                    resolve();
                } else {
                    console.error(`❌ Failed to log for ${provider}: ${res.statusCode} ${body}`);
                    resolve(); // Resolve anyway to continue
                }
            });
        });

        req.on('error', (e) => {
            console.error(`❌ Request Error: ${e.message}`);
            resolve();
        });

        req.write(data);
        req.end();
    });
}

async function checkUsage() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: API_HOST,
            path: USAGE_PATH,
            method: 'GET'
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const data = JSON.parse(body);
                        console.log('📊 Current Usage Stats:', JSON.stringify(data.services, null, 2));
                    } catch (e) {
                        console.error('❌ Invalid JSON:', body);
                    }
                } else {
                    console.error(`❌ Failed to fetch usage: ${res.statusCode} ${body}`);
                }
                resolve();
            });
        });

        req.end();
    });
}

async function run() {
    console.log('🚀 Starting Usage Simulation...');

    // Simulate some usage
    await logUsage('tripo', 5);
    await logUsage('blockade', 12);
    await logUsage('eleven', 350); // Simulating 350 chars

    console.log('⏳ Waiting for propagation (3s)...');
    await new Promise(r => setTimeout(r, 3000));

    await checkUsage();
}

run();
