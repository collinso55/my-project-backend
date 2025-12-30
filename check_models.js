const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // For some SDK versions, we might need to use the model manager or just try a known model.
        // But the error message suggested calling ListModels.
        // The Node SDK doesn't always expose listModels directly on the main class in older versions,
        // but let's try to infer it or just test a few common ones.

        // Actually, the error message said: "Call ListModels to see the list of available models"
        // In the Node SDK, this is often done via the API directly or a specific method.
        // Let's try a simple generation with 'gemini-pro' and 'gemini-1.5-flash' and 'gemini-1.0-pro' to see which one works.

        const modelsToTest = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro", "gemini-1.5-pro"];

        console.log("Testing models...");

        for (const modelName of modelsToTest) {
            console.log(`\nTesting ${modelName}...`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                console.log(`SUCCESS: ${modelName} works! Response: ${result.response.text()}`);
                return; // Exit after finding a working one
            } catch (error) {
                console.log(`FAILED: ${modelName} - ${error.message}`);
            }
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
