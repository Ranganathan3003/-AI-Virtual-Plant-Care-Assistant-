const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const path = require('path');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/advice', async (req, res) => {
  const { plantName, plantIssue } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful plant care assistant.' },
        { role: 'user', content: `My plant "${plantName}" has this issue: "${plantIssue}". What should I do?` },
      ],
      max_tokens: 200,
    });

    const advice = response.choices[0].message.content;
    res.json({ advice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ advice: 'Failed to get response from AI.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
