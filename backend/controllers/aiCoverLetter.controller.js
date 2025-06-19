// Import OpenAI
import OpenAI from "openai";

// Init OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Controller function
export const generateCoverLetter = async (req, res) => {
  try {
    // Get input
    const { jobTitle, resumeText } = req.body;
    if (!jobTitle || !resumeText) {
      return res.status(400).json({ message: "Missing jobTitle or resumeText" });
    }

    // Build prompt
    const prompt = `Write a professional cover letter for the job "${jobTitle}" based on this resume:\n${resumeText}`;
    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });

    // Send result
    res.json({ coverLetter: completion.choices[0].message.content });
  } catch (err) {
    // Error response
    res.status(500).json({ message: "Failed to generate cover letter", error: err.message });
  }
};