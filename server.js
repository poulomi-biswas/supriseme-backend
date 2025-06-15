const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// POST route to get suggestions
app.post('/api/suggestions', async (req, res) => {
  const { hint, category, budget } = req.body;

  const prompt = `Suggest 5 surprise gift ideas in the "${category}" category under a budget of "${budget}". Hint: ${hint}. Respond in short bullet points.`;

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/google/flan-t5-large',
      {
        inputs: prompt
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`
        }
      }
    );

    const generatedText = response.data[0]?.generated_text || "⚠️ Hugging Face did not return a response.";
    res.json({ suggestions: generatedText });
  } catch (error) {
    console.error('AI Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'AI suggestion failed.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
