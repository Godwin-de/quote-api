export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: "Generate a short random inspirational quote and not use repetitive quotes. At least 5 to 10 words maximum"
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
    res.status(200).json({ quote: quoteText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
