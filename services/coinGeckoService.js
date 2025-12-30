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
                // Fallback to mock data
                console.log(`Returning mock data for ${symbol}`);
                return {
                    price: 50000, // Mock price
                    change24h: 2.5,
                    marketCap: 1000000000,
                    volume24h: 50000000
                };
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

const getMarketOverview = async () => {
    // Fetch top 10 coins by market cap
    try {
        const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 10,
                page: 1,
                sparkline: false,
                price_change_percentage: '24h'
            }
        });

        return response.data.map(coin => ({
            id: coin.id,
            symbol: coin.symbol,
            name: coin.name,
            price: coin.current_price,
            change24h: coin.price_change_percentage_24h,
            image: coin.image,
            marketCap: coin.market_cap
        }));
    } catch (error) {
        console.error('Error fetching market overview:', error.message);
        // Fallback to individual fetches if markets endpoint fails (or rate limited)
        // For now, return empty array or throw
        console.error('Error fetching market overview:', error.message);
        // Fallback to mock data if CoinGecko fails
        return [
            { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', price: 98450.00, change24h: 2.5, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', marketCap: 1200000000000 },
            { id: 'ethereum', symbol: 'eth', name: 'Ethereum', price: 3890.50, change24h: -1.2, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', marketCap: 400000000000 },
            { id: 'solana', symbol: 'sol', name: 'Solana', price: 145.20, change24h: 5.8, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', marketCap: 65000000000 },
            { id: 'cardano', symbol: 'ada', name: 'Cardano', price: 0.45, change24h: 1.2, image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png', marketCap: 15000000000 },
            { id: 'ripple', symbol: 'xrp', name: 'XRP', price: 0.62, change24h: -0.5, image: 'https://assets.coingecko.com/coins/images/44/large/xrp.png', marketCap: 34000000000 }
        ];
    }
};

module.exports = {
    getCoinData,
    getCryptoNews,
    getMarketOverview
};
