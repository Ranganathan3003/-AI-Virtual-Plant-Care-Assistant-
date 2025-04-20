const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require('openai');
const path = require('path');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/advice', async (req, res) => {
  const { plantName, plantIssue } = req.body;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful plant care assistant.'
        },
        {
          role: 'user',
          content: `My plant "${plantName}" has this issue: "${plantIssue}". What should I do?`
        }
      ],
      max_tokens: 200
    });

    const advice = response.data.choices[0].message.content;
    res.json({ advice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ advice: 'Failed to get response from AI.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});