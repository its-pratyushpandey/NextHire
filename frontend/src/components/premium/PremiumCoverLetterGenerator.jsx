import React, { useState } from "react";
import { generateCoverLetter } from "@/services/ai/coverLetterClient";
import { Sparkles, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const PremiumCoverLetterGenerator = ({ resumeText, jobTitle }) => {
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setCoverLetter("");
    try {
      const data = await generateCoverLetter(jobTitle, resumeText);
      setCoverLetter(data.coverLetter);
    } catch {
      setCoverLetter("Failed to generate cover letter. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-7 h-7 text-purple-500 animate-pulse" />
        <h2 className="text-2xl font-bold text-purple-700">AI Cover Letter Generator</h2>
        <BadgeCheck className="w-6 h-6 text-green-500" />
      </div>
    <Button
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow hover:scale-105 transition-all"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Cover Letter"}
    </Button>  
      {coverLetter && (
        <div className="mt-6 bg-white rounded-lg p-4 shadow border border-purple-100">
          <h3 className="font-semibold mb-2 text-purple-700">Your Cover Letter:</h3>
          <pre className="whitespace-pre-wrap text-gray-700">{coverLetter}</pre>
        </div>
      )}
    </div>
  );
};

export default PremiumCoverLetterGenerator;