const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("🎉 Surprise Suggestion Backend is running!");
});

app.post("/api/suggestions", async (req, res) => {
  const { category, hint, budget } = req.body;

  const prompt = `Give creative, specific and fun gift suggestions for the following:\nCategory: ${category}\nHint: ${hint}\nBudget: ${budget}\nSuggestions:`;

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-large", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });

    if (!response.ok) {
      console.error("❌ AI Error:", await response.text());
      return res.status(500).json({ suggestions: "⚠️ AI failed to generate suggestions." });
    }

    const result = await response.json();
    const suggestions = result[0]?.generated_text || "⚠️ AI returned no suggestions.";
    res.json({ suggestions });
  } catch (err) {
    console.error("❌ AI Error:", err.message);
    res.status(500).json({ suggestions: "⚠️ Error generating suggestions." });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
