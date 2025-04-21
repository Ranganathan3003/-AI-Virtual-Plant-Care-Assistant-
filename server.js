const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');

// Load .env variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const MODEL_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1'; // Better model

app.use(bodyParser.json());
app.use(express.static(__dirname));

// Endpoint to get plant advice
app.post('/api/advice', async (req, res) => {
  const { plantName, plantIssue } = req.body;

  if (!plantName || !plantIssue) {
    return res.status(400).json({ advice: 'Missing plant name or issue.' });
  }

  const prompt = `My plant "${plantName}" has this issue: "${plantIssue}". What should I do?`;

  try {
    const response = await axios.post(
      MODEL_URL,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Raw Hugging Face response:', response.data);

    const advice = response.data?.[0]?.generated_text || 'Sorry, no advice was generated.';
    res.json({ advice });

  } catch (err) {
    console.error('❌ Hugging Face API error:', err.response?.data || err.message);
    res.status(500).json({ advice: 'Failed to get response from AI.' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
