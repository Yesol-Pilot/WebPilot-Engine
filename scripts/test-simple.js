const { GoogleGenerativeAI } = require("@google/generative-ai");

// Need to load env manually since this is a standalone script
// We will just read the file or assume user passed it, actually best to read .env.local
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
let apiKey = '';
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/GEMINI_API_KEY=(.*)/);
    if (match) apiKey = match[1].trim();
}

console.log('Testing Key:', apiKey ? 'Found' : 'Not Found');

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function run() {
    try {
        const result = await model.generateContent("Hello, are you working?");
        console.log("Response:", result.response.text());
    } catch (e) {
        console.error("Error:", e.message);
    }
}

run();
