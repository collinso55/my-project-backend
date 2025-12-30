const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
console.log("Gemini Service Initialized with model: gemini-2.0-flash");

const generateContentWithRetry = async (prompt, retries = 2, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            if (error.message.includes('429') && i < retries - 1) {
                console.log(`Quota exceeded. Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            } else {
                console.error("Gemini API Error:", error.message);
                // Fallback mock response
                return {
                    text: "AI Analysis Unavailable: The market is currently volatile. Please monitor key support and resistance levels. (Mock Response due to API Error)",
                    source: 'mock',
                    error: error.message
                };
            }
        }
    }
};

const generateExplanation = async (symbol, price, change, news) => {
    const prompt = `
    Asset: ${symbol}
    Current Price: $${price}
    24h Change: ${change.toFixed(2)}%
    Recent News: ${news.join(', ')}

    Explain why the price moved in simple terms for a beginner investor. 
    Avoid jargon. Keep it under 3 sentences.
    `;

    return await generateContentWithRetry(prompt);
};

const assessRisk = async (amount, asset, volatility, experience) => {
    const prompt = `
    User Profile: ${experience} investor
    Investment Amount: $${amount}
    Asset: ${asset}
    Asset Volatility (24h change): ${volatility}%

    Assess the risk level (Low, Moderate, High, Extreme).
    Explain the risks and potential rewards simply.
    Provide a recommendation: "Go ahead", "Proceed with caution", or "Reconsider".
    `;

    return await generateContentWithRetry(prompt);
};

const suggestDiversification = async (holdings) => {
    const prompt = `
    Current Portfolio: ${JSON.stringify(holdings)}

    Suggest a diversification strategy to reduce risk.
    Provide specific percentage allocations for a balanced portfolio (e.g., Bitcoin, Ethereum, Stablecoins, others).
    Explain why this mix is better.
    `;

    return await generateContentWithRetry(prompt);
};

const analyzeNewsImpact = async (symbol, news, priceChange) => {
    const prompt = `
    Asset: ${symbol}
    Price Change: ${priceChange}%
    News: ${news.join(', ')}

    Analyze how the news likely impacted the price.
    Predict short-term sentiment (Bullish, Bearish, Neutral).
    `;

    return await generateContentWithRetry(prompt);
};

module.exports = {
    generateExplanation,
    assessRisk,
    suggestDiversification,
    analyzeNewsImpact
};
