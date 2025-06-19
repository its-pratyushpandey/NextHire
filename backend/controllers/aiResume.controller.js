// Imports
import OpenAI from "openai";
import pdfParse from "pdf-parse";
import multer from "multer";

// OpenAI setup
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Analyze resume controller
export const analyzeResume = async (req, res) => {
  try {
    // Check file
    if (!req.file) {
      return res.status(400).json({ message: "No resume file uploaded" });
    }
    // Parse PDF
    const data = await pdfParse(req.file.buffer);
    const resumeText = data.text;
    const jobDescription = req.body.jobDescription || "";

    // Build prompt
    const prompt = `Analyze this resume for job fit.\nResume: ${resumeText}\nJob Description: ${jobDescription}\nGive:\n- Match score (0-100)\n- Key skills\n- Recommendations`;

    // OpenAI call
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });
    const analysis = completion.choices[0].message.content;
    // Parse response
    let matchScore = null, skills = [], recommendations = [], experience = {};
    try {
      // Extract score
      const scoreMatch = analysis.match(/Match score\s*[:\-]?\s*(\d+)/i);
      matchScore = scoreMatch ? parseInt(scoreMatch[1]) : null;
      // Extract skills
      const skillsMatch = analysis.match(/Key skills\s*[:\-]?\s*([\s\S]*?)\nRecommendations/i);
      if (skillsMatch) {
        skills = skillsMatch[1].split(/,|\n|•/).map(s => s.trim()).filter(Boolean);
      }
      // Extract recommendations
      const recMatch = analysis.match(/Recommendations\s*[:\-]?\s*([\s\S]*)/i);
      if (recMatch) {
        recommendations = recMatch[1].split(/\n|•/).map(r => r.trim()).filter(Boolean);
      }
      // Extract experience
      const expMatch = analysis.match(/Experience\s*[:\-]?\s*([\s\S]*?)(\n|$)/i);
      if (expMatch) {
        experience = { summary: expMatch[1].trim() };
      }
    } catch (e) {
      // fallback
    }
    // Send result
    res.json({ matchScore, skills, recommendations, experience, raw: analysis });
  } catch (err) {
    // Error
    res.status(500).json({ message: "Failed to analyze resume", error: err.message });
  }
};
