const axios = require('axios');

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

// Helper to get CoinGecko ID from symbol (simplified mapping)
// In a real app, you'd search or have a more comprehensive map
const symbolToId = {
    'btc': 'bitcoin',
    'eth': 'ethereum',
    'sol': 'solana',
    'ada': 'cardano',
    'doge': 'dogecoin',
    'dot': 'polkadot',
    'matic': 'matic-network'
};

const getCoinData = async (symbol) => {
    const retries = 3;
    let delay = 2000;

    for (let i = 0; i < retries; i++) {
        try {
            const id = symbolToId[symbol.toLowerCase()] || symbol.toLowerCase();

            const response = await axios.get(`${COINGECKO_API_URL}/simple/price`, {
                params: {
                    ids: id,
                    vs_currencies: 'usd',
                    include_24hr_change: true,
                    include_market_cap: true,
                    include_24hr_vol: true
                }
            });

            if (!response.data[id]) {
                throw new Error(`Data not found for symbol: ${symbol}`);
            }

            const data = response.data[id];
            return {
                price: data.usd,
                change24h: data.usd_24h_change,
                marketCap: data.usd_market_cap,
                volume24h: data.usd_24h_vol
            };
        } catch (error) {
            if (error.response && error.response.status === 429 && i < retries - 1) {
                console.log(`CoinGecko rate limit hit. Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
            } else {
                console.error('Error fetching coin data:', error.message || error);
                throw error;
            }
        }
    }
};

const getCryptoNews = async (symbol) => {
    // CoinGecko news endpoint is often limited or requires pro.
    // We'll mock this for now or use a free alternative if available.
    // For this demo, we'll return generic recent headlines relevant to the market.
    return [
        `Market analysis: ${symbol.toUpperCase()} shows volatility amidst global economic shifts.`,
        `Investors watching ${symbol.toUpperCase()} key resistance levels.`,
        `Regulatory discussions impact ${symbol.toUpperCase()} sentiment.`
    ];
};

module.exports = {
    getCoinData,
    getCryptoNews
};
