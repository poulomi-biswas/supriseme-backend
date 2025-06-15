const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/suggestions', async (req, res) => {
  const { hint, category, budget } = req.body;

  const prompt = `Give 5 unique surprise gift ideas in the "${category}" category under ₹${budget}. Hint: ${hint}. Reply in short bullet points.`;

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1',
      {
        inputs: prompt
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const generatedText = response.data?.generated_text || response.data[0]?.generated_text;

    if (!generatedText) {
      throw new Error('No suggestions returned from Hugging Face.');
    }

    res.json({ suggestions: generatedText });

  } catch (error) {
    console.error('❌ AI Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'AI suggestion failed.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
