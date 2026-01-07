
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const API_KEY = process.env.NEXT_PUBLIC_BLOCKADE_LABS_API_KEY;

async function debugApi() {
    console.log(`Using API Key: ${API_KEY ? API_KEY.substring(0, 5) + '...' : 'None'}`);

    try {
        console.log('Fetching first 5 requests from history...');
        const res = await axios.get('https://backend.blockadelabs.com/api/v1/imagine/myRequests?limit=5', {
            headers: { 'x-api-key': API_KEY }
        });

        const requests = res.data.data;
        if (!requests || requests.length === 0) {
            console.log('No requests found.');
            return;
        }

        console.log(`Found ${requests.length} items. Dumping first item structure:`);
        console.log(JSON.stringify(requests[0], null, 2));

        console.log('\n--- Item Statuses ---');
        requests.forEach((req, index) => {
            console.log(`[${index}] ID: ${req.id}, Status: ${req.status}, URL: ${req.file_url ? 'Yes' : 'No'}, Prompt: ${req.prompt?.substring(0, 20)}...`);
        });

    } catch (e) {
        console.error('API Request Failed:', e.message);
        if (e.response) {
            console.error('Response Data:', e.response.data);
            console.error('Response Status:', e.response.status);
        }
    }
}

debugApi();
