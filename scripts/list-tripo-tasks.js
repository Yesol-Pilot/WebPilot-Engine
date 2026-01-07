
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Use OLD KEY as it likely holds the history
const TRIPO_API_KEY = 'tsk_Y2PDEe0ro-dJxjvPPLZsKjLfaaLnh4Hlj6ShZK4glDB';
const API_URL = 'https://api.tripo3d.ai/v2/openapi/task';

async function listTasks() {
    console.log(`Attempting to list tasks with key: ${TRIPO_API_KEY.substring(0, 5)}...`);

    try {
        // Try standard pagination params often used in such APIs
        const res = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${TRIPO_API_KEY}` },
            params: {
                page: 1,
                pageSize: 50 // Try to get more
            }
        });

        console.log('Response Status:', res.status);
        console.log('Response Data Structure:', Object.keys(res.data));

        if (res.data.code === 0 && res.data.data) {
            const data = res.data.data;
            console.log(`Success! Found data type: ${Array.isArray(data) ? 'Array' : typeof data}`);

            let tasks = [];
            if (Array.isArray(data)) {
                tasks = data;
            } else if (data.list && Array.isArray(data.list)) {
                tasks = data.list; // Common wrapper
            } else if (data.tasks && Array.isArray(data.tasks)) {
                tasks = data.tasks;
            }

            console.log(`Found ${tasks.length} tasks.`);
            tasks.forEach(t => {
                console.log(`- ${t.task_id}: ${t.prompt} (${t.status})`);
            });
        } else {
            console.log('Data:', JSON.stringify(res.data, null, 2));
        }

    } catch (e) {
        console.error('List Failed:', e.message);
        if (e.response) {
            console.error('Response:', e.response.status, e.response.data);
        }
    }
}

listTasks();
