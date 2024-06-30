const express = require('express');
const cors = require('cors');
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = "AIzaSyDzs4SBT7xodw4gBfeXdHyeI7YFOQsAHnQ";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

const app = express();
const port = 3000;

// Use CORS middleware
app.use(cors());

app.use(express.json());

app.post('/ask', async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).send({ error: 'Question is required' });
    }

    try {
        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });

        const result = await chatSession.sendMessage(question);
        res.send({ answer: result.response.text() });
    } catch (error) {
        console.error('Error asking question:', error);
        res.status(500).send({ error: 'Failed to get a response from the AI' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
