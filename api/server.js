import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// Your Gemini API key (from Google AI Studio)
const GEMINI_KEY = "AIzaSyA35mjsTZud4cec5bNd87HCrfB6AU26FzM";

app.get("/quote", async (req, res) => {
  try {
    // Build query to Google Gemini text generation
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + GEMINI_KEY;

    const body = {
      "contents": [
        {
          "parts": [
            { "text": "Generate a short inspirational quote." }
          ]
        }
      ]
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    // Extract the generated text
    const quoteText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!quoteText) throw new Error("No quote found");

    res.json({ quote: quoteText });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
