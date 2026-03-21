import fetch from "node-fetch";

export default async function handler(req, res) {
  const GEMINI_KEY = AIzaSyA35mjsTZud4cec5bNd87HCrfB6AU26FzM; // Read from Vercel environment

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

    const body = {
      contents: [
        { parts: [{ text: "Generate a short inspirational quote." }] }
      ]
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    const quoteText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No quote";

    res.status(200).json({ quote: quoteText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
