export const SUPPORT_RESPONSES = [
  {
    type: 'general',
    messages: [
      "I'll help you with that right away!",
      "Thanks for reaching out. Let me assist you.",
      "I understand your concern. Here's what we can do...",
      "I'm here to help! Could you provide more details?",
      "Let me look into that for you."
    ]
  },
  {
    type: 'job_search',
    messages: [
      "Here are some job search tips that might help...",
      "Have you tried using our advanced search filters?",
      "I can help you find relevant positions in your field.",
      "Let's narrow down your job search criteria.",
      "Would you like me to show you the latest job postings?"
    ]
  },
  {
    type: 'application',
    messages: [
      "I can guide you through the application process.",
      "Let me check the status of your application.",
      "Here's how you can improve your application.",
      "Would you like tips for your application?",
      "I'll help you track your application progress."
    ]
  },
  {
    type: 'technical',
    messages: [
      "Let me help you resolve this technical issue.",
      "Could you try clearing your browser cache?",
      "I'll guide you through the troubleshooting steps.",
      "Have you tried updating your browser?",
      "Let's check if this is a known issue."
    ]
  },
  {
    type: 'profile',
    messages: [
      "I can help you optimize your profile.",
      "Let's review your profile settings together.",
      "Here's how to make your profile stand out.",
      "Would you like tips for profile enhancement?",
      "I'll guide you through profile updates."
    ]
  },
  {
    type: 'recruiter',
    messages: [
      "Let me help you with your recruitment needs.",
      "I can show you our premium recruiting features.",
      "Here's how to reach more candidates.",
      "Would you like tips for better job postings?",
      "Let's optimize your recruitment process."
    ]
  },
  {
    type: 'account',
    messages: [
      "I'll help you with your account settings.",
      "Let's secure your account together.",
      "Here's how to manage your preferences.",
      "I can help you update your account details.",
      "Let me check your account status."
    ]
  },
  {
    type: 'premium',
    messages: [
      "Let me show you our premium features.",
      "Here's what you get with premium access.",
      "I can explain the premium benefits.",
      "Would you like to explore premium tools?",
      "Let's compare premium vs. basic features."
    ]
  },
  {
    type: 'feedback',
    messages: [
      "Thank you for your feedback!",
      "We appreciate your input.",
      "I'll forward this to our team.",
      "Your feedback helps us improve.",
      "Would you like to submit a detailed review?"
    ]
  },
  {
    type: 'closing',
    messages: [
      "Is there anything else I can help you with?",
      "Don't hesitate to ask if you need more help.",
      "Feel free to reach out anytime.",
      "I'm here if you need further assistance.",
      "Let me know if you have more questions."
    ]
  }
];

export const getRandomResponse = (type = 'general') => {
  const category = SUPPORT_RESPONSES.find(cat => cat.type === type) || SUPPORT_RESPONSES[0];
  const randomIndex = Math.floor(Math.random() * category.messages.length);
  return category.messages[randomIndex];
};

export const detectMessageType = (message) => {
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('job') || lowerMessage.includes('search')) return 'job_search';
  if (lowerMessage.includes('apply') || lowerMessage.includes('application')) return 'application';
  if (lowerMessage.includes('error') || lowerMessage.includes('issue')) return 'technical';
  if (lowerMessage.includes('profile') || lowerMessage.includes('resume')) return 'profile';
  if (lowerMessage.includes('recruit') || lowerMessage.includes('hire')) return 'recruiter';
  if (lowerMessage.includes('account') || lowerMessage.includes('login')) return 'account';
  if (lowerMessage.includes('premium') || lowerMessage.includes('upgrade')) return 'premium';
  if (lowerMessage.includes('feedback') || lowerMessage.includes('suggest')) return 'feedback';
  if (lowerMessage.includes('bye') || lowerMessage.includes('thank')) return 'closing';
  return 'general';
};