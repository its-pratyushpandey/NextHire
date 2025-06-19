// import OpenAI
import OpenAI from "openai";

// init
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ai chat handler
export const aiChat = async (req, res) => {
  try {
    // get message
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Missing message" });
    }
    // model
    const model = process.env.OPENAI_MODEL || "gpt-3.5-turbo";
    // get completion
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "You are a helpful AI assistant for job seekers and recruiters." },
        { role: "user", content: message }
      ],
      max_tokens: 500,
    });
    // reply
    const reply = completion.choices?.[0]?.message?.content || "Sorry, I could not generate a response.";
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate AI response", error: err.message });
  }
};
