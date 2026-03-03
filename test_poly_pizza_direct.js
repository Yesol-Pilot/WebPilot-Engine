const https = require('https');

const apiKey = '74392407dfdd4e599cbfc24be2017969';

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'X-Auth-Token': apiKey
            }
        };
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, statusText: res.statusMessage, body: data }));
        }).on('error', (err) => reject(err));
    });
}

async function test() {
    console.log("Testing Poly Pizza API...");

    // 1. Keyword + License multiple
    try {
        console.log('Testing keyword + license=cc0,cc-by');
        const res = await fetchUrl('https://api.poly.pizza/v1/search?keyword=cat&format=gltf&limit=3&license=cc0,cc-by');
        console.log(`Query 'cat': ${res.status} ${res.statusText}`);
        if (res.status !== 200) console.log('Body:', res.body);
    } catch (e) { console.error('Error cat:', e); }

    // 2. Query (q) + License
    try {
        console.log('Testing q + license=cc0');
        const res = await fetchUrl('https://api.poly.pizza/v1/search?q=graffiti&format=gltf&limit=3&license=cc0');
        console.log(`Query 'graffiti (q)': ${res.status} ${res.statusText}`);
        if (res.status !== 200) console.log('Body:', res.body);
    } catch (e) { console.error('Error graffiti:', e); }
}

test();
