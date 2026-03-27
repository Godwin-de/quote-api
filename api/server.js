export default async function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const GEMINI_KEY = process.env.GEMINI_KEY;

  if (!GEMINI_KEY) {
    return res.status(500).json({ error: "GEMINI_KEY is not set" });
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
    
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

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const quoteText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!quoteText) throw new Error("No quote found");

    res.status(200).json({ quote: quoteText });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
