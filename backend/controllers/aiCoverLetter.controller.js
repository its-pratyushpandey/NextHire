import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateCoverLetter = async (req, res) => {
  try {
    const { jobTitle, resumeText } = req.body;
    if (!jobTitle || !resumeText) {
      return res.status(400).json({ message: "Missing jobTitle or resumeText" });
    }

    const prompt = `Write a professional cover letter for the job "${jobTitle}" based on this resume:\n${resumeText}`;
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });

    res.json({ coverLetter: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate cover letter", error: err.message });
  }
};