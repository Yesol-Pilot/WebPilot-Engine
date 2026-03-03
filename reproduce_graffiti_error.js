const fetch = require('node-fetch');

async function testGraffitiSearch() {
    try {
        console.log('Testing /api/assets/search with query "graffiti"...');
        const response = await fetch('http://localhost:8090/api/assets/search?query=graffiti&limit=3');

        console.log(`Status: ${response.status} ${response.statusText}`);

        const text = await response.text();
        console.log('Response body:', text);

    } catch (error) {
        console.error('Error during fetch:', error);
    }
}

testGraffitiSearch();
