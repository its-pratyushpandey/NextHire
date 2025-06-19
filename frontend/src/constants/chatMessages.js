export const CHAT_MESSAGES = {
  recruiter: {
    jobPosting: [
      {
        question: "How do I create an effective job posting?",
        answer: "To create an effective job posting: 1) Write a clear job title 2) Include key responsibilities 3) List required and preferred qualifications 4) Describe your company culture 5) Specify salary range and benefits 6) Add keywords for better visibility",
        suggestions: ["Job post templates", "Best practices", "Optimize visibility"]
      },
      {
        question: "What are the best practices for screening candidates?",
        answer: "Best practices include: 1) Create a structured evaluation process 2) Use standardized questions 3) Focus on both technical and soft skills 4) Check references thoroughly 5) Document your assessments 6) Use skill assessment tools",
        suggestions: ["Evaluation templates", "Interview questions", "Assessment tools"]
      },
      // Add more recruiter-specific Q&As...
    ],
    hiring: [
      {
        question: "How can I improve my hiring process?",
        answer: "Improve your hiring process by: 1) Defining clear job requirements 2) Using AI-powered candidate matching 3) Implementing structured interviews 4) Setting up efficient communication channels 5) Getting team feedback 6) Making data-driven decisions",
        suggestions: ["Process optimization", "AI matching", "Interview techniques"]
      }
    ],
    analytics: [
      {
        question: "How do I interpret recruitment analytics?",
        answer: "Key metrics to focus on: 1) Time-to-hire 2) Cost-per-hire 3) Source quality 4) Acceptance rate 5) Candidate experience scores 6) Retention rates. Our platform provides detailed visualizations for each metric.",
        suggestions: ["Key metrics", "Performance tracking", "Data insights"]
      }
    ]
  },
  jobSeeker: {
    application: [
      {
        question: "How can I make my application stand out?",
        answer: "To stand out: 1) Customize your resume for each role 2) Write a compelling cover letter 3) Highlight relevant achievements 4) Show measurable results 5) Include keywords from the job description 6) Demonstrate cultural fit",
        suggestions: ["Resume tips", "Cover letter help", "Keywords optimization"]
      }
    ],
    interview: [
      {
        question: "How should I prepare for technical interviews?",
        answer: "Prepare by: 1) Reviewing common technical questions 2) Practicing coding challenges 3) Understanding the company's tech stack 4) Preparing project examples 5) Studying system design concepts 6) Mock interviews",
        suggestions: ["Technical prep", "Mock interview", "Project portfolio"]
      }
    ],
    career: [
      {
        question: "What's the best way to negotiate salary?",
        answer: "For successful negotiation: 1) Research market rates 2) Know your value 3) Consider total compensation 4) Practice your pitch 5) Be professional and confident 6) Get offers in writing",
        suggestions: ["Salary research", "Negotiation tips", "Benefits discussion"]
      }
    ]
  }
};

export const PREMIUM_FEATURES = {
  aiAssistant: {
    enabled: true,
    capabilities: [
      "Real-time resume analysis",
      "Interview preparation",
      "Salary insights",
      "Career path guidance",
      "Skills assessment",
      "Market trends analysis"
    ]
  },
  chatFeatures: {
    instantResponse: true,
    fileSharing: true,
    voiceMessages: true,
    videoChat: true,
    screenSharing: true,
    analyticsTracking: true
  }
};