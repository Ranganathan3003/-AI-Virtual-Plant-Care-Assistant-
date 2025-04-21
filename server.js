const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.post('/api/advice', async (req, res) => {
  const { plantName, plantIssue } = req.body;

  const prompt = `My plant "${plantName}" has this issue: "${plantIssue}". What should I do?`;

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/gpt2', // You can change to another model
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
      }
    );

    const advice = response.data?.[0]?.generated_text || 'No advice received.';
    res.json({ advice });

  } catch (err) {
    console.error('Error fetching from Hugging Face:', err.message);
    res.status(500).json({ advice: 'Failed to get response from AI.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
