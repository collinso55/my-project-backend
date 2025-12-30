const axios = require('axios');
require('dotenv').config();

async function getModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API Key found in .env");
        return;
    }

    try {
        const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        console.log("Available Models:");
        const models = response.data.models;
        if (models && models.length > 0) {
            models.forEach(model => {
                if (model.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${model.name} (Supported)`);
                } else {
                    console.log(`- ${model.name} (Not for content generation)`);
                }
            });
        } else {
            console.log("No models found.");
        }
    } catch (error) {
        console.error("Error fetching models:", error.response ? error.response.data : error.message);
    }
}

getModels();
