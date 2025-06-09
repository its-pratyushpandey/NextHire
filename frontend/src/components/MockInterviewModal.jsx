import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const MockInterviewModal = ({ open, onClose, jobTitle, jobRequirements }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tested, setTested] = useState(false);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const fetchQuestions = async () => {
    setLoading(true);
    setQuestions([]);
    setTested(false);
    setError('');
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    try {
      const res = await fetch('/api/v1/ai/interview-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: `${jobTitle}${jobRequirements?.length ? ' (' + jobRequirements.join(', ') + ')' : ''}`
        }),
      });
      const data = await res.json();
      if (res.ok && data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setTested(true);
      } else {
        setError(data.error || 'Could not fetch questions. Please try again later.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (qIdx, option) => {
    setAnswers(prev => ({ ...prev, [qIdx]: option }));
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <DialogTitle>Premium Mock Interview</DialogTitle>
        <DialogDescription>
          Get AI-powered MCQ mock interview questions tailored to this job.
        </DialogDescription>
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-4 flex items-center gap-3">
          <Sparkles className="text-white w-6 h-6" />
          <h2 className="text-white text-lg font-bold flex-1">Premium Mock Interview</h2>
          <Button variant="ghost" onClick={onClose} className="text-white">Close</Button>
        </div>
        <div className="p-6 bg-white dark:bg-gray-900">
          <div className="mb-4">
            <div className="font-semibold text-gray-700 dark:text-gray-200">
              Get AI-powered MCQ mock interview questions for:
            </div>
            <div className="text-purple-600 dark:text-purple-300 font-bold text-lg">
              {jobTitle}
            </div>
            {jobRequirements?.length > 0 && (
              <div className="text-sm text-gray-500 mt-1">
                <span className="font-medium">Requirements:</span> {jobRequirements.join(', ')}
              </div>
            )}
          </div>
          <Button
            onClick={fetchQuestions}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold mb-4"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
            {tested ? 'Regenerate Questions' : 'Get Mock Questions'}
          </Button>
          <div className="space-y-6 min-h-[120px] max-h-72 overflow-y-auto pr-2">
            {error && (
              <div className="p-4 rounded bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                {error}
              </div>
            )}
            {questions.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded bg-purple-50 dark:bg-purple-900/20 text-gray-800 dark:text-gray-100"
              >
                <div className="font-semibold mb-2">{i + 1}. {q.text}</div>
                <div className="space-y-2">
                  {q.options.map((opt, j) => (
                    <label key={j} className={`flex items-center gap-2 cursor-pointer ${answers[i] === opt ? 'font-bold text-purple-700' : ''}`}>
                      <input
                        type="radio"
                        name={`question-${i}`}
                        value={opt}
                        checked={answers[i] === opt}
                        onChange={() => handleOptionSelect(i, opt)}
                        className="accent-purple-600"
                        disabled={submitted}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          {questions.length > 0 && !submitted && (
            <Button
              onClick={handleSubmit}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold shadow-lg hover:scale-105 transition-all"
            >
              Submit Answers
            </Button>
          )}
          {submitted && (
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-center shadow-lg">
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-200 mb-2">Your Score: {score} / {questions.length}</div>
              <div className="text-lg text-gray-700 dark:text-gray-300">Premium Result: {score === questions.length ? 'Excellent!' : score > 0 ? 'Good try! Review the correct answers.' : 'Keep practicing!'}</div>
              <Button onClick={onClose} className="mt-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold">Close</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MockInterviewModal;