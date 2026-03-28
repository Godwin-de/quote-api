import express from "express";
import cors from "cors";
const app = express();
app.use(cors());

const GROQ_KEY = process.env.GROQ_KEY;

app.get("/quote", async (req, res) => {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: "Generate a short inspirational quote. Atleast 20 words maximum"
          }
        ],
        max_tokens: 100
      })
    });
    const data = await response.json();
    const quoteText = data?.choices?.[0]?.message?.content
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
