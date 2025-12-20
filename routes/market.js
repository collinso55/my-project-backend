const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');

router.get('/explain/:symbol', marketController.getMarketExplanation);
router.post('/risk', marketController.assessRisk);
router.post('/diversify', marketController.suggestDiversification);
router.get('/news-impact/:symbol', marketController.analyzeNewsImpact);
router.post('/watchlist', marketController.addToWatchlist);

module.exports = router;
