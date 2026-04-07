import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing from environment variables.");
    }

    const { history, message } = req.body;
    
    // Initialize the Gemini API client securely on the server
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Start chat with the provided history from the client
    const chat = model.startChat({
        history: history || [],
    });

    // Send the new message and await the response
    const result = await chat.sendMessage(message);
    const text = result.response.text();

    // Return the response text to the frontend
    return res.status(200).json({ text });
    
  } catch (error) {
    console.error("Gemini API Error in backend:", error);
    return res.status(500).json({ error: error.message || "Failed to generate AI response." });
  }
}
