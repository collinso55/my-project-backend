const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');

router.get('/explain/:id', marketController.getMarketExplanation);
router.get('/overview', marketController.getMarketOverview);
router.post('/risk', marketController.assessRisk);
router.post('/diversify', marketController.suggestDiversification);
router.get('/news-impact/:symbol', marketController.analyzeNewsImpact);
router.post('/watchlist', marketController.addToWatchlist);
router.post('/alerts', marketController.createPriceAlert);

module.exports = router;
