const axios = require('axios');

async function testAPIs() {
    const baseURL = 'http://localhost:3002'; // Using port 3002 as seen in logs

    try {
        console.log('Testing /api/debug/env...');
        const envRes = await axios.get(`${baseURL}/api/debug/env`);
        console.log('Env Result:', envRes.data);
    } catch (e) {
        console.error('Env Error:', e.response?.data || e.message);
    }

    try {
        console.log('\nTesting /api/chat/npc...');
        const chatRes = await axios.post(`${baseURL}/api/chat/npc`, {
            npcDescription: "A friendly shopkeeper",
            history: [],
            userInput: "Hello there!"
        });
        console.log('Chat Result:', chatRes.data);
    } catch (e) {
        console.error('Chat Error:', e.response?.data || e.message);
    }
}

testAPIs();
