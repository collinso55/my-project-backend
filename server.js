const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
// Middleware

app.use(cors());
app.use(express.json());
// Test route
app.get('/', (req, res) => {
    res.json({ message: 'API is running!' });
});
// Import routes here
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');
const aiRoutes = require('./routes/ai');

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/ai', aiRoutes);

const marketRoutes = require('./routes/market');
app.use('/api/market', marketRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});