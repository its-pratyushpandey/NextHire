import OpenAI from "openai";
import pdfParse from "pdf-parse";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const parseResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ message: "OpenAI API key is missing in server environment." });
    }

    console.log("OPENAI_API_KEY loaded:", !!process.env.OPENAI_API_KEY);

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    const prompt = `
      Extract the following from this resume:
      - Full Name
      - Email
      - Phone Number
      - Skills (as array)
      - Education (as array)
      - Experience (as array)
      - LinkedIn URL (if present)
      - Summary/Bio

      Resume:
      ${resumeText}

      Respond in JSON format with keys: fullname, email, phoneNumber, skills, education, experience, linkedIn, bio.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
    });

    const aiText = completion.choices[0].message.content;
    let parsed;
    try {
      parsed = JSON.parse(aiText);
    } catch (e) {
      return res.status(500).json({ message: "AI response parsing failed", aiText });
    }

    fs.unlinkSync(req.file.path);

    res.json({ ...parsed, success: true });
  } catch (err) {
    res.status(500).json({ message: "Resume parsing failed", error: err.message });
  }
};