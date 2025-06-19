export const CHAT_RESPONSES = {
  recruiter: {
    job_posting: [
      { 
        text: "I can help you create an effective job posting. Would you like to:",
        suggestions: ["Create new job post", "Get posting tips", "See templates"]
      },
      {
        text: "Here's how to optimize your job posting: 1) Use clear job titles 2) List key requirements 3) Include salary range 4) Add company benefits",
        suggestions: ["Show more tips", "Start posting", "View examples"]
      }
    ],
    screening: [
      {
        text: "Let me help you with candidate screening. Your current applicant pool has potential matches.",
        suggestions: ["View applicants", "Screening tools", "Setup interviews"]
      }
    ],
    hiring: [
      {
        text: "Your hiring pipeline shows several promising candidates. Need help with the next steps?",
        suggestions: ["Review candidates", "Schedule interviews", "Check analytics"]
      }
    ],
    analytics: [
      {
        text: "Here's a snapshot of your recruitment metrics:",
        suggestions: ["View full report", "Compare trends", "Export data"]
      }
    ]
  },
  jobseeker: {
    job_search: [
      {
        text: "I'll help you find relevant positions. What type of roles are you looking for?",
        suggestions: ["Search jobs", "Set alerts", "Save filters"]
      }
    ],
    application: [
      {
        text: "Let's make your application stand out. Would you like help with:",
        suggestions: ["Resume review", "Cover letter", "Application status"]
      }
    ],
    interview: [
      {
        text: "I can help you prepare for interviews. What area would you like to focus on?",
        suggestions: ["Practice questions", "Technical prep", "Interview tips"]
      }
    ]
  },
  general: [
    {
      text: "How can I assist you today?",
      suggestions: ["Explore features", "Get help", "View guides"]
    }
  ]
};

export const getResponse = (role, intent) => {
  const responses = role === 'recruiter' 
    ? CHAT_RESPONSES.recruiter[intent] || CHAT_RESPONSES.general
    : CHAT_RESPONSES.jobseeker[intent] || CHAT_RESPONSES.general;
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export const detectMessageIntent = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Recruiter intents
  if (/post|job listing|create job/i.test(lowerMessage)) return 'job_posting';
  if (/screen|candidate|applicant/i.test(lowerMessage)) return 'screening';
  if (/hire|hiring|recruit/i.test(lowerMessage)) return 'hiring';
  if (/analytics|metrics|stats/i.test(lowerMessage)) return 'analytics';
  
  // Job seeker intents
  if (/find|search|looking for/i.test(lowerMessage)) return 'job_search';
  if (/apply|application|resume/i.test(lowerMessage)) return 'application';
  if (/interview|prepare|question/i.test(lowerMessage)) return 'interview';
  
  return 'general';
};