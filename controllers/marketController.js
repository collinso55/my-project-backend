const coinGeckoService = require('../services/coinGeckoService');
const geminiService = require('../services/geminiService');
const supabase = require('../config/supabase');

const getMarketExplanation = async (req, res) => {
    try {
        const { symbol } = req.params;
        const marketData = await coinGeckoService.getCoinData(symbol);
        const news = await coinGeckoService.getCryptoNews(symbol);

        const explanation = await geminiService.generateExplanation(
            symbol,
            marketData.price,
            marketData.change24h,
            news
        );

        res.json({
            symbol,
            price: marketData.price,
            change24h: marketData.change24h,
            explanation
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const assessRisk = async (req, res) => {
    try {
        const { amount, symbol, experience } = req.body;
        const marketData = await coinGeckoService.getCoinData(symbol);

        const riskAssessment = await geminiService.assessRisk(
            amount,
            symbol,
            marketData.change24h,
            experience
        );

        res.json({
            symbol,
            riskAssessment
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const suggestDiversification = async (req, res) => {
    try {
        const { holdings } = req.body;
        const suggestion = await geminiService.suggestDiversification(holdings);

        res.json({
            suggestion
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const analyzeNewsImpact = async (req, res) => {
    try {
        const { symbol } = req.params;
        const marketData = await coinGeckoService.getCoinData(symbol);
        const news = await coinGeckoService.getCryptoNews(symbol);

        const analysis = await geminiService.analyzeNewsImpact(
            symbol,
            news,
            marketData.change24h
        );

        res.json({
            symbol,
            analysis
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addToWatchlist = async (req, res) => {
    try {
        const { user_id, symbol, type } = req.body;

        const { data, error } = await supabase
            .from('watchlist')
            .insert([
                { user_id, symbol, type }
            ])
            .select();

        if (error) throw error;

        res.json({ message: 'Added to watchlist', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getMarketExplanation,
    assessRisk,
    suggestDiversification,
    analyzeNewsImpact,
    addToWatchlist
};
