import axios from 'axios';

export const getInterviewQuestions = async (req, res) => {
  const { jobTitle } = req.body;
  if (!jobTitle || typeof jobTitle !== 'string' || !jobTitle.trim()) {
    return res.status(400).json({ questions: [], error: "Missing or invalid jobTitle" });
  }

  // Example MCQs for demo (replace with AI or DB in production)
  const questions = [
    {
      text: `What is a key responsibility of a ${jobTitle}?`,
      options: [
        `Managing ${jobTitle} tasks effectively`,
        "Ignoring deadlines",
        "Avoiding teamwork",
        "Delaying communication"
      ],
      answer: `Managing ${jobTitle} tasks effectively`
    },
    {
      text: `Which skill is most important for a ${jobTitle}?`,
      options: [
        "Procrastination",
        "Strong communication",
        "Lack of adaptability",
        "Disorganization"
      ],
      answer: "Strong communication"
    },
    {
      text: `How should a ${jobTitle} handle a difficult situation?`,
      options: [
        "Ignore the problem",
        "Address it professionally",
        "Blame others",
        "Delay action"
      ],
      answer: "Address it professionally"
    },
    {
      text: `What is a good way for a ${jobTitle} to stay updated with trends?`,
      options: [
        "Never learn new things",
        "Follow industry news",
        "Avoid networking",
        "Ignore feedback"
      ],
      answer: "Follow industry news"
    },
    {
      text: `Which of the following is NOT a recommended practice for a ${jobTitle}?`,
      options: [
        "Continuous learning",
        "Effective communication",
        "Missing deadlines",
        "Team collaboration"
      ],
      answer: "Missing deadlines"
    }
  ];

  res.json({ questions });
};