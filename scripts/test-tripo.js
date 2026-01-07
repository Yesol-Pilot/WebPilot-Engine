
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const TRIPO_API_KEY = 'tsk_FuVmMtg1JRerslLpmI_9BJpGjKc49WLkViclW2b-RS1'; // Hardcoded for verification
const API_URL = 'https://api.tripo3d.ai/v2/openapi/task';

async function testTripo() {
    console.log(`Testing Tripo API with Key: ${TRIPO_API_KEY ? TRIPO_API_KEY.substring(0, 5) + '...' : 'None'}`);

    if (!TRIPO_API_KEY) {
        console.error('No API Key found.');
        return;
    }

    try {
        console.log('Initiating task for prompt: "simple wooden chair"');
        const res = await axios.post(API_URL, {
            type: 'text_to_model',
            prompt: 'simple wooden chair'
        }, {
            headers: {
                Authorization: `Bearer ${TRIPO_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Task Creation Response:', res.status, res.statusText);
        console.log('Data:', JSON.stringify(res.data, null, 2));

        if (res.data.code !== 0) {
            console.error('API Error Code:', res.data.code, res.data.message);
            return;
        }

        const taskId = res.data.data.task_id;
        console.log(`Task Started! ID: ${taskId}`);
        console.log('Waiting 5 seconds to check status...');

        await new Promise(r => setTimeout(r, 5000));

        const statusRes = await axios.get(`${API_URL}/${taskId}`, {
            headers: { Authorization: `Bearer ${TRIPO_API_KEY}` }
        });

        console.log('Status Check:', statusRes.data.data.status);
        console.log('Full Status Data:', JSON.stringify(statusRes.data, null, 2));

    } catch (e) {
        console.error('Request Failed:', e.message);
        if (e.response) {
            console.error('Response Status:', e.response.status);
            console.error('Response Data:', JSON.stringify(e.response.data, null, 2));
        }
    }
}

testTripo();
