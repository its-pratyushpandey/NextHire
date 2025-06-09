import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

const InterviewBot = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    setQuestions([]);
    try {
      // Replace with your AI API endpoint or OpenAI integration
      const res = await fetch('/api/ai/interview-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle }),
      });
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (e) {
      setQuestions(['Sorry, could not fetch questions.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Live Interview Preparation Bot</h2>
      <input
        type="text"
        className="w-full p-2 mb-4 rounded border"
        placeholder="Enter job title (e.g. Frontend Developer)"
        value={jobTitle}
        onChange={e => setJobTitle(e.target.value)}
      />
      <Button onClick={fetchQuestions} disabled={loading || !jobTitle}>
        {loading ? <Loader2 className="animate-spin" /> : 'Get Mock Questions'}
      </Button>
      <div className="mt-6 space-y-3">
        {questions.map((q, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded bg-purple-50 dark:bg-purple-900/20"
          >
            {q}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InterviewBot;