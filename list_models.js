const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // The SDK doesn't have a direct listModels method on the client instance in some versions, 
        // but usually we can try to just use a known model.
        // However, let's try to use the model we thought was correct and see if we can get more info or if there is a list method.
        // Actually, for the JS SDK, listing models might require a different call or might not be exposed directly in the high-level client easily without looking at docs.
        // Let's try to use 'gemini-1.0-pro' which is often the specific name.
        console.log("Trying gemini-1.0-pro...");
        const modelPro = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        const result = await modelPro.generateContent("Test");
        console.log("gemini-1.0-pro worked!");
    } catch (error) {
        console.error("Error:", error.message);
    }
}

listModels();
