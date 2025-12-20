const { getCoinData } = require('./services/coinGeckoService');

async function test() {
    try {
        console.log("Fetching data for bitcoin...");
        const data = await getCoinData('bitcoin');
        console.log("Success:", data);
    } catch (error) {
        console.error("Full Error Object:", error);
        if (error.response) {
            console.error("Response Status:", error.response.status);
            console.error("Response Data:", error.response.data);
        }
    }
}

test();
