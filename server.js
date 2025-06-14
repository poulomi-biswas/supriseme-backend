const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/suggestions', async (req, res) => {
  const { hint, category, budget } = req.body;

  try {
    const prompt = `Suggest 5 surprise gift ideas in the "${category}" category under a budget of "${budget}". Hint: ${hint}. Respond in short bullet points.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',  // or 'gpt-4' if your key has access
      messages: [{ role: 'user', content: prompt }]
    });

    const aiText = completion.choices[0].message.content;
    res.json({ suggestions: aiText });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'AI suggestion failed.' });
  }
});

app.listen(3000, () => {
  console.log('✅ Server running at http://localhost:3000');
});
