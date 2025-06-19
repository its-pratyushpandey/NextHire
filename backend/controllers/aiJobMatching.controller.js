// Env setup
import dotenv from "dotenv";
dotenv.config();

// Imports
import OpenAI from "openai";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

// OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Cosine similarity
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (normA * normB);
}

// Main job matching controller
export const matchJobs = async (req, res) => {
  try {
    // Premium check
    const user = await User.findById(req.id);
    if (!user || user.subscription?.plan !== "premium") {
      return res.status(403).json({ message: "Premium feature only" });
    }

    // Get resume/profile
    const resumeText = user.resumeText || user.bio || (user.skills || []).join(", ") || "";
    if (!resumeText) return res.status(400).json({ message: "No resume/profile data found" });

    // Get jobs
    const jobs = await Job.find({ status: "active" });
    if (!jobs.length) return res.json({ jobs: [] });

    // Embeddings
    const [resumeEmbedding] = (await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: [resumeText]
    })).data.map(e => e.embedding);

    const jobDescriptions = jobs.map(j => `${j.title}\n${j.description}\n${(j.skills || []).join(", ")}`);
    const jobEmbeddings = (await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: jobDescriptions
    })).data.map(e => e.embedding);

    // Score jobs
    const scoredJobs = jobs.map((job, i) => ({
      ...job.toObject(),
      matchScore: Math.round(cosineSimilarity(resumeEmbedding, jobEmbeddings[i]) * 100)
    }));

    scoredJobs.sort((a, b) => b.matchScore - a.matchScore);

    // Respond
    res.json({ jobs: scoredJobs.slice(0, 10) });
  } catch (err) {
    res.status(500).json({ message: "Job matching failed", error: err.message });
  }
};