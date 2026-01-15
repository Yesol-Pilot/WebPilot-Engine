const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const TRIPO_API_KEY = process.env.NEXT_PUBLIC_TRIPO_API_KEY;
const taskId = 'dd444913-9e64-4bc0-905d-d7248fe27667';
const API_URL = `https://api.tripo3d.ai/v2/openapi/task/${taskId}`;

async function test() {
    try {
        const res = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${TRIPO_API_KEY}` }
        });
        console.log("Output Structure:", JSON.stringify(res.data.data.output, null, 2));
    } catch (e) {
        console.error("Error:", e.response?.data || e.message);
    }
}

test();
