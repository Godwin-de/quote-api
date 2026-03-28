import express from "express";
import fetch from "node-fetch";
import cors from "cors";
const app = express();
app.use(cors());
const GEMINI_KEY = process.env.GEMINI_KEY;

app.get("/quote", async (req, res) => {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;
    const body = {
      contents: [{ parts: [{ text: "Generate a short inspirational quote." }] }]
    };
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await response.json();

    // Temporary debug
    // console.log("Gemini response:", JSON.stringify(data, null, 2));
    
    const quoteText = data?.candidates?.[0]?.content?.parts?.[0]?.text
      ?.replace(/^["*_]+|["*_]+$/g, "")
      .trim();
    
    if (!quoteText) throw new Error("No quote found");
    res.json({ quote: quoteText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
