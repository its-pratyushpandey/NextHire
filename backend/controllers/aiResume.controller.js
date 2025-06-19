import OpenAI from "openai";
import pdfParse from "pdf-parse";
import multer from "multer";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume file uploaded" });
    }
    // Parse PDF
    const data = await pdfParse(req.file.buffer);
    const resumeText = data.text;
    const jobDescription = req.body.jobDescription || "";

    const prompt = `Analyze this resume for job fit.\nResume: ${resumeText}\nJob Description: ${jobDescription}\nGive:\n- Match score (0-100)\n- Key skills\n- Recommendations`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });
    const analysis = completion.choices[0].message.content;
    // Try to parse the response into structured data
    let matchScore = null, skills = [], recommendations = [], experience = {};
    try {
      // Use regex to extract fields (simple demo, improve as needed)
      const scoreMatch = analysis.match(/Match score\s*[:\-]?\s*(\d+)/i);
      matchScore = scoreMatch ? parseInt(scoreMatch[1]) : null;
      const skillsMatch = analysis.match(/Key skills\s*[:\-]?\s*([\s\S]*?)\nRecommendations/i);
      if (skillsMatch) {
        skills = skillsMatch[1].split(/,|\n|•/).map(s => s.trim()).filter(Boolean);
      }
      const recMatch = analysis.match(/Recommendations\s*[:\-]?\s*([\s\S]*)/i);
      if (recMatch) {
        recommendations = recMatch[1].split(/\n|•/).map(r => r.trim()).filter(Boolean);
      }
      // Optionally extract experience if present
      const expMatch = analysis.match(/Experience\s*[:\-]?\s*([\s\S]*?)(\n|$)/i);
      if (expMatch) {
        experience = { summary: expMatch[1].trim() };
      }
    } catch (e) {
      // fallback to raw analysis
    }
    res.json({ matchScore, skills, recommendations, experience, raw: analysis });
  } catch (err) {
    res.status(500).json({ message: "Failed to analyze resume", error: err.message });
  }
};
