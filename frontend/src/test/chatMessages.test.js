import { CHAT_MESSAGES } from '@/constants/chatMessages';

// Test messages
const testMessages = [
  // Recruiter messages
  "How do I create a job posting?",
  "What's the best way to screen candidates?",
  "Show me my hiring analytics",
  "How to improve response rate?",
  "Need help with technical assessment",
  
  // Job seeker messages
  "Looking for software developer jobs",
  "How to prepare for interviews?",
  "Help with my resume",
  "Salary negotiation tips",
  "Application status check"
];

// Test each message in the browser console:
testMessages.forEach(msg => {
  console.log(`Testing message: "${msg}"`);
  // Log the response that would be generated
});