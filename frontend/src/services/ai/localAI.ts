// Simple keyword-based AI response for browser compatibility
interface Responses {
  jobSearch: string;
  resume: string;
  interview: string;
  default: string;
}

const responses: Responses = {
  jobSearch: [
    "Here are some job search tips:",
    "• Update your profile",
    "• Use relevant keywords",
    "• Set up job alerts",
    "• Network professionally"
  ].join('\n'),
  resume: [
    "Here are some resume tips:",
    "• Keep it concise",
    "• Highlight achievements",
    "• Use action verbs",
    "• Proofread carefully"
  ].join('\n'),
  interview: [
    "Interview preparation tips:",
    "• Research the company",
    "• Prepare STAR answers",
    "• Dress professionally",
    "• Ask good questions"
  ].join('\n'),
  default: "I can help you with job searching, resume writing, and interview preparation. What would you like to know?"
};

function getCategory(message: string): keyof Responses {
  const msg = message.toLowerCase();
  if (msg.includes('job')) return 'jobSearch';
  if (msg.includes('resume')) return 'resume';
  if (msg.includes('interview')) return 'interview';
  return 'default';
}

export const generateLocalResponse = (message: string): string => {
  const category = getCategory(message);
  return responses[category] || responses.default;
};