const axios = require('axios');

async function testGeminiAPI() {
    console.log('Testing Gemini API at http://localhost:8081/api/analyze ...');

    // 1x1 pixel PNG transparent base64
    const dummyImage = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKwjwAAAAABJRU5ErkJggg==";

    try {
        const response = await axios.post('http://localhost:8081/api/analyze', {
            image: "data:image/png;base64," + dummyImage,
            prompt: "Test prompt for debugging 500 error"
        });

        console.log('✅ Success!');
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('❌ Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            // Log only the error message from the response data to avoid truncation
            const data = error.response.data;
            if (data && data.error) {
                console.error('API Error Message:', data.error.message || data.error);
            } else {
                console.error('Data:', JSON.stringify(data));
            }
        } else {
            console.error('Error:', error.message);
        }
    }
}

testGeminiAPI();
