
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
      'https://api-inference.huggingface.co/models/bigscience/bloomz-560m',
      {
        inputs: prompt,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );

    const generated = response.data[0]?.generated_text;
    res.json({ advice: generated || 'Sorry, no advice was generated.' });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ advice: 'Failed to get response from AI.' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
